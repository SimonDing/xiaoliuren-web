(function () {
  const $ = (sel) => document.querySelector(sel);

  let currentCast = null;
  let currentBazi = null;
  let currentFate = null;
  let currentTakashima = null;
  let currentCombo = null;
  let lastDate = new Date();
  let luopan = null;
  let lastCompass = null;
  let lastFengshuiResult = null;
  let luopanRunning = false;

  const DIR_CODE = {
    正东: 'E', 东南: 'SE', 正南: 'S', 西南: 'SW',
    正西: 'W', 西北: 'NW', 正北: 'N', 东北: 'NE'
  };

  const DIR8_TO_KEY = {
    正北: 'N', 东北: 'NE', 正东: 'E', 东南: 'SE',
    正南: 'S', 西南: 'SW', 正西: 'W', 西北: 'NW'
  };

  function init() {
    buildWheelLabels();
    runCast(new Date());
    tickClock();
    setInterval(tickClock, 1000);

    $('#btn-refresh').addEventListener('click', () => runCast(new Date()));
    $('#btn-bazi').addEventListener('click', onBaziSubmit);
    $('#btn-clear-bazi').addEventListener('click', clearBazi);
    $('#btn-geo').addEventListener('click', onGeoLocate);
    $('#btn-fengshui').addEventListener('click', onFengshuiSubmit);
    $('#btn-fs-clear').addEventListener('click', clearFengshui);
    $('#btn-luopan').addEventListener('click', toggleLuopan);
    $('#btn-luopan-cal').addEventListener('click', showLuopanHelp);
    $('#btn-use-facing').addEventListener('click', useFacingForBed);
    $('#btn-ai-save').addEventListener('click', saveAiConfig);
    $('#btn-ai-analyze').addEventListener('click', runAiAnalyze);
    $('#fs-lat').addEventListener('change', syncLuopanGeo);
    $('#fs-lng').addEventListener('change', syncLuopanGeo);

    $('#birth-year').value = 1990;
    $('#birth-month').value = 5;
    $('#birth-day').value = 15;
    $('#birth-hour').value = 10;
    $('#birth-minute').value = 0;

    loadFengshuiForm();
    loadAiForm();
    initLuopan();
  }

  function initLuopan() {
    const canvas = $('#luopan-canvas');
    if (!canvas || !window.Luopan) return;
    luopan = Luopan.createLuopan({
      canvas,
      size: 440,
      lat: Number($('#fs-lat').value) || 0,
      lng: Number($('#fs-lng').value) || 0,
      onUpdate: onCompassUpdate
    });
    luopan.resize();
  }

  function syncLuopanGeo() {
    if (!luopan) return;
    luopan.setLatLng($('#fs-lat').value, $('#fs-lng').value);
  }

  function onCompassUpdate(data) {
    lastCompass = data;
    const p = data.plates;
    $('#lp-deg').textContent = `${data.heading.toFixed(1)}°`;
    if (p) {
      $('#lp-mount').textContent = `${p.dipan.zuoXiang} · ${data.dir8}`;
      $('#lp-dipan').textContent =
        `${p.dipan.label} · ${p.dipan.mountain.bagua}·${p.dipan.mountain.wuxing}\n${p.dipan.zuoXiang}`;
      $('#lp-renpan').textContent =
        `${p.renpan.label} · ${p.renpan.mountain.bagua}·${p.renpan.mountain.wuxing}`;
      $('#lp-tianpan').textContent =
        `${p.tianpan.label} · ${p.tianpan.mountain.bagua}·${p.tianpan.mountain.wuxing}`;
    } else {
      $('#lp-mount').textContent = `${data.mountain.name}山 · ${data.bagua.name}卦 · ${data.dir8}`;
    }
    if (data.chuanShan) {
      const cs = data.chuanShan;
      $('#lp-chuanshan').textContent = cs.isVoid
        ? `空亡龙\n${cs.mountain}山第${cs.slot}格 · 宜避开`
        : `${cs.name}龙\n${cs.mountain}山 · 来龙入首`;
    }
    if (data.touDi) {
      const td = data.touDi;
      $('#lp-toudi').textContent = `${td.name}龙\n纳音${td.nayin} · 第${td.index}龙`;
    }
    let meta = data.hasSensor
      ? `磁方位 ${data.heading.toFixed(1)}° · 磁偏角约 ${data.declination.toFixed(1)}° · 真方位约 ${data.trueHeading.toFixed(1)}°`
      : data.warning || '等待传感器…将手机持平并缓慢旋转以校准';
    $('#lp-meta').textContent = meta;
    const fj = data.fenjin;
    const xiu = data.xiu;
    const cs = data.chuanShan;
    const td = data.touDi;
    $('#lp-extra').textContent = fj && xiu
      ? `${fj.label}（${fj.quality}） · ${xiu.name}宿 · 穿山${cs ? cs.name : '—'} · 透地${td ? td.name : '—'} · 后天${data.bagua.name}/先天${data.xianTian ? data.xianTian.name : '—'}`
      : '分金 — · 宿度 — · 穿山 — · 透地 —';

    const yong = currentBazi ? currentBazi.yongShen : null;
    const qimen = currentFate ? currentFate.qimen : null;
    const tips = Luopan.placementHint(data, yong, qimen);
    $('#lp-place').textContent = tips.join(' ');
  }

  async function toggleLuopan() {
    if (!luopan) initLuopan();
    if (!luopan) {
      alert('罗盘初始化失败');
      return;
    }
    if (luopanRunning) {
      luopan.stop();
      luopanRunning = false;
      $('#btn-luopan').textContent = '开启罗盘';
      $('#lp-meta').textContent = '罗盘已关闭';
      return;
    }
    try {
      syncLuopanGeo();
      $('#btn-luopan').textContent = '启动中…';
      await luopan.start();
      luopanRunning = true;
      $('#btn-luopan').textContent = '关闭罗盘';
      $('#lp-meta').textContent = '罗盘运行中：手机顶部对准目标墙面/书桌朝向';
    } catch (err) {
      $('#btn-luopan').textContent = '开启罗盘';
      alert(err.message || String(err));
    }
  }

  function showLuopanHelp() {
    alert(
      '【杨公三合罗盘 · 校准与用法】\n\n' +
        '校准：\n' +
        '1. 允许方向/运动传感器\n' +
        '2. 手机持平，远离磁吸壳与金属桌\n' +
        '3. 按「8」字缓慢旋转校准\n' +
        '4. 顶部红准星 = 你的朝向（天心十字线）\n\n' +
        '三针用法（各差半山 7.5°）：\n' +
        '· 地盘正针：定坐向——门、床、书桌朝向以此为准\n' +
        '· 人盘中针：消砂——看外局峰峦、靠山、案山\n' +
        '· 天盘缝针：纳水——看水口、来去水、明堂水气\n\n' +
        '龙格：\n' +
        '· 穿山七十二龙：看来龙入首（每山三龙、各5°）；值「空亡」勿强立穴\n' +
        '· 透地六十龙：看穴场气脉（每龙6°、附纳音）；宜与穿山、分金相合\n\n' +
        '另有周天度数、一百二十分金、二十八宿、先后天八卦、天池。\n' +
        '立向宜分金正中并避开穿山空亡；对准后可「用地盘朝向填床头」。'
    );
  }

  function useFacingForBed() {
    if (!lastCompass) {
      alert('请先开启罗盘并待读数稳定');
      return;
    }
    const key = DIR8_TO_KEY[lastCompass.dir8];
    if (key) {
      $('#fs-bed-head').value = key;
      saveFengshuiForm();
      alert(`已将床头朝向设为「${lastCompass.dir8}」（当前${lastCompass.mountain.name}山）`);
    }
  }

  function loadAiForm() {
    const cfg = AiFengshui.loadConfig();
    $('#ai-base').value = cfg.baseUrl || 'https://api.openai.com/v1';
    $('#ai-key').value = cfg.apiKey || '';
    $('#ai-model').value = cfg.model || 'gpt-4o-mini';
  }

  function saveAiConfig() {
    AiFengshui.saveConfig({
      baseUrl: $('#ai-base').value.trim(),
      apiKey: $('#ai-key').value.trim(),
      model: $('#ai-model').value.trim() || 'gpt-4o-mini'
    });
    $('#ai-status').textContent = '已保存到本机（不会写入仓库）';
  }

  async function runAiAnalyze() {
    const status = $('#ai-status');
    const box = $('#ai-result');
    try {
      saveAiConfig();
      if (!currentFate || !currentFate.qimen) {
        currentFate = FateChange.synthesize(lastDate, currentCast, currentBazi, currentTakashima);
      }
      // 确保有本地建议摘要
      if (!lastFengshuiResult) {
        try {
          lastFengshuiResult = YangGong.advise({
            lat: $('#fs-lat').value,
            lng: $('#fs-lng').value,
            sitDir: $('#fs-sit').value,
            bedZone: $('#fs-bed-zone').value,
            bedHead: $('#fs-bed-head').value,
            yongShen: currentBazi ? currentBazi.yongShen : null,
            qimen: currentFate.qimen,
            meihua: currentFate.meihua,
            liuRen: currentCast
          });
        } catch (e) {
          /* 允许仅凭罗盘+坐标分析 */
        }
      }

      status.textContent = '正在请求 AI 分析…';
      box.classList.add('hidden');
      const sitLabel = $('#fs-sit').selectedOptions[0].textContent;
      const content = await AiFengshui.analyze({
        lat: $('#fs-lat').value,
        lng: $('#fs-lng').value,
        sit: sitLabel,
        bedZone: $('#fs-bed-zone').selectedOptions[0].textContent,
        bedHead: $('#fs-bed-head').selectedOptions[0].textContent,
        yongShen: currentBazi ? currentBazi.yongShen : null,
        qimen: currentFate.qimen,
        compass: lastCompass,
        localAdvice: lastFengshuiResult
          ? `${lastFengshuiResult.headline}\n${lastFengshuiResult.actions.join('\n')}`
          : $('#lp-place').textContent
      });
      box.textContent = content;
      box.classList.remove('hidden');
      status.textContent = '分析完成（仅供参考）';
      box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (err) {
      status.textContent = '';
      alert(err.message || String(err));
    }
  }

  function loadFengshuiForm() {
    try {
      const raw = localStorage.getItem('xiaoliuren_fengshui');
      if (!raw) {
        // 默认北京示意坐标，便于试用
        $('#fs-lat').value = 39.9042;
        $('#fs-lng').value = 116.4074;
        return;
      }
      const data = JSON.parse(raw);
      if (data.lat != null) $('#fs-lat').value = data.lat;
      if (data.lng != null) $('#fs-lng').value = data.lng;
      if (data.sit) $('#fs-sit').value = data.sit;
      if (data.bedZone) $('#fs-bed-zone').value = data.bedZone;
      if (data.bedHead) $('#fs-bed-head').value = data.bedHead;
    } catch (e) {
      $('#fs-lat').value = 39.9042;
      $('#fs-lng').value = 116.4074;
    }
  }

  function saveFengshuiForm() {
    const data = {
      lat: $('#fs-lat').value,
      lng: $('#fs-lng').value,
      sit: $('#fs-sit').value,
      bedZone: $('#fs-bed-zone').value,
      bedHead: $('#fs-bed-head').value
    };
    localStorage.setItem('xiaoliuren_fengshui', JSON.stringify(data));
  }

  function applyGeo(lat, lng) {
    $('#fs-lat').value = Number(lat).toFixed(4);
    $('#fs-lng').value = Number(lng).toFixed(4);
    $('#btn-geo').textContent = '定位填入经纬度';
    saveFengshuiForm();
    syncLuopanGeo();
  }

  async function onGeoLocate() {
    $('#btn-geo').textContent = '定位中…';
    try {
      // Android App：优先 Capacitor Geolocation
      if (
        window.Capacitor &&
        window.Capacitor.Plugins &&
        window.Capacitor.Plugins.Geolocation
      ) {
        const pos = await window.Capacitor.Plugins.Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 12000
        });
        applyGeo(pos.coords.latitude, pos.coords.longitude);
        return;
      }
      if (!navigator.geolocation) {
        throw new Error('当前环境不支持定位，请手动填写经纬度。');
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => applyGeo(pos.coords.latitude, pos.coords.longitude),
        (err) => {
          $('#btn-geo').textContent = '定位填入经纬度';
          alert('定位失败：' + (err.message || '请检查权限后重试，或手动填写。'));
        },
        { enableHighAccuracy: true, timeout: 12000 }
      );
    } catch (err) {
      $('#btn-geo').textContent = '定位填入经纬度';
      alert('定位失败：' + (err.message || String(err)));
    }
  }

  function onFengshuiSubmit() {
    try {
      if (!currentFate || !currentFate.qimen) {
        currentFate = FateChange.synthesize(lastDate, currentCast, currentBazi, currentTakashima);
      }
      saveFengshuiForm();
      const result = YangGong.advise({
        lat: $('#fs-lat').value,
        lng: $('#fs-lng').value,
        sitDir: $('#fs-sit').value,
        bedZone: $('#fs-bed-zone').value,
        bedHead: $('#fs-bed-head').value,
        yongShen: currentBazi ? currentBazi.yongShen : null,
        qimen: currentFate.qimen,
        meihua: currentFate.meihua,
        liuRen: currentCast
      });
      lastFengshuiResult = result;
      renderFengshui(result);
      $('#fs-result').classList.remove('hidden');
      $('#fs-result').scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (err) {
      alert(err.message || String(err));
    }
  }

  function clearFengshui() {
    $('#fs-result').classList.add('hidden');
    $('#ai-result').classList.add('hidden');
    $('#ai-result').textContent = '';
    lastFengshuiResult = null;
  }

  function renderFengshui(r) {
    $('#fs-geo').textContent = r.geo.label;
    $('#fs-score').textContent = String(r.overallScore);
    $('#fs-sitting').textContent = r.sitting.summary;
    $('#fs-bed').textContent = r.bed.summary;
    $('#fs-headline').textContent = r.headline;

    const actions = $('#fs-actions');
    actions.innerHTML = '';
    r.actions.forEach((t) => {
      const li = document.createElement('li');
      li.textContent = t;
      actions.appendChild(li);
    });

    const zones = $('#fs-zones');
    zones.innerHTML = '';
    r.place.zones.forEach((z) => {
      const art = document.createElement('article');
      art.className = 'aspect';
      art.innerHTML = `<h3>${z.title} · ${z.dir}</h3><p>${z.text}</p>`;
      zones.appendChild(art);
    });

    const items = $('#fs-items');
    items.innerHTML = '';
    r.place.items.forEach((it) => {
      const span = document.createElement('span');
      span.className = 'door-chip good';
      span.textContent = `${it.wuxing}·${it.item}`;
      items.appendChild(span);
    });

    const check = $('#fs-check');
    check.innerHTML = '';
    r.place.checklist.forEach((t) => {
      const li = document.createElement('li');
      li.textContent = t;
      check.appendChild(li);
    });

    $('#fs-bed-tips').textContent =
      r.bed.tips.join(' ') + ' ' + r.sitting.comments.slice(1).join(' ');
  }

  function tickClock() {
    $('#live-clock').textContent = Lunar.formatSolar(new Date());
  }

  function buildWheelLabels() {
    const wheel = $('#wheel');
    XiaoLiuRen.PALACES.forEach((p, i) => {
      const el = document.createElement('div');
      el.className = 'petal';
      el.dataset.index = String(i);
      el.textContent = p.name;
      el.style.transform = `rotate(${i * 60}deg)`;
      wheel.appendChild(el);
    });
  }

  function runCast(date) {
    lastDate = date;
    currentCast = XiaoLiuRen.castFromDate(date);
    currentTakashima = Takashima.castFromDate(date);
    currentCombo = Takashima.combineWithLiuRen(currentTakashima, currentCast);
    renderCast(currentCast, currentCombo);
    renderTakashima(currentTakashima, currentCombo);
    if (currentBazi) {
      renderRefine(XiaoLiuRen.refineWithBazi(currentCast, currentBazi));
    }
    currentFate = FateChange.synthesize(date, currentCast, currentBazi, currentTakashima);
    renderFate(currentFate);
  }

  function renderCast(cast, combo) {
    const p = cast.palace;
    const idx = cast.path.indices.finalIdx;
    const aspects = (combo && combo.aspects) || cast.aspects;
    const score = combo ? combo.score : cast.score;
    const tip = combo ? combo.tip : cast.tip;

    $('#palace-name').textContent = p.name;
    $('#palace-name').className = 'palace-name is-' + p.nature;
    $('#palace-meta').textContent = `${p.nature} · ${p.wuxing} · ${p.direction}`;

    $('#pointer').style.transform = `rotate(${idx * 60}deg)`;
    document.querySelectorAll('.petal').forEach((el) => {
      el.classList.toggle('active', Number(el.dataset.index) === idx);
    });

    $('#meta-solar').textContent = cast.solar;
    $('#meta-lunar').textContent = `${cast.lunar.year}年${cast.lunar.monthCn}${cast.lunar.dayCn}${cast.lunar.isLeap ? '（闰）' : ''}`;
    $('#meta-shichen').textContent = `${cast.shichen.label}（${cast.shichen.range}）`;
    $('#meta-path').textContent = `${cast.path.monthPalace.name} → ${cast.path.dayPalace.name} → ${p.name}`;
    $('#meta-nature').textContent = p.nature;
    $('#meta-wx').textContent = `${p.wuxing} / ${p.direction} / ${p.color}`;

    $('#poem').textContent = p.poem;
    $('#score-fill').style.width = score + '%';
    const delta = combo && combo.scoreDelta ? `（合参${combo.scoreDelta >= 0 ? '+' : ''}${combo.scoreDelta}）` : '';
    $('#score-label').textContent = `时运指数 ${score}${delta}`;

    $('#asp-overall').textContent = aspects.overall;
    $('#asp-career').textContent = aspects.career;
    $('#asp-wealth').textContent = aspects.wealth;
    $('#asp-love').textContent = aspects.love;
    $('#asp-health').textContent = aspects.health;
    $('#asp-travel').textContent = aspects.travel;
    $('#asp-social').textContent = aspects.social;
    $('#asp-study').textContent = aspects.study;
    $('#yi').textContent = aspects.suit;
    $('#ji').textContent = aspects.avoid;
    $('#tip').textContent = tip;
  }

  function renderTakashima(tk, combo) {
    $('#tk-name').textContent = `${tk.hex.name}（第${tk.hex.id}卦）`;
    $('#tk-luck').textContent = tk.hex.luck;
    $('#tk-trigrams').textContent = `上${tk.upper.name} · 下${tk.lower.name}`;
    $('#tk-move').textContent = `${tk.moveLabel}动`;
    $('#tk-bian').textContent = tk.bian.name;
    $('#tk-harmony').textContent = combo ? combo.harmony : '—';
    $('#tk-hex-title').textContent = tk.hex.name;
    $('#tk-hex-sub').textContent = `${tk.method}`;
    $('#tk-judgment').textContent = tk.hex.judgment;
    $('#tk-line').textContent = `${tk.moveLabel}：「${tk.lineText}」→ 变卦${tk.bian.name}（${tk.bian.luck}）`;
    $('#tk-verdict-title').textContent = combo ? `壬卦合参 · ${combo.harmony}` : '壬卦合参';
    $('#tk-verdict').textContent = combo ? combo.verdict : '';
    $('#tk-advice').textContent = `高岛建议：${tk.hex.advice}。事业：${tk.hex.career}；财运：${tk.hex.wealth}；感情：${tk.hex.love}。`;

    const box = $('#tk-lines');
    box.innerHTML = '';
    // 自上而下显示（上爻在上）
    for (let i = 5; i >= 0; i--) {
      const yang = tk.bits[i] === 1;
      const moving = i === tk.moveIdx;
      const row = document.createElement('div');
      row.className = 'hex-line' + (yang ? ' yang' : ' yin') + (moving ? ' moving' : '');
      if (yang) {
        row.innerHTML = '<i></i>';
      } else {
        row.innerHTML = '<i></i><i></i>';
      }
      box.appendChild(row);
    }
  }

  function renderFate(fate) {
    const panel = $('#fate-panel');
    const badge = $('#risk-badge');
    const level = fate.risk.overall;

    panel.classList.remove('risk-high', 'risk-mid');
    badge.classList.remove('high', 'mid', 'low');
    if (level === '高') {
      panel.classList.add('risk-high');
      badge.classList.add('high');
      badge.textContent = '高风险';
    } else if (level === '中') {
      panel.classList.add('risk-mid');
      badge.classList.add('mid');
      badge.textContent = '有波动';
    } else {
      badge.classList.add('low');
      badge.textContent = '较平稳';
    }

    $('#risk-title').textContent = fate.risk.title + ' · ' + fate.plan.headline;

    const list = $('#risk-list');
    list.innerHTML = '';
    if (!fate.risk.risks.length) {
      const li = document.createElement('li');
      li.textContent = '未发现明显凶象；下方方位仍可作为今日拓展与布局参考。';
      list.appendChild(li);
    } else {
      fate.risk.risks.forEach((r) => {
        const li = document.createElement('li');
        li.className = r.level === '高' ? 'high' : '';
        li.innerHTML = `<span class="src">[${r.source}]</span>${r.text}`;
        list.appendChild(li);
      });
    }

    // 罗盘高亮
    const bestCode = DIR_CODE[fate.consensus.primaryDir];
    const avoidCodes = new Set(
      fate.consensus.avoidDirs.map((d) => DIR_CODE[d]).filter(Boolean)
    );
    document.querySelectorAll('.compass-dir').forEach((el) => {
      el.classList.remove('best', 'avoid');
      const d = el.dataset.d;
      if (d === bestCode) el.classList.add('best');
      if (avoidCodes.has(d)) el.classList.add('avoid');
    });
    $('#compass-main').textContent = fate.consensus.primaryDir;
    $('#compass-sub').textContent = fate.consensus.secondaryDir
      ? `辅 ${fate.consensus.secondaryDir}`
      : '主方位';

    $('#fate-oneliner').textContent = fate.plan.oneLiner;

    const steps = $('#plan-steps');
    steps.innerHTML = '';
    fate.plan.steps.forEach((s) => {
      const li = document.createElement('li');
      li.textContent = s;
      steps.appendChild(li);
    });

    // 梅花
    const mh = fate.meihua;
    $('#mh-summary').textContent = mh.summary;
    $('#mh-tiyong').textContent = `体${mh.ti.name}（${mh.ti.dir}/${mh.ti.wuxing}）· 用${mh.yong.name}（${mh.yong.dir}/${mh.yong.wuxing}）· ${mh.relation}。${mh.judgment}`;
    $('#mh-bian').textContent = `变卦${mh.bian.name}，外局出路偏「${mh.changeAdvice.primaryDir}」；补体可取「${mh.changeAdvice.supportDir}」。${mh.changeAdvice.moveHint}`;
    $('#mh-advice').textContent = mh.changeAdvice.strategy;

    // 奇门
    const qm = fate.qimen;
    $('#qm-summary').textContent = qm.summary;
    const chips = $('#qm-doors');
    chips.innerHTML = '';
    qm.doors.forEach((d) => {
      const span = document.createElement('span');
      span.className = 'door-chip';
      if (d.luck.includes('吉')) span.classList.add('good');
      if (d.luck.includes('凶')) span.classList.add('bad');
      span.textContent = `${d.door}门·${d.dir}`;
      chips.appendChild(span);
    });
    $('#qm-zhifu').textContent = `${qm.changeAdvice.zhiFu} ${qm.changeAdvice.zhiShi}`;
    $('#qm-advice').textContent = qm.changeAdvice.strategy;
  }

  function onBaziSubmit() {
    try {
      const payload = {
        year: Number($('#birth-year').value),
        month: Number($('#birth-month').value),
        day: Number($('#birth-day').value),
        hour: Number($('#birth-hour').value),
        minute: Number($('#birth-minute').value || 0),
        gender: $('#birth-gender').value
      };
      currentBazi = Bazi.castBazi(payload);
      renderBazi(currentBazi);
      const refined = XiaoLiuRen.refineWithBazi(currentCast, currentBazi);
      renderRefine(refined);
      currentFate = FateChange.synthesize(lastDate, currentCast, currentBazi, currentTakashima);
      renderFate(currentFate);
      $('#bazi-result').classList.remove('hidden');
      $('#refine-panel').classList.remove('hidden');
      $('#fate-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (err) {
      alert(err.message || String(err));
    }
  }

  function clearBazi() {
    currentBazi = null;
    $('#bazi-result').classList.add('hidden');
    $('#refine-panel').classList.add('hidden');
    currentFate = FateChange.synthesize(lastDate, currentCast, null, currentTakashima);
    renderFate(currentFate);
  }

  function renderBazi(b) {
    const pillars = b.pillars;
    $('#bz-year').innerHTML = cell(pillars[0], b.tenGods.year);
    $('#bz-month').innerHTML = cell(pillars[1], b.tenGods.month);
    $('#bz-day').innerHTML = cell(pillars[2], '日主');
    $('#bz-hour').innerHTML = cell(pillars[3], b.tenGods.hour);

    $('#bz-summary').textContent = b.summaryText;
    $('#bz-yong').textContent = `喜用神：${b.yongShen.join('、')}｜身${b.strength.level}｜月令节：${b.monthJie}`;
    $('#bz-wuxing').textContent = b.wuxingRank.map((x) => `${x.name}${x.value}`).join(' · ');
    $('#bz-dayun').textContent = `大运${b.dayun.forward ? '顺' : '逆'}行，约${b.dayun.startAge}岁起运。当前：${b.currentDayun.ganZhi}（${b.currentDayun.ageFrom}-${b.currentDayun.ageTo}岁）`;
    $('#bz-suggest').textContent = b.suggestions.summary;
  }

  function cell(p, god) {
    return `<div class="gan">${p.gan}</div><div>${p.zhi}</div><div style="color:var(--gold-dim);font-size:0.75rem;margin-top:0.25rem">${god}</div>`;
  }

  function renderRefine(r) {
    if (!r) return;
    $('#rf-harmony').textContent = `合参气场：${r.harmony}`;
    $('#rf-note').textContent = r.note;
    $('#rf-career').textContent = r.career;
    $('#rf-wealth').textContent = r.wealth;
    $('#rf-love').textContent = r.love;
    $('#rf-health').textContent = r.health;
    $('#rf-focus').textContent = `方位：${r.focus.directions}。颜色：${r.focus.colors}。事业参考：${r.focus.careers}。`;
  }

  document.addEventListener('DOMContentLoaded', init);
})();
