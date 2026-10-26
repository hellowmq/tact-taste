[![Tact Taste：文字线雕、光谱玻璃、钴蓝排版与朱红纸票，取自实际运行画面](docs/media/cover.png)](https://tech.wenmq.cn/tact-taste/showreel.html)

# Tact Taste

**有分寸，也有锋芒。**

[English](README.en.md) · [在线体验](https://tech.wenmq.cn/tact-taste/) · [32 秒短片](https://tech.wenmq.cn/tact-taste/showreel.html) · [下载 v0.1.0](https://github.com/hellowmq/tact-taste/releases/tag/v0.1.0) · [安装](docs/INSTALL.md) · [示例说明](docs/EXAMPLES.md) · [MIT](LICENSE)

给 AI 编程助手的 **UI 与交互设计技能**。从布局、排版、配色和材质，到选择、等待、取消与恢复，把界面的视觉和操作一起打磨。

把它交给助手，再给出你的项目与目标。它会查看真实界面、选择适合的改进、落实代码，并验证受影响的操作。保留已有品牌与业务规则，不绑定框架。

## 看得见的品味

- **光谱** — 让颜色、透光与高光，在同一个玻璃表面相遇。
- **字场** — 同四个字，在大字、留白与错位之间改变节奏。
- **纸间** — 纸纹、压印与金属箔；一张可以选择，也可以收回的收藏票。

封面还保留了连续文字的双视角粒子线雕：文本 **1 / 2 → 2 / 3**，在同一句话上接住下一次转场。

**[播放 32 秒 Showreel ↗](https://tech.wenmq.cn/tact-taste/showreel.html)** — 从线雕、调色和排版，到收藏撤回、连续选择和拖动取消。真实示例操作，配以原创音轨；[下载 MP4](https://github.com/hellowmq/tact-taste/releases/download/v0.1.0/tact-taste-showreel-v0.1.0.mp4) · [制作源码](showreel/README.md)。

<details>
<summary>展开 14 秒交互摘录</summary>

<picture>
  <source media="(prefers-reduced-motion: no-preference)" srcset="docs/media/interactions.gif">
  <img src="docs/media/interactions-poster.png" alt="实际交互摘录：调节玻璃透光、切换排版、收藏与撤回纸票，以及选择、保存和拖动取消。" width="800">
</picture>

实际运行录屏的压缩摘录。减少动态效果时显示静态画面；收起可停止观看。完整示例的操作与验收见[示例说明](docs/EXAMPLES.md)。

</details>

## 操作，也有质感

<picture>
  <source media="(max-width: 600px)" srcset="docs/media/behavior-mobile.png">
  <img src="docs/media/behavior.png" alt="连续选择的渐变指示物、保存确认与拖动预览的固定淡影，均来自实际界面" width="1440">
</picture>

同一个对象接住新的选择；输入、等待和结果各有归属；预览可以取消，失败可以恢复。连续 alpha、渐变与高光参与表达状态，键盘、焦点和减少动态效果也一起考虑。

这些是有取舍的设计判断。展示作品可以鲜明，日常操作应当合适；具体效果需要在你的产品里检验。

## 用到你的项目

从 [Release](https://github.com/hellowmq/tact-taste/releases/tag/v0.1.0) 下载并校验压缩包，解压后进入 `tact-taste` 目录。需要 Python 3.9+：

```sh
python3 scripts/install.py --to "$HOME/.codex/skills/tact-taste"
```

打开新会话，选择技能，或让助手读取安装后的 `SKILL.md`：

```text
用 $tact-taste 改善这个页面的 UI 与交互。
保留品牌配色和业务逻辑，打磨排版、材质与状态变化。
直接实现最有价值的改进，实际运行，并说明验证结果。
```

安装器只复制技能文件，不下载依赖、不覆盖已有目标。Claude Code、手动使用与旧 `interaction-master` 迁移见[安装说明](docs/INSTALL.md)。

## 继续探索

- [UI 设计判断](references/ui-design.md) — 层级、排版、色彩、材质与连续 alpha。
- [示例与验收](docs/EXAMPLES.md) — 本地运行、操作步骤、完整文字线雕与主题研究。
- [保留情况](docs/PRESERVATION.md) — 从「交互大师」保留的核心规则、12 张动效卡与 15 条工程经验。
- [开发与贡献](docs/DEVELOPMENT.md) — 项目结构、验证与打包；[版本记录](CHANGELOG.md)。

本项目文字与新写代码采用 [MIT](LICENSE)，展示图与动图来自自己的实现。[来源与许可](docs/SOURCES.md)记录引用边界；[视觉参考](docs/VISUAL-REFERENCES.md)说明观察与取舍。保存与收藏示例为本地模拟。
