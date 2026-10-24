/* SPDX-License-Identifier: MIT — independent mathematical geometry and renderer. */
(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const stage = $("wire-stage");
  const canvas = $("wire-canvas");
  const context = canvas.getContext("2d");
  const buttons = [$("theme-day"), $("theme-night")];
  const media = matchMedia("(prefers-reduced-motion: reduce)");
  const lifecycle = new AbortController();
  const on = (node, event, handler) => node.addEventListener(event, handler, { signal: lifecycle.signal });
  const reduced = () => media.matches || $("reduce-motion").checked;
  let value = 0;
  let velocity = 0;
  let target = 0;
  let frame = 0;
  let last = 0;
  let width = 1;
  let height = 1;
  let unavailable = !context;
  let disposed = false;
  let inView = true;
  // Authored curve pairs share their Y coordinate. Orthographic rotation reveals
  // a circle in XY and a crescent in ZY. No model, solver, or asset is imported.
  const curves = Array.from({ length: 28 }, (_, layer) => {
    const radius = .74 + layer * .012;
    return Array.from({ length: 181 }, (_, i) => {
      const angle = i / 180 * Math.PI * 2;
      const s = Math.sin(angle);
      const profile = s >= 0 ? Math.abs(s) : Math.sqrt(1.49 - Math.cos(angle) ** 2) - .7;
      return [radius * s, radius * Math.cos(angle), radius * (.35 - profile)];
    });
  });
  function draw() {
    if (disposed) return;
    stage.dataset.progress = value.toFixed(6);
    stage.dataset.angle = (value * 90).toFixed(3);
    if (!context || unavailable) return;
    context.clearRect(0, 0, width, height);
    const night = target === 1;
    const angle = value * Math.PI / 2;
    const sin = Math.sin(angle), cos = Math.cos(angle);
    const scale = Math.min(width * .27, height * .35);
    const centerY = height * .45;
    context.strokeStyle = night ? "rgba(203,227,180,.12)" : "rgba(69,86,59,.14)";
    context.lineWidth = .7;
    context.beginPath();
    context.ellipse(width / 2, centerY + scale * 1.12, Math.min(width * .35, scale * 2.2), scale * .15, 0, 0, Math.PI * 2);
    context.stroke();
    // Sort complete loops by depth to keep the fine metal-like strokes coherent.
    const sorted = curves.map(curve => ({ curve, depth: curve.reduce((sum, [x, , z]) => sum + x * sin + z * cos, 0) / curve.length })).sort((a, b) => a.depth - b.depth);
    sorted.forEach(({ curve, depth }) => {
      context.beginPath();
      curve.forEach(([x, y, z], i) => {
        const px = width / 2 + (x * cos - z * sin) * scale;
        const py = centerY - y * scale;
        if (i === 0) context.moveTo(px, py); else context.lineTo(px, py);
      });
      context.closePath();
      const alpha = Math.max(.35, Math.min(.9, .58 + depth * .26));
      context.strokeStyle = night ? `rgba(210,231,169,${alpha})` : `rgba(153,76,39,${alpha})`;
      context.lineWidth = night ? .9 : .85;
      context.stroke();
    });
  }
  function resize() {
    const rect = stage.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    if (context && !unavailable) context.setTransform(ratio, 0, 0, ratio, 0, 0);
    draw();
  }
  function finish() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    value = target;
    velocity = 0;
    stage.dataset.moving = "false";
    draw();
    $("wire-status").textContent = target ? "夜间主题，月牙侧视图。" : "昼间主题，圆环正视图。";
  }
  function tick(now) {
    if (disposed) return;
    if (reduced() || document.hidden || !inView || unavailable) { finish(); return; }
    const dt = Math.min(.05, Math.max(0, (now - last) / 1000));
    last = now;
    // Exact critically damped step for a constant target over this interval.
    // Retargeting retains current position AND velocity rather than resetting.
    const omega = 11;
    const offset = value - target;
    const b = velocity + omega * offset;
    const decay = Math.exp(-omega * dt);
    value = target + (offset + b * dt) * decay;
    velocity = (velocity - omega * b * dt) * decay;
    draw();
    if (Math.abs(value - target) < .0001 && Math.abs(velocity) < .001) { finish(); return; }
    frame = requestAnimationFrame(tick);
  }
  function choose(next) {
    if (next === target) return;
    target = next;
    stage.dataset.theme = next ? "night" : "day";
    buttons.forEach((button, i) => button.setAttribute("aria-pressed", String(i === next)));
    $("wire-theme-label").textContent = next ? "夜间主题" : "昼间主题";
    if (reduced() || document.hidden || !inView || unavailable) { finish(); return; }
    stage.dataset.moving = "true";
    $("wire-status").textContent = next ? "正在转向夜间主题。" : "正在转向昼间主题。";
    // Existing motion owns its next frame; do not queue a competing controller.
    if (!frame) { last = performance.now(); frame = requestAnimationFrame(tick); }
    else draw();
  }
  buttons.forEach((button, i) => on(button, "click", () => choose(i)));
  on(media, "change", () => { if (reduced()) finish(); });
  on($("reduce-motion"), "change", () => { if (reduced()) finish(); });
  on(window, "blur", finish);
  on(document, "visibilitychange", () => { if (document.hidden) finish(); });
  on(canvas, "contextlost", event => { event.preventDefault(); unavailable = true; stage.classList.add("canvas-unavailable"); finish(); });
  on(canvas, "contextrestored", () => { unavailable = false; stage.classList.remove("canvas-unavailable"); resize(); });
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(stage);
  const visibility = new IntersectionObserver(entries => { inView = entries[0].isIntersecting; if (!inView) finish(); });
  visibility.observe(stage);
  on(window, "pagehide", event => {
    finish();
    if (!event.persisted) { disposed = true; resizeObserver.disconnect(); visibility.disconnect(); lifecycle.abort(); }
  });
  on(window, "pageshow", () => { if (!disposed) resize(); });
  if (unavailable) stage.classList.add("canvas-unavailable");
  resize();
})();
