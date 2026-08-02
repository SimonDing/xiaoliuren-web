/**
 * LiuShen BiFa (character-reading) engine
 * Spirits x character structure, combined with XiaoLiuRen cast
 */
(function (global) {
  const SPIRITS = {
  "青龙": {
    "dir": "左/东/起笔",
    "wuxing": "木",
    "nature": "大吉",
    "image": "贵人、喜庆、功名、生机、新开始"
  },
  "朱雀": {
    "dir": "上/南/高处",
    "wuxing": "火",
    "nature": "半吉半凶",
    "image": "文墨、名声、表达、口舌、讯息"
  },
  "勾陈": {
    "dir": "中/土界/方框",
    "wuxing": "土",
    "nature": "平偏困",
    "image": "田土、房产、局限、阻滞、旧事"
  },
  "螣蛇": {
    "dir": "贯穿/转折/弯曲",
    "wuxing": "火土",
    "nature": "小凶虚惊",
    "image": "虚惊、缠绕、焦虑、变数、小人"
  },
  "白虎": {
    "dir": "右/西/落笔",
    "wuxing": "金",
    "nature": "偏凶带煞",
    "image": "威权、果断、压力、伤灾、官非"
  },
  "玄武": {
    "dir": "下/北/暗处",
    "wuxing": "水",
    "nature": "半吉半凶",
    "image": "谋略、潜伏、阴私、暗财、冷漠"
  }
};

  const TOPICS = {
  "推断": {
    "label": "推断"
  },
  "大象": {
    "label": "大象"
  },
  "运势": {
    "label": "运势"
  },
  "爱情": {
    "label": "爱情"
  },
  "疾病": {
    "label": "疾病"
  },
  "失物": {
    "label": "失物"
  },
  "诉讼": {
    "label": "诉讼"
  }
};

  const LEFT_RADICALS = [
  "人",
  "忄",
  "扌",
  "氵",
  "冫",
  "讠",
  "饣",
  "纟",
  "钅",
  "礻",
  "衤",
  "木",
  "火",
  "土",
  "王",
  "日",
  "目",
  "月",
  "车",
  "马",
  "女",
  "口",
  "山",
  "石",
  "虫",
  "犭",
  "禾",
  "米",
  "贝"
];
  const RIGHT_RADICALS = [
  "刂",
  "攻",
  "页",
  "隻",
  "鸟",
  "殳",
  "戈",
  "刀",
  "斤",
  "欠",
  "见",
  "力"
];
  const TOP_RADICALS = [
  "艹",
  "宝",
  "穴",
  "雨",
  "笋",
  "爫",
  "⺈",
  "业",
  "亠",
  "丷",
  "疒"
];
  const BOTTOM_RADICALS = [
  "心",
  "灬",
  "皿",
  "辶",
  "廻",
  "儿",
  "寸",
  "土",
  "木",
  "火",
  "女"
];
  const ENCLOSE_MARKS = [
  "囗",
  "门",
  "囵",
  "困",
  "回",
  "园",
  "国",
  "图",
  "圆",
  "圈",
  "日",
  "田",
  "目",
  "口"
];
  const SNAKE_MARKS = [
  "辶",
  "廻",
  "乙",
  "乚",
  "勹",
  "己",
  "已",
  "巳",
  "弓"
];
  const TIGER_MARKS = [
  "刀",
  "刃",
  "刂",
  "戈",
  "戊",
  "戌",
  "戎",
  "成",
  "我",
  "戒",
  "或",
  "力",
  "劝",
  "加",
  "动",
  "劫"
];
  const CHAR_DB = {
  "明": {
    "struct": "左右",
    "parts": [
      {
        "c": "日",
        "pos": "左"
      },
      {
        "c": "月",
        "pos": "右"
      }
    ],
    "note": "日月同宫"
  },
  "安": {
    "struct": "上下",
    "parts": [
      {
        "c": "宝",
        "pos": "上"
      },
      {
        "c": "女",
        "pos": "下"
      }
    ],
    "note": "女在屋下"
  },
  "财": {
    "struct": "左右",
    "parts": [
      {
        "c": "贝",
        "pos": "左"
      },
      {
        "c": "才",
        "pos": "右"
      }
    ],
    "note": "贝才成财"
  },
  "爱": {
    "struct": "上下",
    "parts": [
      {
        "c": "爫",
        "pos": "上"
      },
      {
        "c": "友",
        "pos": "下"
      }
    ],
    "note": "友下藏情"
  },
  "困": {
    "struct": "包围",
    "parts": [
      {
        "c": "囗",
        "pos": "外"
      },
      {
        "c": "木",
        "pos": "内"
      }
    ],
    "note": "木困于口"
  },
  "家": {
    "struct": "上下",
    "parts": [
      {
        "c": "宝",
        "pos": "上"
      },
      {
        "c": "豕",
        "pos": "下"
      }
    ],
    "note": "豕在屋下"
  },
  "官": {
    "struct": "上下",
    "parts": [
      {
        "c": "宝",
        "pos": "上"
      }
    ],
    "note": "屋下有官"
  },
  "病": {
    "struct": "半包",
    "parts": [
      {
        "c": "疒",
        "pos": "外"
      },
      {
        "c": "丙",
        "pos": "内"
      }
    ],
    "note": "病字头"
  },
  "痛": {
    "struct": "半包",
    "parts": [
      {
        "c": "疒",
        "pos": "外"
      }
    ],
    "note": "病痛缠身"
  },
  "失": {
    "struct": "独体",
    "parts": [
      {
        "c": "失",
        "pos": "中"
      }
    ],
    "note": "似矢出头"
  },
  "得": {
    "struct": "左右",
    "parts": [
      {
        "c": "彳",
        "pos": "左"
      }
    ],
    "note": "行而有寸"
  },
  "来": {
    "struct": "独体",
    "parts": [
      {
        "c": "未",
        "pos": "中"
      }
    ],
    "note": "未来之象"
  },
  "心": {
    "struct": "独体",
    "parts": [
      {
        "c": "心",
        "pos": "中"
      }
    ],
    "note": "心神"
  },
  "火": {
    "struct": "独体",
    "parts": [
      {
        "c": "火",
        "pos": "中"
      }
    ],
    "note": "火性上炎"
  },
  "水": {
    "struct": "独体",
    "parts": [
      {
        "c": "水",
        "pos": "中"
      }
    ],
    "note": "水性就下"
  },
  "金": {
    "struct": "上下",
    "parts": [
      {
        "c": "金",
        "pos": "中"
      }
    ],
    "note": "金玉之象"
  },
  "木": {
    "struct": "独体",
    "parts": [
      {
        "c": "木",
        "pos": "中"
      }
    ],
    "note": "青龙本象"
  },
  "土": {
    "struct": "独体",
    "parts": [
      {
        "c": "土",
        "pos": "中"
      }
    ],
    "note": "勾陈本象"
  },
  "口": {
    "struct": "独体",
    "parts": [
      {
        "c": "口",
        "pos": "中"
      }
    ],
    "note": "朱雀口舌"
  },
  "合": {
    "struct": "上下",
    "parts": [
      {
        "c": "人",
        "pos": "上"
      },
      {
        "c": "口",
        "pos": "下"
      }
    ],
    "note": "人口相合"
  },
  "分": {
    "struct": "上下",
    "parts": [
      {
        "c": "八",
        "pos": "上"
      },
      {
        "c": "刀",
        "pos": "下"
      }
    ],
    "note": "刀分两途"
  },
  "利": {
    "struct": "左右",
    "parts": [
      {
        "c": "禾",
        "pos": "左"
      },
      {
        "c": "刂",
        "pos": "右"
      }
    ],
    "note": "禾边带刀"
  },
  "和": {
    "struct": "左右",
    "parts": [
      {
        "c": "禾",
        "pos": "左"
      },
      {
        "c": "口",
        "pos": "右"
      }
    ],
    "note": "禾口为和"
  },
  "争": {
    "struct": "上下",
    "parts": [
      {
        "c": "⺈",
        "pos": "上"
      }
    ],
    "note": "相争之象"
  },
  "钱": {
    "struct": "左右",
    "parts": [
      {
        "c": "钅",
        "pos": "左"
      },
      {
        "c": "戛",
        "pos": "右"
      }
    ],
    "note": "金旁带戈"
  },
  "婚": {
    "struct": "左右",
    "parts": [
      {
        "c": "女",
        "pos": "左"
      },
      {
        "c": "昏",
        "pos": "右"
      }
    ],
    "note": "女傍黄昏"
  },
  "姻": {
    "struct": "左右",
    "parts": [
      {
        "c": "女",
        "pos": "左"
      },
      {
        "c": "因",
        "pos": "右"
      }
    ],
    "note": "女在围中"
  },
  "讼": {
    "struct": "左右",
    "parts": [
      {
        "c": "讠",
        "pos": "左"
      },
      {
        "c": "公",
        "pos": "右"
      }
    ],
    "note": "言公成讼"
  },
  "找": {
    "struct": "左右",
    "parts": [
      {
        "c": "扌",
        "pos": "左"
      },
      {
        "c": "戈",
        "pos": "右"
      }
    ],
    "note": "手边带戈"
  },
  "寻": {
    "struct": "上下",
    "parts": [
      {
        "c": "寸",
        "pos": "下"
      }
    ],
    "note": "寸心可寻"
  },
  "丢": {
    "struct": "上下",
    "parts": [
      {
        "c": "壬",
        "pos": "上"
      }
    ],
    "note": "去而不回象"
  },
  "回": {
    "struct": "包围",
    "parts": [
      {
        "c": "囗",
        "pos": "外"
      },
      {
        "c": "口",
        "pos": "内"
      }
    ],
    "note": "重围"
  },
  "开": {
    "struct": "独体",
    "parts": [
      {
        "c": "开",
        "pos": "中"
      }
    ],
    "note": "两手相开"
  },
  "成": {
    "struct": "独体",
    "parts": [
      {
        "c": "戈",
        "pos": "中"
      }
    ],
    "note": "戈中有成"
  },
  "功": {
    "struct": "左右",
    "parts": [
      {
        "c": "工",
        "pos": "左"
      },
      {
        "c": "力",
        "pos": "右"
      }
    ],
    "note": "工力成名"
  },
  "名": {
    "struct": "上下",
    "parts": [
      {
        "c": "夕",
        "pos": "上"
      },
      {
        "c": "口",
        "pos": "下"
      }
    ],
    "note": "夕口成名"
  },
  "吉": {
    "struct": "上下",
    "parts": [
      {
        "c": "士",
        "pos": "上"
      },
      {
        "c": "口",
        "pos": "下"
      }
    ],
    "note": "士口为吉"
  },
  "凶": {
    "struct": "上下",
    "parts": [
      {
        "c": "凶",
        "pos": "中"
      }
    ],
    "note": "陷坑之象"
  },
  "平": {
    "struct": "独体",
    "parts": [
      {
        "c": "平",
        "pos": "中"
      }
    ],
    "note": "两旁均衡"
  },
  "顺": {
    "struct": "左右",
    "parts": [
      {
        "c": "川",
        "pos": "左"
      },
      {
        "c": "页",
        "pos": "右"
      }
    ],
    "note": "川页为顺"
  },
  "危": {
    "struct": "上下",
    "parts": [
      {
        "c": "厄",
        "pos": "下"
      }
    ],
    "note": "崖下之人"
  },
  "险": {
    "struct": "左右",
    "parts": [
      {
        "c": "阝",
        "pos": "左"
      }
    ],
    "note": "山险"
  },
  "运": {
    "struct": "半包",
    "parts": [
      {
        "c": "辶",
        "pos": "外"
      },
      {
        "c": "云",
        "pos": "内"
      }
    ],
    "note": "云在走之"
  },
  "势": {
    "struct": "上下",
    "parts": [
      {
        "c": "执",
        "pos": "上"
      },
      {
        "c": "力",
        "pos": "下"
      }
    ],
    "note": "执力成势"
  },
  "情": {
    "struct": "左右",
    "parts": [
      {
        "c": "忄",
        "pos": "左"
      },
      {
        "c": "青",
        "pos": "右"
      }
    ],
    "note": "心青为情"
  },
  "恋": {
    "struct": "上下",
    "parts": [
      {
        "c": "亦",
        "pos": "上"
      },
      {
        "c": "心",
        "pos": "下"
      }
    ],
    "note": "心在下"
  }
};

  function isHan(ch) {
    const code = ch.codePointAt(0);
    return (code >= 0x4e00 && code <= 0x9fff) || (code >= 0x3400 && code <= 0x4dbf);
  }

  function includesAny(str, list) {
    for (let i = 0; i < list.length; i++) {
      if (list[i] && str.indexOf(list[i]) >= 0) return list[i];
    }
    return null;
  }

  function emptyScores() {
    return { "青龙": 0, "朱雀": 0, "勾陈": 0, "螣蛇": 0, "白虎": 0, "玄武": 0 };
  }

  function addScore(scores, name, n, reasons, reason) {
    scores[name] += n;
    if (reason) reasons.push({ spirit: name, text: reason, weight: n });
  }

  function analyzeChar(ch) {
    const scores = emptyScores();
    const reasons = [];
    const features = [];
    const db = CHAR_DB[ch];

    if (db) {
      features.push("结构「" + db.struct + "」" + (db.note ? "·" + db.note : ""));
      db.parts.forEach(function (p) {
        if (p.pos === "左" || p.pos === "左上") {
          addScore(scores, "青龙", 3, reasons, "「" + ch + "」之「" + p.c + "」居左，青龙位得力");
        } else if (p.pos === "右") {
          addScore(scores, "白虎", 3, reasons, "「" + ch + "」之「" + p.c + "」居右，白虎位发力");
        } else if (p.pos === "上") {
          addScore(scores, "朱雀", 3, reasons, "「" + ch + "」上部「" + p.c + "」属朱雀");
        } else if (p.pos === "下") {
          addScore(scores, "玄武", 3, reasons, "「" + ch + "」下部「" + p.c + "」属玄武");
        } else if (p.pos === "中" || p.pos === "内" || p.pos === "外") {
          if (db.struct === "包围" || db.struct === "半包") {
            addScore(scores, "勾陈", 3, reasons, "「" + ch + "」" + db.struct + "结构，勾陈主困顿/田土");
          } else {
            addScore(scores, "勾陈", 2, reasons, "「" + ch + "」核心「" + p.c + "」居中，勾陈主局");
          }
        }
      });
    } else {
      features.push("以部首与笔画形态推定六神落位");
      if (includesAny(ch, LEFT_RADICALS)) addScore(scores, "青龙", 2, reasons, "含左侧偏旁气场，青龙主贵人生机");
      if (includesAny(ch, RIGHT_RADICALS)) addScore(scores, "白虎", 2, reasons, "含右侧偏旁气场，白虎主压力果断");
      if (includesAny(ch, TOP_RADICALS)) addScore(scores, "朱雀", 2, reasons, "含字头/上罩，朱雀主文书讯息");
      if (includesAny(ch, BOTTOM_RADICALS)) addScore(scores, "玄武", 2, reasons, "含字底/底座，玄武主潜伏暗处");
      if (!includesAny(ch, LEFT_RADICALS) && !includesAny(ch, RIGHT_RADICALS) && !includesAny(ch, TOP_RADICALS) && !includesAny(ch, BOTTOM_RADICALS)) {
        addScore(scores, "勾陈", 1, reasons, "独体或难分，勾陈居中守局");
        addScore(scores, "青龙", 1, reasons, "起笔气场仍存青龙微力");
      }
    }

    if (includesAny(ch, ENCLOSE_MARKS) || (db && (db.struct === "包围" || db.struct === "半包"))) {
      addScore(scores, "勾陈", 2, reasons, "方框/包围明显，勾陈主阻滞或房产田土");
      features.push("勾陈笔：包围/方正");
    }
    if (includesAny(ch, SNAKE_MARKS)) {
      addScore(scores, "螣蛇", 3, reasons, "折笔/走之/弯曲之象，螣蛇主虚惊缠绕");
      features.push("螣蛇笔：弯曲转折");
    }
    if (includesAny(ch, TIGER_MARKS)) {
      addScore(scores, "白虎", 2, reasons, "刀戈锐笔，白虎杀伐加重");
      features.push("白虎笔：刀戈陡峭");
    }
    if (/[口言讠舌鸣叫吵]/.test(ch)) {
      addScore(scores, "朱雀", 2, reasons, "多口/言旁，朱雀主口舌与文书");
      features.push("朱雀笔：口舌文墨");
    }
    if (/[心忄灬]/.test(ch)) {
      addScore(scores, "玄武", 1, reasons, "心点沉底，玄武主心事暗潮");
    }
    if (/[木艹禾竹]/.test(ch)) {
      addScore(scores, "青龙", 1, reasons, "木草舒展，青龙生机");
      features.push("青龙笔：舒展木象");
    }

    const ranked = Object.keys(scores)
      .map(function (k) { return { name: k, score: scores[k], meta: SPIRITS[k] }; })
      .sort(function (a, b) { return b.score - a.score; });

    return { char: ch, scores: scores, ranked: ranked, dominant: ranked[0], secondary: ranked[1], reasons: reasons, features: features, db: db || null };
  }

  function analyzeText(text) {
    const chars = Array.from(text || "").filter(isHan);
    if (!chars.length) throw new Error("请输入至少一个汉字（心诚所问之字）");

    const perChar = chars.map(analyzeChar);
    const total = emptyScores();
    const allReasons = [];
    perChar.forEach(function (c, i) {
      Object.keys(total).forEach(function (k) { total[k] += c.scores[k] || 0; });
      c.reasons.forEach(function (r) {
        allReasons.push({ char: c.char, index: i + 1, spirit: r.spirit, text: r.text, weight: r.weight });
      });
    });

    const ranked = Object.keys(total)
      .map(function (k) { return { name: k, score: total[k], meta: SPIRITS[k] }; })
      .sort(function (a, b) { return b.score - a.score; });

    return {
      text: chars.join(""),
      chars: chars,
      count: chars.length,
      perChar: perChar,
      total: total,
      ranked: ranked,
      dominant: ranked[0],
      secondary: ranked[1] || ranked[0],
      reasons: allReasons.slice(0, 12)
    };
  }

  function phaseOf(name) {
    const table = {
      "青龙": {
        pro: "初势有生发、贵人与新机，宜主动开局。",
        plain: "开头会比较顺，像有人帮忙或有新机会，适合先迈一步。",
        dir: "向好处推进，先抓开头的窗口",
        advice: "多联络贵人长辈，适合开新项目、表白、投递。"
      },
      "朱雀": {
        pro: "中段重讯息、文书与口舌，成在表达，败在争吵。",
        plain: "中间关键在「怎么说、怎么写」：合同、消息、考试偏吉；吵起来就变凶。",
        dir: "多留字据、少抬杠，用表达成事",
        advice: "慎言慎邮，文书合同反复核对；考试发表可积极。"
      },
      "勾陈": {
        pro: "事多胶着、旧案牵绊，宜稳守补洞，不宜强攻。",
        plain: "容易卡住、原地踏步，像被旧事缠住。先把该补的手续补齐，别硬撞。",
        dir: "稳扎稳打，解开束缚再前进",
        advice: "清理旧账旧物，补手续；房产田土事宜慢不宜快。"
      },
      "螣蛇": {
        pro: "变数虚惊、心神内耗，往往雷声大雨点小。",
        plain: "心里会慌、事会绕，但很多是虚惊。先稳住情绪，别被传闻牵着走。",
        dir: "降噪、放松，看清再说",
        advice: "减少内耗与夜思，别被八卦消息带着跑。"
      },
      "白虎": {
        pro: "收官带压力、冲突或破耗，亦主果断了断。",
        plain: "后段会硬：要么痛快点做决定，要么碰上争执破财。宜见好就收、硬仗要有准备。",
        dir: "果断收尾，防伤灾与硬碰",
        advice: "避免硬碰与危险运动；该断则断，见好就收。"
      },
      "玄武": {
        pro: "事在暗处酝酿，宜查隐情、防冷手，亦主智谋布局。",
        plain: "很多关键在台面下：有人不动声色，或事情还没曝光。先把隐患查清，再谈公开推进。",
        dir: "查暗处、做预案，忌轻信表面",
        advice: "查账查人防暗亏；隐私事少扩散，用策略胜过硬闯。"
      }
    };
    return table[name] || table["勾陈"];
  }

  function topicIntro(topic, d, s, palace, lrNature) {
    const intros = {
      "推断": {
        pro: "以" + d + "为主、" + s + "为辅合参小六壬「" + palace + "」。事之起承看青龙/朱雀，收束看白虎/玄武，中局勾陈螣蛇定阻滞与变数。",
        plain: "简单说：这件事现在的「主味道」是" + d + "（" + SPIRITS[d].image + "），其次是" + s + "。再配上你打开时起的小六壬课「" + palace + "」，可以判断事情会怎么走、该进取还是先稳住。"
      },
      "大象": {
        pro: "大象取六神气场总貌：" + d + "司局，" + s + "辅之。小六壬时课「" + palace + "」定当下天时，字象定人事格局。",
        plain: "简单说：眼下大局像「" + d + "」当家——" + SPIRITS[d].image + "；旁边还有「" + s + "」揆一脚。结合此刻小六壬「" + palace + "」，能看出大方向是明还是暗、顺还是卡。"
      },
      "运势": {
        pro: "运势看青龙生发与白虎压力消长。今字" + d + "最重；时课" + palace + "（" + lrNature + "）校准起伏节奏。",
        plain: "简单说：运势起伏主要看「贵人/机会」（青龙）和「压力/硬仗」（白虎）谁更大。这个字里" + d + "最明显，再对照小六壬「" + palace + "」看最近是该冲还是该守。"
      },
      "爱情": {
        pro: "情爱重青龙（情苗）、朱雀（口舌）、螣蛇（纠结）、玄武（冷战阴私）。字现" + d + "/" + s + "，叠课「" + palace + "」。",
        plain: "简单说：感情上，字里" + d + "和" + s + "最抢眼。有没有甜、会不会吵、是不是冷战，都能从这几个六神看出来；再和小六壬「" + palace + "」合起来看近期走向。"
      },
      "疾病": {
        pro: "疾厄忌白虎刀兵、玄武暗损、勾陈久滞、螣蛇心神虚扰。字象" + d + "当令，课得" + palace + "，宜谨慎作息与就医核查（非医疗诊断）。",
        plain: "简单说：健康话题要特别小心「白虎」（外伤/手术）和「玄武」（暗处、慢性）。这个字偏向" + d + "，配合小六壬「" + palace + "」提醒你注意哪里；不舒服请及时看医生，测字不能代替诊疗。"
      },
      "失物": {
        pro: "失物看玄武藏匿、勾陈困局、青龙近寻、螣蛇转转。字得" + d + "，课落" + palace + "，方位人事可并参小六壬寻物断。",
        plain: "简单说：找东西时，" + d + "告诉你「藏得深不深、转没转手」。再对照小六壬寻失物专断（课象「" + palace + "」），能更清楚往哪找、急不急、有没有人能帮忙。"
      },
      "诉讼": {
        pro: "讼事朱雀主口舌文书，白虎主官非刑威，勾陈主拖延胶着。字现" + d + "/" + s + "，课「" + palace + "」定进退。",
        plain: "简单说：打官司/扯皮最怕「吵」（朱雀）和「被硬刚」（白虎）。这个字里" + d + "突出，说明目前压力点在那儿；结合小六壬「" + palace + "」，判断该硬刚、和解，还是先把证据做实。"
      }
    };
    return intros[topic] || intros["推断"];
  }

  function buildDevelop(d, s, palace, lrNature, topic) {
    const main = phaseOf(d);
    const sub = phaseOf(s);
    const goodLr = lrNature === "大吉" || lrNature === "吉";
    const badLr = lrNature === "凶";

    let pro = "发展路径：以" + d + "定主旋律——" + main.pro + "辅以" + s + "——" + sub.pro;
    let plain = "事情大概会这样走：先呈现「" + d + "」的特点（" + main.plain + "）；过程中又夹着「" + s + "」（" + sub.plain + "）。";

    if (goodLr) {
      pro += "小六壬「" + palace + "」偏吉，字吉则加倍，字凶则得以缓冲。";
      plain += "好在你打开时的小六壬是「" + palace + "」、偏顺利，所以坏的能缓一缓，好的可以多用点力。";
    } else if (badLr) {
      pro += "小六壬「" + palace + "」偏凶，即便字有青龙，亦须先避祸再进取。";
      plain += "不过此刻小六壬落「" + palace + "」、偏不顺，就算字里有贵人象，也建议先躲开坑，再谈冲刺。";
    } else {
      pro += "小六壬「" + palace + "」平和，字象为主、时课为辅，按部就班即可。";
      plain += "此刻小六壬「" + palace + "」比较中性，主要听测字的六神提示，一步步来就行。";
    }

    return {
      pro: pro,
      plain: plain,
      directionPro: "发展方向：" + main.dir + "；同时留意" + s + "带来的「" + SPIRITS[s].image + "」。",
      directionPlain: "你接下来可以这样理解：主线是「" + main.dir + "」。另外盯住" + s + "这一点，别让它把局面带偏。",
      advicePro: main.advice,
      advicePlain: "可操作建议：" + main.advice + "（话题：" + topic + "）"
    };
  }

  function divine(text, topic, liuRenCast) {
    if (!TOPICS[topic]) throw new Error("请选择测问方面");
    const analysis = analyzeText(text);
    const d = analysis.dominant.name;
    const s = analysis.secondary.name;
    const palace = liuRenCast && liuRenCast.palace ? liuRenCast.palace.name : "未起课";
    const lrNature = liuRenCast && liuRenCast.palace ? liuRenCast.palace.nature : "平";
    const intro = topicIntro(topic, d, s, palace, lrNature);
    const develop = buildDevelop(d, s, palace, lrNature, topic);

    let extraPro = "";
    let extraPlain = "";
    if (liuRenCast && liuRenCast.oracles) {
      if (topic === "失物" && liuRenCast.oracles.lost) {
        const L = liuRenCast.oracles.lost;
        extraPro = "小六壬寻物专断：" + L.verdict + "（" + L.place + "）。";
        extraPlain = "再对照小六壬找东西：" + L.plain;
      }
      if ((topic === "诉讼" || topic === "推断") && liuRenCast.oracles.truth) {
        const T = liuRenCast.oracles.truth;
        extraPro += "言辞真伪可参小六壬测谎：" + T.verdict + "（可信度" + T.confidence + "）。";
        extraPlain += " 说话靠不靠谱可参考：" + T.plain;
      }
    }

    return {
      topic: topic,
      topicLabel: TOPICS[topic].label,
      analysis: analysis,
      spiritTable: analysis.ranked.map(function (r) {
        return { name: r.name, score: r.score, dir: r.meta.dir, image: r.meta.image, nature: r.meta.nature };
      }),
      headline: {
        pro: "测「" + analysis.text + "」问" + TOPICS[topic].label + "：六神以「" + d + "」司局（" + analysis.dominant.meta.nature + "），次为「" + s + "」。",
        plain: "你写的是「" + analysis.text + "」，问的是【" + TOPICS[topic].label + "】。六神里最突出的是「" + d + "」——" + analysis.dominant.meta.image + "；其次是「" + s + "」。"
      },
      judgment: {
        pro: intro.pro + (extraPro ? " " + extraPro : ""),
        plain: intro.plain + (extraPlain ? " " + extraPlain : "")
      },
      develop: { pro: develop.pro, plain: develop.plain },
      direction: { pro: develop.directionPro, plain: develop.directionPlain },
      advice: { pro: develop.advicePro, plain: develop.advicePlain },
      liuRen: liuRenCast
        ? {
            palace: liuRenCast.palace.name,
            nature: liuRenCast.palace.nature,
            path: liuRenCast.path.monthPalace.name + "→" + liuRenCast.path.dayPalace.name + "→" + liuRenCast.palace.name,
            tip: liuRenCast.tip
          }
        : null,
      disclaimer: "测字与课象仅供文化研究与思路参考，心动则测、无事不测；重大决策请结合现实证据与专业意见。"
    };
  }

  global.LiuShenBiFa = {
    SPIRITS: SPIRITS,
    TOPICS: TOPICS,
    CHAR_DB: CHAR_DB,
    analyzeChar: analyzeChar,
    analyzeText: analyzeText,
    divine: divine
  };
})(typeof window !== "undefined" ? window : globalThis);
