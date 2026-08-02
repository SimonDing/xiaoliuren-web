/**
 * 杨公风水知识库（封装）
 * 峦头形法 · 理气二十四山 · 阳宅三要 · 水法 · 罗盘用法
 * 供 luopan.js / yanggong.js / UI 查表与合参
 */
(function (global) {
  const META = {
    name: '杨公风水',
    founder: '唐代国师杨筠松',
    principle: '峦头为体，理气为用；乘生气，重救贫',
    indoorMap: '家具/墙壁为「山（砂）」；过道/门窗/鱼缸为「水」',
    natureView: '人法地，地法天，天法道，道法自然。住得心安、平稳、顺畅，才是好风水。'
  };

  /** 第一步：室内峦头（形法） */
  const FORM_FA = {
    title: '室内峦头 · 形法',
    motto: '体无形而不验——看得见的格局不合理，罗盘定得再准也没用。',
    keywords: ['平', '稳', '正', '靠'],
    mountainWater: {
      rule: '高一寸为山，低一寸为水',
      mountain: '墙壁、高大衣柜、书柜——宜作靠山',
      water: '门、窗、走廊、人行动线、鱼缸——宜作气口与活水'
    },
    sofaBed: {
      rule: '背后有靠，前方开阔',
      must: '床头与沙发必须靠实墙（背有靠山），主安稳与贵人',
      avoid: '绝不能靠窗、靠门或悬空'
    },
    mingTang: {
      name: '内明堂',
      where: '玄关、沙发正前方茶几区',
      role: '主管财运与事业',
      tip: '须干净、明亮、开阔，忌堆杂物阻碍生气'
    },
    sha: [
      {
        name: '横梁压顶',
        pro: '床、沙发、书桌正上方不可有凸出横梁，属压迫煞。',
        plain: '头顶有梁容易感觉压抑、头痛或运势发闷；能挪则挪，不能挪可用平顶吊顶/布幔化解观感。'
      },
      {
        name: '尖角冲射',
        pro: '墙角与大方家具尖角不宜正对床、沙发、座位。',
        plain: '尖角像「戳人」，长期对坐会心烦、睡不安；转角或用植物/矮柜挡一下。'
      },
      {
        name: '门冲煞',
        pro: '卧室门正对大门、厕门正对厨门等气流直冲为煞。',
        plain: '气直冲不聚。用玄关、屏风、门帘或阔叶植物挡气，让气走「S」弯。'
      }
    ]
  };

  /** 第二步：理气要点 */
  const LI_QI = {
    title: '室内理气 · 二十四山',
    note: '杨公用二十四山（每山15°），基础先掌握太极点与吉凶位。',
    taiji: {
      how: '户型图画对角线交点为太极点（中心）',
      measure: '站中心用罗盘/手机测各方位',
      taboo: '中心宜空旷，忌堆重物，更忌厕所占中（污秽太极 / 火烧天心）'
    },
    dongJing: {
      rule: '吉方宜动，凶方宜静',
      jiDong: '吉方适合开门、放水、客厅等高频活动',
      xiongJing: '凶方宜高大沉重家具压制，少走动争执'
    }
  };

  /** 第三步：阳宅三要 */
  const SAN_YAO = {
    title: '杨公阳宅三要 · 门、主、灶',
    door: {
      name: '门（气之口）',
      tips: [
        { pro: '门为进气口，须畅通；门口可按方位辅以化煞物。', plain: '门口先通畅干净，脚垫下可按门向放五帝钱作文化化解。' },
        { pro: '开门见山/穿堂（一箭穿心）气散不聚，财气易从前门进后门出。', plain: '进门直通阳台或后窗要挡：玄关、屏风或阔叶植物，让气弯着进来。' }
      ]
    },
    master: {
      name: '主卧（人之本）',
      tips: [
        { pro: '床属阴，宜藏风聚气；床位是核心。', plain: '床要稳、要靠，才能睡得实。' },
        { pro: '镜不可正对床，反射扰乱气场。', plain: '镜子别对着床，睡不踏实就挪开或夜间遮住。' },
        { pro: '屋大人少为凶象，卧室不宜过大。', plain: '卧室太大容易「气散」；一般控制在约二十平米内更聚气。' }
      ]
    },
    stove: {
      name: '灶（财与丁）',
      tips: [
        { pro: '秘诀「坐煞向吉」：灶体可压凶方，灶口/操作面向吉方纳气。', plain: '灶背后可对着相对不吉的方位「压一压」，炒菜时人面向较吉的方位更好。' },
        { pro: '水火不相冲：水槽与炉灶勿紧挨、勿正对，中间宜有操作台。', plain: '水龙头和灶台中间最好隔一段台面，免得家里火气大、易拌嘴。' }
      ]
    }
  };

  /** 第四步：水法 */
  const WATER_FA = {
    title: '杨公水法 · 室内催财',
    motto: '山管人丁，水管财',
    fishTank: {
      place: '水宜置吉位（如东/东南生机方，或当年财位），不可乱放',
      avoid: ['卧室（阴湿伤身）', '厨房（水火相克）', '神台/祖先牌位下方（正神下水，破财）']
    },
    corridor: {
      tip: '过道如河流，宜明亮通畅；过暗易生阴滞气，可长明小壁灯',
      plain: '走廊别黑洞洞，留一盏小灯，气才能流到各房间。'
    }
  };

  /** 实操清单 */
  const CHECKLIST = [
    { title: '清理杂物', pro: '生气不聚于脏乱；先大扫除再生旺。', plain: '风水第一步不是买摆件，而是大扫除。' },
    { title: '明厅暗室', pro: '客厅属阳宜亮；卧室属阴宜暗柔。', plain: '客厅亮堂进财待客；卧室柔暗好睡。' },
    { title: '沙发靠山', pro: '沙发靠实墙，不可背对大门。', plain: '沙发背后要有墙，别对着大门坐。' },
    { title: '床位三忌', pro: '床头靠实墙；忌横梁下、正对门、对镜。', plain: '床头靠墙，头顶无梁，别对门，别对镜子。' },
    { title: '书桌格局', pro: '座位背后有靠，面向门或窗（明堂开阔）。', plain: '坐着背后有墙，前面能看见门或开阔处。' },
    { title: '植物运用', pro: '室内宜阔叶常绿；带刺植物室内易惹口舌，化煞可置窗外。', plain: '发财树、龟背竹一类；仙人掌玫瑰尽量别放屋里，除非专门化小人放在窗台外。' }
  ];

  /** 罗盘用法库 */
  const LUOPAN_GUIDE = {
    title: '杨公三合罗盘用法',
    threeNeedles: {
      motto: '地盘立向格龙，人盘拨砂，天盘纳水',
      dipan: {
        name: '地盘正针（内圈）',
        offset: '与磁南北重合',
        use: '测方位、定坐向（立向）',
        plain: '房子坐哪向哪、门床桌朝哪，主要看这一圈。'
      },
      renpan: {
        name: '人盘中针（中圈）',
        offset: '逆时针错开地盘 7.5°（半山）',
        use: '消砂：周围建筑、山峰、高大家具',
        plain: '看背后靠山、窗外高楼、室内高柜吉不吉利。'
      },
      tianpan: {
        name: '天盘缝针（外圈）',
        offset: '顺时针错开地盘 7.5°',
        use: '纳水：水流、马路、门窗气口',
        plain: '看门、窗、走廊、水景从哪边进气。'
      }
    },
    grip: [
      { pro: '避开磁场干扰：摘表、远手机强磁、避钢筋柱与大功率电器。', plain: '测之前先把磁吸壳、手表拿开，离电视冰箱远一点。' },
      { pro: '端平罗盘于齐胸/齐腰，保持水平。', plain: '手机/罗盘要端平，别歪着测。' },
      { pro: '传统盘：转内盘令磁针（南极圆孔端）对准天池红点，海底线对齐。', plain: '电子盘：等指针稳定，顶部对准你要测的方向即可。' },
      { pro: '看天心十道（十字红线）压字读数。', plain: '看十字线压到哪个山字，就是那个方位。' }
    ],
    indoorSteps: [
      {
        title: '定太极点',
        pro: '于房屋中心端平罗盘（可用木凳，忌铁凳）。',
        plain: '找到房子中心，把手机/罗盘平放在那儿测最准。'
      },
      {
        title: '定坐向（地盘）',
        pro: '面朝大门或主采光面，校准后看前方线为「向」、后方线为「坐」。',
        plain: '脸朝大门那头是「向」，背后是「坐」。例如前「午」后「子」= 坐北朝南。'
      },
      {
        title: '看门窗走廊（天盘纳水）',
        pro: '自中心视线对准大门/阳台/过道口，读天盘山字，配合坐向论生旺墓。',
        plain: '从中心看门、窗、走廊落在天盘哪一山，判断这股「水气」宜不宜进。'
      },
      {
        title: '看高柜高楼（人盘消砂）',
        pro: '视线对准高大形体，读人盘山字，以五行生克坐山论吉凶。',
        plain: '高柜、窗外高楼用人盘看：生旺坐山则助丁贵，克坐山则宜化解。'
      }
    ],
    taboos: [
      {
        name: '骑线与空亡',
        pro: '十字线压两山交界为出卦/空亡，气场混乱。',
        plain: '压在两条线缝上别硬定床和沙发，稍微转开再摆。'
      },
      {
        name: '罗盘不上床',
        pro: '罗盘藏天地磁场，宜红布包裹置高处净位，忌置床上与随意踩踏。',
        plain: '不用时收好放干净高处，别扔床上，也别放地上乱踩。'
      },
      {
        name: '多点复核',
        pro: '钢筋房磁场乱，中心测完后退两步再测；指针乱转则避电磁点。',
        plain: '现代房子干扰大，换个位置再测一次；指针乱跳就躲开电器。'
      }
    ],
    mnemonic: {
      pro: '找中心，端水平；针压底，看红线；内盘定坐向，外盘定门窗，中盘定高低。',
      plain: '中心端平 → 地盘定坐向 → 天盘看门窗水气 → 人盘看高低靠山。'
    }
  };

  /** 二十四山简表（与罗盘合参的断语辅助） */
  const MOUNTAIN_NOTES = {
    壬: { bagua: '坎', wuxing: '水', plain: '偏北水气，宜静养与藏，忌污秽占位' },
    子: { bagua: '坎', wuxing: '水', plain: '正北水位，利智慧谋略，卧室宜柔暗' },
    癸: { bagua: '坎', wuxing: '水', plain: '北偏东水气，宜清净，忌重浊堆积' },
    丑: { bagua: '艮', wuxing: '土', plain: '东北土气，宜稳重收纳，忌尖角冲射' },
    艮: { bagua: '艮', wuxing: '土', plain: '东北少男位，宜书房矮柜，忌厕占' },
    寅: { bagua: '艮', wuxing: '土', plain: '东偏北木土交，宜生发渐进' },
    甲: { bagua: '震', wuxing: '木', plain: '正东偏北木气，利开创与文书' },
    卯: { bagua: '震', wuxing: '木', plain: '正东木位，生机旺，宜绿植与学习' },
    乙: { bagua: '震', wuxing: '木', plain: '东偏南柔木，利人际与细活' },
    辰: { bagua: '巽', wuxing: '木', plain: '东南库地，宜收纳有序，忌脏乱' },
    巽: { bagua: '巽', wuxing: '木', plain: '东南风木，传统财位之一，宜亮宜洁' },
    巳: { bagua: '巽', wuxing: '木', plain: '南偏东火木交，宜文书名声，忌口舌堆物' },
    丙: { bagua: '离', wuxing: '火', plain: '南偏东火气，利名声表达，忌燥乱' },
    午: { bagua: '离', wuxing: '火', plain: '正南火位，宜明亮客厅，忌卧室过燥' },
    丁: { bagua: '离', wuxing: '火', plain: '南偏西文明火，利文墨，忌硬冲' },
    未: { bagua: '坤', wuxing: '土', plain: '西南土气，宜厚重稳定，忌尖利' },
    坤: { bagua: '坤', wuxing: '土', plain: '西南母位，宜柔顺厚载，忌污秽' },
    申: { bagua: '坤', wuxing: '土', plain: '西偏南金土交，宜果断收纳' },
    庚: { bagua: '兑', wuxing: '金', plain: '正西偏南金气，利决断，忌刀兵意象正冲座位' },
    酉: { bagua: '兑', wuxing: '金', plain: '正西金位，利口才收益，忌尖锐对卧' },
    辛: { bagua: '兑', wuxing: '金', plain: '西偏北金气，宜整洁光亮' },
    戌: { bagua: '乾', wuxing: '金', plain: '西北库地，宜沉稳，忌脏乱破损' },
    乾: { bagua: '乾', wuxing: '金', plain: '西北家长位，宜庄重，忌压迫凌乱' },
    亥: { bagua: '乾', wuxing: '金', plain: '北偏西水金交，宜藏不宜燥' }
  };

  const WUXING_PLACE = {
    木: { items: ['阔叶绿植', '木质书架', '青色点缀'], role: '生发、文昌、生机' },
    火: { items: ['暖光台灯', '红色小件', '香薰烛（慎）'], role: '明亮、名声、热情' },
    土: { items: ['陶瓷摆件', '米黄色软装', '厚重矮柜'], role: '稳固、靠山、收纳' },
    金: { items: ['金属相框', '白色收纳', '圆形器物'], role: '收束、决断、整洁' },
    水: { items: ['小型流水景', '深蓝布艺', '玻璃器皿'], role: '流通、财气、智谋' }
  };

  function tip(title, pro, plain) {
    return { title: title, pro: pro, plain: plain };
  }

  function mountainNote(name) {
    return MOUNTAIN_NOTES[name] || null;
  }

  /** 知识库章节（供 UI 折叠展示） */
  function knowledgeSections() {
    return [
      {
        id: 'meta',
        title: META.name + '总纲',
        blocks: [
          tip('核心', META.principle, '看得见的形（峦头）是身体，看不见的方位（理气）是用法；强调乘生气、能改善生活。'),
          tip('室内隐喻', META.indoorMap, '墙和柜子当山，门窗走廊鱼缸当水，按这个思路摆就容易懂。'),
          tip('心法', META.natureView, '某处让你压抑别扭，多半是煞；住着心安顺畅，就是好风水。')
        ]
      },
      {
        id: 'form',
        title: FORM_FA.title,
        blocks: [
          tip('总诀', FORM_FA.motto, '先把看得见的格局摆正：' + FORM_FA.keywords.join('、') + '。'),
          tip('山水', FORM_FA.mountainWater.rule, '山=' + FORM_FA.mountainWater.mountain + '；水=' + FORM_FA.mountainWater.water + '。'),
          tip('靠山', FORM_FA.sofaBed.rule, FORM_FA.sofaBed.must + '。' + FORM_FA.sofaBed.avoid + '。'),
          tip(FORM_FA.mingTang.name, FORM_FA.mingTang.where + '，' + FORM_FA.mingTang.role + '。', FORM_FA.mingTang.tip),
          ...FORM_FA.sha.map(function (s) {
            return tip('形煞·' + s.name, s.pro, s.plain);
          })
        ]
      },
      {
        id: 'liqi',
        title: LI_QI.title,
        blocks: [
          tip('说明', LI_QI.note, '先找中心点，再分吉方动、凶方静。'),
          tip('太极点', LI_QI.taiji.how + '。' + LI_QI.taiji.measure + '。', LI_QI.taiji.taboo + '。'),
          tip('动静', LI_QI.dongJing.rule, LI_QI.dongJing.jiDong + '；' + LI_QI.dongJing.xiongJing + '。')
        ]
      },
      {
        id: 'sanyao',
        title: SAN_YAO.title,
        blocks: [].concat(
          SAN_YAO.door.tips.map(function (t, i) {
            return tip(SAN_YAO.door.name + (i + 1), t.pro, t.plain);
          }),
          SAN_YAO.master.tips.map(function (t, i) {
            return tip(SAN_YAO.master.name + (i + 1), t.pro, t.plain);
          }),
          SAN_YAO.stove.tips.map(function (t, i) {
            return tip(SAN_YAO.stove.name + (i + 1), t.pro, t.plain);
          })
        )
      },
      {
        id: 'water',
        title: WATER_FA.title,
        blocks: [
          tip('总诀', WATER_FA.motto, WATER_FA.fishTank.place + '。'),
          tip('水忌', '忌：' + WATER_FA.fishTank.avoid.join('；') + '。', '卧室、厨房、神台下别放鱼缸。'),
          tip('动线', WATER_FA.corridor.tip, WATER_FA.corridor.plain)
        ]
      },
      {
        id: 'checklist',
        title: '室内布置实操清单',
        blocks: CHECKLIST.map(function (c) {
          return tip(c.title, c.pro, c.plain);
        })
      },
      {
        id: 'luopan',
        title: LUOPAN_GUIDE.title,
        blocks: [
          tip(
            '三盘三针',
            LUOPAN_GUIDE.threeNeedles.motto,
            '地盘：' +
              LUOPAN_GUIDE.threeNeedles.dipan.plain +
              ' 人盘：' +
              LUOPAN_GUIDE.threeNeedles.renpan.plain +
              ' 天盘：' +
              LUOPAN_GUIDE.threeNeedles.tianpan.plain
          ),
          ...LUOPAN_GUIDE.grip.map(function (g, i) {
            return tip('握法校准·' + (i + 1), g.pro, g.plain);
          }),
          ...LUOPAN_GUIDE.indoorSteps.map(function (s) {
            return tip(s.title, s.pro, s.plain);
          }),
          ...LUOPAN_GUIDE.taboos.map(function (t) {
            return tip('禁忌·' + t.name, t.pro, t.plain);
          }),
          tip('口诀', LUOPAN_GUIDE.mnemonic.pro, LUOPAN_GUIDE.mnemonic.plain)
        ]
      }
    ];
  }

  function helpAlertText() {
    const g = LUOPAN_GUIDE;
    return (
      '【' +
      g.title +
      '】\n\n' +
      '【三盘三针】\n' +
      g.threeNeedles.motto +
      '\n· ' +
      g.threeNeedles.dipan.name +
      '：' +
      g.threeNeedles.dipan.use +
      '\n· ' +
      g.threeNeedles.renpan.name +
      '：' +
      g.threeNeedles.renpan.use +
      '\n· ' +
      g.threeNeedles.tianpan.name +
      '：' +
      g.threeNeedles.tianpan.use +
      '\n\n【校准】\n' +
      g.grip
        .map(function (x, i) {
          return i + 1 + '. ' + x.plain;
        })
        .join('\n') +
      '\n\n【室内四步】\n' +
      g.indoorSteps
        .map(function (s, i) {
          return i + 1 + '. ' + s.title + '——' + s.plain;
        })
        .join('\n') +
      '\n\n【三大禁忌】\n' +
      g.taboos
        .map(function (t) {
          return '· ' + t.name + '：' + t.plain;
        })
        .join('\n') +
      '\n\n【口诀】' +
      g.mnemonic.plain
    );
  }

  /**
   * 结合当前罗盘读数，追加详细分析与建议
   * @param {object} compass Luopan.buildPayload
   * @param {Array} baseTips 已有 tips
   * @param {{yongShen?:string[], qimen?:object}} ctx
   */
  function enrichCompassTips(compass, baseTips, ctx) {
    const tips = (baseTips || []).slice();
    if (!compass || !compass.plates) return tips;

    const face = compass.plates.dipan.mountain;
    const sit = compass.plates.dipan; // has zuoXiang
    const note = mountainNote(face.name);
    const wx = face.wuxing;
    const place = WUXING_PLACE[wx] || WUXING_PLACE.土;

    tips.push(
      tip(
        '知识库·当前山向',
        '地盘正对「' +
          face.name +
          '山」' +
          face.bagua +
          '卦·' +
          wx +
          '。' +
          (note ? note.plain + '。' : '') +
          sit.zuoXiang +
          '。',
        '简单说：你现在测到的朝向是「' +
          face.name +
          '山」。' +
          (note ? note.plain + '。' : '') +
          '定门、床、书桌先认这个方向；背后坐山要稳，面前明堂要空。'
      )
    );

    tips.push(
      tip(
        '知识库·峦头合参',
        FORM_FA.sofaBed.rule + '；' + FORM_FA.mingTang.tip,
        '对着这个朝向布置时：座位/床要背后靠实墙，面前留空（明堂）。有横梁、尖角、门对门，优先挪位或挡气。'
      )
    );

    tips.push(
      tip(
        '知识库·三盘用法',
        LUOPAN_GUIDE.threeNeedles.motto +
          '。此刻人盘「' +
          compass.plates.renpan.label +
          '」看砂；天盘「' +
          compass.plates.tianpan.label +
          '」看水。',
        '背后高低看人盘（' +
          compass.plates.renpan.label +
          '）；门窗水气看天盘（' +
          compass.plates.tianpan.label +
          '）。吉方多活动，相对不利处放重柜少走动。'
      )
    );

    tips.push(
      tip(
        '知识库·五行摆件（' + wx + '）',
        '朝向五行属' + wx + '，主「' + place.role + '」。可点缀：' + place.items.join('、') + '。',
        '想加强这个朝向的气场，可小面积放：' + place.items.join('、') + '。别堆满，干净最重要。'
      )
    );

    if (compass.fenjin && (compass.fenjin.slot === 1 || compass.fenjin.slot === 5)) {
      tips.push(
        tip(
          '知识库·禁忌·骑线',
          LUOPAN_GUIDE.taboos[0].pro + '当前分金偏边（' + compass.fenjin.label + '）。',
          LUOPAN_GUIDE.taboos[0].plain + '床和沙发不要顺着这条偏线硬摆。'
        )
      );
    }

    if (compass.chuanShan && compass.chuanShan.isVoid) {
      tips.push(
        tip(
          '知识库·空亡处理',
          '穿山空亡不宜强立向。' + FORM_FA.sha[2].pro,
          '空亡像空号：把床头/书桌轻轻转开半山；门口若直冲，加玄关或植物挡气。'
        )
      );
    }

    // 阳宅三要快检（按朝向给门主灶提醒）
    tips.push(
      tip(
        '知识库·门主灶快检',
        SAN_YAO.door.tips[1].pro + ' ' + SAN_YAO.master.tips[1].pro + ' ' + SAN_YAO.stove.tips[1].pro,
        '门：别一箭穿心，进门要有遮挡。床：不对镜、不靠空。灶：水火隔开。按当前朝向复查这三处。'
      )
    );

    tips.push(
      tip(
        '知识库·水法',
        WATER_FA.motto + '。' + WATER_FA.fishTank.place,
        '小水景放在明亮干净的一侧（多参考天盘气口），卧室厨房神台下别放。走廊留一盏小灯。'
      )
    );

    if (ctx && ctx.yongShen && ctx.yongShen.length) {
      const match = ctx.yongShen.indexOf(wx) >= 0;
      tips.push(
        tip(
          '知识库·命局合参',
          match
            ? '朝向五行' + wx + '合喜用，宜案头久坐与进业。'
            : '喜用为' + ctx.yongShen.join('、') + '，当前' + wx + '，可微调至喜用山并避开空亡。',
          match
            ? '这个朝向挺合你的喜用，适合长时间办公学习。'
            : '更合你的是「' + ctx.yongShen.join('、') + '」，不舒服就慢慢转桌椅，对准中间格。'
        )
      );
    }

    tips.push(tip('知识库·收束', LUOPAN_GUIDE.mnemonic.pro, CHECKLIST[0].plain + ' ' + META.natureView));
    return tips;
  }

  /**
   * 生成「风水建议」报告中的知识库段落
   */
  function buildReportExtras(compass, adviseResult) {
    const sections = [];
    sections.push({
      title: '杨公总纲',
      pro: META.principle + '。' + META.indoorMap + '。',
      plain: META.natureView
    });
    sections.push({
      title: '形法要点',
      pro: FORM_FA.keywords.join('、') + '；' + FORM_FA.sofaBed.must,
      plain: FORM_FA.mingTang.tip + ' 先避：' + FORM_FA.sha.map(function (s) { return s.name; }).join('、') + '。'
    });
    sections.push({
      title: '阳宅三要',
      pro: '重门、主、灶。' + SAN_YAO.door.tips[0].pro,
      plain: '门口通畅有遮挡；床靠墙不对镜；灶与水槽隔开。'
    });
    sections.push({
      title: '水法催财',
      pro: WATER_FA.motto + '。' + WATER_FA.fishTank.place,
      plain: '水景放吉位亮处；' + WATER_FA.corridor.plain
    });

    if (compass && compass.plates) {
      const face = compass.plates.dipan.mountain;
      const n = mountainNote(face.name);
      sections.push({
        title: '罗盘合参（当前读数）',
        pro:
          '地盘' +
          compass.plates.dipan.label +
          ' / 人盘' +
          compass.plates.renpan.label +
          ' / 天盘' +
          compass.plates.tianpan.label +
          (compass.chuanShan ? ' / 穿山' + compass.chuanShan.name : '') +
          (compass.touDi ? ' / 透地' + compass.touDi.name : '') +
          '。',
        plain:
          '此刻朝「' +
          face.name +
          '山」' +
          (n ? '——' + n.plain : '') +
          '。定朝向认地盘，背后看人盘，门窗水气看天盘。' +
          (compass.chuanShan && compass.chuanShan.isVoid ? '穿山空亡，床桌略转避开。' : '')
      });
    } else {
      sections.push({
        title: '罗盘合参',
        pro: '尚未读取电子罗盘。',
        plain: '建议开启罗盘对准大门或书桌，再点「生成风水建议」，分析会更贴你的实际朝向。'
      });
    }

    if (adviseResult && adviseResult.place) {
      sections.push({
        title: '与格局引擎合流',
        pro: adviseResult.headline || '',
        plain: '今日生气偏「' + adviseResult.place.sheng + '」，事业气口偏「' + adviseResult.place.kai + '」。结合上表形法与三要逐项落实。'
      });
    }

    return {
      sections: sections,
      checklist: CHECKLIST,
      luopanMnemonic: LUOPAN_GUIDE.mnemonic
    };
  }

  function summarizeForAi(compass, adviseResult) {
    const extras = buildReportExtras(compass, adviseResult);
    return extras.sections
      .map(function (s) {
        return '【' + s.title + '】' + s.pro + ' 白话：' + s.plain;
      })
      .join('\n');
  }

  global.YangGongData = {
    META: META,
    FORM_FA: FORM_FA,
    LI_QI: LI_QI,
    SAN_YAO: SAN_YAO,
    WATER_FA: WATER_FA,
    CHECKLIST: CHECKLIST,
    LUOPAN_GUIDE: LUOPAN_GUIDE,
    MOUNTAIN_NOTES: MOUNTAIN_NOTES,
    WUXING_PLACE: WUXING_PLACE,
    mountainNote: mountainNote,
    knowledgeSections: knowledgeSections,
    helpAlertText: helpAlertText,
    enrichCompassTips: enrichCompassTips,
    buildReportExtras: buildReportExtras,
    summarizeForAi: summarizeForAi
  };
})(typeof window !== 'undefined' ? window : globalThis);
