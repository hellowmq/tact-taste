# Interaction patterns

Read the parts relevant to the current task. These are independently worded design and engineering judgments, not copied implementations or universal motion parameters. Source boundaries are in [the register](../docs/SOURCES.md).

## 1. One object through change

Keep a selected item, expansion anchor, or shared indicator identifiable across states. Move the same visual object rather than destroying it and starting another entrance. Update the corresponding accessible state at the same time. Re-selecting the current item should usually be a no-op.

## 2. Local acknowledgement

Let the initiating control acknowledge input promptly without moving its hit target. Show pending work separately from a result. A completed animation cannot confirm a save; a real response or readback must own that claim. If confirmation is unavailable, say what was requested and what remains unknown.

## 3. Redirectable transitions

Use the current rendered state as the start of a new transition. Ordinary CSS transitions can already redirect many simple changes. A spring may require current position and velocity in addition to a target. Check the chosen model’s damping domain: a formula containing `sqrt(1 - damping²)` for underdamped motion does not cover critical or overdamped cases. This is a model constraint, not a universal spring setting. A predetermined showreel timeline alone is not an input state machine. Retain a position or contour anchor when changing geometry. Border radius, shadows, and filters can add paint cost even when transforms appear smooth; measure the affected workload.

## 4. Cancellation as an ending

A gesture needs an owner and a valid release condition. Accept only the initiating primary pointer and the intended activation button; decide whether a movement threshold distinguishes clicking from dragging. Escape, pointer cancellation, lost capture, blur, hiding, and disposal should end affected previews safely. Clear ownership before releasing capture to avoid duplicate cleanup. Cancelling a preview must not produce an extra click.

## 5. One time model for controlled playback

For a timeline or replayable illustration, derive DOM, SVG, and canvas output from the same time or progress. Declare the unit. A scene can have start, end, and render-at-time responsibilities; derive bounded local progress from the shared time rather than running unrelated timers for each visual layer. Separating a controller from render-at-time logic can support pause, seek, replay, and export. Keep this display state distinct from gesture ownership and asynchronous data.

## 6. Reproducible frames

Derive a frame from time, dimensions, and parameters when arbitrary seeking or export is required. Initialize random values once or keep a seed; do not silently change the composition on resize. State that cannot be reconstructed needs an explicit restoration model.

## 7. Rhythm and reading

Choose an entrance, a stable reading stage, and an exit where staging helps comprehension. Let each scene foreground one message or mechanism, and carry repeated type, color, or geometry between scenes. Leave a stable final title or action. Sequential staggering can express reading order, radial staggering an outward spread, and line-level staggering content hierarchy. Bound the total stagger for longer text; the delay must not grow indefinitely with character count. Keep body text available without waiting for a decorative reveal. A fixed total duration is not a general readability standard. Brief glitch, grain, and flashes may emphasize an expressive piece, but must preserve legibility; reduced motion removes them rather than merely slowing them.

## 8. Text remains text

Use masks or transforms for short expressive titles while retaining complete semantic content. Work with grapheme clusters when splitting text with emoji or combining marks. Avoid having assistive technology announce a duplicate decorative layer. Reduced motion still shows the complete text.

## 9. Particles need a relationship

Define an origin, destination, delay, and envelope before increasing density. Determine whether the effect explains an input or state. Wait for fonts before sampling text outlines. Particle count, resolution, and device-pixel ratio are budgets to measure, not proof of universal performance.

## 10. Numbers and outlines need meaning

Use number or path animation to explain a real change, a route, or an actual result. Never make sample metrics or playback progress look like measured application data. Reduced motion can show the final number or complete outline immediately.

## 11. Audio has its own clock

When audio is actually needed, map scene time to the audio engine’s absolute scheduling time. Pause, seek, and resume must cancel or rebuild obsolete schedules. Handle activation or resume failure and environments with no audio. A successful visual preview does not verify sound. Muting output is different from stopping scheduled computation. Verify listening and timing separately from screenshots.

## 12. Controls and resource ownership

Keep playback and rendering separate. Provide pause, reset, replay, seek, accessible button names, and keyboard operation where appropriate. Use a native range input or complete slider semantics. Remember whether playback was running before a scrub; explicitly define what valid release and cancellation restore. Global shortcuts must yield to text inputs. Do not attach click-to-pause to the entire page when links, forms, or other controls share it. Assign listeners, animation frames, timers, and media nodes to an instance and clean them on disposal. For paused static scenes, redraw on seek, resize, or state changes instead of keeping an idle render loop running. Include CSS grain, marquees, and auxiliary animations in pause behavior. Returning from the background must not override an explicit pause. Rebuild clock mappings from a stable state and discard obsolete work. Load required fonts before sampling; account for unavailable fonts and offline dependencies when adapting a reference.

## Applying a pattern

Pick the mechanism that addresses an observed problem, define the result the user should notice, implement within the host’s conventions, and verify the affected sequence. Technical correctness, aesthetic preference, and demonstrated user benefit are different claims.


## Continuous text through paired views — new example

When a task calls for expressive transitions between a short sequence of authored phrases, pair adjacent texts: 1/2, then 2/3. Define the same middle text samples and reading view for both volumes so the transition can hand over while that text is stationary and readable. Each pair stays fixed during its turn; camera motion reveals its other projection. Keep type scale, baseline, readable holds, supporting copy, and navigation part of the composition.

For the example's common-height samples, volume 12 uses `(x1, y, -x2)` and volume 23 uses `(-x3, y, -x2)`. Orthographic yaw is `screenX = x*cos(angle) - z*sin(angle)`. Both volumes project to `(x2, y)` at 90 degrees. Only the hidden axis changes at handoff; suppress any depth-dependent styling there that would reveal a jump. Small camera elevation during a turn must return to zero at each reading view. This is independently written example geometry, not a general multi-view text solver.

Choose content and fonts whose vertical sampling bands are compatible. Different glyph extents, blank rows, mixed baselines, wrapping, and arbitrary user text need additional validation; do not conceal missing strokes by claiming generic support. Preserve complete semantic text and a readable static fallback. Validate endpoint legibility, point-by-point middle projection, reverse seeking, pause, cancellation, and reduced motion separately from a still screenshot. An expressive headline sequence may justify this mechanism; ordinary body text should remain available without decorative delay.
