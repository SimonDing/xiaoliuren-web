/**
 * 将静态站点复制到 www/，供 Capacitor 打包 Android。
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const www = path.join(root, 'www');

function rimraf(dir) {
  if (!fs.existsSync(dir)) return;
  fs.rmSync(dir, { recursive: true, force: true });
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

rimraf(www);
fs.mkdirSync(www, { recursive: true });

fs.copyFileSync(path.join(root, 'index.html'), path.join(www, 'index.html'));
copyDir(path.join(root, 'css'), path.join(www, 'css'));
copyDir(path.join(root, 'js'), path.join(www, 'js'));

fs.writeFileSync(
  path.join(www, 'js', 'app-shell.js'),
  `/**
 * Android App Shell 适配：安全区、返回键
 */
(function () {
  document.documentElement.classList.add('is-app');

  function isNative() {
    return !!(
      window.Capacitor &&
      typeof window.Capacitor.isNativePlatform === 'function' &&
      window.Capacitor.isNativePlatform()
    );
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!isNative()) return;
    document.body.classList.add('native-app');

    if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App) {
      window.Capacitor.Plugins.App.addListener('backButton', function ({ canGoBack }) {
        if (canGoBack) window.history.back();
        else window.Capacitor.Plugins.App.exitApp();
      });
    }
  });
})();
`
);

let html = fs.readFileSync(path.join(www, 'index.html'), 'utf8');
if (!html.includes('app-shell.js')) {
  html = html.replace(
    '<script src="js/app.js"></script>',
    '<script src="js/app-shell.js"></script>\n  <script src="js/app.js"></script>'
  );
}
if (!html.includes('mobile-web-app-capable')) {
  html = html.replace(
    '<meta name="viewport" content="width=device-width, initial-scale=1" />',
    `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta name="mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="theme-color" content="#0D1117" />`
  );
}
fs.writeFileSync(path.join(www, 'index.html'), html);

fs.writeFileSync(
  path.join(www, 'manifest.webmanifest'),
  JSON.stringify(
    {
      name: '小六壬时运',
      short_name: '小六壬',
      start_url: '.',
      display: 'standalone',
      background_color: '#0c0b09',
      theme_color: '#0c0b09',
      lang: 'zh-CN'
    },
    null,
    2
  )
);

console.log('www/ prepared for Capacitor');
