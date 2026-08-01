/**
 * 风险识别 + 梅花 / 奇门 合参改运指引
 */
(function (global) {
  const DIR_SCORE = {
    正东: 'E', 东: 'E', 东南: 'SE', 正南: 'S', 南: 'S',
    西南: 'SW', 正西: 'W', 西: 'W', 西北: 'NW', 正北: 'N', 北: 'N',
    东北: 'NE', 中央: 'C', 中: 'C'
  };

  const DIR_LABEL = {
    E: '正东', SE: '东南', S: '正南', SW: '西南',
    W: '正西', NW: '西北', N: '正北', NE: '东北', C: '中央'
  };

  function detectRisk(cast, baziRefine) {
    const risks = [];
    const palace = cast.palace.name;
    const nature = cast.palace.nature;

    if (palace === '赤口') {
      risks.push({ level: '高', source: '小六壬', text: '赤口主口舌官非与冲突，言语与合同风险升高。' });
    }
    if (palace === '空亡') {
      risks.push({ level: '高', source: '小六壬', text: '空亡主虚耗落空，投资、远行、轻信承诺易失手。' });
    }
    if (palace === '留连') {
      risks.push({ level: '中', source: '小六壬', text: '留连主纠缠拖延，若强行推进易耗时耗力。' });
    }
    if (nature === '凶' || cast.score <= 40) {
      risks.push({ level: '高', source: '时运', text: `时运指数 ${cast.score}，今日整体偏逆，宜改道取气。` });
    } else if (cast.score <= 60) {
      risks.push({ level: '中', source: '时运', text: `时运指数 ${cast.score}，平中带波折，宜有备而来。` });
    }
    if (baziRefine && baziRefine.harmony === '需防') {
      risks.push({ level: '高', source: '八字合参', text: baziRefine.note });
    }
    if (baziRefine && baziRefine.harmony === '共振' && nature === '凶') {
      risks.push({ level: '高', source: '八字合参', text: '凶象与日主同气放大，情绪化决策风险更高。' });
    }

    const high = risks.filter((r) => r.level === '高').length;
    const mid = risks.filter((r) => r.level === '中').length;
    let overall = '低';
    if (high >= 1) overall = '高';
    else if (mid >= 1) overall = '中';

    return {
      active: overall !== '低',
      overall,
      risks,
      title: overall === '高' ? '检测到较高风险' : overall === '中' ? '检测到波动风险' : '今日风险较低'
    };
  }

  function synthesize(date, cast, bazi) {
    const meihua = global.Meihua.castFromDate(date);
    const qimen = global.Qimen.castFromDate(date);
    const baziRefine = bazi ? global.XiaoLiuRen.refineWithBazi(cast, bazi) : null;
    const risk = detectRisk(cast, baziRefine);

    // 若梅花体用亦险，加重
    if (meihua.riskLevel === '险') {
      risk.risks.push({ level: '高', source: '梅花易数', text: meihua.judgment });
      risk.active = true;
      risk.overall = '高';
      risk.title = '检测到较高风险';
    } else if (meihua.riskLevel === '忧' && risk.overall === '低') {
      risk.risks.push({ level: '中', source: '梅花易数', text: meihua.judgment });
      risk.active = true;
      risk.overall = '中';
      risk.title = '检测到波动风险';
    }

    const votes = {};
    function vote(dirLabel, weight, source) {
      const code = DIR_SCORE[dirLabel] || dirLabel;
      if (!code || code === 'C') return;
      if (!votes[code]) votes[code] = { score: 0, sources: [] };
      votes[code].score += weight;
      votes[code].sources.push(source);
    }

    // 投票：奇门生门/开门权重高；梅花变卦方位；八字喜用方位
    vote(qimen.changeAdvice.primaryDir, 5, '奇门生门');
    vote(qimen.changeAdvice.secondaryDir, 4, '奇门开门');
    vote(qimen.changeAdvice.restDir, 2, '奇门休门');
    vote(meihua.changeAdvice.primaryDir, 4, '梅花变卦');
    vote(meihua.changeAdvice.supportDir, 3, '梅花生体');

    if (bazi && bazi.yongShen) {
      const wxDir = { 木: '正东', 火: '正南', 土: '西南', 金: '正西', 水: '正北' };
      bazi.yongShen.forEach((w, i) => vote(wxDir[w], 3 - i, `八字喜用${w}`));
    }

    // 避向减分
    (qimen.changeAdvice.avoidDirs || []).forEach((d) => {
      const code = DIR_SCORE[d];
      if (code && votes[code]) votes[code].score -= 4;
    });
    if (meihua.changeAdvice.avoidDir && meihua.changeAdvice.avoidDir !== '无强制避向') {
      const code = DIR_SCORE[meihua.changeAdvice.avoidDir];
      if (code && votes[code]) votes[code].score -= 3;
    }
    // 小六壬凶宫方位略减
    if (cast.palace.nature === '凶') {
      const code = DIR_SCORE[cast.palace.direction];
      if (code && votes[code]) votes[code].score -= 2;
    }

    const ranked = Object.entries(votes)
      .map(([code, v]) => ({ code, dir: DIR_LABEL[code], score: v.score, sources: [...new Set(v.sources)] }))
      .sort((a, b) => b.score - a.score);

    const best = ranked[0] || { dir: '正东', sources: ['默认'], score: 0 };
    const second = ranked[1] || null;
    const avoid = [
      ...qimen.changeAdvice.avoidDirs,
      meihua.changeAdvice.avoidDir !== '无强制避向' ? meihua.changeAdvice.avoidDir : null
    ].filter(Boolean);

    const plan = buildPlan(risk, best, second, avoid, meihua, qimen, cast, bazi);

    return {
      risk,
      meihua,
      qimen,
      ranked,
      consensus: {
        primaryDir: best.dir,
        secondaryDir: second ? second.dir : qimen.changeAdvice.secondaryDir,
        avoidDirs: [...new Set(avoid)],
        sources: best.sources
      },
      plan
    };
  }

  function buildPlan(risk, best, second, avoid, meihua, qimen, cast, bazi) {
    const steps = [];
    if (risk.overall === '高') {
      steps.push(`停：先暂停高风险动作（争执、借贷、远行赌一把、冲动签约）。今日小六壬得「${cast.palace.name}」，宜改道不硬刚。`);
    } else if (risk.overall === '中') {
      steps.push(`缓：事情可推进但别加塞。留余地、留证据，给变数腾空间。`);
    } else {
      steps.push(`守中带进：风险不高，仍可用梅花与奇门吉方锦上添花。`);
    }

    steps.push(`转：优先朝「${best.dir}」行动或取气（依据：${best.sources.join('、')}）。可在该方位办公、会客、短途走动，或把工位/床头朝向微调至此。`);

    if (second) {
      steps.push(`辅：备选「${second.dir}」（${second.sources.join('、')}），若主方位不便，改走此方亦可。`);
    }

    steps.push(`梅花：${meihua.changeAdvice.strategy}`);
    steps.push(`奇门：${qimen.changeAdvice.strategy}`);

    if (bazi) {
      steps.push(`命局：喜用${bazi.yongShen.join('、')}，改运时颜色与行业可向喜用靠拢——${bazi.suggestions.summary}`);
    }

    steps.push(`避：少往 ${[...new Set(avoid)].join('、')} 启动大事；${qimen.changeAdvice.zhiFu}`);

    return {
      headline: risk.active
        ? `改运主方位：${best.dir}${second ? `（辅：${second.dir}）` : ''}`
        : `吉利拓展方位：${best.dir}`,
      steps,
      oneLiner: risk.active
        ? `有风险时：停—转「${best.dir}」—借生门/变卦之气—避 ${[...new Set(avoid)].slice(0, 2).join('与')}。`
        : `可顺势朝「${best.dir}」拓展，奇门生门与梅花变卦可作锦囊。`
    };
  }

  global.FateChange = { detectRisk, synthesize };
})(typeof window !== 'undefined' ? window : globalThis);
