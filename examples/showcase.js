/* SPDX-License-Identifier: MIT — original, deterministic motion piece for tact-taste. */
(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const stage = $("theatre");
  const canvas = $("motion-canvas");
  let renderer = null;
  try { renderer = window.TactParticleRenderer.create(canvas); } catch (error) { stage.dataset.rendererError = error.message; }
  const seek = $("scene-seek");
  const play = $("play");
  const replay = $("replay");
  const note = $("playback-note");
  const status = $("showcase-status");
  const jumpButtons = [...document.querySelectorAll("[data-scene-jump]")];
  const motionQuery = matchMedia("(prefers-reduced-motion: reduce)");
  const lifecycle = new AbortController();
  const on = (target, type, handler) => target.addEventListener(type, handler, { signal: lifecycle.signal });
  const G = window.TactTextGeometry;
  const duration = G.DURATION;
  const names = ["让界面有层次", "让变化有来处", "让操作有回音"];
  const descriptions = [
    "用布局、留白和排版，让重要的内容先被看见。",
    "同一组粒子转过一个视角，上一句成为下一句的来处。",
    "让输入、等待与结果，拥有清楚且有分寸的回应。"
  ];
  const english = ["SEE THE ORDER.", "FOLLOW THE CHANGE.", "FEEL THE RESPONSE."];
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  let time = 1.2;
  let playing = false;
  let frame = 0;
  let width = 1;
  let height = 1;
  let originTime = time;
  let originClock = 0;
  let scrub = null;
  let unavailable = !renderer;
  let interacted = false;
  let light = null;
  let pointData = new Float32Array(0);
  let disposed = false;
  let inView = true;
  let samples = [];
  let pairs = [[], []];
  let projected = [];
  const reduced = () => motionQuery.matches || $("reduce-motion").checked;

  function buildGeometry() {
    const sampler = document.createElement("canvas");
    sampler.width = 1080;
    sampler.height = 640;
    const ctx = sampler.getContext("2d", { willReadFrequently: true });
    if (!ctx) { unavailable = true; return; }
    const masks = names.map(text => {
      ctx.clearRect(0, 0, sampler.width, sampler.height);
      ctx.fillStyle = "#fff";
      ctx.font = '600 234px "PingFang SC", "Microsoft YaHei", sans-serif';
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      ctx.fillText(text.slice(0, 3), 540, 265);
      ctx.fillText(text.slice(3), 540, 540);
      return ctx.getImageData(0, 0, sampler.width, sampler.height).data;
    });
    samples = [];
    let previous = [];
    let usedRows = 0;
    // A common height is essential: no averaging of different Y coordinates.
    // The three authored phrases share the glyph 让 and a common cap-height.
    for (let y = 30; y < 575; y += 3) {
      const rows = masks.map(pixels => {
        const xs = [];
        for (let x = 0; x < 1080; x += 3) if (pixels[(y * 1080 + x) * 4 + 3] > 110) xs.push(x);
        return xs;
      });
      if (rows.some(row => !row.length)) continue;
      const count = Math.max(...rows.map(row => row.length));
      const offsetB = Math.floor((.35 + Math.sin(y * .037) * .19) * count);
      const offsetC = Math.floor((.41 + Math.cos(y * .031) * .22) * count);
      const current = [];
      for (let i = 0; i < count; i++) {
        const indexes = [i, (i + offsetB) % count, (count - 1 - i + offsetC) % count];
        const xs = rows.map((row, n) => (row[Math.floor(indexes[n] / count * row.length)] - 540 + Math.sin((samples.length + 1) * (n + 3) * 1.27) * .65) / 1080);
        const link = previous.length ? previous[Math.min(previous.length - 1, Math.floor(i / count * previous.length))] : -1;
        current.push(samples.length);
        samples.push({ x1: xs[0], x2: xs[1], x3: xs[2], y: (y - 310 + Math.sin(samples.length * 1.71) * .6) / 1080, link });
      }
      previous = current;
      usedRows++;
    }
    if (!samples.length) { unavailable = true; return; }
    pairs = [samples.map(sample => G.point(sample, 0)), samples.map(sample => G.point(sample, 1))];
    projected = new Array(samples.length);
    pointData = new Float32Array(samples.length * 7);
    stage.dataset.renderer = renderer ? renderer.kind : "text-fallback";
    stage.dataset.particles = String(samples.length);
    stage.dataset.rows = String(usedRows);
    stage.dataset.geometry = "paired-12-23";
  }

  function draw() {
    if (disposed) return;
    const state = G.timeline(time);
    stage.dataset.scene = String(state.active);
    stage.dataset.pair = state.pair === 0 ? "1-2" : "2-3";
    stage.dataset.angle = (state.angle * 180 / Math.PI).toFixed(4);
    stage.dataset.phase = state.turning ? "turn" : "read";
    stage.dataset.elevation = state.elevation.toFixed(6);
    stage.dataset.time = time.toFixed(3);
    seek.value = String(time);
    seek.setAttribute("aria-valuetext", `${time.toFixed(1)} 秒，共 16 秒，${names[state.active]}`);
    $("scene-label").textContent = state.turning ? state.pair === 0 ? "01 → 02" : "02 → 03" : `0${state.active + 1} / ${english[state.active]}`;
    $("pair-label").textContent = state.pair === 0 ? "文本 1 · 2 / 同一件线雕" : "文本 2 · 3 / 同一件线雕";
    $("play-time").value = `00:${String(Math.floor(time)).padStart(2, "0")} / 00:16`;
    $("stage-progress-fill").style.width = `${time / duration * 100}%`;
    jumpButtons.forEach((button, i) => button.setAttribute("aria-pressed", String(i === state.active)));
    $("context-index").textContent = `0${state.active + 1}`;
    $("context-copy").textContent = descriptions[state.active];
    $("semantic-text").textContent = names[state.active];
    $("fallback-text").textContent = names[state.active];
    $("fallback-text").hidden = !unavailable;
    if (unavailable || !renderer || !samples.length) return;
    let scale = width * .98;
    const centerY = height * .48;
    const volume = Math.sin(state.local * Math.PI);
    const positions = pairs[state.pair];
    let extentX = .001, extentY = .001;
    for (let i = 0; i < positions.length; i++) {
      const p = G.project(positions[i], state.angle, state.elevation);
      projected[i] = p;
      extentX = Math.max(extentX, Math.abs(p.x));
      extentY = Math.max(extentY, Math.abs(p.y));
    }
    scale = Math.min(scale, width * .44 / (extentX * 1.18), height * .37 / extentY);
    stage.dataset.cameraScale = scale.toFixed(6);
    const diameter = Math.max(1.05, Math.min(4.0, width / 360));
    for (let i = 0; i < projected.length; i++) {
      const p = projected[i];
      p.x = width * .5 + p.x * scale * 1.18;
      p.y = centerY + p.y * scale;
      const seed = Math.abs(Math.sin(i * 12.9898 + 78.233) * 43758.5453) % 1;
      const depthLight = 1 - volume * Math.max(0, p.depth) * 1.05;
      const fixedLight = .61 + .21 * Math.sin(p.x / width * 5.2 - p.y / height * 3.1) + seed * .23;
      const distance = light ? Math.hypot((p.x / width - light.x) * 1.5, p.y / height - light.y) : 1;
      const pointerLight = light ? Math.max(0, 1 - distance * 3) * .25 : 0;
      const brightness = Math.min(1.15, (fixedLight + pointerLight) * depthLight);
      const warm = seed > .963;
      const k = i * 7;
      pointData[k] = p.x / width * 2 - 1;
      pointData[k + 1] = 1 - p.y / height * 2;
      pointData[k + 2] = diameter * (.65 + seed * .65) * (warm ? 1.35 : 1) * (1 - volume * p.depth * .55);
      pointData[k + 3] = brightness * (warm ? 1 : .85);
      pointData[k + 4] = brightness * (warm ? .57 : .95);
      pointData[k + 5] = brightness * (warm ? .39 : .89);
      pointData[k + 6] = seed;
    }
    const wires = [];
    const wireAlpha = .055 + volume * volume * .33;
    for (let i = 0; i < samples.length; i += 2) {
      const other = samples[i].link;
      if (other < 0) continue;
      const a = projected[i], b = projected[other];
      if (Math.abs(a.x - b.x) > Math.min(width * .12, 115)) continue;
      const alpha = wireAlpha * (1 - volume * Math.max(0, a.depth) * .4);
      wires.push(a.x / width * 2 - 1, 1 - a.y / height * 2, .53, .83, .75, alpha,
        b.x / width * 2 - 1, 1 - b.y / height * 2, .53, .83, .75, alpha);
    }
    // A few longer, fixed spatial filaments tie the point field into a sculpture.
    // At the common 90-degree view their control points also share Y and Z.
    for (let i = 150; i < samples.length; i += 71) {
      let other = i;
      for (let step = 0; step < 26 && other >= 0; step++) other = samples[other].link;
      if (other < 0) continue;
      const a = positions[i], b = positions[other];
      const pa = projected[i], pb = projected[other];
      if (Math.hypot(pa.x-pb.x,pa.y-pb.y) > width * .32) continue;
      const bend = Math.sin(i * 1.71);
      const control = { x: (a.x+b.x)/2, y: (a.y+b.y)/2 + .028*bend, z: (a.z+b.z)/2 + .034*Math.cos(i) };
      let previous = pa;
      for (let j = 1; j <= 8; j++) {
        const t=j/8, u=1-t;
        const p=G.project({x:u*u*a.x+2*u*t*control.x+t*t*b.x,y:u*u*a.y+2*u*t*control.y+t*t*b.y,z:u*u*a.z+2*u*t*control.z+t*t*b.z},state.angle,state.elevation);
        const next={x:width*.5+p.x*scale*1.18,y:centerY+p.y*scale};
        wires.push(previous.x/width*2-1,1-previous.y/height*2,.42,.78,.71,.08 + volume*.2,next.x/width*2-1,1-next.y/height*2,.42,.78,.71,.08 + volume*.2);
        previous=next;
      }
    }
    renderer.draw(pointData, new Float32Array(wires));
  }

  function resize() {
    const rect = stage.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    if (renderer && !unavailable) renderer.resize(ratio);
    draw();
  }
  function syncControls() {
    stage.dataset.playing = String(playing);
    play.textContent = playing ? "暂停" : time >= duration ? "再看一遍" : "播放";
    play.setAttribute("aria-pressed", String(playing));
    play.disabled = reduced() || unavailable;
    replay.disabled = reduced() || unavailable;
    seek.disabled = reduced() || unavailable;
    note.textContent = unavailable ? "图形暂不可用，保留静态标题；可继续操作下方示例。" : reduced() ? "静态阅读：选择任一句，直接查看完整文字。" : "文本 1 → 2，再由文本 2 → 3。拖动可反向观看。";
  }
  function tick(now) {
    if (!playing || disposed) return;
    time = clamp(originTime + (now - originClock) / 1000, 0, duration);
    draw();
    if (time >= duration) {
      playing = false;
      frame = 0;
      syncControls();
      status.textContent = "作品已结束，可重播或反向探索。";
      return;
    }
    frame = requestAnimationFrame(tick);
  }
  function setPlaying(value) {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    playing = Boolean(value && !reduced() && !unavailable && !document.hidden && inView && !disposed);
    if (playing) {
      if (time >= duration) time = 0;
      originTime = time;
      originClock = performance.now();
      frame = requestAnimationFrame(tick);
    }
    syncControls();
  }
  function endScrub(commit, resume = true) {
    if (!scrub) return;
    const old = scrub;
    scrub = null;
    if (!commit) time = old.time;
    try { if (seek.hasPointerCapture(old.pointer)) seek.releasePointerCapture(old.pointer); } catch { /* Owner was cleared first. */ }
    draw();
    setPlaying(resume && old.playing);
    status.textContent = commit ? "已跳转到所选进度。" : "已取消拖动，回到原进度。";
  }
  on(play, "click", () => { interacted = true; setPlaying(!playing); status.textContent = playing ? "正在播放，可随时暂停或拖动时间轴。" : "已暂停。"; });
  on(replay, "click", () => { interacted = true; endScrub(false, false); time = 0; draw(); setPlaying(true); status.textContent = "从头播放。"; });
  jumpButtons.forEach((button, i) => on(button, "click", () => {
    interacted = true;
    endScrub(false, false);
    setPlaying(false);
    time = G.STOPS[i];
    draw();
    syncControls();
    status.textContent = `已选择第 ${i + 1} 句：${names[i]}。`;
  }));
  on(seek, "pointerdown", (event) => {
    if (scrub || !event.isPrimary || event.button !== 0) return;
    interacted = true;
    scrub = { pointer: event.pointerId, time, playing };
    setPlaying(false);
    try { seek.setPointerCapture(event.pointerId); } catch { endScrub(false, false); }
  });
  on(seek, "input", () => {
    interacted = true;
    if (!scrub) setPlaying(false);
    time = clamp(Number(seek.value), 0, duration);
    draw();
    syncControls();
  });
  on(seek, "pointerup", (event) => {
    if (scrub?.pointer !== event.pointerId) return;
    const rect = seek.getBoundingClientRect();
    const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
    endScrub(inside);
  });
  on(seek, "pointercancel", (event) => { if (scrub?.pointer === event.pointerId) endScrub(false, false); });
  on(seek, "lostpointercapture", (event) => { if (scrub?.pointer === event.pointerId) endScrub(false, false); });
  on(document, "keydown", (event) => {
    if (event.key === "Escape" && scrub) { event.preventDefault(); endScrub(false); }
  });
  function suspend() { endScrub(false, false); setPlaying(false); }
  function motionChanged() {
    interacted = true;
    suspend();
    if (reduced()) time = G.STOPS[G.timeline(time).active];
    draw();
    syncControls();
  }
  on($("reduce-motion"), "change", motionChanged);
  on(motionQuery, "change", motionChanged);
  on(window, "blur", suspend);
  on(document, "visibilitychange", () => { if (document.hidden) suspend(); });
  function loseContext(event) {
    event.preventDefault();
    unavailable = true;
    stage.classList.add("canvas-unavailable");
    suspend();
    draw();
  }
  function restoreContext() {
    try { renderer.restore(); unavailable = false; } catch { unavailable = true; }
    stage.classList.remove("canvas-unavailable");
    resize();
    syncControls();
  }
  ["contextlost", "webglcontextlost"].forEach(name => on(canvas, name, loseContext));
  ["contextrestored", "webglcontextrestored"].forEach(name => on(canvas, name, restoreContext));
  const observer = new ResizeObserver(resize);
  observer.observe(stage);
  const visibility = new IntersectionObserver((entries) => {
    inView = entries[0].isIntersecting;
    if (!inView) suspend();
  });
  visibility.observe(stage);
  function dispose() {
    suspend();
    disposed = true;
    observer.disconnect();
    visibility.disconnect();
    lifecycle.abort();
    if (renderer) renderer.dispose();
  }
  on(window, "pagehide", (event) => { suspend(); if (!event.persisted) dispose(); });
  on(window, "pageshow", () => { if (!disposed) { resize(); syncControls(); } });
  on(stage, "pointermove", (event) => {
    const rect = stage.getBoundingClientRect();
    light = { x: (event.clientX - rect.left) / rect.width, y: (event.clientY - rect.top) / rect.height };
    if (!playing) draw();
  });
  on(stage, "pointerleave", () => { light = null; if (!playing) draw(); });
  if (unavailable) stage.classList.add("canvas-unavailable");
  buildGeometry();
  resize();
  syncControls();
  // Fixed system-font sampling is rebuilt once fonts settle, never per frame.
  document.fonts.ready.then(() => {
    if (!disposed) {
      buildGeometry(); resize(); syncControls();
      if (!interacted && !reduced()) setPlaying(true);
    }
  });
})();
