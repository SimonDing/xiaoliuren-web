/**
 * 四柱八字排盘（本地简化实现）
 * 规则对齐 bazi-skill：立春换年、节令换月、五鼠遁时、十神与五行统计
 */
(function (global) {
  const GAN = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
  const ZHI = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
  const WX_GAN = {甲:'木',乙:'木',丙:'火',丁:'火',戊:'土',己:'土',庚:'金',辛:'金',壬:'水',癸:'水'};
  const WX_ZHI = {子:'水',丑:'土',寅:'木',卯:'木',辰:'土',巳:'火',午:'火',未:'土',申:'金',酉:'金',戌:'土',亥:'水'};
  const YIN_YANG_GAN = {甲:'阳',乙:'阴',丙:'阳',丁:'阴',戊:'阳',己:'阴',庚:'阳',辛:'阴',壬:'阳',癸:'阴'};
  const CANG_GAN = {
    子:['癸'],丑:['己','癸','辛'],寅:['甲','丙','戊'],卯:['乙'],
    辰:['戊','乙','癸'],巳:['丙','庚','戊'],午:['丁','己'],未:['己','丁','乙'],
    申:['庚','壬','戊'],酉:['辛'],戌:['戊','辛','丁'],亥:['壬','甲']
  };
  const SHISHEN_NAME = {
    same_same:'比肩', same_diff:'劫财',
    sheng_same:'食神', sheng_diff:'伤官',
    ke_same:'偏财', ke_diff:'正财',
    bei_same:'七杀', bei_diff:'正官',
    mu_same:'偏印', mu_diff:'正印'
  };

  // 节气近似时刻（相对 1900 的经验公式，精度对排月柱足够）
  // 顺序：小寒起，每两年气一节；月柱用「节」：立春、惊蛰、清明…
  const JIEQI_NAMES = [
    '小寒','大寒','立春','雨水','惊蛰','春分','清明','谷雨',
    '立夏','小满','芒种','夏至','小暑','大暑','立秋','处暑',
    '白露','秋分','寒露','霜降','立冬','小雪','大雪','冬至'
  ];

  function jieqiDate(year, index) {
    // Centcentury empirical: based on 1900 offset minutes
    const base = new Date(Date.UTC(1900, 0, 6, 2, 5, 0));
    const century = (year - 1900) * 365.2422 * 24 * 60;
    // 节气大致每 15.2184 天
    const offsetMin = century + index * 15.2184 * 24 * 60;
    // 微调常见偏差
    const adjust = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    return new Date(base.getTime() + (offsetMin + (adjust[index] || 0)) * 60000);
  }

  function getYearPillar(date) {
    let y = date.getFullYear();
    const lichun = jieqiDate(y, 2);
    // jieqiDate 用 UTC，转本地比较：用年月日时分构造本地近似
    const lichunLocal = toLocalApprox(lichun);
    if (date < lichunLocal) y -= 1;
    // 1984 甲子年
    const idx = ((y - 1984) % 60 + 60) % 60;
    return { gan: GAN[idx % 10], zhi: ZHI[idx % 12], index: idx, year: y };
  }

  function toLocalApprox(utcDate) {
    // 将推算的 UTC 时刻转为“北京时间观感”的本地 Date（+8h 近似）
    return new Date(utcDate.getTime() + 8 * 3600 * 1000);
  }

  function getMonthPillar(date, yearGan) {
    const y = date.getFullYear();
    // 十二节 → 地支：小寒丑、立春寅、惊蛰卯…大雪子
    const jieNodes = [
      { idx: 0, branch: 1 },  // 小寒 → 丑
      { idx: 2, branch: 2 },  // 立春 → 寅
      { idx: 4, branch: 3 },  // 惊蛰 → 卯
      { idx: 6, branch: 4 },  // 清明 → 辰
      { idx: 8, branch: 5 },  // 立夏 → 巳
      { idx: 10, branch: 6 }, // 芒种 → 午
      { idx: 12, branch: 7 }, // 小暑 → 未
      { idx: 14, branch: 8 }, // 立秋 → 申
      { idx: 16, branch: 9 }, // 白露 → 酉
      { idx: 18, branch: 10 },// 寒露 → 戌
      { idx: 20, branch: 11 },// 立冬 → 亥
      { idx: 22, branch: 0 }  // 大雪 → 子
    ];
    const nodes = [];
    for (let yy = y - 1; yy <= y + 1; yy++) {
      for (const j of jieNodes) {
        nodes.push({
          date: toLocalApprox(jieqiDate(yy, j.idx)),
          branch: j.branch,
          jie: JIEQI_NAMES[j.idx]
        });
      }
    }
    nodes.sort((a, b) => a.date - b.date);
    let cur = nodes[0];
    for (const n of nodes) {
      if (date >= n.date) cur = n;
      else break;
    }

    const zhi = ZHI[cur.branch];
    // 年上起月：甲己丙作首，乙庚戊为头…
    const yearGanIdx = GAN.indexOf(yearGan);
    const yinGan = [2, 4, 6, 8, 0][yearGanIdx % 5]; // 寅月天干
    const offset = (cur.branch - 2 + 12) % 12;
    const gan = GAN[(yinGan + offset) % 10];
    return { gan, zhi, jie: cur.jie, branchIndex: cur.branch };
  }

  function getDayPillar(date) {
    // 夜子时 23:00 后用次日日柱
    let d = new Date(date.getTime());
    if (d.getHours() >= 23) {
      d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1, 0, 0, 0);
    }
    // 甲子日起算：1900-01-01 为甲戌（已知），用儒略日差
    const utc = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
    const base = Date.UTC(1900, 0, 1);
    const days = Math.floor((utc - base) / 86400000);
    // 1900-01-01 = 甲戌 = gan0? 甲=0 戌=10 → index 10
    const idx = ((10 + days) % 60 + 60) % 60;
    return { gan: GAN[idx % 10], zhi: ZHI[idx % 12], index: idx };
  }

  function getHourPillar(dayGan, zhiIndex) {
    // 五鼠遁
    const dayIdx = GAN.indexOf(dayGan);
    const start = [0,2,4,6,8][dayIdx % 5]; // 甲己甲, 乙庚丙...
    const gan = GAN[(start + zhiIndex) % 10];
    return { gan, zhi: ZHI[zhiIndex] };
  }

  function shishen(dayGan, otherGan) {
    if (!otherGan) return '—';
    const dw = WX_GAN[dayGan];
    const ow = WX_GAN[otherGan];
    const sameYY = YIN_YANG_GAN[dayGan] === YIN_YANG_GAN[otherGan];
    const rel = relation(dw, ow);
    const key = `${rel}_${sameYY ? 'same' : 'diff'}`;
    return SHISHEN_NAME[key];
  }

  function relation(me, other) {
    const order = ['木','火','土','金','水'];
    const a = order.indexOf(me);
    const b = order.indexOf(other);
    if (a === b) return 'same';
    if ((a + 1) % 5 === b) return 'sheng';
    if ((a + 2) % 5 === b) return 'ke';
    if ((a + 3) % 5 === b) return 'bei';
    return 'mu';
  }

  function countWuxing(pillars) {
    const score = {木:0,火:0,土:0,金:0,水:0};
    for (const p of pillars) {
      score[WX_GAN[p.gan]] += 1.2;
      score[WX_ZHI[p.zhi]] += 1.0;
      const cangs = CANG_GAN[p.zhi] || [];
      cangs.forEach((g, i) => {
        score[WX_GAN[g]] += i === 0 ? 0.5 : 0.25;
      });
    }
    return score;
  }

  function judgeStrength(dayWx, monthZhi, scores) {
    const lingWx = WX_ZHI[monthZhi];
    const deling = lingWx === dayWx || relation(lingWx, dayWx) === 'mu';
    const total = Object.values(scores).reduce((a, b) => a + b, 0);
    const self = scores[dayWx];
    const ratio = self / total;
    let level = '中和';
    if (ratio >= 0.28 || (deling && ratio >= 0.22)) level = '偏旺';
    if (ratio <= 0.16) level = '偏弱';
    if (ratio >= 0.36) level = '过旺';
    if (ratio <= 0.12) level = '过弱';
    return { level, deling, ratio };
  }

  function pickYongShen(dayWx, strength, scores) {
    const order = ['木','火','土','金','水'];
    const idx = order.indexOf(dayWx);
    const shengWo = order[(idx + 4) % 5];
    const woSheng = order[(idx + 1) % 5];
    const woKe = order[(idx + 2) % 5];
    const keWo = order[(idx + 3) % 5];
    const ranked = order.slice().sort((a, b) => scores[a] - scores[b]);

    if (strength.level === '偏弱' || strength.level === '过弱') {
      return [dayWx, shengWo].filter((v, i, a) => a.indexOf(v) === i);
    }
    if (strength.level === '偏旺' || strength.level === '过旺') {
      return [woSheng, woKe];
    }
    // 中和：补最弱
    return [ranked[0], ranked[1]];
  }

  function dayunList(yearGan, monthPillar, gender, startAge = 8) {
    const yangYear = ['甲','丙','戊','庚','壬'].includes(yearGan);
    const male = gender === '男';
    const forward = (yangYear && male) || (!yangYear && !male);
    const g0 = GAN.indexOf(monthPillar.gan);
    const z0 = ZHI.indexOf(monthPillar.zhi);
    const list = [];
    for (let i = 1; i <= 8; i++) {
      const g = forward ? (g0 + i) % 10 : (g0 - i + 100) % 10;
      const z = forward ? (z0 + i) % 12 : (z0 - i + 120) % 12;
      const ageFrom = startAge + (i - 1) * 10;
      list.push({
        ganZhi: GAN[g] + ZHI[z],
        ageFrom,
        ageTo: ageFrom + 9
      });
    }
    return { forward, list, startAge };
  }

  function estimateStartAge(date, forward) {
    // 简化：到最近节的天数 / 3
    const y = date.getFullYear();
    const nodes = [];
    for (let yy = y - 1; yy <= y + 1; yy++) {
      [0,2,4,6,8,10,12,14,16,18,20,22].forEach((ji) => {
        nodes.push(toLocalApprox(jieqiDate(yy, ji)));
      });
    }
    nodes.sort((a, b) => a - b);
    let prev = nodes[0], next = nodes[nodes.length - 1];
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i] <= date) prev = nodes[i];
      if (nodes[i] > date) { next = nodes[i]; break; }
    }
    const days = Math.abs((forward ? next : prev) - date) / 86400000;
    const age = Math.max(1, Math.round(days / 3));
    return Math.min(age, 12);
  }

  function buildSuggestions(yong, dayMaster) {
    const map = {
      木: { color:'青绿、翠绿', dir:'东方', job:'教育、文化、农林、服装、策划' },
      火: { color:'红、紫、橙', dir:'南方', job:'能源、媒体、表演、电子、餐饮热食' },
      土: { color:'黄、咖、米白', dir:'中央/西南东北', job:'地产、建筑、农业、咨询、中介' },
      金: { color:'白、金、银灰', dir:'西方', job:'金融、科技、机械、法律、汽车' },
      水: { color:'黑、蓝', dir:'北方', job:'物流、贸易、旅游、医疗、传播' }
    };
    const primary = map[yong[0]] || map[dayMaster.wuxing];
    return {
      colors: yong.map((w) => map[w].color).join('；'),
      directions: yong.map((w) => map[w].dir).join('；'),
      careers: yong.map((w) => map[w].job).join('；'),
      summary: `日主${dayMaster.gan}（${dayMaster.wuxing}），喜用偏${yong.join('、')}。日常可多接触对应颜色与方位，事业方向可参考：${primary.job}。`
    };
  }

  function castBazi({ year, month, day, hour = 12, minute = 0, gender = '男' }) {
    const date = new Date(year, month - 1, day, hour, minute, 0);
    if (Number.isNaN(date.getTime())) throw new Error('出生时间无效');
    if (year < 1900 || year > 2100) throw new Error('八字排盘支持 1900-2100 年');

    const yearP = getYearPillar(date);
    const monthP = getMonthPillar(date, yearP.gan);
    const dayP = getDayPillar(date);
    const zhiIndex = global.Lunar.hourToZhiIndex(hour, minute);
    const hourP = getHourPillar(dayP.gan, zhiIndex);

    const pillars = [
      { name:'年柱', ...yearP },
      { name:'月柱', gan: monthP.gan, zhi: monthP.zhi },
      { name:'日柱', ...dayP },
      { name:'时柱', ...hourP }
    ];

    const tenGods = {
      year: shishen(dayP.gan, yearP.gan),
      month: shishen(dayP.gan, monthP.gan),
      day: '日主',
      hour: shishen(dayP.gan, hourP.gan)
    };

    const cang = pillars.map((p) => ({
      name: p.name,
      list: (CANG_GAN[p.zhi] || []).map((g) => `${g}(${shishen(dayP.gan, g)})`)
    }));

    const scores = countWuxing(pillars);
    const dayMaster = { gan: dayP.gan, wuxing: WX_GAN[dayP.gan], yinyang: YIN_YANG_GAN[dayP.gan] };
    const strength = judgeStrength(dayMaster.wuxing, monthP.zhi, scores);
    const yongShen = pickYongShen(dayMaster.wuxing, strength, scores);
    const startAge = estimateStartAge(date, ( ['甲','丙','戊','庚','壬'].includes(yearP.gan) && gender === '男') || (!['甲','丙','戊','庚','壬'].includes(yearP.gan) && gender === '女'));
    const dayun = dayunList(yearP.gan, monthP, gender, startAge);
    const wuxingRank = Object.entries(scores)
      .map(([name, value]) => ({ name, value: Math.round(value * 10) / 10 }))
      .sort((a, b) => b.value - a.value);
    const suggestions = buildSuggestions(yongShen, dayMaster);

    // 当前大运
    const age = calcAge(date, new Date());
    const currentDayun = dayun.list.find((d) => age >= d.ageFrom && age <= d.ageTo) || dayun.list[0];

    return {
      date,
      gender,
      pillars: pillars.map((p) => ({ name: p.name, gan: p.gan, zhi: p.zhi, ganZhi: p.gan + p.zhi, wuxing: WX_GAN[p.gan] + WX_ZHI[p.zhi] })),
      tenGods,
      cang,
      dayMaster,
      strength,
      scores,
      wuxingRank,
      yongShen,
      dayun,
      currentDayun,
      age,
      monthJie: monthP.jie,
      suggestions,
      summaryText: `乾造/坤造：${pillars.map((p) => p.gan + p.zhi).join(' ')}。日主${dayMaster.gan}${dayMaster.wuxing}，身${strength.level}，喜用${yongShen.join('、')}。现年约${age}岁，行${currentDayun.ganZhi}大运（${currentDayun.ageFrom}-${currentDayun.ageTo}岁）。`
    };
  }

  function calcAge(birth, now) {
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
    return Math.max(0, age);
  }

  global.Bazi = {
    castBazi,
    GAN,
    ZHI,
    WX_GAN,
    shishen
  };
})(typeof window !== 'undefined' ? window : globalThis);
