/**
 * 手相辅助断 —— 《手相全篇》脉络 + 盲派实务 + 与小六壬时课合参
 * 输出：各方面专业/白话，供用户在预测不确信时交叉验证
 */
(function (global) {
  function pick(map, key, fallbackKey) {
    if (map[key]) return map[key];
    return map[fallbackKey];
  }

  function palaceTone(cast) {
    if (!cast || !cast.palace) return { name: '未知', nature: '平', tip: '时课未起，仅以手相为本。' };
    const n = cast.palace.nature || '平';
    const name = cast.palace.name;
    let tip = '时课平和，手相为主、时课为辅。';
    if (n.indexOf('吉') >= 0) tip = '时课偏顺，手相吉处可多用，凶处能缓冲。';
    if (n.indexOf('凶') >= 0) tip = '时课偏紧，即便手相有贵人象，也宜先避坑再进取。';
    return { name, nature: n, tip };
  }

  /**
   * @param {object} input
   * @param {string} input.hand - left|right
   * @param {string} input.shape - wood|fire|earth|metal|water
   * @param {string} input.life
   * @param {string} input.head
   * @param {string} input.heart
   * @param {string} input.fate
   * @param {string} input.marriage
   * @param {string} input.special
   * @param {object} [liuRenCast]
   */
  function analyze(input, liuRenCast) {
    const D = global.ShouXiangData;
    if (!D) throw new Error('手相知识库未加载');

    const shape = pick(D.HAND_SHAPES, input.shape, 'earth');
    const life = pick(D.LIFE, input.life, 'deepLong');
    const head = pick(D.HEAD, input.head, 'straight');
    const heart = pick(D.HEART, input.heart, 'toMiddle');
    const fate = pick(D.FATE, input.fate, 'clear');
    const marriage = pick(D.MARRIAGE, input.marriage, 'oneClear');
    const special = pick(D.SPECIAL, input.special, 'none');
    const tone = palaceTone(liuRenCast);

    const handLabel = input.hand === 'left' ? '左手（多看先天底子）' : '右手（多看后天造化）';

    const features = [
      { label: '所看之手', value: handLabel },
      { label: '手型', value: shape.name },
      { label: '生命线', value: life.name },
      { label: '智慧线', value: head.name },
      { label: '感情线', value: heart.name },
      { label: '事业线', value: fate.name },
      { label: '婚姻线', value: marriage.name },
      { label: '特殊纹', value: special.name }
    ];

    const aspects = {};

    aspects.overall = {
      pro: `依《手相全篇》三才：生命为地、智慧为人、感情为天。今得${shape.name}，生命线「${life.name}」，智慧线「${head.name}」，感情线「${heart.name}」，事业线「${fate.name}」，特殊「${special.name}」。${D.META.mangpai}`,
      plain: `简单说：你这只${handLabel}，整体像「${shape.name}」的人。身体本钱看生命线（${life.name}），脑子怎么转看智慧线（${head.name}），感情怎么处看感情线（${heart.name}），做事方向看事业线（${fate.name}）。${special.name !== '无特别强纹' ? '另外还有「' + special.name + '」这个亮点。' : ''}下面按方面逐条说人话。`
    };

    aspects.character = {
      pro: `${shape.pro} 智慧线侧：${head.pro}`,
      plain: `${shape.plain} 说到性格：${head.plain} ${shape.mang}`
    };

    aspects.career = {
      pro: `${fate.pro} 手型事业气：${shape.aspects.career}。${input.special === 'brokenPalm' || input.special === 'mPattern' ? special.pro : ''}`,
      plain: `${fate.plain} 结合手型，事业节奏偏「${shape.aspects.career}」。${fate.mang} ${input.special === 'mPattern' || input.special === 'brokenPalm' ? special.plain : ''}`
    };

    aspects.wealth = {
      pro: `财不离手型与命运纹。${shape.name}之财路：${shape.aspects.wealth}。命运纹「${fate.name}」定进财是否有轨。`,
      plain: `钱从哪来：${shape.name}更适合「${shape.aspects.wealth}」这种进财方式。${fate.plain} ${shape.mang}`
    };

    aspects.love = {
      pro: `${heart.pro} 婚姻纹：${marriage.pro}`,
      plain: `${heart.plain} 说到结婚过日子：${marriage.plain} ${heart.mang} ${marriage.mang}`
    };

    aspects.health = {
      pro: `${life.pro} 手型脏腑倾向：${shape.aspects.health}。`,
      plain: `${life.plain} 按手型五行，日常更要留意「${shape.aspects.health}」相关保养。${life.mang} 手相不代替就医。`
    };

    aspects.family = {
      pro: `六亲子女多参婚姻纹、感情线辅纹与手型稳度。婚姻「${marriage.name}」，感情「${heart.name}」。`,
      plain: `和家里人、以后孩子缘：感情线决定你怎么付出，婚姻线决定姻缘稳不稳。${marriage.plain} 土金型掌多顾家，水火型掌要防顾外失内。盲派常说：家和则丁财稳，家闹则事事漏。`
    };

    const riskBits = [];
    if (input.life === 'broken' || input.life === 'island') riskBits.push(life.mang);
    if (input.fate === 'broken') riskBits.push(fate.mang);
    if (input.heart === 'chained' || input.heart === 'forked') riskBits.push(heart.mang);
    if (input.special === 'brokenPalm') riskBits.push(special.mang);
    if (!riskBits.length) riskBits.push('整体无明显凶格强纹，灾厄以「过劳、口舌、担保」三类日常坑为主，忌冲动签字与熬夜硬扛。');

    aspects.risk = {
      pro: `灾厄看断裂、岛纹、链纹、断掌等变格，须与气色神态并参，忌单纹定生死。`,
      plain: riskBits.join(' ')
    };

    aspects.combo = {
      pro: `时课小六壬得「${tone.name}」（${tone.nature}）。${tone.tip} 手相定格局，时课定当下窗口。`,
      plain: `你打开应用时起的小六壬是「${tone.name}」，吉凶气场是「${tone.nature}」。${tone.tip} 若手相和时课都偏顺，近期可主动一点；若一个顺一个紧，就「稳中带做、先避坑」。`
    };

    aspects.mangpai = {
      pro: `盲派总诀：有纹言有事，无纹言无应；深者实、浅者虚；辅纹定应期，主纹定格局。`,
      plain: [
        `用大白话把你这盘手相掐一下：`,
        `一、人：${shape.name.replace('掌', '')}底子，脑子走「${head.name}」路线，别跟自己性格对着干。`,
        `二、事：事业线「${fate.name}」，该守就守、该换就换，别死扛不对的岗位。`,
        `三、财：按「${shape.aspects.wealth}」进财最顺，投机与担保是头号破财口。`,
        `四、情：感情「${heart.name}」+ 婚姻「${marriage.name}」，能过好日子比谈轰烈恋爱重要。`,
        `五、身：生命线「${life.name}」，累了就歇，别在转折年硬上。`,
        `六、时：对照小六壬「${tone.name}」，近一段${tone.nature.indexOf('凶') >= 0 ? '先求稳' : tone.nature.indexOf('吉') >= 0 ? '可借势' : '按部就班'}。`,
        special.name !== '无特别强纹' ? `七、特格「${special.name}」：${special.mang}` : `七、无强特格，平常心做事就是福。`
      ].join('\n')
    };

    return {
      meta: D.META,
      handLabel,
      features,
      aspects,
      order: D.ASPECT_ORDER,
      headline: {
        pro: `手相辅助断 · ${shape.name} · ${special.name !== '无特别强纹' ? special.name : '三才主线'}`,
        plain: `对课象没把握时，用手相交叉看：你这盘偏「${shape.name}」，感情婚姻看「${heart.name}/${marriage.name}」，做事看「${fate.name}」。下面逐条大白话。`
      },
      disclaimer: '手相与课象仅供文化研究与自我对照，不构成医疗、法律、投资建议。纹可变、人可改，知命在于造命。'
    };
  }

  global.ShouXiang = { analyze };
})(typeof window !== 'undefined' ? window : globalThis);
