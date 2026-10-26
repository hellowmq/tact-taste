# Showreel 制作参考

阅读日期：2026-10-25；源码与成片整理公开日期：2026-10-27。以下均是文档阅读与独立概括；没有安装这些 Skill，也没有复制它们的模板、音轨、字体或视频素材。

| 来源与固定版本 | 借鉴的做法 | 本片的落实 |
| --- | --- | --- |
| [Remotion Agent Skills](https://github.com/remotion-dev/skills/tree/6c67adcd9cdbe6eb84d76342da89b225f9161cb2) | 明确的帧区间、时间驱动和数值钳制 | 固定 32 秒 / 960 帧；线雕通过真实 seek 输入采样，CSS 转场按同一时间采样 |
| [Product Launch Video](https://github.com/memex-lab/product-launch-video-skill/tree/9de027d1947ce8f8b60ccf70aa89e482bf80ecea) | 开场主镜头、大小景别与快慢反差、先分镜再实现 | 深绿线雕→紫光→蓝黄→纸红→深绿→纸白的色彩节奏；操作后留出阅读时间 |
| [SaaS Product Demo Video](https://github.com/noamdorr/saas-product-demo-video/tree/74f4f7150810b1bb5bf9160c4a2742c5dce69b62) | 每个镜头传递一个重点；交互因果；检查点击位置、落定帧和切点 | 鼠标坐标由实际控件边界生成；点击后检查状态；检查每段切入、结果与最终定帧 |
| [demo-video-skill](https://github.com/isaaclins/demo-video-skill/tree/1b623a3f7b1ad551586886295f92ba0b7a2baab9) | 录制真实网页；光标与反馈同步；核对采集稳定性和音量 | 嵌入本项目 examples，执行指针与键盘输入，分别处理 WebGL 和 CSS 的时间采样 |

这些是制作方法参考，不表示已经运行或验证上游工具的全部能力。代码采用本项目独立编写的 HTML/CSS/JavaScript 与 FFmpeg 管线，没有引入 React / Remotion 运行依赖。

具体选择：保留 1→2、2→3 的共享视角；每次强调一个操作及其结果；先检查关键帧，再检查实际编码后的影片。没有采用“每镜必须多层发光”“每次入场必须有若干种效果”的固定配额。

影片中的光谱调色和透光、字场布局和反色、纸票选择/收藏/撤回、连续选择反向切换、拖动 Escape 取消与松手确认，均由原示例的处理逻辑产生。结尾明确定位为给 AI 编程助手的 UI 与交互设计 Skill，没有加入未实测的效率、转化率或自动生成能力宣传。

## 素材边界

原 UI、线雕、文字和品牌画面均来自本项目。新增影片排版、镜头、时间轴和合成为本项目代码；配乐及操作音由本地数学合成生成，没有外部采样。系统字体只用于渲染像素，没有分发字体文件。第三方仓库只作为链接与方法参考。

本地制作时的账号环境、绝对路径、失败尝试和 QA 日志不进入 Git 或 Release。制作工程独立于 Skill 安装文件；视频以 Release 附件分发，指纹见 [showreel.json](../docs/showreel.json)。
