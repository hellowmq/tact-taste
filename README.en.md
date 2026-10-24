# Tact Taste

**Interaction with taste and tact.**

[中文](README.md) · [v0.1.0 download](https://github.com/hellowmq/tact-taste/releases/tag/v0.1.0) · [Changelog](CHANGELOG.md) · [Installation](docs/INSTALL.md) · [Examples](docs/EXAMPLES.md) · [Sources and licensing](docs/SOURCES.md)

Tact Taste is a **UI and interaction design skill for coding assistants**. Use it when an existing product works but its hierarchy feels scattered, its states are unclear, or changes feel abrupt. It guides the assistant from layout, typography, and control relationships through feedback, continuity, rhythm, and recovery.

It grew out of the Chinese “交互大师” skill, bringing its visual judgments, twelve motion cards, and fifteen engineering lessons into a self-contained project. Give the assistant your project and goal; it uses these judgments to inspect the interface, make changes, and verify the affected flows.

Our preferences are concrete: acknowledge input locally; make changes traceable; let people change their minds; make failure recoverable. Let layout establish hierarchy, motion explain relationships, and words resolve remaining uncertainty. These preferences should be tested against the product and its actual users.

## What should change

These are design goals to verify in your own product:

| Before | Intended outcome |
| --- | --- |
| Extra labels, borders, and explanations obscure the main action | Grouping, spacing, alignment, type, and emphasis establish reading order; necessary instructions remain |
| Selection, content, and focus drift apart | Visual state, semantics, focus, and identity describe the same choice |
| A polished animation jumps back during repeated clicks | New targets continue from the rendered state and remain interruptible |
| Saving reports success immediately and failure disappears | Input, pending work, confirmation, and recovery have explicit ownership |

## Use it for

- UI hierarchy, grouping, spacing, typography, color emphasis, and coherent control states.
- Feedback that distinguishes input, pending work, confirmed results, and failure.
- Selection and expansion that remain continuous during rapid changes.
- Gestures with clear ownership, cancellation, and cleanup.
- Information hierarchy and motion that serve a specific task.
- Keyboard operation, visible focus, reduced motion, and lifecycle behavior.

Preserve the product’s visual identity and explicitly protected assets, character actions, and business rules. Choose the smallest implementation appropriate to the host; an animation library is optional. Character illustration and wholesale brand creation are separate tasks.

## What the assistant does

1. Inspect the real screen, primary task, reading order, control relationships, and constraints.
2. Identify a valuable visual or interaction problem and an observable improvement.
3. Implement within the existing product while preserving locked identity, actions, and business rules.
4. Review still frames and full interaction sequences, then report changes, actual checks, and remaining gaps.

The project provides executable design guidance for an assistant working in your codebase. Implementation follows your host and existing technology.

## Install locally

From this project directory, with Python 3.9 or newer:

```sh
python3 scripts/install.py --to "$HOME/.codex/skills/tact-taste"
```

For Claude Code:

```sh
python3 scripts/install.py --to "$HOME/.claude/skills/tact-taste"
```

The installer copies the skill and its supporting references, license, and source register. It downloads nothing and refuses to overwrite an existing destination. Start a new session and select the skill using your host’s supported mechanism, or explicitly ask the assistant to read the installed `SKILL.md`.

Example request:

```text
Use $tact-taste to improve this page’s UI and interactions. Preserve its
brand colors and business rules. Review hierarchy, grouping, spacing,
typography, and control states; then refine selection, saving, and cancellation.
Implement the useful changes, run the affected flows, and report the evidence.
```

In Claude Code, invoke `/tact-taste`. See [installation and migration](docs/INSTALL.md) for details. Download `tact-taste-v0.1.0.zip` from the [v0.1.0 Release](https://github.com/hellowmq/tact-taste/releases/tag/v0.1.0), extract it into an empty directory, and run the installer above. The release includes SHA-256 checksums. Source is available in the [public repository](https://github.com/hellowmq/tact-taste).

## Try the examples

Open [examples/index.html](examples/index.html) directly, or serve the project locally:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Visit [the local examples](http://127.0.0.1:8765/examples/) for **continuous text as paired 3D particle-and-wire views**. The three Chinese phrases move from hierarchy, through continuity, to feedback.

The first volume reads as text **1** from one view and text **2** from the next. At the shared view of text **2**, the next volume takes over and rotates toward text **3**. The immersive dark layout uses two-line Chinese pearl-like particle typography, with original WebGL point materials, restrained glow, depth lighting, and pointer illumination. Canvas and readable-text fallbacks remain available. Text itself forms the particles and spatial structure. Reading holds, typography, whitespace, supporting copy, chapter navigation, and playback controls make up the actual interface.

The visible entry plays once; pause, scrub backward, or choose a phrase. Pausing or hiding never triggers an automatic restart. Both volumes share the same projection of text 2 at handoff. Reduced motion keeps complete static text. The 16-second duration is a local art-direction choice. Below the artwork, three live UI specimens combine composition, palette, material, and interaction:

- **Light Studio:** a spectral optical ring, translucent glass, palette swatches, transmission control, and pointer lighting.
- **Type Composer:** cobalt and acid-green typography, three continuous layouts of the same four characters, leading control, and contrast-safe palette inversion.
- **Paper Walk:** vermilion, textured paper, a foil seal, selectable ticket numbers, and reversible in-page collection.

The selection, save-feedback, and drag-cancellation studies remain directly visible. Their gradient surfaces, crossfades, highlights, and committed-position ghost share the same interaction state. Only the ring/crescent theme study remains expandable. Collection exists in page memory and resets on reload; it creates no order. New UI specimens have no perpetual animation, and reduced motion reaches the selected state directly.

All examples use original HTML, CSS, and JavaScript, with system fonts and no external assets, runtime dependencies, or network calls. Save confirmation is explicitly a local simulation.

The skill and references are in English. Installation details, source notes, and the example interface are primarily in Chinese.

## Check and package

```sh
python3 scripts/check.py
python3 -m unittest discover -s tests -v
node tests/text-geometry.cjs
python3 scripts/package.py --output dist/tact-taste.zip
```

The pure geometry test needs a local Node.js runtime. Skill installation and the browser examples do not depend on Node.js.

The distribution manifest explicitly lists shipped files. Checks cover package structure, local links, source records, and common private-path leaks. They do not prove design quality, complete secret detection, or browser compatibility. The [example guide](docs/EXAMPLES.md) includes behavioral acceptance steps.

## Expression has a quality bar

A creative showcase needs a distinctive visual proposition. Typography, material, spatial depth, and motion rhythm deserve the same attention as reliable control. The [visual reference notes](docs/VISUAL-REFERENCES.md) name the actual works viewed, observations, and independently implemented choices.

## Preservation and design scope

The [preservation review](docs/PRESERVATION.md) maps the original core rules, twelve cards, and fifteen engineering lessons to their current locations. [UI design judgments](references/ui-design.md) expand the inherited layout-first and composition principles; new practical extensions are labeled separately.

These are opinionated design judgments, without a quantified user-study claim. A crafted showcase and a frequent product action call for different rhythms.

## License and provenance

Original project guidance and newly written examples use the [MIT License](LICENSE). External works retain their own licenses. No upstream source code, screenshots, fonts, audio, or other assets are bundled.

Four historical HTML reference files lack documented redistribution permission and are excluded. The [source register](docs/SOURCES.md) records dated license checks, immutable commit links, and reuse boundaries. A historical short quotation with an unconfirmed original source has been replaced by independently worded guidance.

Contributions should include a concrete operation, an observable result, and the source and license of any new material. Distinguish design advice, source observations, and tests actually run.
