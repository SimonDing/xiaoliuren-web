# 小六壬 · 时运占测

本地传统文化推演工具：支持 **网页版** 与 **Android App**。打开即按当前时间起课，并可合参八字、梅花易数、奇门遁甲、高岛断易与杨公风水。

> 仅供文化研究与娱乐参考，不构成任何决策建议。

## Android 手机 / 平板（下载即用）

1. 打开 Releases 页面下载 APK：  
   **https://github.com/SimonDing/xiaoliuren-web/releases**
2. 在手机中允许「安装未知应用」
3. 安装 `xiaoliuren-*-android.apk` 后直接打开使用，**无需浏览器、无需联网即可起课**（字体 CDN 可选）

当前分发包：`release/xiaoliuren-1.2.2-android.apk`（含三合电子罗盘与白话对照），见 [Releases](https://github.com/SimonDing/xiaoliuren-web/releases/tag/v1.2.2)。

详细说明见 [docs/ANDROID.md](./docs/ANDROID.md)。

### 电子风水罗盘与 AI（自备 Key）

1. 在「杨公风水」中定位或填写经纬度  
2. 点「开启罗盘」→ 允许运动/方向传感器 → 手机持平，顶部对准墙面或书桌拟朝方向  
3. 盘面按磁北显示二十四山；实时提示办公桌等摆放  
4. （可选）填写 OpenAI 兼容的 Base URL / API Key / 模型，点「AI 杨公细化」；Key 只存本机

## 功能

| 模块 | 说明 |
|------|------|
| **小六壬** | 按农历月、日、时辰起课，输出事业/财运/感情/健康等全方面断语 |
| **高岛断易** | 以打开/刷新的即刻时间为种子三钱起卦（一爻动），与小六壬合参 |
| **八字细盘** | 可选输入阳历生辰，排出四柱、十神、喜用、大运 |
| **梅花易数** | 时间起卦，定体用、动爻、变卦 |
| **奇门遁甲** | 简化时盘，标出生门/开门等吉方 |
| **改运指引** | 风险识别 + 多系统方位投票 |
| **杨公风水** | 三合详盘（天地人三针、穿山七十二龙、透地六十龙、周天分金、二十八宿、先后天八卦）、经纬度坐向床位；可选自备 AI Key |

## 网页版快速开始

```bash
git clone https://github.com/SimonDing/xiaoliuren-web.git
cd xiaoliuren-web
# Windows
start index.html
```

在线仓库：https://github.com/SimonDing/xiaoliuren-web

## 项目结构

```
xiaoliuren-web/
├── index.html / css / js   # 网页核心
├── android/                # Capacitor Android 工程
├── release/                # 可分发 APK
├── scripts/prepare-www.js  # 打包前同步静态资源
├── docs/ANDROID.md         # Android 安装与自建说明
└── package.json            # Capacitor 依赖
```

## 自行编译 Android

需要 Node.js、JDK 21、Android SDK：

```bash
npm install
npm run build:web
npx cap sync android
cd android
./gradlew assembleDebug   # Windows: gradlew.bat assembleDebug
```

APK 输出：`android/app/build/outputs/apk/debug/app-debug.apk`

## 免责声明

本项目展示的传统术数推演结果仅供学习与娱乐，人生选择取决于自身判断与努力。

## License

[MIT](./LICENSE)
