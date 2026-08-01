(function () {
  const $ = (sel) => document.querySelector(sel);

  let currentCast = null;
  let currentBazi = null;
  let currentFate = null;
  let lastDate = new Date();

  const DIR_CODE = {
    正东: 'E', 东南: 'SE', 正南: 'S', 西南: 'SW',
    正西: 'W', 西北: 'NW', 正北: 'N', 东北: 'NE'
  };

  function init() {
    buildWheelLabels();
    runCast(new Date());
    tickClock();
    setInterval(tickClock, 1000);

    $('#btn-refresh').addEventListener('click', () => runCast(new Date()));
    $('#btn-bazi').addEventListener('click', onBaziSubmit);
    $('#btn-clear-bazi').addEventListener('click', clearBazi);

    $('#birth-year').value = 1990;
    $('#birth-month').value = 5;
    $('#birth-day').value = 15;
    $('#birth-hour').value = 10;
    $('#birth-minute').value = 0;
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
    renderCast(currentCast);
    if (currentBazi) {
      renderRefine(XiaoLiuRen.refineWithBazi(currentCast, currentBazi));
    }
    currentFate = FateChange.synthesize(date, currentCast, currentBazi);
    renderFate(currentFate);
  }

  function renderCast(cast) {
    const p = cast.palace;
    const idx = cast.path.indices.finalIdx;

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
    $('#score-fill').style.width = cast.score + '%';
    $('#score-label').textContent = `时运指数 ${cast.score}`;

    const a = cast.aspects;
    $('#asp-overall').textContent = a.overall;
    $('#asp-career').textContent = a.career;
    $('#asp-wealth').textContent = a.wealth;
    $('#asp-love').textContent = a.love;
    $('#asp-health').textContent = a.health;
    $('#asp-travel').textContent = a.travel;
    $('#asp-social').textContent = a.social;
    $('#asp-study').textContent = a.study;
    $('#yi').textContent = a.suit;
    $('#ji').textContent = a.avoid;
    $('#tip').textContent = cast.tip;
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
      currentFate = FateChange.synthesize(lastDate, currentCast, currentBazi);
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
    currentFate = FateChange.synthesize(lastDate, currentCast, null);
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
