# 开发与贡献

Tact Taste 是随项目工作的设计技能，具体实现跟随宿主与现有技术。它适合改善网页或原生应用中的层级、状态与操作反馈；保留锁定的品牌、角色动作、时序和业务规则。纯角色绘制或从零定义整个品牌，需要另行设计。

## 本地看示例

直接打开 [examples/index.html](../examples/index.html)，或在项目根目录运行：

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

访问 [本地示例](http://127.0.0.1:8765/examples/)。界面采用系统字体与独立编写的 HTML/CSS/JavaScript，无外部字体、图片、CDN 或网络请求。播放、反向、键盘、取消、失败恢复和减少动态效果的验收见[示例说明](EXAMPLES.md)。

README 的展示图是对实际界面的裁切与编排；动图是运行录屏的压缩摘录。素材与处理方式见 [展示素材说明](media/README.md)。

## 项目结构

```text
tact-taste/
├── SKILL.md                 技能入口与审美判断
├── agents/openai.yaml       技能展示信息
├── references/              UI、动效模式与工程经验
├── docs/                    安装、验收、来源与展示素材
├── examples/                文字线雕、视觉 UI 与操作研究
├── showreel/                32 秒影片的源码、分镜与原创音轨生成
├── scripts/                 安装、检查与打包
├── tests/                   安装与分发边界测试
├── distribution.json        项目分发与技能安装白名单
└── LICENSE                  MIT
```

完整项目包含展示素材；技能安装只复制 `skill_files` 中的文件，运行技能不依赖展示图片。

## 验证与打包

```sh
python3 scripts/check.py
python3 -m unittest discover -s tests -v
node tests/text-geometry.cjs
python3 scripts/package.py --output dist/tact-taste.zip
```

纯几何测试需要本机 Node.js；技能安装与浏览器示例不依赖 Node.js。打包只包含白名单文件，输出已存在时拒绝覆盖。检查覆盖结构、相对链接、来源记录、媒体类型和常见私有路径，不能发现所有敏感内容或证明技能效果。行为与视觉仍须在实际宿主中检查。

## 贡献经验

从主要任务、阅读顺序与控件关系出发，说明用户会感到什么变化。优先复用项目已有技术，按影响测试正常、快速重复、反向、取消、失败与恢复。

提交经验时给出可复现操作、预期结果、实际验证与限制。区分设计判断、源码观察与运行证据，记录新材料的来源和许可。展示片的节奏与密度不是常用控件的统一标准；截图不证明完整操作、读屏、物理触屏或性能。

[来源与许可](SOURCES.md) · [视觉参考](VISUAL-REFERENCES.md) · [保留情况](PRESERVATION.md)


## GitHub Pages 展示页

在线页面： [Tact Taste](https://tech.wenmq.cn/tact-taste/)。账号个人 Pages 的自定义域名由 GitHub 继承，此项目独立部署到 `/tact-taste/`；个人站的源码和设置不参与本工作流。

`site/` 是展示页与短片播放器的排版和控制层，文字线雕和三组视觉 UI 从 `examples/` 复用。构建只输出明确列出的 HTML、脚本、样式与封面，共十四个文件。MP4 来自 Release，不进入 Git 历史、Pages 构建目录或技能安装。

```sh
python3 scripts/build_pages.py --output dist/pages --base-url https://tech.wenmq.cn/tact-taste/
python3 -m http.server 8766 --bind 127.0.0.1 --directory dist/pages
```

输出目录已存在时构建拒绝覆盖；使用新的空输出目录。打开本机 8766 端口查看。部署前还需按 `/tact-taste/` 子路径验证资源、键盘、作品切换、减少动态效果、图形替代与复制命令。

`.github/workflows/pages.yml` 在 `main` 推送时执行检查、构建与部署，也支持手动触发。仅部署任务获得 `pages: write` 和 `id-token: write`；官方 Actions 固定到已核对提交。部署以 Actions 成功状态、Pages 返回地址和公开资源回读为证据。发布标签及版本下载包独立维护。

影片的本地依赖、复现命令与来源见 [Showreel 制作说明](../showreel/README.md)。影片制作不参与 Pages CI；修改播放器时，实际验证播放、暂停、章节跳转、媒体失败提示与窄屏。成片作为现有 Release 的补充展示附件，保留既有安装包和校验文件。
