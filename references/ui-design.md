# UI design judgments

Use for an existing interface whose hierarchy, grouping, density, typography, or visual states need work. Begin with the actual rendered screen and the task it serves. Preserve locked layouts and assets; when a layout is explicitly fixed, improve within that boundary or explain the specific conflict.

U1–U6 make the original layout-first principle and composition lessons actionable. U7–U9 are new practical extensions for this independent project, not a recovered historical rule or a claim about a reference project's implementation. These are design judgments, not results of user research.

## U1. Give the screen a reading order

Identify what the user came to see or do, what supports that task, and what is occasional. Use placement, scale, weight, and whitespace to express those relationships. If every label, action, and value has equal emphasis, decide which deserves attention before adding another accent.

An expressive composition may use a large title or dominant artwork; a utility may prioritize the current value and its control. Secondary actions should remain discoverable without competing with the main task. Avoid turning the same hierarchy into the same layout in every host.

## U2. Let proximity and alignment explain relationships

Keep related labels, values, controls, and feedback near one another. Make separation between groups stronger than separation within a group. Align repeated rows and related edges so people can scan without repeatedly decoding the arrangement.

Adjust grouping, whitespace, alignment, and control relationships before adding secondary labels, dividers, cards, or explanatory paragraphs. Add text when content, state, or the next action is still unclear. Preserve necessary accessible names and instructions even when the visual grouping is sufficient.

## U3. Typography carries hierarchy and rhythm

Choose meaningful differences in type size, weight, line spacing, and line length for headings, content, values, and supporting information. Keep the body readable and available while an expressive title moves. Review long text, Chinese and Latin text together, and the final resting state rather than judging only a short demo title.

Short-title masks, displacement, and stagger can reveal structure. Keep complete semantic text, handle grapheme clusters, and prevent decorative copies from being announced twice. Decorative delay should never become a prerequisite for reading the main content.

## U4. Color and effects have a job

Keep the product's existing palette and visual identity unless the user authorizes changing them. Use emphasis to reveal a selected object, an action's result, or a relationship. Choose color, whitespace, shape, and type together rather than giving every control a competing effect.

Strong contrast, gradients, particles, blur, texture, and geometric transformation can be appropriate in an expressive work. Use them deliberately around a focal subject and retain legibility. Ordinary controls usually need a smaller response. A reduced-motion view must keep complete content, selection, and outcomes.

## U5. Design the states of the control

Review the relevant idle, focus, pressed, selected, expanded, pending, confirmed, failed, and cancelled states as a coherent family. The user should recognize the same object throughout. Feedback should remain next to its action; critical hit targets should stay stable while their visual layers respond.

Use native menus, selection, keyboard behavior, and focus conventions when they fit the host. A companion widget, a web control, and an art gallery have different needs. Do not introduce a permanent panel or extra product entry simply because a reusable visual mechanism exists.

## U6. Review the composition and its ending

Choose a subject, reading order, type proportions, color relationships, whitespace, and a stable ending. A still frame should have an intentional composition; the full sequence should explain how the parts connect. Repeated type, color, and geometry can give successive scenes a common identity.

For a motion showcase, design a distinctive piece with entrance, development, reading, and ending, then give the viewer playback control. For a high-frequency task, keep repeated actions immediate. Neither a technically correct animation nor a static screenshot establishes the quality of the other.

## U7. Practical extensions: consistency, non-color cues, and narrow layouts

These are newly explicit implementation suggestions derived from the principles above:

- Reuse a small set of spacing, type, radius, border, and icon treatments already present in the product. If introducing a system is within scope, make repeated components consistent before adding variants; do not invent a universal pixel scale for every project.
- Distinguish selected, error, and focus states with an appropriate combination of shape, outline, text, icon, or semantics, so their meaning does not depend only on hue. Keep disabled content recognizable. Verify actual contrast and assistive behavior when making accessibility claims.
- Use icon-only actions only when their meaning and accessible names are clear in context. Review their focus and activation area in the actual host; do not assume the visible glyph is the whole target.
- When a theme change has a meaningful spatial metaphor, the same object can turn to another view while its palette changes. Retarget from the current camera state; keep text, focus, and controls stable and readable. Reduced motion should reach the new theme directly. An expressive artwork can justify this treatment; a routine color switch does not automatically need a 3D scene.
- On a narrow screen or with long/localized content, preserve grouping and task priority while changing columns or order as needed. Check wrapping, clipping, readable values, reachable actions, and stable feedback. A desktop screenshot is insufficient evidence.

## U8. Expressive showcases: judge the image, not only the mechanism

New guidance from the showcase revision: when the user wants visual distinction, choose a specific visual idea and relevant real works as benchmarks. Give the main subject enough scale; design type, material, light/dark depth, fine detail, and the transition’s build, peak, and resolution together. A generic empty frame around an animation can weaken the work even when each control works.

Separate the artwork’s intensity from control noise. Navigation and transport can be quiet while the subject is bold. A one-time entrance or playthrough may suit a showcase if it has an immediate pause, respects reduced motion, stops when hidden, and never resumes against the user’s choice. Pointer response should have a visible relationship to the subject, rather than adding unrelated decoration.

Document the difference between visual observation, independently written implementation, and actual evidence. Study a reference’s choices without copying its assets or treating a screenshot as proof of timing, performance, or interaction quality.

## U9. Continuous alpha and material belong to the state model

New guidance from the UI gallery revision: distinguish spatial transparency from temporal opacity. A gradient alpha mask can soften an edge or express depth; a crossfade connects two visual states. Neither should dim essential labels indefinitely or substitute for clear selected, pending, confirmed, failed, or cancelled semantics.

- Choose a material vocabulary: a light-facing edge, a transparent body, a faint occlusion/shadow, and a legible foreground. Layer these around the same object rather than filling every surface with a flat accent color. Blur and blending need browser and device evaluation.
- Keep visual nodes stable and retarget CSS opacity/transform from the current computed appearance. For overlapping content, select semantics immediately and make inactive layers inert and hidden from assistive technology. Keep exiting layers non-interactive even while they remain briefly visible.
- Give input a visible consequence: transmission changes a surface, leading changes type spacing, a preview changes composition. Keep a committed-state ghost when it helps explain cancellation; it must use the confirmed value, not follow the uncommitted preview.
- Preserve contrast while changing themes. Switching a foreground/background pair together can be preferable to interpolating both through low-contrast colors. Effects remain optional in reduced motion, while values, readable content, and results stay complete.
- Inspect intermediate frames and rapid reversals as well as the final screenshot. Do not infer smoothness, contrast, or performance from the presence of a CSS transition.

The historical references contain opacity envelopes, gradient type, atmosphere, and blur/position combinations. The specific UI materials and crossfade implementation here are independently written extensions, not recovered upstream UI components.

## Apply within the current scope

Identify one visible problem and the user-visible improvement. Choose the smallest useful change, inspect its static states, perform the affected interactions, and report actual evidence. The preference is a coherent and expressive interface where the product calls for one, with structure and behavior that remain understandable.
