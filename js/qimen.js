/**
 * 奇门遁甲 · 简化时盘（拆补近似）
 * 用于：在风险时指示生门/开门等吉方，规避死门/惊门
 */
(function (global) {
  // 洛书九宫方位（5为中）
  const PALACE = {
    1: { name: '坎一宫', dir: '正北', dirCode: 'N' },
    2: { name: '坤二宫', dir: '西南', dirCode: 'SW' },
    3: { name: '震三宫', dir: '正东', dirCode: 'E' },
    4: { name: '巽四宫', dir: '东南', dirCode: 'SE' },
    5: { name: '中五宫', dir: '中央', dirCode: 'C' },
    6: { name: '乾六宫', dir: '西北', dirCode: 'NW' },
    7: { name: '兑七宫', dir: '正西', dirCode: 'W' },
    8: { name: '艮八宫', dir: '东北', dirCode: 'NE' },
    9: { name: '离九宫', dir: '正南', dirCode: 'S' }
  };

  const DOORS = ['休', '生', '伤', '杜', '景', '死', '惊', '开'];
  const DOOR_INFO = {
    休: { luck: '吉', meaning: '休养、贵人、谈判缓和', action: '休息调整、拜访贵人、缓和冲突' },
    生: { luck: '大吉', meaning: '生机、财源、求谋得地', action: '求财求职、开新事、改运起步' },
    伤: { luck: '凶', meaning: '伤害、竞争、冲动', action: '避争斗，改用智取' },
    杜: { luck: '平', meaning: '闭塞、隐藏、技术', action: '韬晦修炼、补漏洞，不宜张扬' },
    景: { luck: '平吉', meaning: '文书、名声、曝光', action: '发文宣传、考试面试尚可' },
    死: { luck: '大凶', meaning: '停滞、终结、破耗', action: '绝勿在此方启动大事' },
    惊: { luck: '凶', meaning: '惊扰、官非、惊恐', action: '防口舌官司，少争辩' },
    开: { luck: '大吉', meaning: '开创、官贵、畅通', action: '签约上线、见贵、打开局面' }
  };

  // 节气索引（与 bazi jieqi 一致）：0小寒…23冬至
  // 阳遁：冬至→夏至前；阴遁：夏至→冬至前
  // 简化局数表（上中下元取仲局常用近似）
  const JU_TABLE = {
    // jie index → { yinYang: 1阳/-1阴, ju }
    23: { yinYang: 1, ju: 1 }, // 冬至 阳一
    0: { yinYang: 1, ju: 2 },
    1: { yinYang: 1, ju: 3 },
    2: { yinYang: 1, ju: 8 }, // 立春
    3: { yinYang: 1, ju: 9 },
    4: { yinYang: 1, ju: 1 }, // 惊蛰
    5: { yinYang: 1, ju: 3 },
    6: { yinYang: 1, ju: 4 }, // 清明
    7: { yinYang: 1, ju: 5 },
    8: { yinYang: 1, ju: 7 }, // 立夏
    9: { yinYang: 1, ju: 8 },
    10: { yinYang: 1, ju: 9 }, // 芒种
    11: { yinYang: -1, ju: 9 }, // 夏至 阴九
    12: { yinYang: -1, ju: 8 },
    13: { yinYang: -1, ju: 7 },
    14: { yinYang: -1, ju: 2 }, // 立秋
    15: { yinYang: -1, ju: 1 },
    16: { yinYang: -1, ju: 9 }, // 白露
    17: { yinYang: -1, ju: 7 },
    18: { yinYang: -1, ju: 6 }, // 寒露
    19: { yinYang: -1, ju: 5 },
    20: { yinYang: -1, ju: 3 }, // 立冬
    21: { yinYang: -1, ju: 2 },
    22: { yinYang: -1, ju: 1 }  // 大雪
  };

  const GAN = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
  const ZHI = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];

  // 三奇六仪在阳遁的顺布起点宫=局数
  const YI_ORDER_YANG = ['戊','己','庚','辛','壬','癸','丁','丙','乙'];

  function dayPillarIndex(date) {
    let d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    if (date.getHours() >= 23) d.setDate(d.getDate() + 1);
    const utc = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
    const base = Date.UTC(1900, 0, 1);
    const days = Math.floor((utc - base) / 86400000);
    return ((10 + days) % 60 + 60) % 60;
  }

  function hourPillar(dayGan, zhiIndex) {
    const dayIdx = GAN.indexOf(dayGan);
    const start = [0, 2, 4, 6, 8][dayIdx % 5];
    return { gan: GAN[(start + zhiIndex) % 10], zhi: ZHI[zhiIndex] };
  }

  function xunShouByIndex(gzIndex) {
    const xunStart = Math.floor(gzIndex / 10) * 10; // 0,10,20,30,40,50
    const map = {
      0: '戊',   // 甲子旬
      10: '己',  // 甲戌
      20: '庚',  // 甲申
      30: '辛',  // 甲午
      40: '壬',  // 甲辰
      50: '癸'   // 甲寅
    };
    const zhiName = { 0: '甲子', 10: '甲戌', 20: '甲申', 30: '甲午', 40: '甲辰', 50: '甲寅' };
    return { yi: map[xunStart], name: zhiName[xunStart] };
  }

  // 用与 bazi 相同的节气近似
  function jieqiDate(year, index) {
    const base = new Date(Date.UTC(1900, 0, 6, 2, 5, 0));
    const century = (year - 1900) * 365.2422 * 24 * 60;
    const offsetMin = century + index * 15.2184 * 24 * 60;
    return new Date(base.getTime() + offsetMin * 60000 + 8 * 3600 * 1000);
  }

  function currentJu(date) {
    const y = date.getFullYear();
    let best = { idx: 23, t: jieqiDate(y - 1, 23) };
    for (let yy = y - 1; yy <= y + 1; yy++) {
      for (let i = 0; i < 24; i++) {
        const t = jieqiDate(yy, i);
        if (t <= date && t >= best.t) best = { idx: i, t };
      }
    }
    const conf = JU_TABLE[best.idx] || { yinYang: 1, ju: 1 };
    return { ...conf, jieIndex: best.idx, jieName: [
      '小寒','大寒','立春','雨水','惊蛰','春分','清明','谷雨',
      '立夏','小满','芒种','夏至','小暑','大暑','立秋','处暑',
      '白露','秋分','寒露','霜降','立冬','小雪','大雪','冬至'
    ][best.idx] };
  }

  function castFromDate(date = new Date()) {
    const juInfo = currentJu(date);
    const yang = juInfo.yinYang === 1;
    const ju = juInfo.ju;

    const dayIdx = dayPillarIndex(date);
    const dayGan = GAN[dayIdx % 10];
    const dayZhi = ZHI[dayIdx % 12];
    const zhiIndex = global.Lunar.hourToZhiIndex(date.getHours(), date.getMinutes());
    const hour = hourPillar(dayGan, zhiIndex);
    // 时辰干支六十甲子索引
    const hGz = (() => {
      for (let i = 0; i < 60; i++) {
        if (GAN[i % 10] === hour.gan && ZHI[i % 12] === hour.zhi) return i;
      }
      return 0;
    })();

    const xun = xunShouByIndex(hGz);
    // 六仪三奇排盘：阳遁从局数宫顺布戊己庚辛壬癸丁丙乙
    const yiOrder = YI_ORDER_YANG.slice();
    const yiPalace = {};
    for (let i = 0; i < 9; i++) {
      const p = yang
        ? ((ju - 1 + i) % 9) + 1
        : ((ju - 1 - i + 90) % 9) + 1;
      yiPalace[yiOrder[i]] = p;
    }

    // 值符：旬首仪所在宫
    const zhiFuPalace = yiPalace[xun.yi] || ju;
    // 八门：休生伤杜景死惊开，沿洛书飞宫 1-8-3-4-9-2-7-6（中5寄坤二）
    const path = [1, 8, 3, 4, 9, 2, 7, 6];
    const startPos = path.indexOf(ju === 5 ? 2 : ju);
    const doorPalace = {};
    for (let i = 0; i < 8; i++) {
      const idx = yang
        ? (startPos + i) % 8
        : (startPos - i + 80) % 8;
      doorPalace[DOORS[i]] = path[idx];
    }

    // 值使随旬首偏移（简化）
    const xunOffset = hGz % 10;
    const zhiShiDoor = DOORS[yang ? xunOffset % 8 : (8 - (xunOffset % 8)) % 8];
    const flyIdx = (path.indexOf(zhiFuPalace === 5 ? 2 : zhiFuPalace) + (yang ? xunOffset : -xunOffset) + 80) % 8;
    const zhiShiPalace = path[flyIdx];
    const hourGanPalace = yiPalace[hour.gan] || (hour.gan === '甲' ? zhiFuPalace : ju);

    const doorsList = DOORS.map((d) => ({
      door: d,
      palace: doorPalace[d],
      dir: PALACE[doorPalace[d]].dir,
      ...DOOR_INFO[d]
    }));

    const sheng = doorsList.find((x) => x.door === '生');
    const kai = doorsList.find((x) => x.door === '开');
    const xiu = doorsList.find((x) => x.door === '休');
    const si = doorsList.find((x) => x.door === '死');
    const jing = doorsList.find((x) => x.door === '惊');

    const changeAdvice = {
      primaryDir: sheng.dir,
      secondaryDir: kai.dir,
      restDir: xiu.dir,
      avoidDirs: [si.dir, jing.dir],
      strategy: `今日${yang ? '阳' : '阴'}遁${ju}局（${juInfo.jieName}后）。求转机首选「生门·${sheng.dir}」：${DOOR_INFO.生.action}；打开局面可走「开门·${kai.dir}」；需缓则可往「休门·${xiu.dir}」。务必避开「死门·${si.dir}」与「惊门·${jing.dir}」。`,
      zhiFu: `值符落${PALACE[zhiFuPalace].name}（${PALACE[zhiFuPalace].dir}），见贵、借势可朝此方。`,
      zhiShi: `值使为${zhiShiDoor}门，动态落${PALACE[zhiShiPalace].name}（${PALACE[zhiShiPalace].dir}），办事节奏随此方起伏。`
    };

    return {
      yinYang: yang ? '阳遁' : '阴遁',
      ju,
      jieName: juInfo.jieName,
      day: dayGan + dayZhi,
      hour: hour.gan + hour.zhi,
      xunShou: xun.name,
      zhiFuPalace,
      zhiShiDoor,
      zhiShiPalace,
      hourGanPalace,
      doors: doorsList,
      yiPalace,
      changeAdvice,
      summary: `${yang ? '阳' : '阴'}遁${ju}局 · 日${dayGan}${dayZhi} 时${hour.gan}${hour.zhi} · 生门在${sheng.dir}，开门在${kai.dir}`
    };
  }

  global.Qimen = { PALACE, DOOR_INFO, castFromDate };
})(typeof window !== 'undefined' ? window : globalThis);
