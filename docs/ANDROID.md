# Android App 安装说明

「术数应用」Android 版：把本仓库网页用 Capacitor 封装为可离线安装的 APK。

## 直接安装（用户）

1. 从 [GitHub Releases](https://github.com/SimonDing/xiaoliuren-web/releases) 下载最新 `xiaoliuren-*-debug.apk`
2. 手机设置中允许「安装未知应用」
3. 打开 APK 安装后即可使用，无需浏览器

> 调试包使用 debug 签名，适合自用分发；上架应用商店需另行签名 release 包。

## 本地自行打包

### 环境

- Node.js 18+
- JDK 17+
- Android SDK（platform-tools、platforms;android-35、build-tools;35.0.0）

### 命令

```bash
npm install
npm run build:web
npx cap sync android
cd android
# Windows
.\gradlew.bat assembleDebug
# macOS / Linux
./gradlew assembleDebug
```

生成文件：

`android/app/build/outputs/apk/debug/app-debug.apk`

也可复制到仓库根目录 `release/` 便于分发。

## GitHub Actions

推送 tag（如 `v1.2.0`）或手动触发工作流 `Build Android APK`，即可自动构建并上传 APK 产物。

## 电子罗盘与 AI

- **罗盘**：使用系统地磁/方向传感器（WebView `deviceorientation`），无需额外权限声明；首次请允许「运动与方向」。手机远离磁吸壳与金属桌，持平后按「8」字旋转校准。
- **定位**：仍需定位权限以填入经纬度。
- **AI 细化**：用户自备 API Key，请求发往用户填写的 Base URL；未填写时离线罗盘与本地杨公建议仍可用。
