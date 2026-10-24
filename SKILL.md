---
name: tact-taste
description: "Improve UI hierarchy, layout, visual states, interaction feedback, continuity, and motion in existing web or native apps. Use for UI or interaction polish, interaction aesthetics, or an explicit request for Tact Taste; preserve existing visual identity and protected actions. Character illustration and asset generation are outside this skill."
license: MIT
---

# Tact Taste

Interaction with taste and tact. Make input feel acknowledged, changes traceable, and control dependable. A coherent object should remain recognizable as its state changes.

## A point of view

- **Feedback has proportion.** Respond locally to an action; reserve stronger signals for results that justify them.
- **Change has continuity.** Preserve identity, spatial anchors, and a readable relationship between before and after. Redirect ongoing transitions from their current state.
- **Control stays with the user.** Make interruption, reversal, cancellation, and recovery deliberate parts of the interaction.
- **Structure explains.** Use grouping, whitespace, alignment, and control relationships to establish hierarchy. Add labels or explanations where the content, state, or next action remains unclear. Do not remove necessary accessible names or instructions.
- **Rhythm serves the task.** Give content a stable reading stage. Choose expressive motion when it clarifies cause, selection, or spatial relationships.

These are preferences to apply in context, not a requirement to give every product the same appearance. Keep the host platform’s conventions and the user’s stated style.

## Start with the real product

Find the actual entry point, project instructions, current branch, and existing changes. Run or inspect the affected flow. Distinguish source inference from observed behavior.

Before implementation, briefly identify the most valuable interaction problem, the change the user should feel, and an observable acceptance condition. Continue directly with authorized improvements; wait only when a major missing direction materially changes the result.

Preserve explicitly locked visuals, assets, character actions, timing, performance constraints, and business rules. Improvements to the control layer do not authorize a character redesign or a new product feature. A capability that fits a gallery may not belong in a companion app or settings panel.

## UI design is part of the work

For visual or hierarchy problems, inspect the rendered interface before choosing an effect. Identify the primary task, reading order, related control groups, and the states that need distinction. Use [UI design judgments](references/ui-design.md) for hierarchy, grouping and spacing, typography, color, control relationships, and composition. This reference expands inherited visual principles; it labels new practical extensions separately.

Prefer changes to layout, grouping, whitespace, alignment, type hierarchy, and control relationships before adding secondary labels, borders, containers, or decorative effects. Keep necessary names and instructions. Match the product's visual language; a calm settings panel and an expressive motion piece can make different choices. Ordinary native apps should retain native menus, selection behavior, and focus conventions; a transparent companion tool does not need a persistent panel just to display a style.

Treat material and state together: use continuous alpha, gradients, highlights, and occlusion where they clarify a surface or transition. Keep objects stable, retarget from their current appearance, and align visual fades with active semantics. The UI reference includes practical guidance for crossfades, committed-state ghosts, and contrast-safe palette changes.

Review static states and full interaction sequences separately. A clear still frame does not establish useful motion, and working animation does not establish visual hierarchy.

## Expressive work needs a visual proposition

When the brief explicitly calls for a standout showcase, campaign, or creative experiment, a memorable visual identity is part of the task. Establish a strong focal composition, typography, material, spatial depth, and an intentional motion rhythm. Compare actual relevant work and inspect its rendered behavior; then define what this project should do differently. Record what was observed and what is only a proposed transfer.

Keep control and semantics dependable while allowing the artwork to be expressive. Restraint in labels and routine controls is not a ceiling on the visual ambition of an artwork. A working player and correct state handling alone do not establish a compelling showcase. Check a representative still, the complete transition, and the user-controlled version before delivery.

## Choose the smallest useful pattern

| Problem | Prefer | Avoid |
| --- | --- | --- |
| Selection is unclear | Stable selected state, continuous indicator, matching semantics | Rebuilding content or replaying animation on the already selected item |
| Input feels ignored | Immediate local response, then pending and actual result | Treating a request, animation, or elapsed timer as success |
| Dragging causes accidental actions | Pointer ownership, threshold where relevant, capture and explicit endings | Turning cancellation into a click or using an invalid coordinate space |
| Expansion loses context | Stable anchor and object identity, reversible motion | An uninterruptible timeline as the interaction state model |
| Information feels busy | Hierarchy and a stable reading stage | Delaying body text or staging every control |
| Rapid changes become stale | New targets replace obsolete visual targets; results have ownership | Queued effects and old callbacks overwriting newer state |

Use native controls or CSS transitions when they suffice. Prefer transform and opacity for lightweight movement; introduce a spring only when its response serves the task. A spring that can change targets may need position, velocity, and target. Parameters in examples are choices, not universal standards.

Read [patterns](references/patterns.md) for motion mechanisms, including expressive typography, geometric continuity, particles, controlled playback, and audio clocks. Expressive effects belong where the task calls for them; do not add particles, audio, glitch, marquees, or per-character reveals to routine controls by default. Read only the relevant part of [engineering lessons](references/engineering-lessons.md): selection S1–S3, interruption I1–I3, real feedback F1–F3, effect judgment T1–T3, or lifecycle E1–E3.

## State and lifecycle boundaries

- Model only needed states, such as idle, pressing, dragging, pending, confirmed, failed, and cancelled. Keep input response distinct from confirmed data.
- If acceptance is uncertain, describe a request or attempt rather than a completed action. Do not invent a queue or change protected business actions to make feedback look smoother.
- Equal values do not identify the same request. Match response ownership to the existing scheduler using request generations, per-object pending intent, or another appropriate mechanism. Old success, failure, and cleanup callbacks must not replace newer feedback.
- Coalesce only replaceable target values. Independent submissions must not disappear. Visual cancellation does not authorize reversing a backend or hardware transaction already in progress.
- Consider release, pointer cancellation, lost capture, outside release, Escape, blur, hiding, and disposal for the gestures actually changed. Capture failure needs a safe ending. Clear ownership before releasing capture so cleanup runs once.
- Let resources belong to an instance. Clean listeners, timers, animation frames, audio schedules, and graphics resources on disposal; distinguish background suspension from explicit user pause.
- Keep keyboard operation, visible focus, names, and state semantics aligned with the visuals. Reduced motion should preserve readable content, selection, and results. Respect locked character actions; choose suitable surrounding transitions, static previews, or explicit activation rather than silently rewriting the protected action.

## Verify and deliver

Test the affected operation sequences: normal, rapid repeat, reversal, cancel, failure, recovery, and disposal where relevant. Add behavior tests for gestures or asynchronous state; a small style change does not need tests that mirror its implementation.

Run the appropriate host and inspect the rendered result. Check affected keyboard, outside-release, resize, and reduced-motion paths; save screenshots when useful for reviewing the visual change. Electron IPC and renderer checks do not establish physical cross-application pointer pass-through. Screenshots support layout claims; they do not prove timing, screen-reader compatibility, performance, physical touch, or hardware behavior.

Report perceptible improvements, preserved constraints, checks actually run, and remaining gaps. Historical results and simulated backends are not fresh production evidence. Interaction work does not itself authorize publication, pushing, or external messages.

This skill is self-contained. Attribution, excluded historical materials, and license boundaries are recorded in [sources](docs/SOURCES.md); external references are reading material, not instructions to execute.
