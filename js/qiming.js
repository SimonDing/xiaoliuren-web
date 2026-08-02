/**
 * 传统起名：八字喜用五行补益 + 五格数理参考 + 音义性别风格
 * 依赖 Bazi、QiMingData；可合参当前小六壬时课
 */
(function (global) {
  const WX_ORDER = ['木', '火', '土', '金', '水'];

  function surnameStroke(surname) {
    const D = global.QiMingData;
    const s = (surname || '').trim();
    if (!s) return 0;
    if (D.SURNAME_STROKES[s]) return D.SURNAME_STROKES[s];
    // 未知姓：按字数估（每字约 8 画），保证能算
    let n = 0;
    for (const ch of s) n += D.SURNAME_STROKES[ch] || 8;
    return n;
  }

  function charInfo(ch) {
    return global.QiMingData.CHARS[ch] || null;
  }

  function wuge(surname, given) {
    const sn = surnameStroke(surname);
    const chars = Array.from(given);
    const strokes = chars.map((c) => {
      const info = charInfo(c);
      return info ? info.stroke : 8;
    });
    let tian, ren, di, zong, wai;
    if (chars.length === 1) {
      tian = sn + 1;
      ren = sn + strokes[0];
      di = strokes[0] + 1;
      zong = sn + strokes[0];
      wai = zong - ren + 1;
    } else {
      tian = sn + 1;
      ren = sn + strokes[0];
      di = strokes[0] + strokes[1];
      zong = sn + strokes[0] + strokes[1];
      wai = zong - ren + 1;
    }
    if (wai < 1) wai = 1;
    const lucky = global.QiMingData.LUCKY_NUMS;
    const score =
      (lucky.has(tian) ? 1 : 0) +
      (lucky.has(ren) ? 2 : 0) +
      (lucky.has(di) ? 1.5 : 0) +
      (lucky.has(zong) ? 2 : 0) +
      (lucky.has(wai) ? 0.5 : 0);
    return {
      tian, ren, di, wai, zong,
      strokes: { surname: sn, given: strokes },
      luckyScore: score,
      plain: `五格参考：天${tian} 人${ren} 地${di} 外${wai} 总${zong}（吉数命中约 ${Math.round(score * 10) / 10} 分）。人格、总格偏吉更宜日常称呼与文书。`
    };
  }

  function toneOk(a, b) {
    if (!b) return true;
    // 尽量避免两字同声调（尤其同为 3、4 声拗口）
    if (a === b && (a === 3 || a === 4)) return false;
    return true;
  }

  function genderOk(info, gender) {
    if (!info) return false;
    if (info.gender === '中') return true;
    return info.gender === gender;
  }

  function scoreCandidate(surname, given, opts) {
    const { yongShen, weakWx, gender, style, zodiacZhi, palace } = opts;
    const chars = Array.from(given);
    const infos = chars.map(charInfo);
    if (infos.some((x) => !x)) return null;

    let score = 0;
    const reasons = [];

    // 五行补喜用
    let yongHit = 0;
    infos.forEach((info) => {
      if (yongShen.indexOf(info.wx) >= 0) {
        yongHit += 1;
        score += 6;
      } else if (weakWx && info.wx === weakWx) {
        score += 3;
        yongHit += 0.5;
      }
    });
    if (yongHit >= 1) {
      reasons.push('用字五行贴近命局喜用「' + yongShen.join('、') + '」');
    }

    // 风格
    let styleHit = 0;
    infos.forEach((info) => {
      if (info.styles.indexOf(style) >= 0) {
        styleHit += 1;
        score += 3;
      }
    });
    if (styleHit) reasons.push('气质偏「' + style + '」');

    // 性别
    if (infos.every((info) => genderOk(info, gender))) score += 4;
    else score -= 8;

    // 音律
    if (chars.length === 2) {
      if (toneOk(infos[0].tone, infos[1].tone)) score += 2;
      else score -= 2;
      if (chars[0] === chars[1]) score -= 3;
    }

    // 五格
    const wg = wuge(surname, given);
    score += wg.luckyScore * 2;
    if (wg.luckyScore >= 4) reasons.push('五格数理较吉');

    // 生肖轻忌
    const avoid = (global.QiMingData.ZODIAC_AVOID[zodiacZhi] || []);
    if (chars.some((c) => avoid.indexOf(c) >= 0)) {
      score -= 4;
      reasons.push('生肖用字略有民俗避忌，仅供参考');
    }

    // 时课合参
    if (palace && palace.wuxing) {
      if (infos.some((info) => info.wx === palace.wuxing)) {
        score += 1.5;
        reasons.push('与当下小六壬「' + palace.name + '」五行相生扶');
      }
    }

    // 字义
    reasons.push(infos.map((info) => info.mean).join('；'));

    return {
      fullName: surname + given,
      given,
      score: Math.round(score * 10) / 10,
      wuxing: infos.map((i) => i.wx).join(''),
      meanings: infos.map((i) => i.ch + '：' + i.m),
      wuge: wg,
      reasons,
      pro: `名「${given}」五行${infos.map((i) => i.ch + i.wx).join('、')}，补喜用${yongShen.join('、')}；${wg.plain}`,
      plain: `大白话：这个名字叫起来是「${surname}${given}」。${infos.map((i) => i.ch + '有「' + i.m + '」的意思').join('，')}。主要想帮孩子补「${yongShen.join('、')}」这路气场。${wg.luckyScore >= 3.5 ? '五格数字也还顺眼。' : '五格是参考，好听好写更重要。'}`
    };
  }

  function poolFor(yongShen, gender, style) {
    const D = global.QiMingData.CHARS;
    const prefer = yongShen.slice();
    const list = [];
    Object.keys(D).forEach((ch) => {
      const info = D[ch];
      if (!genderOk(info, gender)) return;
      const wxBoost = prefer.indexOf(info.wx) >= 0 ? 2 : 0;
      const stBoost = info.styles.indexOf(style) >= 0 ? 1 : 0;
      list.push({ ch, info, rank: wxBoost * 10 + stBoost * 5 + (info.gender === gender ? 2 : 0) });
    });
    list.sort((a, b) => b.rank - a.rank);
    return list;
  }

  function generateNames(input) {
    const D = global.QiMingData;
    if (!D) throw new Error('起名字库未加载');
    if (!global.Bazi) throw new Error('八字引擎未加载');

    const surname = (input.surname || '').trim();
    if (!surname) throw new Error('请填写姓氏');
    if (surname.length > 2) throw new Error('暂支持单姓或复姓两字');

    const gender = input.gender === '女' ? '女' : '男';
    const style = input.style || '文雅';
    const len = input.len === 1 ? 1 : 2;
    const count = Math.min(Math.max(input.count || 10, 1), 16);

    const bazi = global.Bazi.castBazi({
      year: Number(input.year),
      month: Number(input.month),
      day: Number(input.day),
      hour: Number(input.hour != null ? input.hour : 12),
      minute: Number(input.minute != null ? input.minute : 0),
      gender
    });

    const yongShen = bazi.yongShen || [];
    const weakWx = (bazi.wuxingRank && bazi.wuxingRank.length)
      ? bazi.wuxingRank[bazi.wuxingRank.length - 1].name
      : yongShen[0];
    const zodiacZhi = bazi.pillars[0].zhi;
    const palace = input.palace || null;

    const pool = poolFor(yongShen, gender, style);
    if (pool.length < 4) throw new Error('字库不足以匹配条件，请改风格或性别后再试');

    const candidates = [];
    const seen = new Set();

    function pushGiven(given) {
      if (seen.has(given)) return;
      seen.add(given);
      const item = scoreCandidate(surname, given, {
        yongShen, weakWx, gender, style, zodiacZhi, palace
      });
      if (item) candidates.push(item);
    }

    if (len === 1) {
      pool.slice(0, 40).forEach((p) => pushGiven(p.ch));
    } else {
      const top = pool.slice(0, 28);
      for (let i = 0; i < top.length; i++) {
        for (let j = 0; j < top.length; j++) {
          if (i === j) continue;
          if (!toneOk(top[i].info.tone, top[j].info.tone)) continue;
          pushGiven(top[i].ch + top[j].ch);
          if (candidates.length > 80) break;
        }
        if (candidates.length > 80) break;
      }
    }

    candidates.sort((a, b) => b.score - a.score);
    const names = candidates.slice(0, count);

    const summaryPro = `依八字：${bazi.pillars.map((p) => p.ganZhi).join(' ')}。日主${bazi.dayMaster.gan}${bazi.dayMaster.wuxing}，身${bazi.strength.level}，喜用${yongShen.join('、')}。起名以补喜用、五格吉数、音义性别为宜，忌生造怪字。`;
    const summaryPlain = [
      `先给孩子排出八字：${bazi.pillars.map((p) => p.ganZhi).join(' ')}。`,
      `日主是「${bazi.dayMaster.gan}」（${bazi.dayMaster.wuxing}），命局${bazi.strength.level}，起名重点补「${yongShen.join('、')}」。`,
      `下面按「好听好写 + 五行补益 + 五格参考」挑了 ${names.length} 个${len === 1 ? '单名' : '双名'}，风格偏「${style}」。`,
      `大白话提醒：名字是缘分与称呼习惯，五格与喜用是参考，不必迷信到一个字都不肯改。`
    ].join('');

    return {
      bazi,
      yongShen,
      weakWx,
      zodiacZhi,
      style,
      len,
      surname,
      gender,
      summary: { pro: summaryPro, plain: summaryPlain },
      names,
      disclaimer: '起名依据传统命理与民俗字义，仅供文化参考；户籍登记以当地规范为准。五格笔画为常用近似，可能与个别字典略有出入。'
    };
  }

  global.QiMing = {
    generateNames,
    surnameStroke,
    wuge,
    WX_ORDER
  };
})(typeof window !== 'undefined' ? window : globalThis);
