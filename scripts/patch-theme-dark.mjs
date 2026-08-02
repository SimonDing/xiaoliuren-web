/**
 * Apply mystical dark theme palette to css/style.css
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cssPath = path.join(__dirname, "..", "css", "style.css");
let s = fs.readFileSync(cssPath, "utf8");

const rootBlock = `:root {
  /* 玄学深色主导：夜观星象 · 星云灵性 · 鎏金启示 */
  --bg: #0D1117;
  --bg-deep: #120E1F;
  --ink: #0D1117;
  --ink-soft: #161B27;
  --ink-deep: #F0F0F0;
  --paper: #F0F0F0;
  --paper-dim: #A0A5B5;
  --primary: #3B286D;
  --primary-soft: #2A5268;
  --cinnabar: #8B3A4A;
  --cinnabar-bright: #C45C6A;
  --gold: #D4AF37;
  --gold-bright: #F0C05A;
  --gold-dim: #A8892A;
  --jade: #2A5268;
  --azure: #2A5268;
  --mist: rgba(255, 255, 255, 0.04);
  --line: rgba(212, 175, 55, 0.28);
  --danger: #C45C6A;
  --ok: #3D8B7A;
  --surface: rgba(22, 27, 39, 0.55);
  --surface-soft: rgba(59, 40, 109, 0.18);
  --glass: rgba(22, 27, 39, 0.42);
  --glass-border: rgba(240, 240, 240, 0.08);
  --font-display: "ZCOOL XiaoWei", "STKaiti", "KaiTi", serif;
  --font-seal: "Ma Shan Zheng", "ZCOOL XiaoWei", cursive;
  --font-body: "Noto Serif SC", "Songti SC", "SimSun", serif;
  --shadow: 0 20px 50px rgba(0, 0, 0, 0.45);
  --glow-gold: 0 0 28px rgba(212, 175, 55, 0.22);
  --glow-cinnabar: 0 0 24px rgba(196, 92, 106, 0.18);
  --glow-primary: 0 0 40px rgba(59, 40, 109, 0.35);
}

* { box-sizing: border-box; }

html, body {
  margin: 0;
  padding: 0;
  background: var(--bg);
  color: var(--paper);
  font-family: var(--font-body);
  min-height: 100%;
}

body {
  background:
    radial-gradient(ellipse 90% 55% at 50% -10%, rgba(59, 40, 109, 0.45), transparent 58%),
    radial-gradient(ellipse 55% 45% at 92% 78%, rgba(42, 82, 104, 0.35), transparent 52%),
    radial-gradient(ellipse 45% 35% at 8% 60%, rgba(59, 40, 109, 0.28), transparent 48%),
    radial-gradient(ellipse 40% 30% at 70% 30%, rgba(42, 82, 104, 0.2), transparent 50%),
    linear-gradient(165deg, #120E1F 0%, #0D1117 45%, #0A0E16 100%);
  overflow-x: hidden;
}

body::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  opacity: 0.07;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  z-index: 0;
}

body::after {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  opacity: 0.55;
  background-image:
    radial-gradient(1.2px 1.2px at 12% 18%, rgba(240, 192, 90, 0.7) 40%, transparent 55%),
    radial-gradient(1px 1px at 28% 62%, rgba(240, 240, 240, 0.45) 40%, transparent 55%),
    radial-gradient(1.4px 1.4px at 55% 22%, rgba(212, 175, 55, 0.55) 40%, transparent 55%),
    radial-gradient(1px 1px at 72% 48%, rgba(160, 165, 181, 0.4) 35%, transparent 55%),
    radial-gradient(1px 1px at 88% 15%, rgba(240, 192, 90, 0.5) 40%, transparent 55%),
    radial-gradient(1.2px 1.2px at 40% 88%, rgba(240, 240, 240, 0.35) 40%, transparent 55%),
    radial-gradient(1px 1px at 8% 80%, rgba(160, 165, 181, 0.4) 40%, transparent 55%),
    radial-gradient(1.3px 1.3px at 95% 70%, rgba(212, 175, 55, 0.45) 40%, transparent 55%),
    radial-gradient(1px 1px at 62% 75%, rgba(240, 240, 240, 0.3) 40%, transparent 55%);
  animation: starDrift 70s linear infinite;
}

.aura-sky {
  position: fixed;
  inset: -20% -10%;
  pointer-events: none;
  z-index: 0;
  background:
    radial-gradient(ellipse 42% 28% at 50% 16%, rgba(59, 40, 109, 0.4), transparent 70%),
    radial-gradient(ellipse 34% 26% at 78% 55%, rgba(42, 82, 104, 0.32), transparent 70%),
    radial-gradient(ellipse 30% 24% at 18% 70%, rgba(59, 40, 109, 0.25), transparent 70%);
  filter: blur(8px);
  animation: auraBreathe 10s ease-in-out infinite;
}

.star-particles {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.star-particles i {
  position: absolute;
  width: 2px;
  height: 2px;
  border-radius: 50%;
  background: rgba(240, 192, 90, 0.55);
  box-shadow: 0 0 6px rgba(212, 175, 55, 0.35);
  animation: particleFloat linear infinite;
}
`;

if (!s.startsWith(":root")) {
  console.error("Unexpected CSS start");
  process.exit(1);
}

const wrapIdx = s.indexOf("\n.wrap {");
if (wrapIdx < 0) {
  console.error("Cannot find .wrap");
  process.exit(1);
}
s = rootBlock + s.slice(wrapIdx);

// Panel glassmorphism
s = s.replace(
  /\.panel \{[\s\S]*?overflow: hidden;\n\}/,
  `.panel {
  position: relative;
  background: linear-gradient(155deg, rgba(59, 40, 109, 0.22), rgba(22, 27, 39, 0.55) 45%, rgba(42, 82, 104, 0.16));
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  padding: 1.5rem 1.55rem 1.7rem;
  margin-bottom: 1.35rem;
  box-shadow: var(--shadow), inset 0 1px 0 rgba(255, 255, 255, 0.04);
  animation: fadeUp 0.8s ease both;
  backdrop-filter: blur(16px) saturate(1.15);
  -webkit-backdrop-filter: blur(16px) saturate(1.15);
  overflow: hidden;
}`
);

// Convert leftover light surfaces back to dark glass
const lightToDark = [
  [/rgba\(255,\s*255,\s*255,\s*0\.8[0-9]?\)/g, "rgba(22, 27, 39, 0.55)"],
  [/rgba\(255,\s*255,\s*255,\s*0\.7[0-9]?\)/g, "rgba(22, 27, 39, 0.5)"],
  [/rgba\(255,\s*255,\s*255,\s*0\.6[0-9]?\)/g, "rgba(22, 27, 39, 0.45)"],
  [/rgba\(255,\s*255,\s*255,\s*0\.5[0-9]?\)/g, "rgba(22, 27, 39, 0.4)"],
  [/rgba\(36,\s*48,\s*42,\s*0\.0[56]\)/g, "rgba(0, 0, 0, 0.28)"],
  [/rgba\(60,\s*90,\s*78,\s*0\.12\)/g, "rgba(0, 0, 0, 0.4)"],
  [/rgba\(45,\s*138,\s*104,\s*0\.05\)/g, "rgba(59, 40, 109, 0.12)"],
  [/rgba\(12,\s*10,\s*8,\s*0\.55\)/g, "rgba(22, 27, 39, 0.55)"],
  [/linear-gradient\(165deg,\s*rgba\(240,\s*228,\s*200,\s*0\.075\),[\s\S]*?rgba\(168,\s*50,\s*36,\s*0\.04\)\)/g,
    "linear-gradient(155deg, rgba(59, 40, 109, 0.18), rgba(42, 82, 104, 0.1))"]
];
for (const [re, to] of lightToDark) s = s.replace(re, to);

// Brand / button / keyframes polish append if missing particle keyframes
if (!s.includes("@keyframes particleFloat")) {
  s += `

@keyframes particleFloat {
  0% { transform: translateY(0) translateX(0); opacity: 0.2; }
  40% { opacity: 0.75; }
  100% { transform: translateY(-110vh) translateX(12px); opacity: 0.05; }
}

@keyframes smokeDrift {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.35; }
  50% { transform: translate3d(2%, -1%, 0) scale(1.05); opacity: 0.55; }
}
`;
}

fs.writeFileSync(cssPath, s);
console.log("OK theme patched", {
  dark: s.includes("#0D1117"),
  glass: s.includes("backdrop-filter"),
  particles: s.includes("particleFloat")
});
