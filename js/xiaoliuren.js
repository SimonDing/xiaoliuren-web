/**
 * 小六壬：月日时起课 + 六神全方面断语
 */
(function (global) {
  const PALACES = [
    {
      name: '大安',
      wuxing: '木',
      direction: '正东',
      color: '青绿',
      nature: '吉',
      short: '安稳守成，宜静不宜动',
      poem: '大安事事昌，求谋在东方。失物去不远，宅舍保安康。'
    },
    {
      name: '留连',
      wuxing: '水',
      direction: '正北',
      color: '黑蓝',
      nature: '平',
      short: '事多纠缠，宜缓不宜急',
      poem: '留连事难成，求谋日未明。官事只宜缓，去者未回程。'
    },
    {
      name: '速喜',
      wuxing: '火',
      direction: '正南',
      color: '朱红',
      nature: '大吉',
      short: '喜事将至，宜进不宜退',
      poem: '速喜喜来临，求财向南行。失物申未午，逢人路上寻。'
    },
    {
      name: '赤口',
      wuxing: '金',
      direction: '正西',
      color: '白金',
      nature: '凶',
      short: '口舌是非，宜防争执官非',
      poem: '赤口主口舌，官非切要防。失物急去寻，人身有损伤。'
    },
    {
      name: '小吉',
      wuxing: '木',
      direction: '东南',
      color: '青绿',
      nature: '吉',
      short: '小有所成，宜合作互助',
      poem: '小吉最吉昌，路上好商量。阴人来报喜，失物在坤方。'
    },
    {
      name: '空亡',
      wuxing: '土',
      direction: '中央',
      color: '土黄',
      nature: '凶',
      short: '多虚少实，宜守不宜攻',
      poem: '空亡事不长，阴人多乖张。求财无利益，行人有灾殃。'
    }
  ];

  const ASPECTS = {
    大安: {
      overall: '今日气场偏安稳，宜守成、复盘与巩固既有成果。心神易定，适合做需要耐心的事，不宜贸然开辟新战场。',
      career: '工作上以稳为主，完成既定任务比追求亮眼突破更有利。汇报、整理、复盘类事务较顺；跳槽、强推新方案宜暂缓。',
      wealth: '正财稳、偏财弱。工资、回款、固定收益较可期；投机、冲动消费、高风险博弈不建议。',
      love: '关系宜温存维系。情侣适合共同做安静的事；单身不宜强求速成，以诚意与稳定形象吸引人。',
      health: '身心偏和，注意肝胆与颈椎劳损。宜早睡、散步、少怒。',
      travel: '短途平安，长途无妨但勿赶急。失物多未远去，可在东方或熟悉处寻。',
      social: '贵人多在东方与旧识之中。少言多听，避免卷入他人争执。',
      study: '适合温习巩固、考证备考、深度阅读，不宜分心多开新课题。',
      suit: '守成、签约复核、访旧、静养、整理家居',
      avoid: '冒险投机、激烈争论、远途奔波求成、临时起意的重大决定'
    },
    留连: {
      overall: '事情容易拖泥带水，信息不全、进度反复。今日宜耐心铺垫，不宜逼迫结果。',
      career: '项目可能卡在审批、协作或细节返工。先把关键人催齐、材料补齐，再推进会更有效。',
      wealth: '钱款易拖延到账，或有额外开销纠缠。不宜借钱担保；账目宜当日核对清楚。',
      love: '情感易陷入拉扯、冷战或旧事重提。先沟通情绪，再谈结论；勿用冷暴力。',
      health: '湿气、肠胃、睡眠容易受扰。少油腻，避免久坐不动。',
      travel: '行程易变，交通可能延误。出行提前预留时间；寻人寻物多费周折。',
      social: '人际有粘滞感，口头答应未必立刻兑现。重要事尽量落成文字。',
      study: '效率起伏，适合拆小任务推进；避免一次想啃完大部头。',
      suit: '沟通协调、补充资料、慢性事务、拜访需要多次跟进的人',
      avoid: '强求当日见分晓、情绪化决裂、大额借贷、轻信口头承诺'
    },
    速喜: {
      overall: '喜气来得快，消息、机会与转机较为明朗。宜主动出击，但忌得意忘形。',
      career: '适合提案、面试、公开表达、推进关键节点。南方方位与午后时段较有利。',
      wealth: '偏财与意外之喜概率升高，正财也有加速到账之象。仍需理性，勿因小胜加杠杆。',
      love: '表白、约会、复合信号都更活跃。单身可扩大社交；有伴者适合制造小惊喜。',
      health: '精力充沛，防上火与心率偏快。少辛辣熬夜，喜中勿纵欲耗神。',
      travel: '出行吉利，访人易遇。失物可向南方、申未午方位留意。',
      social: '贵人主动出现，适合请客联络。言辞真诚最易得助。',
      study: '灵感来得快，适合冲刺、发表、答辩；记下灵感以免过后遗忘。',
      suit: '求财求职、告白求婚、公开喜讯、短线推进、拜访南方相关事务',
      avoid: '骄傲轻敌、透支身体、把运气当实力去豪赌'
    },
    赤口: {
      overall: '口舌锋芒显露，易因言语、合同、态度引发冲突。宜低调、留痕、少争。',
      career: '会议与邮件措辞要格外谨慎。合同细则、责任边界务必核对；避免当众指责。',
      wealth: '破财多因争执、罚款、冲动消费或担保。财务签字慢半拍，少做口头交易。',
      love: '最忌冷嘲热讽与翻旧账。有矛盾先降温再谈；单身者勿因一句戏言结怨。',
      health: '注意口咽、肺部、外伤与血压。少饮酒争执，开车骑车格外小心。',
      travel: '路途防争执与剐蹭。西方事务多波折；能改期则改，不能则少言语。',
      social: '小人与是非易近。不传播未经证实的消息，不站队站错。',
      study: '适合独立完成；小组讨论易起摩擦，意见不同先写下来再辩。',
      suit: '证据留存、冷静处理纠纷、就医检查、修订条款',
      avoid: '争吵诉讼硬刚、酒后发言、网络撕扯、危险运动'
    },
    小吉: {
      overall: '有和气与小成就，贵人多在女性、晚辈或协作伙伴中。宜借力，不宜独断。',
      career: '团队合作、客户沟通、跨部门协调较顺。小目标容易落地，大目标宜分步。',
      wealth: '小额进账、折扣优惠、合伙分成较有机会。不宜贪大；细水长流更应景。',
      love: '关系温馨，适合约会、见家长、化解小误会。单身可通过朋友介绍认识新缘。',
      health: '总体平稳，注意脾胃与过敏。饮食清淡规律即可。',
      travel: '出行顺利，问路问人多有帮助。西南方向较吉。',
      social: '和气生财，适合送礼回访、维护弱连接人脉。',
      study: '讨论班、互助小组效果好；把知识讲给别人听更能巩固。',
      suit: '合作谈判、拜访女贵人、小额投资稳健品种、社交联谊',
      avoid: '独断专行、好高骛远、忽略细节导致前功尽弃'
    },
    空亡: {
      overall: '多虚少实，期望易落空。今日宜收缩战线、验证信息，不宜押注未知。',
      career: '会议多、落实少；承诺需二次确认。重要签约、上线发布能推迟则推迟。',
      wealth: '求财费力，投资易空。守住现有资金，避免新坑；谨防诈骗与“稳赚”话术。',
      love: '情感易有落差感或对方心不在焉。降低预期，务实沟通；勿因空虚冲动绑定。',
      health: '精神易疲惫、免疫力波动。以休息为主，体检复查可安排，避免过度消耗。',
      travel: '行程易取消或白跑一趟。非必要不出远门；寻人寻物常无果。',
      social: '表面热络未必可靠。少托付重任，先看行动再交心。',
      study: '效率偏低，适合整理笔记、划掉无效信息，不要硬啃高难度新内容。',
      suit: '休整复盘、清理无效事项、核实真伪、储蓄防守',
      avoid: '重大投资、远行求成、轻信承诺、情绪化恋爱决定'
    }
  };

  function calcPalace(lunarMonth, lunarDay, zhiIndex) {
    // 从大安起月，月上起日，日上起时（时辰以子=1…亥=12）
    const monthIdx = (lunarMonth - 1) % 6;
    const dayIdx = (monthIdx + lunarDay - 1) % 6;
    const hourNum = zhiIndex + 1;
    const finalIdx = (dayIdx + hourNum - 1) % 6;
    return {
      monthPalace: PALACES[monthIdx],
      dayPalace: PALACES[dayIdx],
      finalPalace: PALACES[finalIdx],
      indices: { monthIdx, dayIdx, finalIdx }
    };
  }

  function castFromDate(date = new Date()) {
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    const h = date.getHours();
    const mi = date.getMinutes();
    const lunar = global.Lunar.solarToLunar(y, m, d);
    const zhiIndex = global.Lunar.hourToZhiIndex(h, mi);
    const zhi = global.Lunar.ZHI[zhiIndex];
    const cast = calcPalace(lunar.month, lunar.day, zhiIndex);
    const palace = cast.finalPalace;
    const aspects = ASPECTS[palace.name];

    return {
      solar: global.Lunar.formatSolar(date),
      date,
      lunar,
      shichen: {
        zhi,
        index: zhiIndex,
        label: `${zhi}时`,
        range: SHICHEN_RANGE[zhiIndex]
      },
      path: cast,
      palace,
      aspects,
      score: natureToScore(palace.nature),
      tip: buildTip(palace, aspects)
    };
  }

  const SHICHEN_RANGE = [
    '23:00-01:00','01:00-03:00','03:00-05:00','05:00-07:00',
    '07:00-09:00','09:00-11:00','11:00-13:00','13:00-15:00',
    '15:00-17:00','17:00-19:00','19:00-21:00','21:00-23:00'
  ];

  function natureToScore(nature) {
    if (nature === '大吉') return 92;
    if (nature === '吉') return 78;
    if (nature === '平') return 58;
    return 36;
  }

  function buildTip(palace, aspects) {
    return `得${palace.name}（${palace.nature}），五行属${palace.wuxing}，宜向${palace.direction}，喜用${palace.color}。${palace.short}。今日宜：${aspects.suit}；忌：${aspects.avoid}。`;
  }

  /**
   * 与八字合参：按日主五行、喜用粗调断语语气
   */
  function refineWithBazi(cast, bazi) {
    if (!bazi) return null;
    const palaceWx = cast.palace.wuxing;
    const dayWx = bazi.dayMaster.wuxing;
    const yong = bazi.yongShen;
    const relation = wuxingRelation(dayWx, palaceWx);

    let harmony = '中和';
    let note = '';
    if (yong.includes(palaceWx)) {
      harmony = '得助';
      note = `课象五行「${palaceWx}」正合命局喜用，今日机遇与你更同频，可适度积极。`;
    } else if (relation === '克我' && cast.palace.nature.includes('凶')) {
      harmony = '需防';
      note = `课象「${palaceWx}」对日主有压力，叠见凶宫，务必谨言慎行、收缩风险。`;
    } else if (relation === '我克' && cast.palace.nature.includes('吉')) {
      harmony = '可取';
      note = `日主能驾驭课象之「${palaceWx}」，吉象可落为实际成果，贵在执行。`;
    } else if (relation === '同我') {
      harmony = '共振';
      note = `课象与日主同气，运势波动会被放大——吉则更吉，平淡时也易固执。`;
    } else {
      note = `课象五行「${palaceWx}」与日主「${dayWx}」呈${relation}关系，宜结合喜用「${yong.join('、')}」取舍行动。`;
    }

    const refined = {
      harmony,
      note,
      career: tweak(cast.aspects.career, harmony, '事业'),
      wealth: tweak(cast.aspects.wealth, harmony, '财运'),
      love: tweak(cast.aspects.love, harmony, '感情'),
      health: healthTweak(cast.aspects.health, bazi),
      focus: bazi.suggestions
    };
    return refined;
  }

  function tweak(text, harmony, label) {
    const prefix = {
      得助: `【八字合参·${label}得助】`,
      需防: `【八字合参·${label}需防】`,
      可取: `【八字合参·${label}可取】`,
      共振: `【八字合参·${label}共振】`,
      中和: `【八字合参·${label}】`
    }[harmony];
    return `${prefix}${text}`;
  }

  function healthTweak(text, bazi) {
    const weak = bazi.wuxingRank.slice(-2).map((x) => x.name).join('、');
    return `${text} 结合命局，相对薄弱五行为${weak}，今日尤需对应脏腑与作息（仅供参考，不适请就医）。`;
  }

  function wuxingRelation(me, other) {
    const order = ['木', '火', '土', '金', '水'];
    const a = order.indexOf(me);
    const b = order.indexOf(other);
    if (a === b) return '同我';
    if ((a + 1) % 5 === b) return '我生';
    if ((a + 2) % 5 === b) return '我克';
    if ((a + 3) % 5 === b) return '克我';
    return '生我';
  }

  global.XiaoLiuRen = {
    PALACES,
    ASPECTS,
    calcPalace,
    castFromDate,
    refineWithBazi
  };
})(typeof window !== 'undefined' ? window : globalThis);
