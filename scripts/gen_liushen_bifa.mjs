/**
 * ASCII-only generator for js/liushen-bifa.js (UTF-8).
 * Run: node scripts/gen_liushen_bifa.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const out = path.join(root, "js", "liushen-bifa.js");

const U = (...xs) => String.fromCodePoint(...xs.map((x) => (typeof x === "string" ? x.codePointAt(0) : x)));
const S = (hex) => hex.split(" ").map((h) => parseInt(h, 16));
const T = (hex) => String.fromCodePoint(...S(hex));

const QL = T("9752 9f99");
const ZQ = T("6731 96c0");
const GC = T("52fe 9648");
const TS = T("87a3 86c7");
const BH = T("767d 864e");
const XW = T("7384 6b66");

const LEFT = "\u4eba\u5fc4\u624c\u6c35\u51ab\u8ba0\u9963\u7e9f\u9485\u793b\u8864\u6728\u706b\u571f\u738b\u65e5\u76ee\u6708\u8f66\u9a6c\u5973\u53e3\u5c71\u77f3\u866b\u72ad\u79be\u7c73\u8d1d".split("");
const RIGHT = "\u5202\u653b\u9875\u96bb\u9e1f\u6bb3\u6208\u5200\u65a4\u6b20\u89c1\u529b".split("");
const TOP = "\u8279\u5b9d\u7a74\u96e8\u7b0b\u722b\u2e88\u4e1a\u4ea0\u4e37\u7592".split("");
const BOTTOM = "\u5fc3\u706c\u76bf\u8fb6\u5efb\u513f\u5bf8\u571f\u6728\u706b\u5973".split("");
const ENCLOSE = "\u56d7\u95e8\u56f5\u56f0\u56de\u56ed\u56fd\u56fe\u5706\u5708\u65e5\u7530\u76ee\u53e3".split("");
const SNAKE = "\u8fb6\u5efb\u4e59\u4e5a\u52f9\u5df1\u5df2\u5df3\u5f13".split("");
const TIGER = "\u5200\u5203\u5202\u6208\u620a\u620c\u620e\u6210\u6211\u6212\u6216\u529b\u529d\u52a0\u52a8\u52ab".split("");

const CHAR_DB = {
  "\u660e": { struct: "\u5de6\u53f3", parts: [{ c: "\u65e5", pos: "\u5de6" }, { c: "\u6708", pos: "\u53f3" }], note: "\u65e5\u6708\u540c\u5bab" },
  "\u5b89": { struct: "\u4e0a\u4e0b", parts: [{ c: "\u5b9d", pos: "\u4e0a" }, { c: "\u5973", pos: "\u4e0b" }], note: "\u5973\u5728\u5c4b\u4e0b" },
  "\u8d22": { struct: "\u5de6\u53f3", parts: [{ c: "\u8d1d", pos: "\u5de6" }, { c: "\u624d", pos: "\u53f3" }], note: "\u8d1d\u624d\u6210\u8d22" },
  "\u7231": { struct: "\u4e0a\u4e0b", parts: [{ c: "\u722b", pos: "\u4e0a" }, { c: "\u53cb", pos: "\u4e0b" }], note: "\u53cb\u4e0b\u85cf\u60c5" },
  "\u56f0": { struct: "\u5305\u56f4", parts: [{ c: "\u56d7", pos: "\u5916" }, { c: "\u6728", pos: "\u5185" }], note: "\u6728\u56f0\u4e8e\u53e3" },
  "\u5bb6": { struct: "\u4e0a\u4e0b", parts: [{ c: "\u5b9d", pos: "\u4e0a" }, { c: "\u8c55", pos: "\u4e0b" }], note: "\u8c55\u5728\u5c4b\u4e0b" },
  "\u5b98": { struct: "\u4e0a\u4e0b", parts: [{ c: "\u5b9d", pos: "\u4e0a" }], note: "\u5c4b\u4e0b\u6709\u5b98" },
  "\u75c5": { struct: "\u534a\u5305", parts: [{ c: "\u7592", pos: "\u5916" }, { c: "\u4e19", pos: "\u5185" }], note: "\u75c5\u5b57\u5934" },
  "\u75db": { struct: "\u534a\u5305", parts: [{ c: "\u7592", pos: "\u5916" }], note: "\u75c5\u75db\u7f20\u8eab" },
  "\u5931": { struct: "\u72ec\u4f53", parts: [{ c: "\u5931", pos: "\u4e2d" }], note: "\u4f3c\u77e2\u51fa\u5934" },
  "\u5f97": { struct: "\u5de6\u53f3", parts: [{ c: "\u5f73", pos: "\u5de6" }], note: "\u884c\u800c\u6709\u5bf8" },
  "\u6765": { struct: "\u72ec\u4f53", parts: [{ c: "\u672a", pos: "\u4e2d" }], note: "\u672a\u6765\u4e4b\u8c61" },
  "\u5fc3": { struct: "\u72ec\u4f53", parts: [{ c: "\u5fc3", pos: "\u4e2d" }], note: "\u5fc3\u795e" },
  "\u706b": { struct: "\u72ec\u4f53", parts: [{ c: "\u706b", pos: "\u4e2d" }], note: "\u706b\u6027\u4e0a\u708e" },
  "\u6c34": { struct: "\u72ec\u4f53", parts: [{ c: "\u6c34", pos: "\u4e2d" }], note: "\u6c34\u6027\u5c31\u4e0b" },
  "\u91d1": { struct: "\u4e0a\u4e0b", parts: [{ c: "\u91d1", pos: "\u4e2d" }], note: "\u91d1\u7389\u4e4b\u8c61" },
  "\u6728": { struct: "\u72ec\u4f53", parts: [{ c: "\u6728", pos: "\u4e2d" }], note: "\u9752\u9f99\u672c\u8c61" },
  "\u571f": { struct: "\u72ec\u4f53", parts: [{ c: "\u571f", pos: "\u4e2d" }], note: "\u52fe\u9648\u672c\u8c61" },
  "\u53e3": { struct: "\u72ec\u4f53", parts: [{ c: "\u53e3", pos: "\u4e2d" }], note: "\u6731\u96c0\u53e3\u820c" },
  "\u5408": { struct: "\u4e0a\u4e0b", parts: [{ c: "\u4eba", pos: "\u4e0a" }, { c: "\u53e3", pos: "\u4e0b" }], note: "\u4eba\u53e3\u76f8\u5408" },
  "\u5206": { struct: "\u4e0a\u4e0b", parts: [{ c: "\u516b", pos: "\u4e0a" }, { c: "\u5200", pos: "\u4e0b" }], note: "\u5200\u5206\u4e24\u9014" },
  "\u5229": { struct: "\u5de6\u53f3", parts: [{ c: "\u79be", pos: "\u5de6" }, { c: "\u5202", pos: "\u53f3" }], note: "\u79be\u8fb9\u5e26\u5200" },
  "\u548c": { struct: "\u5de6\u53f3", parts: [{ c: "\u79be", pos: "\u5de6" }, { c: "\u53e3", pos: "\u53f3" }], note: "\u79be\u53e3\u4e3a\u548c" },
  "\u4e89": { struct: "\u4e0a\u4e0b", parts: [{ c: "\u2e88", pos: "\u4e0a" }], note: "\u76f8\u4e89\u4e4b\u8c61" },
  "\u94b1": { struct: "\u5de6\u53f3", parts: [{ c: "\u9485", pos: "\u5de6" }, { c: "\u621b", pos: "\u53f3" }], note: "\u91d1\u65c1\u5e26\u6208" },
  "\u5a5a": { struct: "\u5de6\u53f3", parts: [{ c: "\u5973", pos: "\u5de6" }, { c: "\u660f", pos: "\u53f3" }], note: "\u5973\u508d\u9ec4\u660f" },
  "\u59fb": { struct: "\u5de6\u53f3", parts: [{ c: "\u5973", pos: "\u5de6" }, { c: "\u56e0", pos: "\u53f3" }], note: "\u5973\u5728\u56f4\u4e2d" },
  "\u8bbc": { struct: "\u5de6\u53f3", parts: [{ c: "\u8ba0", pos: "\u5de6" }, { c: "\u516c", pos: "\u53f3" }], note: "\u8a00\u516c\u6210\u8bbc" },
  "\u627e": { struct: "\u5de6\u53f3", parts: [{ c: "\u624c", pos: "\u5de6" }, { c: "\u6208", pos: "\u53f3" }], note: "\u624b\u8fb9\u5e26\u6208" },
  "\u5bfb": { struct: "\u4e0a\u4e0b", parts: [{ c: "\u5bf8", pos: "\u4e0b" }], note: "\u5bf8\u5fc3\u53ef\u5bfb" },
  "\u4e22": { struct: "\u4e0a\u4e0b", parts: [{ c: "\u58ec", pos: "\u4e0a" }], note: "\u53bb\u800c\u4e0d\u56de\u8c61" },
  "\u56de": { struct: "\u5305\u56f4", parts: [{ c: "\u56d7", pos: "\u5916" }, { c: "\u53e3", pos: "\u5185" }], note: "\u91cd\u56f4" },
  "\u5f00": { struct: "\u72ec\u4f53", parts: [{ c: "\u5f00", pos: "\u4e2d" }], note: "\u4e24\u624b\u76f8\u5f00" },
  "\u6210": { struct: "\u72ec\u4f53", parts: [{ c: "\u6208", pos: "\u4e2d" }], note: "\u6208\u4e2d\u6709\u6210" },
  "\u529f": { struct: "\u5de6\u53f3", parts: [{ c: "\u5de5", pos: "\u5de6" }, { c: "\u529b", pos: "\u53f3" }], note: "\u5de5\u529b\u6210\u540d" },
  "\u540d": { struct: "\u4e0a\u4e0b", parts: [{ c: "\u5915", pos: "\u4e0a" }, { c: "\u53e3", pos: "\u4e0b" }], note: "\u5915\u53e3\u6210\u540d" },
  "\u5409": { struct: "\u4e0a\u4e0b", parts: [{ c: "\u58eb", pos: "\u4e0a" }, { c: "\u53e3", pos: "\u4e0b" }], note: "\u58eb\u53e3\u4e3a\u5409" },
  "\u51f6": { struct: "\u4e0a\u4e0b", parts: [{ c: "\u51f6", pos: "\u4e2d" }], note: "\u9677\u5751\u4e4b\u8c61" },
  "\u5e73": { struct: "\u72ec\u4f53", parts: [{ c: "\u5e73", pos: "\u4e2d" }], note: "\u4e24\u65c1\u5747\u8861" },
  "\u987a": { struct: "\u5de6\u53f3", parts: [{ c: "\u5ddd", pos: "\u5de6" }, { c: "\u9875", pos: "\u53f3" }], note: "\u5ddd\u9875\u4e3a\u987a" },
  "\u5371": { struct: "\u4e0a\u4e0b", parts: [{ c: "\u5384", pos: "\u4e0b" }], note: "\u5d16\u4e0b\u4e4b\u4eba" },
  "\u9669": { struct: "\u5de6\u53f3", parts: [{ c: "\u961d", pos: "\u5de6" }], note: "\u5c71\u9669" },
  "\u8fd0": { struct: "\u534a\u5305", parts: [{ c: "\u8fb6", pos: "\u5916" }, { c: "\u4e91", pos: "\u5185" }], note: "\u4e91\u5728\u8d70\u4e4b" },
  "\u52bf": { struct: "\u4e0a\u4e0b", parts: [{ c: "\u6267", pos: "\u4e0a" }, { c: "\u529b", pos: "\u4e0b" }], note: "\u6267\u529b\u6210\u52bf" },
  "\u60c5": { struct: "\u5de6\u53f3", parts: [{ c: "\u5fc4", pos: "\u5de6" }, { c: "\u9752", pos: "\u53f3" }], note: "\u5fc3\u9752\u4e3a\u60c5" },
  "\u604b": { struct: "\u4e0a\u4e0b", parts: [{ c: "\u4ea6", pos: "\u4e0a" }, { c: "\u5fc3", pos: "\u4e0b" }], note: "\u5fc3\u5728\u4e0b" }
};

function j(v) {
  return JSON.stringify(v, null, 2);
}

const body = `/**
 * LiuShen BiFa (character-reading) engine
 * Spirits x character structure, combined with XiaoLiuRen cast
 */
(function (global) {
  const SPIRITS = ${j({
    [QL]: { dir: "\u5de6/\u4e1c/\u8d77\u7b14", wuxing: "\u6728", nature: "\u5927\u5409", image: "\u8d35\u4eba\u3001\u559c\u5e86\u3001\u529f\u540d\u3001\u751f\u673a\u3001\u65b0\u5f00\u59cb" },
    [ZQ]: { dir: "\u4e0a/\u5357/\u9ad8\u5904", wuxing: "\u706b", nature: "\u534a\u5409\u534a\u51f6", image: "\u6587\u58a8\u3001\u540d\u58f0\u3001\u8868\u8fbe\u3001\u53e3\u820c\u3001\u8baf\u606f" },
    [GC]: { dir: "\u4e2d/\u571f\u754c/\u65b9\u6846", wuxing: "\u571f", nature: "\u5e73\u504f\u56f0", image: "\u7530\u571f\u3001\u623f\u4ea7\u3001\u5c40\u9650\u3001\u963b\u6ede\u3001\u65e7\u4e8b" },
    [TS]: { dir: "\u8d2f\u7a7f/\u8f6c\u6298/\u5f2f\u66f2", wuxing: "\u706b\u571f", nature: "\u5c0f\u51f6\u865a\u60ca", image: "\u865a\u60ca\u3001\u7f20\u7ed5\u3001\u7126\u8651\u3001\u53d8\u6570\u3001\u5c0f\u4eba" },
    [BH]: { dir: "\u53f3/\u897f/\u843d\u7b14", wuxing: "\u91d1", nature: "\u504f\u51f6\u5e26\u715e", image: "\u5a01\u6743\u3001\u679c\u65ad\u3001\u538b\u529b\u3001\u4f24\u707e\u3001\u5b98\u975e" },
    [XW]: { dir: "\u4e0b/\u5317/\u6697\u5904", wuxing: "\u6c34", nature: "\u534a\u5409\u534a\u51f6", image: "\u8c0b\u7565\u3001\u6f5c\u4f0f\u3001\u9634\u79c1\u3001\u6697\u8d22\u3001\u51b7\u6f20" }
  })};

  const TOPICS = ${j({
    "\u63a8\u65ad": { label: "\u63a8\u65ad" },
    "\u5927\u8c61": { label: "\u5927\u8c61" },
    "\u8fd0\u52bf": { label: "\u8fd0\u52bf" },
    "\u7231\u60c5": { label: "\u7231\u60c5" },
    "\u75be\u75c5": { label: "\u75be\u75c5" },
    "\u5931\u7269": { label: "\u5931\u7269" },
    "\u8bc9\u8bbc": { label: "\u8bc9\u8bbc" }
  })};

  const LEFT_RADICALS = ${j(LEFT)};
  const RIGHT_RADICALS = ${j(RIGHT)};
  const TOP_RADICALS = ${j(TOP)};
  const BOTTOM_RADICALS = ${j(BOTTOM)};
  const ENCLOSE_MARKS = ${j(ENCLOSE)};
  const SNAKE_MARKS = ${j(SNAKE)};
  const TIGER_MARKS = ${j(TIGER)};
  const CHAR_DB = ${j(CHAR_DB)};

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
    return { "${QL}": 0, "${ZQ}": 0, "${GC}": 0, "${TS}": 0, "${BH}": 0, "${XW}": 0 };
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
      features.push("\u7ed3\u6784\u300c" + db.struct + "\u300d" + (db.note ? "\u00b7" + db.note : ""));
      db.parts.forEach(function (p) {
        if (p.pos === "\u5de6" || p.pos === "\u5de6\u4e0a") {
          addScore(scores, "${QL}", 3, reasons, "\u300c" + ch + "\u300d\u4e4b\u300c" + p.c + "\u300d\u5c45\u5de6\uff0c${QL}\u4f4d\u5f97\u529b");
        } else if (p.pos === "\u53f3") {
          addScore(scores, "${BH}", 3, reasons, "\u300c" + ch + "\u300d\u4e4b\u300c" + p.c + "\u300d\u5c45\u53f3\uff0c${BH}\u4f4d\u53d1\u529b");
        } else if (p.pos === "\u4e0a") {
          addScore(scores, "${ZQ}", 3, reasons, "\u300c" + ch + "\u300d\u4e0a\u90e8\u300c" + p.c + "\u300d\u5c5e${ZQ}");
        } else if (p.pos === "\u4e0b") {
          addScore(scores, "${XW}", 3, reasons, "\u300c" + ch + "\u300d\u4e0b\u90e8\u300c" + p.c + "\u300d\u5c5e${XW}");
        } else if (p.pos === "\u4e2d" || p.pos === "\u5185" || p.pos === "\u5916") {
          if (db.struct === "\u5305\u56f4" || db.struct === "\u534a\u5305") {
            addScore(scores, "${GC}", 3, reasons, "\u300c" + ch + "\u300d" + db.struct + "\u7ed3\u6784\uff0c${GC}\u4e3b\u56f0\u987f/\u7530\u571f");
          } else {
            addScore(scores, "${GC}", 2, reasons, "\u300c" + ch + "\u300d\u6838\u5fc3\u300c" + p.c + "\u300d\u5c45\u4e2d\uff0c${GC}\u4e3b\u5c40");
          }
        }
      });
    } else {
      features.push("\u4ee5\u90e8\u9996\u4e0e\u7b14\u753b\u5f62\u6001\u63a8\u5b9a\u516d\u795e\u843d\u4f4d");
      if (includesAny(ch, LEFT_RADICALS)) addScore(scores, "${QL}", 2, reasons, "\u542b\u5de6\u4fa7\u504f\u65c1\u6c14\u573a\uff0c${QL}\u4e3b\u8d35\u4eba\u751f\u673a");
      if (includesAny(ch, RIGHT_RADICALS)) addScore(scores, "${BH}", 2, reasons, "\u542b\u53f3\u4fa7\u504f\u65c1\u6c14\u573a\uff0c${BH}\u4e3b\u538b\u529b\u679c\u65ad");
      if (includesAny(ch, TOP_RADICALS)) addScore(scores, "${ZQ}", 2, reasons, "\u542b\u5b57\u5934/\u4e0a\u7f69\uff0c${ZQ}\u4e3b\u6587\u4e66\u8baf\u606f");
      if (includesAny(ch, BOTTOM_RADICALS)) addScore(scores, "${XW}", 2, reasons, "\u542b\u5b57\u5e95/\u5e95\u5ea7\uff0c${XW}\u4e3b\u6f5c\u4f0f\u6697\u5904");
      if (!includesAny(ch, LEFT_RADICALS) && !includesAny(ch, RIGHT_RADICALS) && !includesAny(ch, TOP_RADICALS) && !includesAny(ch, BOTTOM_RADICALS)) {
        addScore(scores, "${GC}", 1, reasons, "\u72ec\u4f53\u6216\u96be\u5206\uff0c${GC}\u5c45\u4e2d\u5b88\u5c40");
        addScore(scores, "${QL}", 1, reasons, "\u8d77\u7b14\u6c14\u573a\u4ecd\u5b58${QL}\u5fae\u529b");
      }
    }

    if (includesAny(ch, ENCLOSE_MARKS) || (db && (db.struct === "\u5305\u56f4" || db.struct === "\u534a\u5305"))) {
      addScore(scores, "${GC}", 2, reasons, "\u65b9\u6846/\u5305\u56f4\u660e\u663e\uff0c${GC}\u4e3b\u963b\u6ede\u6216\u623f\u4ea7\u7530\u571f");
      features.push("${GC}\u7b14\uff1a\u5305\u56f4/\u65b9\u6b63");
    }
    if (includesAny(ch, SNAKE_MARKS)) {
      addScore(scores, "${TS}", 3, reasons, "\u6298\u7b14/\u8d70\u4e4b/\u5f2f\u66f2\u4e4b\u8c61\uff0c${TS}\u4e3b\u865a\u60ca\u7f20\u7ed5");
      features.push("${TS}\u7b14\uff1a\u5f2f\u66f2\u8f6c\u6298");
    }
    if (includesAny(ch, TIGER_MARKS)) {
      addScore(scores, "${BH}", 2, reasons, "\u5200\u6208\u9510\u7b14\uff0c${BH}\u6740\u4f10\u52a0\u91cd");
      features.push("${BH}\u7b14\uff1a\u5200\u6208\u9661\u5ced");
    }
    if (/[\u53e3\u8a00\u8ba0\u820c\u9e23\u53eb\u5435]/.test(ch)) {
      addScore(scores, "${ZQ}", 2, reasons, "\u591a\u53e3/\u8a00\u65c1\uff0c${ZQ}\u4e3b\u53e3\u820c\u4e0e\u6587\u4e66");
      features.push("${ZQ}\u7b14\uff1a\u53e3\u820c\u6587\u58a8");
    }
    if (/[\u5fc3\u5fc4\u706c]/.test(ch)) {
      addScore(scores, "${XW}", 1, reasons, "\u5fc3\u70b9\u6c89\u5e95\uff0c${XW}\u4e3b\u5fc3\u4e8b\u6697\u6f6e");
    }
    if (/[\u6728\u8279\u79be\u7af9]/.test(ch)) {
      addScore(scores, "${QL}", 1, reasons, "\u6728\u8349\u8212\u5c55\uff0c${QL}\u751f\u673a");
      features.push("${QL}\u7b14\uff1a\u8212\u5c55\u6728\u8c61");
    }

    const ranked = Object.keys(scores)
      .map(function (k) { return { name: k, score: scores[k], meta: SPIRITS[k] }; })
      .sort(function (a, b) { return b.score - a.score; });

    return { char: ch, scores: scores, ranked: ranked, dominant: ranked[0], secondary: ranked[1], reasons: reasons, features: features, db: db || null };
  }

  function analyzeText(text) {
    const chars = Array.from(text || "").filter(isHan);
    if (!chars.length) throw new Error("\u8bf7\u8f93\u5165\u81f3\u5c11\u4e00\u4e2a\u6c49\u5b57\uff08\u5fc3\u8bda\u6240\u95ee\u4e4b\u5b57\uff09");

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
      "${QL}": {
        pro: "\u521d\u52bf\u6709\u751f\u53d1\u3001\u8d35\u4eba\u4e0e\u65b0\u673a\uff0c\u5b9c\u4e3b\u52a8\u5f00\u5c40\u3002",
        plain: "\u5f00\u5934\u4f1a\u6bd4\u8f83\u987a\uff0c\u50cf\u6709\u4eba\u5e2e\u5fd9\u6216\u6709\u65b0\u673a\u4f1a\uff0c\u9002\u5408\u5148\u8fc8\u4e00\u6b65\u3002",
        dir: "\u5411\u597d\u5904\u63a8\u8fdb\uff0c\u5148\u6293\u5f00\u5934\u7684\u7a97\u53e3",
        advice: "\u591a\u8054\u7edc\u8d35\u4eba\u957f\u8f88\uff0c\u9002\u5408\u5f00\u65b0\u9879\u76ee\u3001\u8868\u767d\u3001\u6295\u9012\u3002"
      },
      "${ZQ}": {
        pro: "\u4e2d\u6bb5\u91cd\u8baf\u606f\u3001\u6587\u4e66\u4e0e\u53e3\u820c\uff0c\u6210\u5728\u8868\u8fbe\uff0c\u8d25\u5728\u4e89\u5435\u3002",
        plain: "\u4e2d\u95f4\u5173\u952e\u5728\u300c\u600e\u4e48\u8bf4\u3001\u600e\u4e48\u5199\u300d\uff1a\u5408\u540c\u3001\u6d88\u606f\u3001\u8003\u8bd5\u504f\u5409\uff1b\u5435\u8d77\u6765\u5c31\u53d8\u51f6\u3002",
        dir: "\u591a\u7559\u5b57\u636e\u3001\u5c11\u62ac\u6760\uff0c\u7528\u8868\u8fbe\u6210\u4e8b",
        advice: "\u614e\u8a00\u614e\u90ae\uff0c\u6587\u4e66\u5408\u540c\u53cd\u590d\u6838\u5bf9\uff1b\u8003\u8bd5\u53d1\u8868\u53ef\u79ef\u6781\u3002"
      },
      "${GC}": {
        pro: "\u4e8b\u591a\u80f6\u7740\u3001\u65e7\u6848\u7275\u7eca\uff0c\u5b9c\u7a33\u5b88\u8865\u6d1e\uff0c\u4e0d\u5b9c\u5f3a\u653b\u3002",
        plain: "\u5bb9\u6613\u5361\u4f4f\u3001\u539f\u5730\u8e0f\u6b65\uff0c\u50cf\u88ab\u65e7\u4e8b\u7f20\u4f4f\u3002\u5148\u628a\u8be5\u8865\u7684\u624b\u7eed\u8865\u9f50\uff0c\u522b\u786c\u649e\u3002",
        dir: "\u7a33\u624e\u7a33\u6253\uff0c\u89e3\u5f00\u675f\u7f1a\u518d\u524d\u8fdb",
        advice: "\u6e05\u7406\u65e7\u8d26\u65e7\u7269\uff0c\u8865\u624b\u7eed\uff1b\u623f\u4ea7\u7530\u571f\u4e8b\u5b9c\u6162\u4e0d\u5b9c\u5feb\u3002"
      },
      "${TS}": {
        pro: "\u53d8\u6570\u865a\u60ca\u3001\u5fc3\u795e\u5185\u8017\uff0c\u5f80\u5f80\u96f7\u58f0\u5927\u96e8\u70b9\u5c0f\u3002",
        plain: "\u5fc3\u91cc\u4f1a\u614c\u3001\u4e8b\u4f1a\u7ed5\uff0c\u4f46\u5f88\u591a\u662f\u865a\u60ca\u3002\u5148\u7a33\u4f4f\u60c5\u7eea\uff0c\u522b\u88ab\u4f20\u95fb\u7275\u7740\u8d70\u3002",
        dir: "\u964d\u566a\u3001\u653e\u677e\uff0c\u770b\u6e05\u518d\u8bf4",
        advice: "\u51cf\u5c11\u5185\u8017\u4e0e\u591c\u601d\uff0c\u522b\u88ab\u516b\u5366\u6d88\u606f\u5e26\u7740\u8dd1\u3002"
      },
      "${BH}": {
        pro: "\u6536\u5b98\u5e26\u538b\u529b\u3001\u51b2\u7a81\u6216\u7834\u8017\uff0c\u4ea6\u4e3b\u679c\u65ad\u4e86\u65ad\u3002",
        plain: "\u540e\u6bb5\u4f1a\u786c\uff1a\u8981\u4e48\u75db\u5feb\u70b9\u505a\u51b3\u5b9a\uff0c\u8981\u4e48\u78b0\u4e0a\u4e89\u6267\u7834\u8d22\u3002\u5b9c\u89c1\u597d\u5c31\u6536\u3001\u786c\u4ed7\u8981\u6709\u51c6\u5907\u3002",
        dir: "\u679c\u65ad\u6536\u5c3e\uff0c\u9632\u4f24\u707e\u4e0e\u786c\u78b0",
        advice: "\u907f\u514d\u786c\u78b0\u4e0e\u5371\u9669\u8fd0\u52a8\uff1b\u8be5\u65ad\u5219\u65ad\uff0c\u89c1\u597d\u5c31\u6536\u3002"
      },
      "${XW}": {
        pro: "\u4e8b\u5728\u6697\u5904\u915d\u917f\uff0c\u5b9c\u67e5\u9690\u60c5\u3001\u9632\u51b7\u624b\uff0c\u4ea6\u4e3b\u667a\u8c0b\u5e03\u5c40\u3002",
        plain: "\u5f88\u591a\u5173\u952e\u5728\u53f0\u9762\u4e0b\uff1a\u6709\u4eba\u4e0d\u52a8\u58f0\u8272\uff0c\u6216\u4e8b\u60c5\u8fd8\u6ca1\u66dd\u5149\u3002\u5148\u628a\u9690\u60a3\u67e5\u6e05\uff0c\u518d\u8c08\u516c\u5f00\u63a8\u8fdb\u3002",
        dir: "\u67e5\u6697\u5904\u3001\u505a\u9884\u6848\uff0c\u5fcc\u8f7b\u4fe1\u8868\u9762",
        advice: "\u67e5\u8d26\u67e5\u4eba\u9632\u6697\u4e8f\uff1b\u9690\u79c1\u4e8b\u5c11\u6269\u6563\uff0c\u7528\u7b56\u7565\u80dc\u8fc7\u786c\u95ef\u3002"
      }
    };
    return table[name] || table["${GC}"];
  }

  function topicIntro(topic, d, s, palace, lrNature) {
    const intros = {
      "\u63a8\u65ad": {
        pro: "\u4ee5" + d + "\u4e3a\u4e3b\u3001" + s + "\u4e3a\u8f85\u5408\u53c2\u5c0f\u516d\u58ec\u300c" + palace + "\u300d\u3002\u4e8b\u4e4b\u8d77\u627f\u770b${QL}/${ZQ}\uff0c\u6536\u675f\u770b${BH}/${XW}\uff0c\u4e2d\u5c40${GC}${TS}\u5b9a\u963b\u6ede\u4e0e\u53d8\u6570\u3002",
        plain: "\u7b80\u5355\u8bf4\uff1a\u8fd9\u4ef6\u4e8b\u73b0\u5728\u7684\u300c\u4e3b\u5473\u9053\u300d\u662f" + d + "\uff08" + SPIRITS[d].image + "\uff09\uff0c\u5176\u6b21\u662f" + s + "\u3002\u518d\u914d\u4e0a\u4f60\u6253\u5f00\u65f6\u8d77\u7684\u5c0f\u516d\u58ec\u8bfe\u300c" + palace + "\u300d\uff0c\u53ef\u4ee5\u5224\u65ad\u4e8b\u60c5\u4f1a\u600e\u4e48\u8d70\u3001\u8be5\u8fdb\u53d6\u8fd8\u662f\u5148\u7a33\u4f4f\u3002"
      },
      "\u5927\u8c61": {
        pro: "\u5927\u8c61\u53d6\u516d\u795e\u6c14\u573a\u603b\u8c8c\uff1a" + d + "\u53f8\u5c40\uff0c" + s + "\u8f85\u4e4b\u3002\u5c0f\u516d\u58ec\u65f6\u8bfe\u300c" + palace + "\u300d\u5b9a\u5f53\u4e0b\u5929\u65f6\uff0c\u5b57\u8c61\u5b9a\u4eba\u4e8b\u683c\u5c40\u3002",
        plain: "\u7b80\u5355\u8bf4\uff1a\u773c\u4e0b\u5927\u5c40\u50cf\u300c" + d + "\u300d\u5f53\u5bb6\u2014\u2014" + SPIRITS[d].image + "\uff1b\u65c1\u8fb9\u8fd8\u6709\u300c" + s + "\u300d\u63c6\u4e00\u811a\u3002\u7ed3\u5408\u6b64\u523b\u5c0f\u516d\u58ec\u300c" + palace + "\u300d\uff0c\u80fd\u770b\u51fa\u5927\u65b9\u5411\u662f\u660e\u8fd8\u662f\u6697\u3001\u987a\u8fd8\u662f\u5361\u3002"
      },
      "\u8fd0\u52bf": {
        pro: "\u8fd0\u52bf\u770b${QL}\u751f\u53d1\u4e0e${BH}\u538b\u529b\u6d88\u957f\u3002\u4eca\u5b57" + d + "\u6700\u91cd\uff1b\u65f6\u8bfe" + palace + "\uff08" + lrNature + "\uff09\u6821\u51c6\u8d77\u4f0f\u8282\u594f\u3002",
        plain: "\u7b80\u5355\u8bf4\uff1a\u8fd0\u52bf\u8d77\u4f0f\u4e3b\u8981\u770b\u300c\u8d35\u4eba/\u673a\u4f1a\u300d\uff08${QL}\uff09\u548c\u300c\u538b\u529b/\u786c\u4ed7\u300d\uff08${BH}\uff09\u8c01\u66f4\u5927\u3002\u8fd9\u4e2a\u5b57\u91cc" + d + "\u6700\u660e\u663e\uff0c\u518d\u5bf9\u7167\u5c0f\u516d\u58ec\u300c" + palace + "\u300d\u770b\u6700\u8fd1\u662f\u8be5\u51b2\u8fd8\u662f\u8be5\u5b88\u3002"
      },
      "\u7231\u60c5": {
        pro: "\u60c5\u7231\u91cd${QL}\uff08\u60c5\u82d7\uff09\u3001${ZQ}\uff08\u53e3\u820c\uff09\u3001${TS}\uff08\u7ea0\u7ed3\uff09\u3001${XW}\uff08\u51b7\u6218\u9634\u79c1\uff09\u3002\u5b57\u73b0" + d + "/" + s + "\uff0c\u53e0\u8bfe\u300c" + palace + "\u300d\u3002",
        plain: "\u7b80\u5355\u8bf4\uff1a\u611f\u60c5\u4e0a\uff0c\u5b57\u91cc" + d + "\u548c" + s + "\u6700\u62a2\u773c\u3002\u6709\u6ca1\u6709\u751c\u3001\u4f1a\u4e0d\u4f1a\u5435\u3001\u662f\u4e0d\u662f\u51b7\u6218\uff0c\u90fd\u80fd\u4ece\u8fd9\u51e0\u4e2a\u516d\u795e\u770b\u51fa\u6765\uff1b\u518d\u548c\u5c0f\u516d\u58ec\u300c" + palace + "\u300d\u5408\u8d77\u6765\u770b\u8fd1\u671f\u8d70\u5411\u3002"
      },
      "\u75be\u75c5": {
        pro: "\u75be\u5384\u5fcc${BH}\u5200\u5175\u3001${XW}\u6697\u635f\u3001${GC}\u4e45\u6ede\u3001${TS}\u5fc3\u795e\u865a\u6270\u3002\u5b57\u8c61" + d + "\u5f53\u4ee4\uff0c\u8bfe\u5f97" + palace + "\uff0c\u5b9c\u8c28\u614e\u4f5c\u606f\u4e0e\u5c31\u533b\u6838\u67e5\uff08\u975e\u533b\u7597\u8bca\u65ad\uff09\u3002",
        plain: "\u7b80\u5355\u8bf4\uff1a\u5065\u5eb7\u8bdd\u9898\u8981\u7279\u522b\u5c0f\u5fc3\u300c${BH}\u300d\uff08\u5916\u4f24/\u624b\u672f\uff09\u548c\u300c${XW}\u300d\uff08\u6697\u5904\u3001\u6162\u6027\uff09\u3002\u8fd9\u4e2a\u5b57\u504f\u5411" + d + "\uff0c\u914d\u5408\u5c0f\u516d\u58ec\u300c" + palace + "\u300d\u63d0\u9192\u4f60\u6ce8\u610f\u54ea\u91cc\uff1b\u4e0d\u8212\u670d\u8bf7\u53ca\u65f6\u770b\u533b\u751f\uff0c\u6d4b\u5b57\u4e0d\u80fd\u4ee3\u66ff\u8bca\u7597\u3002"
      },
      "\u5931\u7269": {
        pro: "\u5931\u7269\u770b${XW}\u85cf\u533f\u3001${GC}\u56f0\u5c40\u3001${QL}\u8fd1\u5bfb\u3001${TS}\u8f6c\u8f6c\u3002\u5b57\u5f97" + d + "\uff0c\u8bfe\u843d" + palace + "\uff0c\u65b9\u4f4d\u4eba\u4e8b\u53ef\u5e76\u53c2\u5c0f\u516d\u58ec\u5bfb\u7269\u65ad\u3002",
        plain: "\u7b80\u5355\u8bf4\uff1a\u627e\u4e1c\u897f\u65f6\uff0c" + d + "\u544a\u8bc9\u4f60\u300c\u85cf\u5f97\u6df1\u4e0d\u6df1\u3001\u8f6c\u6ca1\u8f6c\u624b\u300d\u3002\u518d\u5bf9\u7167\u5c0f\u516d\u58ec\u5bfb\u5931\u7269\u4e13\u65ad\uff08\u8bfe\u8c61\u300c" + palace + "\u300d\uff09\uff0c\u80fd\u66f4\u6e05\u695a\u5f80\u54ea\u627e\u3001\u6025\u4e0d\u6025\u3001\u6709\u6ca1\u6709\u4eba\u80fd\u5e2e\u5fd9\u3002"
      },
      "\u8bc9\u8bbc": {
        pro: "\u8bbc\u4e8b${ZQ}\u4e3b\u53e3\u820c\u6587\u4e66\uff0c${BH}\u4e3b\u5b98\u975e\u5211\u5a01\uff0c${GC}\u4e3b\u62d6\u5ef6\u80f6\u7740\u3002\u5b57\u73b0" + d + "/" + s + "\uff0c\u8bfe\u300c" + palace + "\u300d\u5b9a\u8fdb\u9000\u3002",
        plain: "\u7b80\u5355\u8bf4\uff1a\u6253\u5b98\u53f8/\u626f\u76ae\u6700\u6015\u300c\u5435\u300d\uff08${ZQ}\uff09\u548c\u300c\u88ab\u786c\u521a\u300d\uff08${BH}\uff09\u3002\u8fd9\u4e2a\u5b57\u91cc" + d + "\u7a81\u51fa\uff0c\u8bf4\u660e\u76ee\u524d\u538b\u529b\u70b9\u5728\u90a3\u513f\uff1b\u7ed3\u5408\u5c0f\u516d\u58ec\u300c" + palace + "\u300d\uff0c\u5224\u65ad\u8be5\u786c\u521a\u3001\u548c\u89e3\uff0c\u8fd8\u662f\u5148\u628a\u8bc1\u636e\u505a\u5b9e\u3002"
      }
    };
    return intros[topic] || intros["\u63a8\u65ad"];
  }

  function buildDevelop(d, s, palace, lrNature, topic) {
    const main = phaseOf(d);
    const sub = phaseOf(s);
    const goodLr = lrNature === "\u5927\u5409" || lrNature === "\u5409";
    const badLr = lrNature === "\u51f6";

    let pro = "\u53d1\u5c55\u8def\u5f84\uff1a\u4ee5" + d + "\u5b9a\u4e3b\u65cb\u5f8b\u2014\u2014" + main.pro + "\u8f85\u4ee5" + s + "\u2014\u2014" + sub.pro;
    let plain = "\u4e8b\u60c5\u5927\u6982\u4f1a\u8fd9\u6837\u8d70\uff1a\u5148\u5448\u73b0\u300c" + d + "\u300d\u7684\u7279\u70b9\uff08" + main.plain + "\uff09\uff1b\u8fc7\u7a0b\u4e2d\u53c8\u5939\u7740\u300c" + s + "\u300d\uff08" + sub.plain + "\uff09\u3002";

    if (goodLr) {
      pro += "\u5c0f\u516d\u58ec\u300c" + palace + "\u300d\u504f\u5409\uff0c\u5b57\u5409\u5219\u52a0\u500d\uff0c\u5b57\u51f6\u5219\u5f97\u4ee5\u7f13\u51b2\u3002";
      plain += "\u597d\u5728\u4f60\u6253\u5f00\u65f6\u7684\u5c0f\u516d\u58ec\u662f\u300c" + palace + "\u300d\u3001\u504f\u987a\u5229\uff0c\u6240\u4ee5\u574f\u7684\u80fd\u7f13\u4e00\u7f13\uff0c\u597d\u7684\u53ef\u4ee5\u591a\u7528\u70b9\u529b\u3002";
    } else if (badLr) {
      pro += "\u5c0f\u516d\u58ec\u300c" + palace + "\u300d\u504f\u51f6\uff0c\u5373\u4fbf\u5b57\u6709${QL}\uff0c\u4ea6\u987b\u5148\u907f\u7978\u518d\u8fdb\u53d6\u3002";
      plain += "\u4e0d\u8fc7\u6b64\u523b\u5c0f\u516d\u58ec\u843d\u300c" + palace + "\u300d\u3001\u504f\u4e0d\u987a\uff0c\u5c31\u7b97\u5b57\u91cc\u6709\u8d35\u4eba\u8c61\uff0c\u4e5f\u5efa\u8bae\u5148\u8eb2\u5f00\u5751\uff0c\u518d\u8c08\u51b2\u523a\u3002";
    } else {
      pro += "\u5c0f\u516d\u58ec\u300c" + palace + "\u300d\u5e73\u548c\uff0c\u5b57\u8c61\u4e3a\u4e3b\u3001\u65f6\u8bfe\u4e3a\u8f85\uff0c\u6309\u90e8\u5c31\u73ed\u5373\u53ef\u3002";
      plain += "\u6b64\u523b\u5c0f\u516d\u58ec\u300c" + palace + "\u300d\u6bd4\u8f83\u4e2d\u6027\uff0c\u4e3b\u8981\u542c\u6d4b\u5b57\u7684\u516d\u795e\u63d0\u793a\uff0c\u4e00\u6b65\u6b65\u6765\u5c31\u884c\u3002";
    }

    return {
      pro: pro,
      plain: plain,
      directionPro: "\u53d1\u5c55\u65b9\u5411\uff1a" + main.dir + "\uff1b\u540c\u65f6\u7559\u610f" + s + "\u5e26\u6765\u7684\u300c" + SPIRITS[s].image + "\u300d\u3002",
      directionPlain: "\u4f60\u63a5\u4e0b\u6765\u53ef\u4ee5\u8fd9\u6837\u7406\u89e3\uff1a\u4e3b\u7ebf\u662f\u300c" + main.dir + "\u300d\u3002\u53e6\u5916\u76ef\u4f4f" + s + "\u8fd9\u4e00\u70b9\uff0c\u522b\u8ba9\u5b83\u628a\u5c40\u9762\u5e26\u504f\u3002",
      advicePro: main.advice,
      advicePlain: "\u53ef\u64cd\u4f5c\u5efa\u8bae\uff1a" + main.advice + "\uff08\u8bdd\u9898\uff1a" + topic + "\uff09"
    };
  }

  function divine(text, topic, liuRenCast) {
    if (!TOPICS[topic]) throw new Error("\u8bf7\u9009\u62e9\u6d4b\u95ee\u65b9\u9762");
    const analysis = analyzeText(text);
    const d = analysis.dominant.name;
    const s = analysis.secondary.name;
    const palace = liuRenCast && liuRenCast.palace ? liuRenCast.palace.name : "\u672a\u8d77\u8bfe";
    const lrNature = liuRenCast && liuRenCast.palace ? liuRenCast.palace.nature : "\u5e73";
    const intro = topicIntro(topic, d, s, palace, lrNature);
    const develop = buildDevelop(d, s, palace, lrNature, topic);

    let extraPro = "";
    let extraPlain = "";
    if (liuRenCast && liuRenCast.oracles) {
      if (topic === "\u5931\u7269" && liuRenCast.oracles.lost) {
        const L = liuRenCast.oracles.lost;
        extraPro = "\u5c0f\u516d\u58ec\u5bfb\u7269\u4e13\u65ad\uff1a" + L.verdict + "\uff08" + L.place + "\uff09\u3002";
        extraPlain = "\u518d\u5bf9\u7167\u5c0f\u516d\u58ec\u627e\u4e1c\u897f\uff1a" + L.plain;
      }
      if ((topic === "\u8bc9\u8bbc" || topic === "\u63a8\u65ad") && liuRenCast.oracles.truth) {
        const T = liuRenCast.oracles.truth;
        extraPro += "\u8a00\u8f9e\u771f\u4f2a\u53ef\u53c2\u5c0f\u516d\u58ec\u6d4b\u8c0e\uff1a" + T.verdict + "\uff08\u53ef\u4fe1\u5ea6" + T.confidence + "\uff09\u3002";
        extraPlain += " \u8bf4\u8bdd\u9760\u4e0d\u9760\u8c31\u53ef\u53c2\u8003\uff1a" + T.plain;
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
        pro: "\u6d4b\u300c" + analysis.text + "\u300d\u95ee" + TOPICS[topic].label + "\uff1a\u516d\u795e\u4ee5\u300c" + d + "\u300d\u53f8\u5c40\uff08" + analysis.dominant.meta.nature + "\uff09\uff0c\u6b21\u4e3a\u300c" + s + "\u300d\u3002",
        plain: "\u4f60\u5199\u7684\u662f\u300c" + analysis.text + "\u300d\uff0c\u95ee\u7684\u662f\u3010" + TOPICS[topic].label + "\u3011\u3002\u516d\u795e\u91cc\u6700\u7a81\u51fa\u7684\u662f\u300c" + d + "\u300d\u2014\u2014" + analysis.dominant.meta.image + "\uff1b\u5176\u6b21\u662f\u300c" + s + "\u300d\u3002"
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
            path: liuRenCast.path.monthPalace.name + "\u2192" + liuRenCast.path.dayPalace.name + "\u2192" + liuRenCast.palace.name,
            tip: liuRenCast.tip
          }
        : null,
      disclaimer: "\u6d4b\u5b57\u4e0e\u8bfe\u8c61\u4ec5\u4f9b\u6587\u5316\u7814\u7a76\u4e0e\u601d\u8def\u53c2\u8003\uff0c\u5fc3\u52a8\u5219\u6d4b\u3001\u65e0\u4e8b\u4e0d\u6d4b\uff1b\u91cd\u5927\u51b3\u7b56\u8bf7\u7ed3\u5408\u73b0\u5b9e\u8bc1\u636e\u4e0e\u4e13\u4e1a\u610f\u89c1\u3002"
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
`;

fs.writeFileSync(out, body, "utf8");
console.log("Wrote", out, "bytes", fs.statSync(out).size);
