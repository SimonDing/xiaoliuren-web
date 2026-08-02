# 变更日志（术数应用 / xiaoliuren-web）

本文记录各版本功能与界面变更细节，便于对照 GitHub Releases 与 APK。

---

## v1.3.0 — 小孩起名（2026-08-02）

**APK：** `release/xiaoliuren-1.3.0-android.apk` · versionCode `11`

### 新增
- **小孩起名**模块（`js/qiming.js` + `js/qiming-data.js`）
  - 按宝宝阳历生辰排八字，取日主强弱与**喜用五行**
  - 用字库按五行/字义/笔画/音韵/男女宜忌筛选
  - **五格数理**参考（天、人、地、外、总格；吉数加权）
  - 支持单名/双名；风格：文雅、刚健、柔美、福泽、自然
  - 可与当前小六壬时课五行轻量合参
  - 专业断 + 大白话；可从「八字细盘」同步生辰
- 课象快捷按钮「小孩起名」；面板位于八字细盘之前

### 说明
- 起名与五格笔画为传统文化参考，非户籍唯一标准

---

## v1.2.9 — 手相合参置顶并入主断语（2026-08-02）

**APK：** `release/xiaoliuren-1.2.9-android.apk` · versionCode `10`

### 调整
- 「手相辅助」面板移到**课象总览之后**（六神测字之前），避免被埋没
- 「全方面断语」增加 **手相合参** 栏：勾选掌纹后结果写入主预测区
- 课象 tip 增加手相交叉验证引导
- 手相面板样式加强（描边/光晕），结果渲染更稳健

### 修复
- 避免 tip 被后续赋值覆盖导致手相提示丢失

---

## v1.2.8 — 应用更名「术数应用」+ 手相辅助（2026-08-02）

**APK：** `release/xiaoliuren-1.2.8-android.apk` · versionCode `9`

### 品牌
- 显示名统一为 **术数应用**（`index.html` / `capacitor.config.json` / `strings.xml` / PWA manifest）
- **未改** `applicationId`（`com.simonding.xiaoliuren`），避免已安装用户无法覆盖更新

### 新增：手相辅助
- `js/shouxiang-data.js`：依《手相全篇》脉络整理手型、生命/智慧/感情/事业/婚姻线、特殊纹，并掺**盲派断事**说法
- `js/shouxiang.js`：按用户勾选逐项输出（总体、性格、事业、财运、感情、健康、六亲、灾厄、时课合参、盲派白话总断）
- 入口：课象「手相辅助」、断语区「对预测不太确信？」CTA

---

## v1.2.7 — 道士蓝提亮（2026-08-02）

**APK：** `release/xiaoliuren-1.2.7-android.apk` · versionCode `8`

### 视觉
- 由深紫玄学改为更明亮的**道士蓝**天宫色（`#173A5C` / `#1E4D7B` / `#2B6EA8` / `#3D8BC4`）
- 清除紫黑残留；鎏金点缀保留
- 罗盘盘面与 `theme-color` 同步为道士蓝

---

## v1.2.6 — 深空玄学配色（2026-08-02）

**APK：** `release/xiaoliuren-1.2.6-android.apk` · versionCode `7`

### 视觉
- 深空蓝/灵性紫青渐变、毛玻璃卡片、鎏金、星尘粒子
- 罗盘画布同步深紫星空氛围

---

## v1.2.5 — 玄学 UI 打磨 + 杨公知识库（2026-08-02）

**APK：** `release/xiaoliuren-1.2.5-android.apk`

### 新增/增强
- **杨公风水知识库**（峦头、理气、阳宅三要、水法、罗盘用法、二十四山等）
- 罗盘提示与 AI 风水 prompt 注入知识库摘要
- UI：印章字体、氛围动效、知识库 tabs 与专业/白话对照

---

## v1.2.4 — 六神笔法测字（2026-08-02）

**APK：** `release/xiaoliuren-1.2.4-android.apk`

### 新增
- 六神笔法测字（`js/liushen-bifa.js`）：多字、多主题（推断/大象/运势/爱情/疾病/失物/诉讼）
- 与打开时刻小六壬课象合参；专业断 + 白话

---

## v1.2.3 — 寻失物与测谎话（2026-08-01）

**APK：** `release/xiaoliuren-1.2.3-android.apk`

### 新增
- 小六壬问事专题：**寻失物**、**测谎话**（含可信度）
- 全方面断语增加对应栏目；专业 + 白话

---

## v1.2.2 — 罗盘专业/白话对照（2026-08-01）

**APK：** `release/xiaoliuren-1.2.2-android.apk`

### 增强
- 罗盘读数增加专业说法与大白话详析

---

## v1.2.1 — 默认经纬度（2026-08-01）

**APK：** `release/xiaoliuren-1.2.1-android.apk`

### 修复
- 风水默认经纬度调整为 `78.33, 146.72`

---

## v1.2.0 — 三合电子罗盘 Android 包（2026-08-01）

**APK：** `release/xiaoliuren-1.2.0-android.apk`

### 新增
- 杨公三合电子罗盘（天地人三针、穿山/透地、宿度等）
- 可选自备 AI Key 做杨公风水细化
- Capacitor Android 可下载安装包

---

## v1.1.0 — Android 首发下载版（2026-08-01）

**APK：** `release/xiaoliuren-1.1.0-android.apk`

### 新增
- 网页用 Capacitor 封装为可离线 APK

---

## 更早（网页核心能力，合入后续版本）

- 小六壬：农历月日时起课、六宫断语、宜忌、时运指数
- 高岛断易：即刻时间种子起卦，与小六壬合参
- 梅花易数、奇门遁甲（简化）、改运方位投票
- 八字细盘：四柱、十神、喜用、大运，与课象合参
- 杨公风水：经纬度、坐向床位建议

---

## 技术备注

- 仓库：https://github.com/SimonDing/xiaoliuren-web
- 构建：`npm run android:debug` → `release/xiaoliuren-*-android.apk`
- 包名 `com.simonding.xiaoliuren` 保持稳定，便于覆盖安装
- 自 v1.2.8 起桌面显示名为「术数应用」
