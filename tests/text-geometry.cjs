/* Verify geometry and chain continuity, independently of screenshots. */
const assert = require('node:assert/strict');
const { timeline, point, project, HANDOFF, DURATION } = require('../examples/text-geometry.js');
let assertions = 0;
function near(actual, expected, label) { assert.ok(Math.abs(actual - expected) < 1e-10, `${label}: ${actual} vs ${expected}`); assertions++; }
for (let i = 0; i < 301; i++) {
  const sample = { x1: Math.sin(i * .7) * .44, x2: Math.cos(i * .31) * .46, x3: Math.sin(i * .17 + 1) * .42, y: (i / 300 - .5) * .2 };
  const a = point(sample, 0), b = point(sample, 1);
  near(project(a, 0).x, sample.x1, 'front reads text 1');
  near(project(a, Math.PI / 2).x, sample.x2, 'first side reads text 2');
  near(project(b, Math.PI / 2).x, sample.x2, 'second front retains text 2');
  near(project(b, Math.PI).x, sample.x3, 'second side reads text 3');
  for (const yaw of [0, .3, 1.1, Math.PI / 2, 2.1, Math.PI]) near(project(a, yaw).y, sample.y, 'rotation keeps height');
  near(project(a, Math.PI / 2).x, project(b, Math.PI / 2).x, 'bridge identity');
  assert.notEqual(a.x, b.x); // Pair geometry changes in the hidden axis, not on screen.
}
assert.equal(timeline(HANDOFF - 1e-5).pair, 0);
assert.equal(timeline(HANDOFF).pair, 1);
near(timeline(HANDOFF - .01).angle, Math.PI / 2, 'before handoff hold');
near(timeline(HANDOFF + .01).angle, Math.PI / 2, 'after handoff hold');
near(timeline(0).angle, 0, 'start');near(timeline(DURATION).angle, Math.PI, 'end');
assert.equal(timeline(4).turning, true);assert.equal(timeline(10).turning, true);assert.equal(timeline(HANDOFF).turning, false);
for (let t = 0; t < DURATION; t += .02) assert.ok(timeline(t + .02).angle >= timeline(t).angle);
for (const t of [0, 4.3, HANDOFF, 11, 16]) assert.deepEqual(timeline(t), timeline(t));
console.log(`PASS: paired text endpoints, shared bridge, fixed height, monotonic camera and arbitrary seek (${assertions} numeric assertions).`);
