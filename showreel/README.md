# Tact Taste Showreel

[观看 32 秒短片](https://tech.wenmq.cn/tact-taste/showreel.html) · [下载 1080p MP4](https://github.com/hellowmq/tact-taste/releases/download/v0.1.0/tact-taste-showreel-v0.1.0.mp4)

1920×1080，30 fps，32 秒。线雕开场，串起光谱、字场与纸间，再展示连续选择、收藏撤回、拖动取消与确认。界面与事件逻辑直接复用 [examples](../examples/index.html)；本目录只负责影片画幅、镜头、时间轴、鼠标提示和原创音轨。

## 文件与输出

- `index.html`、`film.css`、`film.js`：影片画面与固定时间轴。
- `product-capture.css`：电影画幅的取景与字号，不替换实际控件结果。
- `storyboard.json`：分镜、重点、证据与停留时间。
- `render.mjs`：执行真实指针/键盘操作，采样关键帧并输出静音视频；同时核对操作结果。
- `audio.py`：用数学合成原创配乐与操作音，没有外部采样。
- `finish.py`：合成 H.264 / AAC MP4，检查时长、帧数、编码、响度与意外黑场，导出审阅图。

源码进 Git；生成的视频、音频和检查记录留在被忽略的 `dist/showreel/`。发布的 MP4 位于 Release，指纹见 [showreel.json](../docs/showreel.json)，校验文件见 [MP4.sha256](https://github.com/hellowmq/tact-taste/releases/download/v0.1.0/tact-taste-showreel-v0.1.0.mp4.sha256)。它是 v0.1.0 的补充展示资料，原标签与安装 ZIP 保持原样。

## 本地制作

准备 Node.js 20+、Python 3 / NumPy、FFmpeg（含 ffprobe）和可用的中文系统字体。视频制作依赖独立于 Skill 和网页：

```sh
npm --prefix showreel ci
cd showreel
npx playwright install chromium
cd ..
python3 -m pip install numpy
```

在项目根目录启动服务器，并保持它运行：

```sh
python3 -m http.server 54757 --bind 127.0.0.1
```

另开终端，从项目根目录执行：

```sh
npm --prefix showreel run stills
npm --prefix showreel run render
python3 showreel/audio.py
python3 showreel/finish.py
```

关键帧位于 `dist/showreel/proof/`，完整视频为 `dist/showreel/tact-taste-showreel.mp4`。渲染器与合成脚本拒绝覆盖已有 MP4；重做时先保存原成片，或使用新的工作目录。不同操作系统的字体、浏览器和编码器可能产生不同的像素或文件指纹；交互结果、时长与画幅仍需通过检查。

`capture-report.json` 记录鼠标落点、原示例指纹与实际状态。保存、收藏等示例仍为本地模拟。影片节奏经过剪辑，不表示网页在某台设备上的实时帧率，也不声称某一次模型调用自动完成了全部设计。

## 方法与许可

分镜、取景、合成代码、原有 UI 与原创音轨采用项目 [MIT](../LICENSE)。系统字体只用于渲染像素，没有打包字体文件。Playwright 是通过 npm 安装的制作依赖，不随 Skill、示例或 Pages 打包。[方法参考](RESEARCH.md)记录借鉴的制作判断，没有复制第三方模板、视频或配乐。
