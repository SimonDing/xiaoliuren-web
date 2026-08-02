/**
 * 用户自备 API Key · OpenAI 兼容接口
 * 按杨公风水学结合经纬度、罗盘朝向、室内格局做细化分析
 * Key 仅存 localStorage，不上传第三方（除用户指定的 API 地址）
 */
(function (global) {
  const STORAGE_KEY = 'xiaoliuren_ai_config';

  function loadConfig() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch (e) {
      return {};
    }
  }

  function saveConfig(cfg) {
    const next = {
      baseUrl: (cfg.baseUrl || '').replace(/\/$/, ''),
      apiKey: cfg.apiKey || '',
      model: cfg.model || 'gpt-4o-mini'
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  }

  function buildPrompt(ctx) {
    const {
      lat,
      lng,
      sit,
      bedZone,
      bedHead,
      yongShen,
      qimen,
      compass,
      localAdvice
    } = ctx;

    return `你是精通杨筠松（杨公）风水学的顾问，熟悉「峦头为体、理气为用」、三合三针、二十四山、阳宅三要（门主灶）、室内水法与藏风聚气。
请根据下列实测、知识库摘要与课盘数据，用简洁中文给出可执行的室内布局建议（分条，勿恐吓，注明仅供文化参考）。

【地理】
纬度 ${lat}，经度 ${lng}

【格局】
房间坐向：${sit}
床区位：${bedZone}；床头朝向：${bedHead}
命局喜用：${(yongShen && yongShen.join('、')) || '未提供'}

【电子三合罗盘此刻朝向（磁方位）】
方位角 ${compass ? compass.heading.toFixed(1) : '—'}° · ${compass ? compass.dir8 : '—'}
地盘正针（立向）：${compass && compass.plates ? compass.plates.dipan.zuoXiang + ' / ' + compass.plates.dipan.label + '·' + compass.plates.dipan.mountain.wuxing : '—'}
人盘中针（消砂）：${compass && compass.plates ? compass.plates.renpan.label + '·' + compass.plates.renpan.mountain.wuxing : '—'}
天盘缝针（纳水）：${compass && compass.plates ? compass.plates.tianpan.label + '·' + compass.plates.tianpan.mountain.wuxing : '—'}
穿山七十二龙：${compass && compass.chuanShan ? compass.chuanShan.name + '（' + compass.chuanShan.mountain + '山' + (compass.chuanShan.isVoid ? '·空亡宜避' : '') + '）' : '—'}
透地六十龙：${compass && compass.touDi ? compass.touDi.name + '·纳音' + compass.touDi.nayin : '—'}
分金：${compass && compass.fenjin ? compass.fenjin.label + '（' + compass.fenjin.quality + '）' : '—'}
二十八宿：${compass && compass.xiu ? compass.xiu.name + '宿' : '—'}
后天卦：${compass ? compass.bagua.name : '—'} · 先天卦：${compass && compass.xianTian ? compass.xianTian.name : '—'}
磁偏角近似：${compass ? compass.declination.toFixed(1) : 0}°

请严格按三合用法：立向取地盘、消砂取人盘、纳水取天盘；来龙看穿山七十二龙（空亡勿立），穴场看透地六十龙，勿混针。

【奇门时方】
${qimen ? qimen.summary : '无'}
生门 ${qimen ? qimen.changeAdvice.primaryDir : '—'}；开门 ${qimen ? qimen.changeAdvice.secondaryDir : '—'}；避 ${qimen ? (qimen.changeAdvice.avoidDirs || []).join('、') : '—'}

【本地规则引擎 + 杨公知识库摘要】
${localAdvice || '无'}

请输出（每条先写专业判断，紧接着用「白话：」翻译成人话，让零基础也能照着摆）：
1. 地理气场与坐向总评（结合经纬度气候采光与罗盘三盘）
2. 峦头形法：靠山、明堂、形煞（横梁/尖角/门冲）如何按现状改
3. 阳宅三要：门、主卧、灶的具体微调
4. 办公桌/床/沙发：朝向哪一山，靠山与明堂怎么摆
5. 水法：鱼缸/动线/气口宜忌（结合天盘）
6. 结合今日奇门生门/开门的「今日可微调」建议
字数控制在 900 字以内；专业词不要省略，但必须配白话。`;
  }

  async function analyze(ctx, cfg) {
    const config = cfg || loadConfig();
    if (!config.apiKey) throw new Error('请先填写 AI API Key');
    if (!config.baseUrl) throw new Error('请填写 API Base URL（如 https://api.openai.com/v1）');
    if (!config.model) throw new Error('请填写模型名称');

    const url = config.baseUrl + '/chat/completions';
    const body = {
      model: config.model,
      temperature: 0.6,
      messages: [
        {
          role: 'system',
          content:
            '你是杨公风水实务顾问，结合二十四山与形法给出室内布置建议。语气稳健、可操作，避免绝对化吉凶恐吓。'
        },
        { role: 'user', content: buildPrompt(ctx) }
      ]
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + config.apiKey
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`AI 接口错误 ${res.status}：${text.slice(0, 200) || res.statusText}`);
    }
    const data = await res.json();
    const content =
      data.choices &&
      data.choices[0] &&
      data.choices[0].message &&
      data.choices[0].message.content;
    if (!content) throw new Error('AI 返回为空，请检查模型名与接口兼容性（需 OpenAI Chat Completions 格式）');
    return content.trim();
  }

  global.AiFengshui = {
    STORAGE_KEY,
    loadConfig,
    saveConfig,
    buildPrompt,
    analyze
  };
})(typeof window !== 'undefined' ? window : globalThis);
