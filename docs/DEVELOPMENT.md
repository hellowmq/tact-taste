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
