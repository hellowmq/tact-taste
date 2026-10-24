/* SPDX-License-Identifier: MIT — paired orthographic text projections. */
(function (root) {
  "use strict";
  const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
  const ease = value => { const p = clamp(value); return p * p * (3 - 2 * p); };
  const DURATION = 16;
  const HANDOFF = 7.6;
  const STOPS = [1.2, 7.6, 14.2];
  function timeline(seconds) {
    const time = clamp(seconds, 0, DURATION);
    const first = ease((time - 2.6) / 3.6);
    const second = ease((time - 9) / 3.6);
    const pair = time < HANDOFF ? 0 : 1;
    const angle = (first + second) * Math.PI / 2;
    const turning = (time > 2.6 && time < 6.2) || (time > 9 && time < 12.6);
    const active = time < 6.2 ? 0 : time < 12.6 ? 1 : 2;
    const local = pair === 0 ? first : second;
    const elevation = Math.sin(local * Math.PI) * .34;
    return { time, pair, angle, elevation, turning, active, local };
  }
  // A sample holds three horizontal coordinates at ONE common height.
  // Pair 12: (x1, y, -x2). Pair 23: (-x3, y, -x2).
  // At yaw PI/2 both project to (x2, y), preserving the bridge sample by sample.
  function point(sample, pair) {
    return pair === 0 ? { x: sample.x1, y: sample.y, z: -sample.x2 } : { x: -sample.x3, y: sample.y, z: -sample.x2 };
  }
  function project(point, angle, elevation = 0) {
    const cos = Math.cos(angle), sin = Math.sin(angle);
    const depth = point.x * sin + point.z * cos;
    return { x: point.x * cos - point.z * sin, y: point.y * Math.cos(elevation) - depth * Math.sin(elevation), depth: point.y * Math.sin(elevation) + depth * Math.cos(elevation) };
  }
  const api = Object.freeze({ DURATION, HANDOFF, STOPS: Object.freeze(STOPS), timeline, point, project });
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.TactTextGeometry = api;
})(globalThis);
