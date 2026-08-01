/**
 * 高岛断易 · 即刻时间种子起卦 + 与小六壬合参
 * 起卦：以当前时分秒毫秒为种子，模拟略筮三钱法得六爻（通常一爻动）
 */
(function (global) {
  const TRIGRAM_NAME = { 1: '乾', 2: '兑', 3: '离', 4: '震', 5: '巽', 6: '坎', 7: '艮', 8: '坤' };
  const LINE_LABEL = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'];

  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function seedFromDate(date) {
    // 即刻时间：年月日时分秒毫秒混合，每次刷新都不同
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    const h = date.getHours();
    const mi = date.getMinutes();
    const s = date.getSeconds();
    const ms = date.getMilliseconds();
    const base =
      ((y * 12 + m) * 31 + d) * 86400000 +
      ((h * 3600 + mi * 60 + s) * 1000 + ms);
    return (base ^ (mi * 9973 + s * 7919 + ms * 104729)) >>> 0;
  }

  /** 三钱法：3=老阳(动阳) 2=少阴 1=少阳 0=老阴(动阴) → 计值 9/8/7/6 */
  function tossLine(rand) {
    let sum = 0;
    for (let i = 0; i < 3; i++) sum += rand() < 0.5 ? 2 : 3; // 字2背3 简化
    // sum 6..9
    return sum;
  }

  function bitsFromLines(values) {
    // values: 6/7/8/9 from bottom to top; yang=1 yin=0
    return values.map((v) => (v === 7 || v === 9 ? 1 : 0));
  }

  function bitsToTrigram(bits3) {
    const key = bits3.join('');
    const map = {
      '111': 1, '110': 2, '101': 3, '100': 4,
      '011': 5, '010': 6, '001': 7, '000': 8
    };
    return map[key];
  }

  function findKingWen(upper, lower) {
    const list = global.TakashimaData.KW_TRIGRAMS;
    for (let i = 0; i < list.length; i++) {
      if (list[i][0] === upper && list[i][1] === lower) return i;
    }
    return 0;
  }

  function luckScore(luck) {
    return { 大吉: 20, 吉: 10, 平: 0, 忧: -10, 凶: -18 }[luck] || 0;
  }

  function castFromDate(date = new Date()) {
    const seed = seedFromDate(date);
    const rand = mulberry32(seed);
    const values = [];
    for (let i = 0; i < 6; i++) values.push(tossLine(rand));

    // 高岛略筮多一爻动：若无动爻，按种子指定一爻为动
    let moving = [];
    values.forEach((v, i) => {
      if (v === 6 || v === 9) moving.push(i);
    });
    if (moving.length === 0) {
      const idx = Math.floor(rand() * 6);
      values[idx] = rand() < 0.5 ? 9 : 6;
      moving = [idx];
    } else if (moving.length > 1) {
      // 保留随机一动（贴近高岛“一爻发动”习惯），其余改为静爻
      const keep = moving[Math.floor(rand() * moving.length)];
      values.forEach((v, i) => {
        if (i !== keep && (v === 6 || v === 9)) values[i] = v === 6 ? 8 : 7;
      });
      moving = [keep];
    }

    const bits = bitsFromLines(values);
    const lowerNum = bitsToTrigram(bits.slice(0, 3));
    const upperNum = bitsToTrigram(bits.slice(3, 6));
    const kwIndex = findKingWen(upperNum, lowerNum);
    const hex = global.TakashimaData.HEXAGRAMS[kwIndex];
    const moveIdx = moving[0];
    const lineText = hex.lines[moveIdx] || '';

    // 变卦
    const changed = bits.slice();
    changed[moveIdx] ^= 1;
    const bianLower = bitsToTrigram(changed.slice(0, 3));
    const bianUpper = bitsToTrigram(changed.slice(3, 6));
    const bianHex = global.TakashimaData.HEXAGRAMS[findKingWen(bianUpper, bianLower)];

    return {
      seed,
      timeLabel: global.Lunar ? global.Lunar.formatSolar(date) : date.toISOString(),
      method: '即刻时间种子 · 三钱略筮（一爻动）',
      values,
      bits,
      upper: { num: upperNum, name: TRIGRAM_NAME[upperNum] },
      lower: { num: lowerNum, name: TRIGRAM_NAME[lowerNum] },
      hex,
      moveIdx,
      moveLabel: LINE_LABEL[moveIdx],
      lineText,
      bian: bianHex,
      scoreBoost: luckScore(hex.luck),
      summary: `得${hex.name}（第${hex.id}卦·${hex.luck}），${LINE_LABEL[moveIdx]}动：「${lineText}」。变卦${bianHex.name}。`
    };
  }

  /**
   * 与小六壬合参：校正断语与时运分
   */
  function combineWithLiuRen(tk, liuRenCast) {
    const palace = liuRenCast.palace;
    const lrLuck = palace.nature; // 大吉/吉/平/凶
    const tkLuck = tk.hex.luck;

    const lrRank = { 大吉: 2, 吉: 1, 平: 0, 凶: -2 }[lrLuck] || 0;
    const tkRank = { 大吉: 2, 吉: 1, 平: 0, 忧: -1, 凶: -2 }[tkLuck] || 0;
    const sum = lrRank + tkRank;

    let harmony = '中和';
    let verdict = '';
    if (sum >= 3) {
      harmony = '双吉';
      verdict = `小六壬「${palace.name}」与高岛「${tk.hex.name}」同现吉象，机遇窗口明确，宜积极而守正。`;
    } else if (sum <= -3) {
      harmony = '双凶';
      verdict = `课象「${palace.name}」叠高岛「${tk.hex.name}」凶忧，务必收缩风险，先避祸再谋利。`;
    } else if (lrRank > 0 && tkRank < 0) {
      harmony = '课吉卦忧';
      verdict = `小六壬偏吉示外势尚可，高岛卦偏忧提示内里有隐患——宜借势推进但严控细节与合同。`;
    } else if (lrRank < 0 && tkRank > 0) {
      harmony = '课凶卦吉';
      verdict = `小六壬示时局不顺，高岛「${tk.hex.name}」反见转机——宜改道、借诚信与中正突破困局。`;
    } else if (lrRank === 0 || tkRank === 0) {
      harmony = '平中求进';
      verdict = `一平一偏，局势未定。以高岛动爻「${tk.lineText}」为当下关键提醒，配合小六壬宜忌行事。`;
    } else {
      harmony = '同向';
      verdict = `两盘同向，可信度提高。总断以高岛卦辞为主，时位以小六壬为准。`;
    }

    const adj = Math.round((tk.scoreBoost + (sum * 4)) / 2);
    const newScore = Math.max(8, Math.min(98, liuRenCast.score + adj));

    const aspects = {
      overall: `【壬卦合参·${harmony}】${verdict} ${tk.hex.judgment} 动爻示：${tk.lineText}。小六壬侧：${liuRenCast.aspects.overall}`,
      career: `【高岛·事业】${tk.hex.career}｜【小六壬】${liuRenCast.aspects.career}`,
      wealth: `【高岛·财运】${tk.hex.wealth}｜【小六壬】${liuRenCast.aspects.wealth}`,
      love: `【高岛·感情】${tk.hex.love}｜【小六壬】${liuRenCast.aspects.love}`,
      health: `【高岛·健康】${tk.hex.health}｜【小六壬】${liuRenCast.aspects.health}`,
      travel: `【高岛总示】${tk.hex.advice}｜【小六壬·出行】${liuRenCast.aspects.travel}`,
      social: `【高岛】${tk.hex.judgment}｜【小六壬·人际】${liuRenCast.aspects.social}`,
      study: `【高岛】${tk.hex.advice}｜【小六壬·学业】${liuRenCast.aspects.study}`,
      lost: `【小六壬·寻失物】${liuRenCast.aspects.lost || ''}${oracleAdj(tk, 'lost')}`,
      truth: `【小六壬·测谎话】${liuRenCast.aspects.truth || ''}${oracleAdj(tk, 'truth')}`,
      suit: refineYiJi(liuRenCast.aspects.suit, tk, true),
      avoid: refineYiJi(liuRenCast.aspects.avoid, tk, false)
    };

    return {
      harmony,
      verdict,
      score: newScore,
      scoreDelta: adj,
      aspects,
      tip: `${liuRenCast.tip} 合参高岛得${tk.hex.name}（${tk.hex.luck}），${tk.moveLabel}：「${tk.lineText}」。变看${tk.bian.name}。建议：${tk.hex.advice}`
    };
  }

  function refineYiJi(base, tk, isYi) {
    if (isYi) {
      if (tk.hex.luck === '大吉' || tk.hex.luck === '吉') return `${base}；并宜按「${tk.hex.advice}」落实`;
      return `${base}；卦示谨慎，宜先完成「${tk.lineText}」所戒之事再进取`;
    }
    if (tk.hex.luck === '凶' || tk.hex.luck === '忧') return `${base}；尤忌违背高岛断「${tk.hex.advice}」`;
    return base;
  }

  /** 高岛吉凶对寻物/测谎可信度的微调提示 */
  function oracleAdj(tk, kind) {
    const luck = tk.hex.luck;
    if (kind === 'lost') {
      if (luck === '大吉' || luck === '吉') return `｜高岛「${tk.hex.name}」偏吉，寻访行动宜抓紧落实。`;
      if (luck === '凶' || luck === '忧') return `｜高岛「${tk.hex.name}」偏忧，寻物宜缩小范围、防白跑。`;
      return `｜合参高岛「${tk.hex.name}」，按动爻「${tk.lineText}」把握节奏。`;
    }
    if (luck === '大吉' || luck === '吉') return `｜高岛偏吉，言辞主干可多一分采信，细节仍须核验。`;
    if (luck === '凶' || luck === '忧') return `｜高岛偏忧，更须防空话与口舌，证据优先于辩解。`;
    return `｜合参高岛「${tk.hex.name}」，动爻提醒：${tk.lineText}。`;
  }

  global.Takashima = {
    castFromDate,
    combineWithLiuRen,
    LINE_LABEL
  };
})(typeof window !== 'undefined' ? window : globalThis);
