/**
 * 杨公三合电子风水罗盘（详盘）
 * 地盘正针 · 人盘中针 · 天盘缝针
 * 穿山七十二龙 · 透地六十龙 · 周天分金 · 二十八宿 · 先后天八卦
 */
(function (global) {
  /** 二十四山：每山 15°，中心磁方位（0=北，顺时针）——正针标准 */
  const MOUNTAINS24 = [
    { name: '壬', center: 345, bagua: '坎', wuxing: '水', yinYang: '阳' },
    { name: '子', center: 0, bagua: '坎', wuxing: '水', yinYang: '阳' },
    { name: '癸', center: 15, bagua: '坎', wuxing: '水', yinYang: '阴' },
    { name: '丑', center: 30, bagua: '艮', wuxing: '土', yinYang: '阴' },
    { name: '艮', center: 45, bagua: '艮', wuxing: '土', yinYang: '阳' },
    { name: '寅', center: 60, bagua: '艮', wuxing: '木', yinYang: '阳' },
    { name: '甲', center: 75, bagua: '震', wuxing: '木', yinYang: '阳' },
    { name: '卯', center: 90, bagua: '震', wuxing: '木', yinYang: '阴' },
    { name: '乙', center: 105, bagua: '震', wuxing: '木', yinYang: '阴' },
    { name: '辰', center: 120, bagua: '巽', wuxing: '土', yinYang: '阳' },
    { name: '巽', center: 135, bagua: '巽', wuxing: '木', yinYang: '阴' },
    { name: '巳', center: 150, bagua: '巽', wuxing: '火', yinYang: '阴' },
    { name: '丙', center: 165, bagua: '离', wuxing: '火', yinYang: '阳' },
    { name: '午', center: 180, bagua: '离', wuxing: '火', yinYang: '阳' },
    { name: '丁', center: 195, bagua: '离', wuxing: '火', yinYang: '阴' },
    { name: '未', center: 210, bagua: '坤', wuxing: '土', yinYang: '阴' },
    { name: '坤', center: 225, bagua: '坤', wuxing: '土', yinYang: '阴' },
    { name: '申', center: 240, bagua: '坤', wuxing: '金', yinYang: '阳' },
    { name: '庚', center: 255, bagua: '兑', wuxing: '金', yinYang: '阳' },
    { name: '酉', center: 270, bagua: '兑', wuxing: '金', yinYang: '阴' },
    { name: '辛', center: 285, bagua: '兑', wuxing: '金', yinYang: '阴' },
    { name: '戌', center: 300, bagua: '乾', wuxing: '土', yinYang: '阳' },
    { name: '乾', center: 315, bagua: '乾', wuxing: '金', yinYang: '阳' },
    { name: '亥', center: 330, bagua: '乾', wuxing: '水', yinYang: '阴' }
  ];

  /** 人盘中针偏西半山；天盘缝针偏东半山 */
  const REN_OFFSET = 7.5;
  const TIAN_OFFSET = -7.5;

  const HOU_TIAN = [
    { name: '坎', center: 0, dir: '正北' },
    { name: '艮', center: 45, dir: '东北' },
    { name: '震', center: 90, dir: '正东' },
    { name: '巽', center: 135, dir: '东南' },
    { name: '离', center: 180, dir: '正南' },
    { name: '坤', center: 225, dir: '西南' },
    { name: '兑', center: 270, dir: '正西' },
    { name: '乾', center: 315, dir: '西北' }
  ];

  const XIAN_TIAN = [
    { name: '坤', center: 0 },
    { name: '震', center: 45 },
    { name: '离', center: 90 },
    { name: '兑', center: 135 },
    { name: '乾', center: 180 },
    { name: '巽', center: 225 },
    { name: '坎', center: 270 },
    { name: '艮', center: 315 }
  ];

  const XIU28_RAW = [
    { name: '虚', span: 9 }, { name: '危', span: 16 }, { name: '室', span: 18 },
    { name: '壁', span: 10 }, { name: '奎', span: 17 }, { name: '娄', span: 12 },
    { name: '胃', span: 15 }, { name: '昴', span: 11 }, { name: '毕', span: 17 },
    { name: '觜', span: 1 }, { name: '参', span: 10 }, { name: '井', span: 32 },
    { name: '鬼', span: 2 }, { name: '柳', span: 14 }, { name: '星', span: 7 },
    { name: '张', span: 18 }, { name: '翼', span: 20 }, { name: '轸', span: 18 },
    { name: '角', span: 12 }, { name: '亢', span: 9 }, { name: '氐', span: 16 },
    { name: '房', span: 5 }, { name: '心', span: 5 }, { name: '尾', span: 18 },
    { name: '箕', span: 10 }, { name: '斗', span: 22 }, { name: '牛', span: 7 },
    { name: '女', span: 11 }
  ];
  const XIU28_TOTAL = XIU28_RAW.reduce((s, x) => s + x.span, 0);
  const XIU28 = (function () {
    let acc = 0;
    return XIU28_RAW.map((x) => {
      const start = (acc / XIU28_TOTAL) * 360;
      acc += x.span;
      const end = (acc / XIU28_TOTAL) * 360;
      return { name: x.name, start, end, center: (start + end) / 2 };
    });
  })();

  /**
   * 穿山七十二龙（穿山虎）：每山三龙，每龙 5°
   * 六十甲子 + 十二空亡；空亡多落于十二地支山之第三格
   */
  const CHUAN_NAMES = {
    壬: ['甲子', '丙子', '戊子'],
    子: ['庚子', '壬子', '空亡'],
    癸: ['乙丑', '丁丑', '己丑'],
    丑: ['辛丑', '癸丑', '空亡'],
    艮: ['甲寅', '丙寅', '戊寅'],
    寅: ['庚寅', '壬寅', '空亡'],
    甲: ['乙卯', '丁卯', '己卯'],
    卯: ['辛卯', '癸卯', '空亡'],
    乙: ['甲辰', '丙辰', '戊辰'],
    辰: ['庚辰', '壬辰', '空亡'],
    巽: ['乙巳', '丁巳', '己巳'],
    巳: ['辛巳', '癸巳', '空亡'],
    丙: ['甲午', '丙午', '戊午'],
    午: ['庚午', '壬午', '空亡'],
    丁: ['乙未', '丁未', '己未'],
    未: ['辛未', '癸未', '空亡'],
    坤: ['甲申', '丙申', '戊申'],
    申: ['庚申', '壬申', '空亡'],
    庚: ['乙酉', '丁酉', '己酉'],
    酉: ['辛酉', '癸酉', '空亡'],
    辛: ['甲戌', '丙戌', '戊戌'],
    戌: ['庚戌', '壬戌', '空亡'],
    乾: ['乙亥', '丁亥', '己亥'],
    亥: ['辛亥', '癸亥', '空亡']
  };

  const CHUAN_SHAN_72 = (function () {
    const list = [];
    // 按周天顺时针：从壬(337.5°)起
    const order = [
      '壬', '子', '癸', '丑', '艮', '寅', '甲', '卯', '乙', '辰', '巽', '巳',
      '丙', '午', '丁', '未', '坤', '申', '庚', '酉', '辛', '戌', '乾', '亥'
    ];
    order.forEach((shan) => {
      const m = MOUNTAINS24.find((x) => x.name === shan);
      const start0 = normalizeDeg(m.center - 7.5);
      const names = CHUAN_NAMES[shan];
      for (let i = 0; i < 3; i++) {
        const start = normalizeDeg(start0 + i * 5);
        const end = normalizeDeg(start0 + (i + 1) * 5);
        const center = normalizeDeg(start0 + i * 5 + 2.5);
        const name = names[i];
        list.push({
          name,
          short: name === '空亡' ? '空' : name,
          mountain: shan,
          slot: i + 1,
          start,
          end,
          center,
          isVoid: name === '空亡',
          use: '穿山·来龙入首'
        });
      }
    });
    return list;
  })();

  /** 六十甲子 + 纳音 */
  const JIAZI60 = [
    ['甲子', '海中金'], ['乙丑', '海中金'], ['丙寅', '炉中火'], ['丁卯', '炉中火'],
    ['戊辰', '大林木'], ['己巳', '大林木'], ['庚午', '路旁土'], ['辛未', '路旁土'],
    ['壬申', '剑锋金'], ['癸酉', '剑锋金'], ['甲戌', '山头火'], ['乙亥', '山头火'],
    ['丙子', '涧下水'], ['丁丑', '涧下水'], ['戊寅', '城头土'], ['己卯', '城头土'],
    ['庚辰', '白蜡金'], ['辛巳', '白蜡金'], ['壬午', '杨柳木'], ['癸未', '杨柳木'],
    ['甲申', '泉中水'], ['乙酉', '泉中水'], ['丙戌', '屋上土'], ['丁亥', '屋上土'],
    ['戊子', '霹雳火'], ['己丑', '霹雳火'], ['庚寅', '松柏木'], ['辛卯', '松柏木'],
    ['壬辰', '长流水'], ['癸巳', '长流水'], ['甲午', '砂中金'], ['乙未', '砂中金'],
    ['丙申', '山下火'], ['丁酉', '山下火'], ['戊戌', '平地木'], ['己亥', '平地木'],
    ['庚子', '壁上土'], ['辛丑', '壁上土'], ['壬寅', '金箔金'], ['癸卯', '金箔金'],
    ['甲辰', '覆灯火'], ['乙巳', '覆灯火'], ['丙午', '天河水'], ['丁未', '天河水'],
    ['戊申', '大驿土'], ['己酉', '大驿土'], ['庚戌', '钗钏金'], ['辛亥', '钗钏金'],
    ['壬子', '桑柘木'], ['癸丑', '桑柘木'], ['甲寅', '大溪水'], ['乙卯', '大溪水'],
    ['丙辰', '沙中土'], ['丁巳', '沙中土'], ['戊午', '天上火'], ['己未', '天上火'],
    ['庚申', '石榴木'], ['辛酉', '石榴木'], ['壬戌', '大海水'], ['癸亥', '大海水']
  ];

  /**
   * 透地六十龙：每龙 6°，甲子起于正北 0°（地盘正针）
   * 用于穴场地下气脉、精细分金
   */
  const TOUDI_60 = JIAZI60.map((pair, i) => {
    const start = i * 6;
    const end = start + 6;
    return {
      name: pair[0],
      nayin: pair[1],
      index: i + 1,
      start,
      end,
      center: start + 3,
      use: '透地·穴场气脉'
    };
  });

  function approxDeclination(lat, lng) {
    lat = Number(lat);
    lng = Number(lng);
    if (Number.isNaN(lat) || Number.isNaN(lng)) return 0;
    if (lng > 70 && lng < 140 && lat > 15 && lat < 55) {
      return -6.5 + (lng - 100) * 0.08 - (lat - 35) * 0.05;
    }
    if (lng > -130 && lng < -60 && lat > 20 && lat < 55) {
      return -12 + (lng + 100) * 0.15;
    }
    return 0;
  }

  function normalizeDeg(d) {
    d = d % 360;
    if (d < 0) d += 360;
    return d;
  }

  function inArc(h, start, end) {
    h = normalizeDeg(h);
    start = normalizeDeg(start);
    end = normalizeDeg(end);
    if (start < end) return h >= start && h < end;
    return h >= start || h < end; // 跨 0°
  }

  function mountainAt(heading) {
    const h = normalizeDeg(heading);
    let best = MOUNTAINS24[0];
    let bestDiff = 999;
    for (const m of MOUNTAINS24) {
      let diff = Math.abs(h - m.center);
      if (diff > 180) diff = 360 - diff;
      if (diff < bestDiff) {
        bestDiff = diff;
        best = m;
      }
    }
    return best;
  }

  function baguaAt(heading) {
    const h = normalizeDeg(heading);
    let best = HOU_TIAN[0];
    let bestDiff = 999;
    for (const b of HOU_TIAN) {
      let diff = Math.abs(h - b.center);
      if (diff > 180) diff = 360 - diff;
      if (diff < bestDiff) {
        bestDiff = diff;
        best = b;
      }
    }
    return best;
  }

  function xianTianAt(heading) {
    const h = normalizeDeg(heading);
    let best = XIAN_TIAN[0];
    let bestDiff = 999;
    for (const b of XIAN_TIAN) {
      let diff = Math.abs(h - b.center);
      if (diff > 180) diff = 360 - diff;
      if (diff < bestDiff) {
        bestDiff = diff;
        best = b;
      }
    }
    return best;
  }

  function dir8Name(heading) {
    const names = ['正北', '东北', '正东', '东南', '正南', '西南', '正西', '西北'];
    return names[Math.round(normalizeDeg(heading) / 45) % 8];
  }

  function oppositeMountain(m) {
    return mountainAt(m.center + 180);
  }

  function fenjinAt(heading) {
    const m = mountainAt(heading);
    const half = 7.5;
    let offset = normalizeDeg(heading) - normalizeDeg(m.center - half);
    if (offset < 0) offset += 360;
    if (offset >= 15) offset = 14.999;
    const slot = Math.min(4, Math.floor(offset / 3));
    const names = ['初', '二', '三', '四', '五'];
    const quality =
      slot === 2 ? '正中·较宜立向' : slot === 1 || slot === 3 ? '近中·可用' : '偏侧·宜微调';
    return {
      mountain: m.name,
      slot: slot + 1,
      name: names[slot],
      label: `${m.name}山${names[slot]}分金`,
      quality,
      offsetInMountain: offset
    };
  }

  function xiuAt(heading) {
    const h = normalizeDeg(heading);
    for (const x of XIU28) {
      if (h >= x.start && h < x.end) return x;
    }
    return XIU28[0];
  }

  function chuanShanAt(heading) {
    const h = normalizeDeg(heading);
    for (const d of CHUAN_SHAN_72) {
      if (inArc(h, d.start, d.end)) return d;
    }
    return CHUAN_SHAN_72[0];
  }

  function touDiAt(heading) {
    const h = normalizeDeg(heading);
    const idx = Math.min(59, Math.floor(h / 6));
    return TOUDI_60[idx];
  }

  function readThreePlates(heading) {
    const h = normalizeDeg(heading);
    const di = mountainAt(h);
    const ren = mountainAt(h + REN_OFFSET);
    const tian = mountainAt(h + TIAN_OFFSET);
    const sit = oppositeMountain(di);
    return {
      dipan: {
        mountain: di,
        bagua: baguaAt(h),
        label: `${di.name}山`,
        zuoXiang: `坐${sit.name}向${di.name}`,
        use: '定坐向·阳宅门向床向'
      },
      renpan: {
        mountain: ren,
        bagua: baguaAt(h + REN_OFFSET),
        label: `${ren.name}山`,
        use: '消砂·外局峰峦案山'
      },
      tianpan: {
        mountain: tian,
        bagua: baguaAt(h + TIAN_OFFSET),
        label: `${tian.name}山`,
        use: '纳水·水口来去水'
      }
    };
  }

  /** @returns {{ title: string, pro: string, plain: string }[]} */
  function placementHint(compassOrMountain, yongShen, qimen) {
    const tips = [];
    const tip = (title, pro, plain) => tips.push({ title, pro, plain });
    let plates;
    let face;
    if (compassOrMountain && compassOrMountain.plates) {
      plates = compassOrMountain.plates;
      face = plates.dipan.mountain;
    } else {
      face = compassOrMountain;
      plates = null;
    }
    if (!face) {
      return [
        {
          title: '使用说明',
          pro: '开启罗盘后显示三盘与龙格读数。',
          plain:
            '先点「开启罗盘」，把手机顶部对准你想摆放的方向（比如书桌朝向），下面会同时给出专业说法和大白话。'
        }
      ];
    }

    const faceDir = dir8Name(face.center);
    const sit = oppositeMountain(face);
    const sitDir = dir8Name(sit.center);

    if (plates) {
      tip(
        '地盘 · 正针（定朝向）',
        `面向${plates.dipan.label}（${face.bagua}卦·${face.wuxing}），${plates.dipan.zuoXiang}。立向、门向、床头、书桌以此盘为准。`,
        `简单说：你现在脸朝「${faceDir}」（${face.name}山）。门、床头、书桌主要看这一圈——想定朝向，就认地盘。相当于「背靠${sitDir}、脸朝${faceDir}」。`
      );
      tip(
        '人盘 · 中针（看周围靠山）',
        `外局砂峰落在${plates.renpan.label}。宜有靠山/高柜，忌尖角煞射。`,
        `简单说：看你身后、两侧有没有「靠山」——墙、柜子、书架都可以。人盘指${plates.renpan.label}一带，最好有东西撑着，别被尖角、横梁正对着。`
      );
      tip(
        '天盘 · 缝针（看前面开阔与水气）',
        `水气口应在${plates.tianpan.label}。明堂宜开阔；流水景宜置生气侧。`,
        `简单说：看你面前是否开阔、亮堂。天盘落在${plates.tianpan.label}附近——小水景、加湿器可放在面前干净一侧，别冲着脏乱处。`
      );
      if (compassOrMountain.chuanShan) {
        const cs = compassOrMountain.chuanShan;
        if (cs.isVoid) {
          tip(
            '穿山七十二龙（看来气从哪进）',
            `值「空亡」龙（${cs.mountain}山第${cs.slot}格）。不宜作来龙入首与正穴，宜微调半山内避开空亡。`,
            '简单说：这一格像「空号」，气不太稳。定床、定桌时稍微转一点角度躲开会更稳妥。'
          );
        } else {
          tip(
            '穿山七十二龙（看来气从哪进）',
            `值${cs.name}龙（${cs.mountain}山）。看来龙入首，宜龙气连续、忌挖断来脉。`,
            `简单说：气脉落在「${cs.name}」这一格，来气还算连贯。别在正对方向把门封死或堆满重物挡死。`
          );
        }
      }
      if (compassOrMountain.touDi) {
        const td = compassOrMountain.touDi;
        tip(
          '透地六十龙（看脚下细格）',
          `值${td.name}龙·纳音${td.nayin}。看穴场气脉与精细分金，宜与穿山、分金相合。`,
          `简单说：这是更细的一格（${td.name}，纳音「${td.nayin}」）。摆床、摆桌尽量对准中间，别卡在两条线夹缝上。`
        );
      }
      if (compassOrMountain.fenjin) {
        const fj = compassOrMountain.fenjin;
        const plainQ =
          fj.slot === 3
            ? '正对着这一山的中间，比较合适定朝向。'
            : fj.slot === 2 || fj.slot === 4
              ? '稍微偏一点，还能用；想更稳可以轻轻再转一点。'
              : '偏在边上了，建议慢慢转动手机或家具，尽量对准中间。';
        tip('一百二十分金（精细对准）', `${fj.label}（${fj.quality}）。`, `简单说：${plainQ}`);
      }
      if (compassOrMountain.xiu) {
        tip(
          '二十八宿（天象分度）',
          `值${compassOrMountain.xiu.name}宿。`,
          `简单说：古人把天空分成二十八段，现在落在「${compassOrMountain.xiu.name}宿」。日常摆家具可参考，不必过分纠结。`
        );
      }
    } else {
      tip(
        '当前朝向',
        `手机朝向「${face.name}山」${face.bagua}卦，五行属${face.wuxing}。`,
        `简单说：你正对着${faceDir}方向。`
      );
    }

    tip(
      '办公桌怎么摆',
      `面向${face.name}方纳气，背靠对宫；左高右稍低；桌前留明堂。`,
      `简单说：人坐着脸朝${faceDir}；背后最好有墙或柜子；左手边可稍高（书柜），右手边别太满；桌前留空，别正对门冲，也别让镜子正对座位。`
    );

    if (yongShen && yongShen.includes(face.wuxing)) {
      tip(
        '与命局喜用',
        `地盘朝向合喜用「${face.wuxing}」，较利案头久坐。`,
        `简单说：这个朝向的五行（${face.wuxing}）刚好是你喜用的，长时间办公、学习会更舒服一些。`
      );
    } else if (yongShen && yongShen.length) {
      tip(
        '与命局喜用',
        `喜用为${yongShen.join('、')}，当前地盘属${face.wuxing}；可微调至喜用山并避开穿山空亡、取分金正中。`,
        `简单说：你更适合「${yongShen.join('、')}」这类方位，现在是「${face.wuxing}」。久坐不舒服就慢慢转动桌子，尽量对准中间格、避开空亡。`
      );
    }

    if (qimen && qimen.changeAdvice) {
      const sheng = qimen.changeAdvice.primaryDir;
      const kai = qimen.changeAdvice.secondaryDir;
      const avoid = qimen.changeAdvice.avoidDirs || [];
      if (faceDir === sheng) {
        tip(
          '今日奇门 · 生门',
          `今日奇门生门在「${sheng}」，与地盘大位相合。`,
          `简单说：今天「生气」方向在${sheng}，和你现在大方向一致，适合做推进事情的小调整。`
        );
      }
      if (faceDir === kai) {
        tip(
          '今日奇门 · 开门',
          `正对开门方「${kai}」，利见贵与事业。`,
          `简单说：今天「开门」在${kai}，正对这个方向，见人、谈事会顺一些。`
        );
      }
      if (avoid.some((d) => d === faceDir)) {
        tip(
          '今日奇门 · 避方',
          `接近今日避方（${avoid.join('、')}），大事决策时建议改向或侧坐。`,
          `简单说：今天不太建议硬顶「${avoid.join('、')}」。有重要决定时，换个朝向或侧身坐更稳。`
        );
      }
    }

    tip(
      '记一句就够',
      '针法：立向地盘、消砂人盘、纳水天盘；来龙看穿山，穴场看透地——空亡处勿强立向。',
      '简单说：定朝向看「地盘」；背后靠不靠看「人盘」；前面空不空看「天盘」；更细的格看穿山、透地。遇到「空亡」就稍微转开一点。'
    );

    if (global.YangGongData && typeof global.YangGongData.enrichCompassTips === 'function' && plates) {
      return global.YangGongData.enrichCompassTips(compassOrMountain, tips, {
        yongShen: yongShen,
        qimen: qimen
      });
    }
    return tips;
  }

  function createLuopan(opts) {
    const canvas = opts.canvas;
    const onUpdate = opts.onUpdate || function () {};
    const ctx = canvas.getContext('2d');
    let lat = opts.lat || 0;
    let lng = opts.lng || 0;
    let running = false;
    let raf = 0;
    let smoothHeading = 0;
    let hasSensor = false;
    let lastEvent = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const parentW = canvas.parentElement ? canvas.parentElement.clientWidth - 8 : 440;
      const css = Math.min(opts.size || 440, parentW, 480);
      canvas.style.width = css + 'px';
      canvas.style.height = css + 'px';
      canvas.width = Math.floor(css * dpr);
      canvas.height = Math.floor(css * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    }

    function ringLabel(text, r, color, fontSize) {
      ctx.fillStyle = color;
      ctx.font = `${fontSize}px "ZCOOL XiaoWei", "KaiTi", "Songti SC", serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 0, -r);
    }

    function drawMountainRing(rTick, rText, offsetDeg, color, accentColor, fontScale, w) {
      MOUNTAINS24.forEach((m) => {
        const c = normalizeDeg(m.center + offsetDeg);
        const ang = ((c - 90) * Math.PI) / 180;
        const strong = ['子', '午', '卯', '酉', '乾', '坤', '艮', '巽'].includes(m.name);
        ctx.beginPath();
        ctx.moveTo(Math.cos(ang) * rTick, Math.sin(ang) * rTick);
        ctx.lineTo(Math.cos(ang) * (rTick * 0.92), Math.sin(ang) * (rTick * 0.92));
        ctx.strokeStyle = strong ? accentColor : color;
        ctx.lineWidth = strong ? 1.4 : 0.6;
        ctx.globalAlpha = strong ? 1 : 0.5;
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.save();
        ctx.rotate(ang + Math.PI / 2);
        ringLabel(m.name, rText, strong ? accentColor : color, Math.max(7, w * fontScale));
        ctx.restore();
      });
    }

    function draw() {
      const w = canvas.clientWidth || 440;
      const cx = w / 2;
      const cy = w / 2;
      const R = w / 2 - 3;
      ctx.clearRect(0, 0, w, w);

      const g = ctx.createRadialGradient(cx, cy, R * 0.06, cx, cy, R);
      g.addColorStop(0, '#3a2e22');
      g.addColorStop(0.4, '#241c14');
      g.addColorStop(0.8, '#12100c');
      g.addColorStop(1, '#070605');
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      ctx.lineWidth = Math.max(2, w * 0.01);
      ctx.strokeStyle = '#c9a45c';
      ctx.stroke();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((-smoothHeading * Math.PI) / 180);

      // 周天度数
      for (let d = 0; d < 360; d += 1) {
        const ang = ((d - 90) * Math.PI) / 180;
        const major = d % 15 === 0;
        const fen = d % 3 === 0;
        const len = major ? 0.042 : fen ? 0.024 : 0.012;
        ctx.beginPath();
        ctx.moveTo(Math.cos(ang) * R * 0.998, Math.sin(ang) * R * 0.998);
        ctx.lineTo(Math.cos(ang) * R * (0.998 - len), Math.sin(ang) * R * (0.998 - len));
        ctx.strokeStyle = major ? '#e8c87a' : fen ? 'rgba(201,164,92,0.5)' : 'rgba(201,164,92,0.18)';
        ctx.lineWidth = major ? 1.1 : 0.5;
        ctx.stroke();
        if (major && w >= 340) {
          ctx.save();
          ctx.rotate(ang + Math.PI / 2);
          ringLabel(String(d), R * 0.935, '#c9a45c', Math.max(6, w * 0.018));
          ctx.restore();
        }
      }

      // 二十八宿
      XIU28.forEach((x) => {
        const ang = ((x.center - 90) * Math.PI) / 180;
        ctx.save();
        ctx.rotate(ang + Math.PI / 2);
        ringLabel(x.name, R * 0.88, 'rgba(150,185,165,0.85)', Math.max(6, w * 0.016));
        ctx.restore();
      });

      // —— 穿山七十二龙（每 5°）——
      CHUAN_SHAN_72.forEach((d) => {
        const ang = ((d.center - 90) * Math.PI) / 180;
        const a0 = ((d.start - 90) * Math.PI) / 180;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a0) * R * 0.845, Math.sin(a0) * R * 0.845);
        ctx.lineTo(Math.cos(a0) * R * 0.78, Math.sin(a0) * R * 0.78);
        ctx.strokeStyle = d.isVoid ? 'rgba(180,70,60,0.45)' : 'rgba(180,150,200,0.35)';
        ctx.lineWidth = 0.6;
        ctx.stroke();
        if (w >= 300) {
          ctx.save();
          ctx.rotate(ang + Math.PI / 2);
          ringLabel(
            d.short,
            R * 0.81,
            d.isVoid ? 'rgba(220,100,90,0.85)' : 'rgba(190,165,210,0.88)',
            Math.max(5, w * 0.013)
          );
          ctx.restore();
        }
      });
      ctx.beginPath();
      ctx.arc(0, 0, R * 0.78, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(180,150,200,0.35)';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // —— 透地六十龙（每 6°）——
      TOUDI_60.forEach((d) => {
        const ang = ((d.center - 90) * Math.PI) / 180;
        const a0 = ((d.start - 90) * Math.PI) / 180;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a0) * R * 0.775, Math.sin(a0) * R * 0.775);
        ctx.lineTo(Math.cos(a0) * R * 0.715, Math.sin(a0) * R * 0.715);
        ctx.strokeStyle = 'rgba(140,175,160,0.4)';
        ctx.lineWidth = 0.55;
        ctx.stroke();
        if (w >= 320) {
          ctx.save();
          ctx.rotate(ang + Math.PI / 2);
          ringLabel(d.name, R * 0.742, 'rgba(150,195,175,0.9)', Math.max(5, w * 0.012));
          ctx.restore();
        }
      });
      ctx.beginPath();
      ctx.arc(0, 0, R * 0.715, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(140,175,160,0.4)';
      ctx.stroke();

      // 天 / 人 / 地 三针
      [0.7, 0.6, 0.5].forEach((r) => {
        ctx.beginPath();
        ctx.arc(0, 0, R * r, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(201,164,92,0.25)';
        ctx.stroke();
      });

      drawMountainRing(R * 0.7, R * 0.655, -TIAN_OFFSET, 'rgba(140,190,210,0.7)', '#8fd0e8', 0.022, w);
      drawMountainRing(R * 0.6, R * 0.555, -REN_OFFSET, 'rgba(200,160,100,0.75)', '#e8b86a', 0.024, w);
      drawMountainRing(R * 0.5, R * 0.445, 0, 'rgba(210,185,120,0.85)', '#f0d78c', 0.03, w);

      // 后天 / 先天
      HOU_TIAN.forEach((b) => {
        const ang = ((b.center - 90) * Math.PI) / 180;
        ctx.save();
        ctx.rotate(ang + Math.PI / 2);
        ringLabel(b.name, R * 0.36, '#e8dcc4', Math.max(9, w * 0.03));
        ctx.restore();
      });
      XIAN_TIAN.forEach((b) => {
        const ang = ((b.center - 90) * Math.PI) / 180;
        ctx.save();
        ctx.rotate(ang + Math.PI / 2);
        ringLabel(b.name, R * 0.255, 'rgba(150,130,100,0.75)', Math.max(7, w * 0.02));
        ctx.restore();
      });

      // 天池
      ctx.beginPath();
      ctx.arc(0, 0, R * 0.16, 0, Math.PI * 2);
      ctx.fillStyle = '#0e0c09';
      ctx.fill();
      ctx.strokeStyle = '#c9a45c';
      ctx.lineWidth = 1.4;
      ctx.stroke();
      ctx.fillStyle = '#c9a45c';
      ctx.font = `${Math.max(8, w * 0.024)}px "ZCOOL XiaoWei", "KaiTi", serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('天池', 0, -2);
      ctx.font = `${Math.max(6, w * 0.016)}px sans-serif`;
      ctx.fillStyle = 'rgba(201,164,92,0.65)';
      ctx.fillText('磁北', 0, 11);

      ctx.beginPath();
      ctx.moveTo(0, -R * 0.998);
      ctx.lineTo(-4, -R * 0.95);
      ctx.lineTo(4, -R * 0.95);
      ctx.closePath();
      ctx.fillStyle = '#b33a2b';
      ctx.fill();

      ctx.restore();

      // 准星
      ctx.beginPath();
      ctx.moveTo(cx, cy - R + 1);
      ctx.lineTo(cx - 8, cy - R + 18);
      ctx.lineTo(cx + 8, cy - R + 18);
      ctx.closePath();
      ctx.fillStyle = '#d4513d';
      ctx.fill();
      ctx.strokeStyle = '#f0e2b8';
      ctx.stroke();

      ctx.strokeStyle = 'rgba(232,220,196,0.2)';
      ctx.beginPath();
      ctx.moveTo(cx, cy - R * 0.72);
      ctx.lineTo(cx, cy + R * 0.72);
      ctx.moveTo(cx - R * 0.72, cy);
      ctx.lineTo(cx + R * 0.72, cy);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(212,81,61,0.4)';
      ctx.beginPath();
      ctx.moveTo(cx, cy - R * 0.72);
      ctx.lineTo(cx, cy - R * 0.18);
      ctx.stroke();
    }

    function buildPayload(extra) {
      const plates = readThreePlates(smoothHeading);
      const dec = approxDeclination(lat, lng);
      return Object.assign(
        {
          heading: smoothHeading,
          trueHeading: normalizeDeg(smoothHeading + dec),
          declination: dec,
          mountain: plates.dipan.mountain,
          bagua: plates.dipan.bagua,
          xianTian: xianTianAt(smoothHeading),
          dir8: dir8Name(smoothHeading),
          plates,
          fenjin: fenjinAt(smoothHeading),
          xiu: xiuAt(smoothHeading),
          chuanShan: chuanShanAt(smoothHeading),
          touDi: touDiAt(smoothHeading),
          hasSensor,
          lat,
          lng
        },
        extra || {}
      );
    }

    function emit(extra) {
      onUpdate(buildPayload(extra));
    }

    function onOrientation(e) {
      let h = null;
      if (typeof e.webkitCompassHeading === 'number' && !Number.isNaN(e.webkitCompassHeading)) {
        h = e.webkitCompassHeading;
      } else if (e.absolute && typeof e.alpha === 'number') {
        h = normalizeDeg(360 - e.alpha);
      } else if (typeof e.alpha === 'number') {
        h = normalizeDeg(360 - e.alpha);
      }
      if (h == null || Number.isNaN(h)) return;
      hasSensor = true;
      lastEvent = Date.now();
      let delta = h - smoothHeading;
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;
      smoothHeading = normalizeDeg(smoothHeading + delta * 0.18);
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0;
          draw();
          emit();
        });
      }
    }

    async function requestPermission() {
      if (
        typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function'
      ) {
        const state = await DeviceOrientationEvent.requestPermission();
        if (state !== 'granted') {
          throw new Error('未获得传感器权限，请在系统设置中允许运动与方向访问');
        }
      }
    }

    async function start() {
      if (running) return;
      await requestPermission();
      running = true;
      window.addEventListener('deviceorientationabsolute', onOrientation, true);
      window.addEventListener('deviceorientation', onOrientation, true);
      resize();
      emit();
      setTimeout(() => {
        if (!hasSensor || Date.now() - lastEvent > 2500) {
          emit({
            hasSensor: false,
            warning:
              '未读到罗盘数据：请允许方向传感器，远离磁吸壳与金属桌；按「8」字旋转校准。'
          });
        }
      }, 2800);
    }

    function stop() {
      running = false;
      window.removeEventListener('deviceorientationabsolute', onOrientation, true);
      window.removeEventListener('deviceorientation', onOrientation, true);
    }

    function setLatLng(la, ln) {
      lat = Number(la) || 0;
      lng = Number(ln) || 0;
      emit();
      draw();
    }

    function setHeadingManual(h) {
      smoothHeading = normalizeDeg(h);
      draw();
      emit();
    }

    window.addEventListener('resize', resize);

    return {
      start,
      stop,
      resize,
      setLatLng,
      setHeadingManual,
      getHeading: () => smoothHeading,
      mountainAt,
      placementHint,
      readThreePlates,
      MOUNTAINS24
    };
  }

  global.Luopan = {
    createLuopan,
    mountainAt,
    baguaAt,
    xianTianAt,
    dir8Name,
    approxDeclination,
    placementHint,
    readThreePlates,
    fenjinAt,
    xiuAt,
    chuanShanAt,
    touDiAt,
    MOUNTAINS24,
    HOU_TIAN,
    XIAN_TIAN,
    XIU28,
    CHUAN_SHAN_72,
    TOUDI_60,
    REN_OFFSET,
    TIAN_OFFSET,
    BAGUA8: HOU_TIAN
  };
})(typeof window !== 'undefined' ? window : globalThis);
