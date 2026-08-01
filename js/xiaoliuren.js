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

  /**
   * 寻失物专断（本于古诀口诀与方位）
   * verdict / place / distance 供 UI 摘要；pro / plain 双轨解释
   */
  const LOST_ORACLE = {
    大安: {
      verdict: '较易找回',
      chance: '高',
      place: '正东 · 宅舍附近或常到之处',
      distance: '去之不远',
      person: '可问家人、旧识',
      pro: '得大安，失物未远。宜向东方与宅舍熟悉处寻，静候亦可得。勿远途奔波。',
      plain: '东西多半还在附近，先在家里、单位东边和你常去的地方找。别急着跑很远。',
      actions: ['先搜卧室/桌面/常放口袋处', '向正东走动一圈留意', '问家人是否挪过']
    },
    留连: {
      verdict: '周折难定',
      chance: '中低',
      place: '正北 · 拖沓辗转之所',
      distance: '或已挪移、尚在途中',
      person: '需多次打听，对方未必立刻说清',
      pro: '得留连，寻物多费周折。物或被挪、暂存、遗忘于反复出入处。宜缓寻、多问，不宜一日内强求结果。',
      plain: '找起来会比较磨人，可能被人挪过或落在「来来回回」的地方。多问几个人，别指望一次就找到。',
      actions: ['查通勤路上、储物间、待洗脏衣', '向北方与潮湿角落留意', '列清单分几天找，别急躁']
    },
    速喜: {
      verdict: '可望寻得',
      chance: '高',
      place: '正南 · 申未午方位，路上逢人',
      distance: '不远，或在途中',
      person: '逢人问路、他人提点最有用',
      pro: '得速喜，失物申未午可寻，路上逢人有指引。宜主动询问南方相关处所与今日接触过的人。',
      plain: '有希望找到。多往南边、午后常去的地方找，路上遇到人就问问，别人一句话可能就点醒你。',
      actions: ['问今天见过面的同事/店员', '查南方座位、南向房间', '回想最后出现的时段快速复盘']
    },
    赤口: {
      verdict: '宜急寻防损',
      chance: '中',
      place: '正西 · 争竞、硬物、金属相关处',
      distance: '尚可追，拖则易损',
      person: '防口舌争执；或与冲突相关',
      pro: '得赤口，失物宜急寻，迟则易损或生口舌。方位偏西，涉及金铁、车马、争竞场合须当心。',
      plain: '要抓紧找，拖久了可能坏掉或更难找。多往西边、车里、五金/锁具附近找，找的时候别跟人吵起来。',
      actions: ['立刻查车内、锁具旁、办公西侧', '核对监控或转账记录', '冷静寻访，避免争执升级']
    },
    小吉: {
      verdict: '有人可助',
      chance: '较高',
      place: '东南 · 坤方（西南）亦须兼顾',
      distance: '可寻，常因人报信而得',
      person: '阴人、女性、晚辈报喜指点',
      pro: '得小吉，失物在坤方，阴人来报喜。宜托女性长辈/同事协助，路上商量亦有转机。',
      plain: '挺有机会，而且多半会有人帮你——尤其女同事、阿姨、晚辈。也往东南、西南方向找找。',
      actions: ['请女性亲友一起回忆', '查东南/西南房间与包袋', '在社交群轻声求助线索']
    },
    空亡: {
      verdict: '难寻或落空',
      chance: '低',
      place: '方位不定 · 信息多虚',
      distance: '或已离、或记错',
      person: '线索不可轻信',
      pro: '得空亡，寻物常无果，或物已离、或本无此物之实。宜先核实「是否真的遗失」，再小范围搜寻，勿远途空耗。',
      plain: '这次不好找，也可能记错了以为丢了。先确认是不是放错、借出、或根本没带出门，别跑大老远白忙。',
      actions: ['先核对购物记录/借还清单', '缩小到最近活动范围细搜', '暂缓悬赏远寻，防被话术骗']
    }
  };

  /**
   * 测谎话 / 言辞真伪专断
   */
  const TRUTH_ORACLE = {
    大安: {
      verdict: '所言较实',
      confidence: '高',
      tone: '安稳可信',
      pro: '得大安，言辞多由衷，事可安稳采信。仍宜留关键证据，但不必过度猜疑。',
      plain: '对方这话大体靠谱，可以信个七八分。重要约定还是留个字据更安心，但不用处处怀疑。',
      actions: ['可按对方说法推进', '重要条款仍书面确认', '观察后续是否言行一致']
    },
    留连: {
      verdict: '含糊两可',
      confidence: '中',
      tone: '拖延遮掩',
      pro: '得留连，言语粘滞，或真假参半、避重就轻。不宜全信口头承诺，宜追问细节与时间节点。',
      plain: '话里有水分，或在拖时间。别只听「差不多、很快、应该」——让对方说清楚时间、地点、具体数字。',
      actions: ['追问可核验细节', '约定书面期限', '看行动是否跟上嘴上说的']
    },
    速喜: {
      verdict: '话快易夸',
      confidence: '中高',
      tone: '热情有余',
      pro: '得速喜，言语爽利喜人，动机未必恶意，但易夸张、报喜不报忧。宜区分「诚意」与「水分」。',
      plain: '对方可能不是存心骗你，但容易把事情说得太好、太满。开心归开心，关键数字和承诺要再核实。',
      actions: ['对承诺打八折听', '核实喜讯来源', '别因一时高兴立刻大额付出']
    },
    赤口: {
      verdict: '多伪宜防',
      confidence: '低',
      tone: '口舌狡辩',
      pro: '得赤口，主口舌虚妄、恶语或强词夺理。言不可轻信，防争讼与栽赃。凡事留痕，少与之硬辩。',
      plain: '这次要当心：对方可能在狡辩、甩锅，甚至故意说假话。别只靠嘴仗，聊天记录、合同、转账都留好。',
      actions: ['暂停轻信与口头成交', '保存聊天/通话证据', '必要时请第三方见证']
    },
    小吉: {
      verdict: '大体可信',
      confidence: '较高',
      tone: '和气圆融',
      pro: '得小吉，所言多近实，或经人从中说合后更可靠。可采信主干，细节仍可再问清楚。',
      plain: '整体可以信，尤其有中间人、朋友帮忙说的话更靠谱。大方向OK，细节再问清楚就行。',
      actions: ['可采信主要陈述', '细节当面再确认一次', '借共同朋友侧面了解']
    },
    空亡: {
      verdict: '空话难核',
      confidence: '很低',
      tone: '虚多实少',
      pro: '得空亡，言语多虚、承诺易落空，或难以核实。切勿据此做重大决定，先验证再信任。',
      plain: '这更像「空头支票」——听着热闹，很难落实。大事千万别只凭这句话就出手，先看证据和行动。',
      actions: ['要求可核验凭证', '重大事项一律暂缓', '警惕「稳赚/绝对/马上」话术']
    }
  };

  function interpretLost(path) {
    const main = LOST_ORACLE[path.finalPalace.name];
    const monthHint = path.monthPalace.name;
    const dayHint = path.dayPalace.name;
    return Object.assign({}, main, {
      palace: path.finalPalace.name,
      pathNote: `月落${monthHint}、日落${dayHint}、时落${path.finalPalace.name}`,
      plainPath: `白话课程：从「${monthHint}」起，经过「${dayHint}」，最终落在「${path.finalPalace.name}」——寻物以最后这一宫为主。`
    });
  }

  function interpretTruth(path) {
    const main = TRUTH_ORACLE[path.finalPalace.name];
    return Object.assign({}, main, {
      palace: path.finalPalace.name,
      pathNote: `时课得${path.finalPalace.name}（${path.finalPalace.nature}）`,
      plainPath: `白话：用现在这个时辰起的课，落在「${path.finalPalace.name}」，主要看对方这话靠不靠谱。`
    });
  }

  function formatLostText(lost) {
    return `【${lost.verdict}·把握${lost.chance}】${lost.pro} 方位：${lost.place}。${lost.plain}`;
  }

  function formatTruthText(truth) {
    return `【${truth.verdict}·可信度${truth.confidence}】${truth.pro} ${truth.plain}`;
  }

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
    const baseAspects = ASPECTS[palace.name];
    const lost = interpretLost(cast);
    const truth = interpretTruth(cast);
    const aspects = Object.assign({}, baseAspects, {
      lost: formatLostText(lost),
      truth: formatTruthText(truth)
    });

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
      oracles: { lost, truth },
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
    LOST_ORACLE,
    TRUTH_ORACLE,
    calcPalace,
    castFromDate,
    interpretLost,
    interpretTruth,
    refineWithBazi
  };
})(typeof window !== 'undefined' ? window : globalThis);
