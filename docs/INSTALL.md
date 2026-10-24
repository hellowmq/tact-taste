# 安装与迁移

本项目遵循 [Agent Skills 格式](https://agentskills.io/specification)。运行技能不需要 Python 或 npm；本地安装、检查和打包脚本需要 Python 3.9+。宿主需要具备读取技能文件和执行当前项目工具的能力。

## 从本地项目安装

取得完整项目文件后，在项目根目录运行。`--to` 是最终技能目录，最后一级应为 `tact-taste`。

Codex 本机技能目录：

```sh
python3 scripts/install.py --to "$HOME/.codex/skills/tact-taste"
```

Claude Code 个人技能目录：

```sh
python3 scripts/install.py --to "$HOME/.claude/skills/tact-taste"
```

Claude Code 也支持安装到目标项目的 `.claude/skills/tact-taste`。先在本项目目录运行安装器，将 `--to` 设置为那个项目的实际目标路径。Claude Code 的目录与 `/tact-taste` 调用方式见[官方说明](https://code.claude.com/docs/en/skills)。

安装器复制 `distribution.json` 中 `skill_files` 列出的文件，包括入口、参考、展示信息、MIT 许可和来源记录。它不创建软链接，不访问网络，不注册插件，不修改其他技能。目标已存在或最后一级名称错误时会退出；不会合并或覆盖。

打开新会话，在宿主技能列表中确认 **Tact Taste**。Codex 中可按当前客户端支持的方式选择或明确提及 `$tact-taste`；Claude Code 中使用 `/tact-taste`。实际自动发现行为依宿主版本和设置而定。无法发现时，直接让助手读取已安装的 `SKILL.md`，不要把“文件复制成功”当作已验证的自动触发。

## 手动使用

保持 `SKILL.md`、完整的 `references/`、`agents/`、`docs/SOURCES.md`、`docs/sources.json` 和 `LICENSE` 的相对位置，放入同一个 `tact-taste` 目录。只复制 `SKILL.md` 会丢失按需参考。

也可以不安装，直接让助手读取取得的项目中的 `SKILL.md`。技能不依赖原来的经验库、本地应用源码或原始 HTML。

## 从 interaction-master 迁移

Tact Taste 是旧「交互大师」的独立整理版，名称与提示词已更新。它不是旧目录的自动升级程序。

1. 保存旧技能的自定义规则和已有修改。
2. 在宿主支持的管理界面停用旧技能，或自行将旧目录移到技能发现目录之外，保留备份。
3. 安装 `tact-taste`，打开新会话，以明确调用方式检查新名称和参考文件。
4. 将常用提示词中的旧名称替换为新名称。

安装器发现同一父目录中的 `interaction-master` 时会拒绝安装，避免两个相同用途的技能同时自动触发。安装器不会替你移动或删除旧技能。如果旧技能在其他发现目录，也请一并检查。

本次项目整理没有修改或安装本机全局技能；以上为后续迁移步骤。

## 更新与卸载

更新前对比并备份本地修改；自行把旧安装目录移到发现目录之外，再安装到空目标。安装器没有强制覆盖选项。

卸载仅需在宿主中停用该技能，或自行移走对应的 `tact-taste` 安装目录。本项目没有后台进程或额外安装依赖。

## 获取 v0.1.0

从 [GitHub Release](https://github.com/hellowmq/tact-taste/releases/tag/v0.1.0) 下载 `tact-taste-v0.1.0.zip` 和 `SHA256SUMS`，放入同一个空目录。macOS 可先核对：

```sh
shasum -a 256 -c SHA256SUMS
```

Linux 可使用 `sha256sum -c SHA256SUMS`。校验通过后解压，进入其中的 `tact-taste` 目录，再执行上文安装命令。更新时重新下载相应版本的压缩包与校验文件，不把旧版本的校验文件用于新包。

也可以取得固定标签的源码：

```sh
git clone --branch v0.1.0 --depth 1 https://github.com/hellowmq/tact-taste.git
cd tact-taste
```

本项目不提供 npm 包或远程脚本执行式安装。下载不会自动安装，也不会修改已有技能。
