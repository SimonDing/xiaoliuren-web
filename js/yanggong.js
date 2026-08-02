/**
 * 杨公风水 · 室内布局建议（合参奇门遁甲 / 八字喜用）
 * 说明：取杨筠松派常用坐向、二十四山、生气方与室内布置原则之实用摘要，
 * 并结合当日奇门生门/开门做「时方」开运提示。非完整形峦勘测。
 */
(function (global) {
  const DIRS8 = [
    { key: 'N', name: '正北', mountain: '子', wuxing: '水', deg: 0 },
    { key: 'NE', name: '东北', mountain: '艮', wuxing: '土', deg: 45 },
    { key: 'E', name: '正东', mountain: '卯', wuxing: '木', deg: 90 },
    { key: 'SE', name: '东南', mountain: '巽', wuxing: '木', deg: 135 },
    { key: 'S', name: '正南', mountain: '午', wuxing: '火', deg: 180 },
    { key: 'SW', name: '西南', mountain: '坤', wuxing: '土', deg: 225 },
    { key: 'W', name: '正西', mountain: '酉', wuxing: '金', deg: 270 },
    { key: 'NW', name: '西北', mountain: '乾', wuxing: '金', deg: 315 }
  ];

  const DIR_BY_NAME = Object.fromEntries(DIRS8.map((d) => [d.name, d]));
  const DIR_BY_KEY = Object.fromEntries(DIRS8.map((d) => [d.key, d]));

  // 坐向：坐方 → 朝向（相对）
  const OPPOSITE = {
    N: 'S', S: 'N', E: 'W', W: 'E',
    NE: 'SW', SW: 'NE', SE: 'NW', NW: 'SE'
  };

  // 杨公常用：二十四山简表（每山约15°）
  const MOUNTAINS24 = [
    { name: '壬', deg: 337.5, sector: 'N', wuxing: '水' },
    { name: '子', deg: 0, sector: 'N', wuxing: '水' },
    { name: '癸', deg: 22.5, sector: 'N', wuxing: '水' },
    { name: '丑', deg: 45, sector: 'NE', wuxing: '土' },
    { name: '艮', deg: 45, sector: 'NE', wuxing: '土' },
    { name: '寅', deg: 67.5, sector: 'NE', wuxing: '木' },
    { name: '甲', deg: 75, sector: 'E', wuxing: '木' },
    { name: '卯', deg: 90, sector: 'E', wuxing: '木' },
    { name: '乙', deg: 105, sector: 'E', wuxing: '木' },
    { name: '辰', deg: 127.5, sector: 'SE', wuxing: '土' },
    { name: '巽', deg: 135, sector: 'SE', wuxing: '木' },
    { name: '巳', deg: 157.5, sector: 'SE', wuxing: '火' },
    { name: '丙', deg: 165, sector: 'S', wuxing: '火' },
    { name: '午', deg: 180, sector: 'S', wuxing: '火' },
    { name: '丁', deg: 195, sector: 'S', wuxing: '火' },
    { name: '未', deg: 217.5, sector: 'SW', wuxing: '土' },
    { name: '坤', deg: 225, sector: 'SW', wuxing: '土' },
    { name: '申', deg: 247.5, sector: 'SW', wuxing: '金' },
    { name: '庚', deg: 255, sector: 'W', wuxing: '金' },
    { name: '酉', deg: 270, sector: 'W', wuxing: '金' },
    { name: '辛', deg: 285, sector: 'W', wuxing: '金' },
    { name: '戌', deg: 307.5, sector: 'NW', wuxing: '土' },
    { name: '乾', deg: 315, sector: 'NW', wuxing: '金' },
    { name: '亥', deg: 337.5, sector: 'NW', wuxing: '水' }
  ];

  const PLACE_ITEMS = {
    木: ['绿植（富贵竹/金钱树）', '木质书架', '青绿织物', '文昌塔（东/东南）'],
    火: ['暖光灯', '红色点缀小件', '香薰蜡烛（慎用）', '奖状证书墙'],
    土: ['陶瓷器皿', '黄色靠垫', '水晶/黄玉摆件', '稳定厚重矮柜'],
    金: ['金属相框', '白色简约收纳', '铜铃/铜葫芦', '圆形金属装饰'],
    水: ['小型流水摆件或鱼缸（宜小）', '黑色/蓝色软装', '镜子（勿对床）', '加湿与清爽通气']
  };

  function clampLatLng(lat, lng) {
    lat = Number(lat);
    lng = Number(lng);
    if (Number.isNaN(lat) || Number.isNaN(lng)) throw new Error('请填写有效的经纬度数字');
    if (lat < -90 || lat > 90) throw new Error('纬度范围应在 -90 ~ 90');
    if (lng < -180 || lng > 180) throw new Error('经度范围应在 -180 ~ 180');
    return { lat, lng };
  }

  function geoProfile(lat, lng) {
    let climate = '温带';
    let light = '宜保证南向采光';
    if (lat >= 35) {
      climate = '偏北温带/寒带过渡';
      light = '日照偏斜，宜优先南向与西南采光采暖，忌北窗过大漏风';
    } else if (lat >= 23.5) {
      climate = '亚热带/暖温带';
      light = '南向为贵，东向晨光利起居，西向注意遮阳';
    } else if (lat >= 0) {
      climate = '热带/亚热带';
      light = '宜通风散热，南/北对流，忌西晒过烈无遮';
    } else {
      climate = '南半球';
      light = '北向多得日照（与北半球相反），布局需镜像理解';
    }
    const hemisphere = lat >= 0 ? '北半球' : '南半球';
    const eastWest = lng >= 0 ? '东经' : '西经';
    return {
      climate,
      light,
      hemisphere,
      label: `${hemisphere} · ${eastWest} ${Math.abs(lng).toFixed(4)}° · 纬 ${lat.toFixed(4)}°`,
      note: `杨公重「藏风聚气」。你所在区域属${climate}：${light}。室内宜保持门窗气口通畅，忌污秽堆堵纳气之位。`
    };
  }

  function resolveDir(input) {
    if (!input) return null;
    if (DIR_BY_KEY[input]) return DIR_BY_KEY[input];
    if (DIR_BY_NAME[input]) return DIR_BY_NAME[input];
    return null;
  }

  function evaluateSitting(sitKey, yongShen) {
    const sit = DIR_BY_KEY[sitKey];
    const face = DIR_BY_KEY[OPPOSITE[sitKey]];
    // 杨公民间常用：坐北朝南多吉；辅以喜用
    let score = 60;
    let comments = [];
    if (sitKey === 'N' && face.key === 'S') {
      score += 18;
      comments.push('坐北朝南，合「向阳纳气」常理，为杨公宅法中常见上格坐向之一。');
    } else if (sitKey === 'NW' || sitKey === 'NE') {
      score += 6;
      comments.push('坐西北/东北，乾艮方主贵与稳定，宜门厅干净、光线充足。');
    } else if (sitKey === 'S') {
      score += 4;
      comments.push('坐南朝北，炎热地区或有利；偏北地区需加强采暖与北向封闭。');
    } else {
      comments.push(`坐${sit.name}向${face.name}，可成局，关键在门气、床位与水火（厨卫）不冲突。`);
    }

    if (yongShen && yongShen.length) {
      if (yongShen.includes(face.wuxing)) {
        score += 12;
        comments.push(`朝向五行「${face.wuxing}」合命局喜用，向首纳气对你更有利。`);
      }
      if (yongShen.includes(sit.wuxing)) {
        score += 8;
        comments.push(`坐山五行「${sit.wuxing}」得喜用加持，宜在坐方安床后靠或厚实靠山家具。`);
      }
      if (!yongShen.includes(face.wuxing) && !yongShen.includes(sit.wuxing)) {
        comments.push(`若暂不能改向，可在室内用喜用五行「${yongShen.join('、')}」的颜色与物件补气。`);
      }
    }

    // 八运（2024-2043）提示
    comments.push('现时八运（2024–2043），宜重「东北—西南」气脉流通，忌二黑五黄方位长期堆放污秽或破损物。');

    return {
      sit,
      face,
      score: Math.min(98, score),
      comments,
      summary: `坐${sit.name}（${sit.mountain}山）→ 朝${face.name}。综合适合度约 ${Math.min(98, score)} 分。`
    };
  }

  function evaluateBed(bedZoneKey, bedHeadKey, sitKey, yongShen, qimen) {
    const zone = DIR_BY_KEY[bedZoneKey];
    const head = DIR_BY_KEY[bedHeadKey];
    const tips = [];
    let score = 55;

    // 床头宜靠实墙（坐方或山方）
    if (bedHeadKey === sitKey) {
      score += 12;
      tips.push('床头朝向与房屋坐山一致，有「靠山」之象，利于睡眠安定。');
    }
    if (yongShen && yongShen.includes(head.wuxing)) {
      score += 10;
      tips.push(`床头朝「${head.name}」五行属${head.wuxing}，合喜用，利健康与贵人梦稳。`);
    }
    if (yongShen && yongShen.includes(zone.wuxing)) {
      score += 6;
      tips.push(`床位置在房间「${zone.name}」一侧，得喜用方位之气。`);
    }

    // 忌：床对门、床头朝西传统说法因人而异——结合奇门死门惊门
    const avoidDirs = (qimen && qimen.changeAdvice && qimen.changeAdvice.avoidDirs) || [];
    if (avoidDirs.includes(head.name) || avoidDirs.includes(zone.name)) {
      score -= 14;
      tips.push(`今日奇门死/惊门落在相关方位，床头或床位正对避方——建议微调角度，或暂时以屏风/帘隔挡门气直冲。`);
    }

    const sheng = qimen && qimen.changeAdvice ? qimen.changeAdvice.primaryDir : null;
    if (sheng && (head.name === sheng || zone.name === sheng)) {
      score += 8;
      tips.push(`床贴近今日奇门生门「${sheng}」，有助恢复与转机，但睡姿仍以舒适、床头靠墙为先。`);
    }

    tips.push('通则：床头务必靠实墙；忌镜对床、横梁压床、卫生间门直冲床；床下勿堆杂物壅塞气场。');
    tips.push('床两侧留通道更佳（大床可一侧靠墙）；情侣宜平衡左右，忌一侧紧贴凌乱堆物。');

    return {
      zone,
      head,
      score: Math.max(20, Math.min(96, score)),
      tips,
      summary: `床在房间${zone.name}区，床头朝${head.name}。床位评分约 ${Math.max(20, Math.min(96, score))} 分。`
    };
  }

  function indoorPlacement({ sitKey, yongShen, qimen, meihua, liuRen }) {
    const sit = DIR_BY_KEY[sitKey] || DIR_BY_KEY.N;
    const face = DIR_BY_KEY[OPPOSITE[sit.key]];
    const yong = yongShen && yongShen.length ? yongShen : ['土', '木'];
    const primary = yong[0];
    const items = [];
    yong.forEach((w) => {
      (PLACE_ITEMS[w] || []).slice(0, 2).forEach((it) => items.push({ wuxing: w, item: it }));
    });

    const sheng = qimen ? qimen.changeAdvice.primaryDir : face.name;
    const kai = qimen ? qimen.changeAdvice.secondaryDir : sit.name;
    const xiu = qimen ? qimen.changeAdvice.restDir : null;
    const avoid = qimen ? qimen.changeAdvice.avoidDirs : [];

    const zones = [
      {
        title: '财位 / 生气位',
        dir: sheng,
        text: `今日奇门生门在「${sheng}」。可在房间该方位摆：绿植、聚宝盆、或工作进账相关文件盒；保持明亮整洁，忌堆垃圾与破损物。`
      },
      {
        title: '开门 / 事业位',
        dir: kai,
        text: `开门方「${kai}」利见贵、签约、推进项目。适合放书桌外角、名片架、台灯；早晨可在此方伸展开运。`
      },
      {
        title: '文昌 / 学习位',
        dir: yong.includes('木') ? '东南/正东' : (yong.includes('水') ? '正北' : '东南'),
        text: '书桌宜背靠实墙、面向房间门气或吉方；左高右低（左书架右台灯亦可）。放置文具、书籍、文昌相关小件。'
      },
      {
        title: '平安睡眠位',
        dir: sit.name,
        text: `以坐山「${sit.name}」为靠，安床靠山；床头朝喜用或坐山。卧室少电子光、少镜射。`
      },
      {
        title: '宜避方位',
        dir: avoid.join('、') || '临时堆物区',
        text: `奇门死门/惊门等避方（${avoid.join('、') || '无强制'}）勿放床头、勿对灶、勿长期坐卧；可作储物但要整洁加盖。`
      }
    ];

    if (xiu) {
      zones.push({
        title: '休门缓释位',
        dir: xiu,
        text: `休门在「${xiu}」，适合放沙发、茶席、冥想角，利于缓和人际与休息回血。`
      });
    }

    if (meihua && meihua.changeAdvice) {
      zones.push({
        title: '梅花变局位',
        dir: meihua.changeAdvice.primaryDir,
        text: `梅花变卦出路「${meihua.changeAdvice.primaryDir}」，可在此方做一处「转机角」：一盏灯 + 一件喜用色物件，提醒自己主动改道。`
      });
    }

    if (liuRen && liuRen.palace) {
      zones.push({
        title: '小六壬课体位',
        dir: liuRen.palace.direction,
        text: `今日课得${liuRen.palace.name}，五行${liuRen.palace.wuxing}，本宫在「${liuRen.palace.direction}」。吉则在此方加强活动；凶则减少在此方争执与重大决策。`
      });
    }

    const checklist = [
      `大门/房门内外干净通畅，门后不堆杂物（杨公重气口）。`,
      `客厅或卧室「${sheng}」方位日间见光，摆 ${PLACE_ITEMS[primary][0]}。`,
      `书桌朝「${kai}」或背靠实墙，桌面只留正在推进的一件要事。`,
      `厨房火与卫生间水尽量不对冲床位；卫生间门常闭、排气通畅。`,
      `喜用色点缀：${yong.map((w) => colorOf(w)).join('、')}，面积宜点缀不宜满屋抢戏。`,
      `每周清理一次避方与床下，保持「藏风聚气」而非藏污纳垢。`
    ];

    return { items, zones, checklist, sheng, kai, primary };
  }

  function colorOf(w) {
    return { 木: '青绿', 火: '红紫', 土: '黄米', 金: '白银', 水: '黑蓝' }[w] || w;
  }

  function advise(input) {
    const { lat, lng } = clampLatLng(input.lat, input.lng);
    const sit = resolveDir(input.sitDir);
    const bedZone = resolveDir(input.bedZone);
    const bedHead = resolveDir(input.bedHead);
    if (!sit) throw new Error('请选择房间坐向（床靠的墙一侧/房屋坐山）');
    if (!bedZone) throw new Error('请选择床在房间中的方位');
    if (!bedHead) throw new Error('请选择床头朝向');

    const geo = geoProfile(lat, lng);
    const yong = input.yongShen || null;
    const sitting = evaluateSitting(sit.key, yong);
    const bed = evaluateBed(bedZone.key, bedHead.key, sit.key, yong, input.qimen);
    const place = indoorPlacement({
      sitKey: sit.key,
      yongShen: yong,
      qimen: input.qimen,
      meihua: input.meihua,
      liuRen: input.liuRen
    });

    // 综合开运短策
    const actions = [
      `地理：${geo.note}`,
      `坐向：${sitting.summary}${sitting.comments[0] || ''}`,
      `床位：${bed.summary}`,
      `今日先做：在「${place.sheng}」摆一盆喜用绿植或亮灯 15 分钟，并清理「${(input.qimen && input.qimen.changeAdvice.avoidDirs[0]) || '杂物角'}」避方。`,
      `睡眠：床头朝「${bedHead.name}」，靠实墙；睡前关闭直射卧室的镜子与强蓝光。`,
      `办公：面向或借用「${place.kai}」气口，背有靠、前有明堂（桌前开阔）。`,
      `形法：沙发/床头靠实墙，明堂开阔，避横梁压顶、尖角冲射、门冲直穿。`,
      `三要：门通气有遮挡；主卧藏风不对镜；灶与水槽隔开，宜坐煞向吉思维微调。`
    ];

    const result = {
      geo,
      sitting,
      bed,
      place,
      actions,
      overallScore: Math.round((sitting.score * 0.4 + bed.score * 0.4 + 70 * 0.2)),
      headline: `杨公布局建议：坐${sit.name}向${sitting.face.name} · 床头宜${bedHead.name} · 今日开运偏「${place.sheng}」`,
      compass: input.compass || null
    };

    if (global.YangGongData && typeof global.YangGongData.buildReportExtras === 'function') {
      result.knowledge = global.YangGongData.buildReportExtras(input.compass || null, result);
    } else {
      result.knowledge = null;
    }
    return result;
  }

  global.YangGong = {
    DIRS8,
    MOUNTAINS24,
    advise,
    geoProfile,
    clampLatLng,
    resolveDir
  };
})(typeof window !== 'undefined' ? window : globalThis);
