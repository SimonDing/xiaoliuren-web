/**
 * 梅花易数 · 时间起卦
 * 先天数：乾1兑2离3震4巽5坎6艮7坤8
 * 动爻在上卦→上用下体；动爻在下卦→下用上体
 */
(function (global) {
  const TRIGRAMS = {
    1: { name: '乾', nature: '天', wuxing: '金', dir: '西北', dirCode: 'NW', symbol: '☰', trait: '刚健、领导、决断' },
    2: { name: '兑', nature: '泽', wuxing: '金', dir: '正西', dirCode: 'W', symbol: '☱', trait: '喜悦、口才、社交' },
    3: { name: '离', nature: '火', wuxing: '火', dir: '正南', dirCode: 'S', symbol: '☲', trait: '光明、文书、眼目' },
    4: { name: '震', nature: '雷', wuxing: '木', dir: '正东', dirCode: 'E', symbol: '☳', trait: '行动、启动、决裂旧局' },
    5: { name: '巽', nature: '风', wuxing: '木', dir: '东南', dirCode: 'SE', symbol: '☴', trait: '渗透、协商、灵活转向' },
    6: { name: '坎', nature: '水', wuxing: '水', dir: '正北', dirCode: 'N', symbol: '☵', trait: '智慧、险中求、流动' },
    7: { name: '艮', nature: '山', wuxing: '土', dir: '东北', dirCode: 'NE', symbol: '☶', trait: '止步、沉淀、守界' },
    8: { name: '坤', nature: '地', wuxing: '土', dir: '西南', dirCode: 'SW', symbol: '☷', trait: '承载、包容、稳健落地' }
  };

  // 六十四卦名（上卦1-8为行，下卦1-8为列）简化常用名
  const HEX_NAMES = {
    '1-1': '乾为天', '1-2': '天泽履', '1-3': '天火同人', '1-4': '天雷无妄',
    '1-5': '天风姤', '1-6': '天水讼', '1-7': '天山遁', '1-8': '天地否',
    '2-1': '泽天夬', '2-2': '兑为泽', '2-3': '泽火革', '2-4': '泽雷随',
    '2-5': '泽风大过', '2-6': '泽水困', '2-7': '泽山咸', '2-8': '泽地萃',
    '3-1': '火天大有', '3-2': '火泽睽', '3-3': '离为火', '3-4': '火雷噬嗑',
    '3-5': '火风鼎', '3-6': '火水未济', '3-7': '火山旅', '3-8': '火地晋',
    '4-1': '雷天大壮', '4-2': '雷泽归妹', '4-3': '雷火丰', '4-4': '震为雷',
    '4-5': '雷风恒', '4-6': '雷水解', '4-7': '雷山小过', '4-8': '雷地豫',
    '5-1': '风天小畜', '5-2': '风泽中孚', '5-3': '风火家人', '5-4': '风雷益',
    '5-5': '巽为风', '5-6': '风水涣', '5-7': '风山渐', '5-8': '风地观',
    '6-1': '水天需', '6-2': '水泽节', '6-3': '水火既济', '6-4': '水雷屯',
    '6-5': '水风井', '6-6': '坎为水', '6-7': '水山蹇', '6-8': '水地比',
    '7-1': '山天大畜', '7-2': '山泽损', '7-3': '山火贲', '7-4': '山雷颐',
    '7-5': '山风蛊', '7-6': '山水蒙', '7-7': '艮为山', '7-8': '山地剥',
    '8-1': '地天泰', '8-2': '地泽临', '8-3': '地火明夷', '8-4': '地雷复',
    '8-5': '地风升', '8-6': '地水师', '8-7': '地山谦', '8-8': '坤为地'
  };

  const LINE_BITS = {
    1: [1, 1, 1], // 乾 上中下（由下往上存）
    2: [1, 1, 0], // 兑
    3: [1, 0, 1], // 离
    4: [1, 0, 0], // 震
    5: [0, 1, 1], // 巽
    6: [0, 1, 0], // 坎
    7: [0, 0, 1], // 艮
    8: [0, 0, 0]  // 坤
  };

  function bitsToTrigram(bits) {
    const key = bits.join('');
    const map = {
      '111': 1, '110': 2, '101': 3, '100': 4,
      '011': 5, '010': 6, '001': 7, '000': 8
    };
    return map[key];
  }

  function mod8(n) {
    const r = n % 8;
    return r === 0 ? 8 : r;
  }

  function mod6(n) {
    const r = n % 6;
    return r === 0 ? 6 : r;
  }

  function wuxingRel(a, b) {
    const order = ['木', '火', '土', '金', '水'];
    const i = order.indexOf(a);
    const j = order.indexOf(b);
    if (i === j) return '比和';
    if ((i + 1) % 5 === j) return '我生用';
    if ((i + 2) % 5 === j) return '我克用';
    if ((i + 3) % 5 === j) return '用克体';
    return '用生体';
  }

  function yearZhiNum(date) {
    // 以春节近似：农历年支；此处用立春年后的地支序 子=1
    const lunar = global.Lunar.solarToLunar(date.getFullYear(), date.getMonth() + 1, date.getDate());
    // 农历年地支：与生肖对应，子鼠=1
    const animalIdx = global.Lunar.ANIMALS.indexOf(lunar.animal); // 0鼠
    return animalIdx + 1;
  }

  function castFromDate(date = new Date()) {
    const lunar = global.Lunar.solarToLunar(date.getFullYear(), date.getMonth() + 1, date.getDate());
    const yNum = yearZhiNum(date);
    const m = lunar.month;
    const d = lunar.day;
    const hNum = global.Lunar.hourToZhiIndex(date.getHours(), date.getMinutes()) + 1;

    const upperNum = mod8(yNum + m + d);
    const lowerNum = mod8(yNum + m + d + hNum);
    const move = mod6(yNum + m + d + hNum);

    const upper = TRIGRAMS[upperNum];
    const lower = TRIGRAMS[lowerNum];
    const benName = HEX_NAMES[`${upperNum}-${lowerNum}`];

    // 变卦：动爻阴阳翻转（爻序自下而上 1-6）
    const lowerBits = LINE_BITS[lowerNum].slice(); // [初,二,三]
    const upperBits = LINE_BITS[upperNum].slice(); // [四,五,上]
    const all = lowerBits.concat(upperBits);
    all[move - 1] = all[move - 1] ^ 1;
    const newLower = bitsToTrigram(all.slice(0, 3));
    const newUpper = bitsToTrigram(all.slice(3, 6));
    const bian = {
      upper: TRIGRAMS[newUpper],
      lower: TRIGRAMS[newLower],
      name: HEX_NAMES[`${newUpper}-${newLower}`]
    };

    // 体用
    const useIsUpper = move >= 4;
    const ti = useIsUpper ? lower : upper;
    const yong = useIsUpper ? upper : lower;
    const rel = wuxingRel(ti.wuxing, yong.wuxing);

    let judgment = '';
    let riskLevel = '平';
    if (rel === '用生体' || rel === '比和') {
      judgment = '用生体或比和，事有助力，宜顺势而为。';
      riskLevel = '吉';
    } else if (rel === '我克用') {
      judgment = '体克用，虽费力可成，宜主动掌控局面。';
      riskLevel = '平';
    } else if (rel === '我生用') {
      judgment = '体生用，力有外泄，宜节省消耗、借力打力。';
      riskLevel = '忧';
    } else {
      judgment = '用克体，主有压力阻滞，宜避锋改道、以变破困。';
      riskLevel = '险';
    }

    const changeAdvice = buildChangeAdvice(ti, yong, bian, rel, move);

    return {
      method: '时间起卦',
      nums: { yNum, m, d, hNum, upperNum, lowerNum, move },
      upper,
      lower,
      benName,
      move,
      movePos: move <= 3 ? `下卦第${move}爻` : `上卦第${move - 3}爻`,
      ti,
      yong,
      relation: rel,
      judgment,
      riskLevel,
      bian,
      changeAdvice,
      summary: `本卦${benName}（${upper.symbol}${lower.symbol}），动${move}爻，体${ti.name}用${yong.name}，${rel}。变卦${bian.name}。`
    };
  }

  function buildChangeAdvice(ti, yong, bian, rel, move) {
    // 改运核心：险象时取「变卦方位 + 生体/比和方位 + 用卦所主行动」
    const goDir = bian.upper.dir; // 变局上卦示外在出路
    const gatherDir = (() => {
      // 找能生体的五行方位
      const need = {
        木: '水', 火: '木', 土: '火', 金: '土', 水: '金'
      }[ti.wuxing];
      const found = Object.values(TRIGRAMS).find((t) => t.wuxing === need);
      return found ? found.dir : ti.dir;
    })();

    const actions = {
      乾: '做决断、立规则、找权威或长辈支持',
      兑: '沟通谈判、公开表达、参加聚会结善缘',
      离: '整理文书合同、曝光澄清、学习充电',
      震: '立即启动被拖延的一步，破除僵局',
      巽: '迂回协商、调整方案、向东南拓展人脉',
      坎: '冷静拆解风险，走流动变通之路，勿硬碰',
      艮: '先停再想，设边界，完成收尾再开新事',
      坤: '落地执行、求助包容型贵人、稳扎稳打'
    };

    let strategy = '';
    if (rel === '用克体' || rel === '我生用') {
      strategy = `风险偏高：不宜在「${yong.dir}」硬拼当前格局。建议转向「${goDir}」寻求变局（变卦${bian.name}），并常接触「${gatherDir}」方位以补正体气。行动上：${actions[bian.lower.name]}；心态上：${actions[ti.name].replace('做', '先稳住再')}。`;
    } else {
      strategy = `气场尚可：可借「${yong.dir}」用神之力推进，同时以「${goDir}」作为拓展方向。核心行动：${actions[yong.name]}。`;
    }

    return {
      primaryDir: goDir,
      supportDir: gatherDir,
      avoidDir: rel === '用克体' ? yong.dir : (rel === '我生用' ? yong.dir : '无强制避向'),
      action: actions[bian.lower.name],
      strategy,
      moveHint: `第${move}爻发动，变化多在近期内应，宜在 1–3 个时辰到三日内调整方向。`
    };
  }

  global.Meihua = { TRIGRAMS, castFromDate };
})(typeof window !== 'undefined' ? window : globalThis);
