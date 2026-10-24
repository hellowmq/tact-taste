# Engineering lessons

Use the relevant category rather than applying the entire document to every edit. The fifteen entries preserve the decisions from the original experience library in a portable form. Source observations and adoption suggestions are separated from test evidence in [the source register](../docs/SOURCES.md).

## Selection — S1–S3

### S1. Choose the implementation layer by the control requirement

Determine whether the user changes a control state, explores time, or manipulates a spatial scene. Start with host-native controls or CSS for ordinary feedback. Consider a timeline for multi-object sequencing and seeking, gesture state for direct manipulation, and canvas or WebGL for genuinely dense drawing. Existing project dependencies, maintenance, licensing, and disposal costs affect the decision.

At integration time, verify the current APIs and maintenance status of any candidate library. Verify a real operation that justifies the chosen layer. Collected examples are not a reason to add a library or a new product entry point.

### S2. Playback state and interaction state have different jobs

Playback, screenshots, and export can share time, parameters, dimensions, and a fixed random seed. Gestures additionally need input ownership and current state; a continuous spring may need velocity. `seek(t)` can reconstruct a presentation without resolving how a user takes control of it.

Verify repeat evaluation, backward seeking, resize, and a mid-gesture target change when those capabilities are required.

### S3. Follow stable data identity

Associate items before and after insertion, removal, or movement using stable identities. Define the data result, visual transition, and focus destination separately. Older platform demos can inspire an interaction without determining the current architecture or dependencies.

Verify consecutive edits in the same region, movement to the ends of a list, cancellation of sorting, and focus after removal or restoration.

## Interruption — I1–I3

### I1. Continue from the current state; isolate intent by object

Redirect a visual transition from its current presentation. Preserve velocity when the chosen physical model requires it. Separately respect the backend scheduler: merging replaceable target values is different from discarding independent submissions. An already-started hardware or backend transaction follows its own completion rules.

Verify A→B→C, reversal to A, and interleaved updates on two objects. The latest visual target must not change unrelated business semantics.

### I2. End a gesture once

Identify the initiating pointer, relevant threshold, coordinate space, and valid release region. Only a valid release may produce a click; cancellation never does. Cancellation and capture failure need safe endings. When a host window can move during dragging, local coordinates may become invalid; choose a host-appropriate space, such as screen coordinates, instead of assuming the window stays still. Clear the internal owner before releasing capture because that release can trigger another event. An interaction that exceeded the drag threshold remains a drag even if it returns to the start.

Verify outside release, a second pointer, Escape, lost capture, blur, capture failure, cancellation followed by restart, and disposal as relevant. Release coordinates must still be checked when movement events were missed.

### I3. Automatic behavior yields control

When a task needs an automatic demonstration, the first meaningful input should hand control over at the current state. The automatic controller must stop writing the same target. Resuming automatic behavior needs a task-appropriate reason and must respect explicit pause and accessibility preferences.

Verify input during the demonstration, background return, and inactivity after the user pauses. An editing tool should not unexpectedly resume motion. Background return must preserve user choices and must not enable sound unconditionally.

## Feedback — F1–F3

### F1. Acknowledge input, pending work, and results separately

Press feedback can be immediate. Pending work begins when the operation is accepted. Success requires a response or readback with confirmation semantics. Sending an IPC message, completing an animation, or ending a native drag does not establish the target’s result. When confirmation is unavailable, use request/unknown wording. Preserve the last confirmed value, current intent, and a recovery path; an unknown numeric value is not zero.

Verify slow responses, unavailable confirmation, and actionable recovery. Simulated delays must be clearly labeled as simulation.

### F2. Equal values are not equal operations

Assign feedback to both the object and operation. A concurrent service may use generations; a serial coalescing scheduler may check per-object pending intent. Match the approach to the actual scheduler. Old success, failure, and cleanup callbacks must not overwrite newer feedback. Recording an old readback and updating the current status may have different rules.

Verify repeated same-value requests, old success and failure arriving late, and object removal. Do not infer ownership from value equality alone.

### F3. Recovery belongs to the failed object and intent

Place feedback beside the initiating object or operation and give each object its own result and retry when operations can fail independently. Preserve unresolved items in a partly successful batch. A retry should reference the failed intent, not silently use whatever happens to be in an editor now. Show refresh, adjustment, and background reading as separate activity where their conflict model warrants it. Disable controls only when the actual conflict requires it; one global loading flag should not make unrelated actions spin or become unavailable.

Verify two objects with different outcomes, retry after the input changes, partial success, and departure during an operation.

## Judgment — T1–T3

### T1. Name the comprehension problem an effect solves

Tie an effect to recognizing selection, understanding causality, or following a spatial relationship. Keep key hit targets and body content stable. Preserve protected character actions and assets. The same technical capability may deserve different entry points in a companion app, a webpage, and a gallery.

Compare the affected operation with and without the effect. Treat the comparison as a design judgment unless user evidence supports a stronger claim.

### T2. Review composition and endpoints independently

Choose the subject, reading order, type hierarchy, color relationships, whitespace, stable reading state, and final state. Inspect representative frames for composition, then perform the entire interaction for rhythm. A technically sound motion system does not determine the art direction.

Verify the same task and content at meaningful states. Source authors’ aesthetic claims do not become independent test results.

### T3. Reduced motion preserves the outcome

Keep complete words, final values, selection, and actions available while removing unnecessary flashes, shaking, or autoplay. Honor protected action contracts; use suitable surrounding transitions, static previews, or explicit activation where appropriate. Account for preference changes while running.

Verify both the initial preference and a runtime change, together with keyboard entry and a stable final state.

## Lifecycle — E1–E3

### E1. Resources belong to an instance

Give listeners, capture, animation frames, timers, audio schedules, and graphics resources an owner. Embedded widgets should not accidentally modify another instance’s cursor or input target. Cancel obsolete callbacks before clearing a preview. Distinguish background suspension, explicit pause, and disposal.

Verify independent instances, disposal during a gesture, mount–operate–dispose–recreate, background return, and obsolete callbacks arriving after recreation. Resume from stable state with the correct clock mapping, rather than replaying expired schedules. Muting is not the same as stopping work.

### E2. Capabilities and visual quality have limits

Choose a budget for target devices, detect required graphics capabilities, and retain a simplified or static result. Respond to context loss and loading failures with a stable state and appropriate recovery. Adjust resolution, density, or effects in response to a measured bottleneck.

Verify missing capabilities, resize, context loss, quality changes, and recovery paths on the affected target devices. Observe relevant frame time, input responsiveness, and resource changes rather than inferring them from the configured budget. Device-pixel ratio, particle count, or the word “adaptive” is not performance evidence.

### E3. Test operation sequences

Choose the affected normal, repeat, reverse, cancel, fail, recover, and dispose sequences. Add keyboard, narrow-screen, reduced-motion, audio, or exported-output checks when the change affects them. A small style change need not grow into a full test matrix.

Report source review, automated behavior tests, simulated previews, actual hosts, devices, and production readback distinctly. Record the actual entry point, date, environment, result, and gaps. A test file or historical pass does not establish a fresh pass.

## Provenance

The rules combine independently written judgments from practical interaction work and reading of public references. The original private project code and unidentified HTML samples are not included. Public reference projects are linked for attribution, not supplied as tested dependencies or vendored code. See [sources and licensing](../docs/SOURCES.md) before copying any upstream implementation or asset.
