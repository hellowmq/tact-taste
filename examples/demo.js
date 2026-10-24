/* SPDX-License-Identifier: MIT — new examples written for tact-taste. */
(() => {
  "use strict";
  const byId = (id) => document.getElementById(id);
  const lifecycle = new AbortController();
  const signal = lifecycle.signal;
  const listen = (node, event, handler) => node.addEventListener(event, handler, { signal });

  listen(byId("reduce-motion"), "change", (event) => {
    document.documentElement.classList.toggle("motion-off", event.target.checked);
  });

  const tabs = [...document.querySelectorAll('.tabs [role="tab"]')];
  const indicator = document.querySelector(".tab-indicator");
  const panels = tabs.map(tab => byId(tab.getAttribute("aria-controls")));
  panels.forEach((panel,i) => {
    panel.hidden = false;
    panel.setAttribute("aria-hidden",String(i !== 0));
    panel.inert = i !== 0;
  });
  let selected = 0;
  function select(index) {
    if (index === selected) return;
    selected = index;
    tabs.forEach((tab, i) => {
      tab.setAttribute("aria-selected", String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
      panels[i].setAttribute("aria-hidden",String(i !== index));
      panels[i].inert = i !== index;
    });
    indicator.style.transform = `translateX(${index * 100}%)`;
    byId("selection-demo").dataset.selection = String(index);
  }
  tabs.forEach((tab, index) => {
    listen(tab, "click", () => select(index));
    listen(tab, "keydown", (event) => {
      let next;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft") next = (index + tabs.length - 1) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      select(next);
      tabs[next].focus();
    });
  });

  const saveValue = byId("save-value");
  const saveStatus = byId("save-status");
  const confirmedValue = byId("confirmed-value");
  const retry = byId("retry");
  const result = document.querySelector(".result");
  const saveEditor = byId("save-editor");
  const timers = new Set();
  let generation = 0;
  let failedIntent = null;
  listen(saveValue, "input", () => {
    byId("save-value-label").value = saveValue.value;
    document.querySelector(".save-preview").style.setProperty("--read-width",`${50+Number(saveValue.value)*.5}%`);
  });

  function save(value) {
    const request = ++generation;
    const shouldFail = byId("fail-next").checked;
    byId("fail-next").checked = false;
    const delay = [900, 250, 600][(request - 1) % 3];
    failedIntent = null;
    retry.hidden = true;
    saveEditor.setAttribute("aria-busy", "true");
    result.dataset.state = "pending";
    saveStatus.textContent = `正在模拟保存 ${value}…`;
    // This delayed response is a visibly labeled local simulation, not a backend.
    const timer = setTimeout(() => {
      timers.delete(timer);
      if (request !== generation || signal.aborted) return;
      saveEditor.setAttribute("aria-busy", "false");
      if (shouldFail) {
        failedIntent = value;
        result.dataset.state = "failed";
        saveStatus.textContent = `模拟保存 ${value} 失败，已确认值保持不变。`;
        retry.textContent = `重试保存 ${value}`;
        retry.hidden = false;
      } else {
        confirmedValue.value = String(value);
        result.dataset.state = "confirmed";
        saveStatus.textContent = `模拟保存 ${value} 已确认。`;
      }
    }, delay);
    timers.add(timer);
  }
  listen(byId("save"), "click", () => save(Number(saveValue.value)));
  listen(retry, "click", () => {
    if (failedIntent !== null) save(failedIntent);
  });

  const track = byId("drag-track");
  const dragValue = byId("drag-value");
  const dragStatus = byId("drag-status");
  let confirmed = 35;
  let preview = confirmed;
  let owner = null;

  function draw(value, isPreview) {
    preview = value;
    track.style.setProperty("--value", value);
    track.setAttribute("aria-valuenow", String(value));
    track.setAttribute("aria-valuetext", `${value}，${isPreview ? "预览中" : "已确认"}`);
    dragValue.value = String(value);
  }
  function positionAt(clientX) {
    const rect = track.getBoundingClientRect();
    return Math.round(Math.max(0, Math.min(100, (clientX - rect.left - 22) / Math.max(1, rect.width - 44) * 100)));
  }
  function finish(commit, message) {
    if (owner === null) return;
    const pointerId = owner;
    owner = null;
    if (commit) confirmed = preview;
    track.style.setProperty("--confirmed",confirmed);
    track.dataset.dragging = "false";
    draw(confirmed, false);
    dragStatus.textContent = message || (commit ? `已确认位置 ${confirmed}` : `已取消，回到位置 ${confirmed}`);
    try {
      if (track.hasPointerCapture(pointerId)) track.releasePointerCapture(pointerId);
    } catch {
      // Ownership is already cleared; a release failure cannot leave a gesture live.
    }
  }

  listen(track, "pointerdown", (event) => {
    if (owner !== null || !event.isPrimary || event.button !== 0) return;
    event.preventDefault();
    track.focus({ preventScroll: true });
    owner = event.pointerId;
    track.dataset.dragging = "true";
    try {
      track.setPointerCapture(owner);
    } catch {
      finish(false, "无法开始拖动，可使用方向键调整。");
      return;
    }
    draw(positionAt(event.clientX), true);
    dragStatus.textContent = "预览中，松手确认；Escape 取消。";
  });
  listen(track, "pointermove", (event) => {
    if (event.pointerId === owner) draw(positionAt(event.clientX), true);
  });
  listen(track, "pointerup", (event) => {
    if (event.pointerId !== owner) return;
    const rect = track.getBoundingClientRect();
    const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
    if (inside) draw(positionAt(event.clientX), true);
    finish(inside);
  });
  listen(track, "pointercancel", (event) => { if (event.pointerId === owner) finish(false); });
  listen(track, "lostpointercapture", (event) => { if (event.pointerId === owner) finish(false); });
  listen(document, "keydown", (event) => {
    if (event.key === "Escape" && owner !== null) {
      event.preventDefault();
      finish(false);
    }
  });
  listen(track, "keydown", (event) => {
    let next;
    if (event.key === "ArrowRight" || event.key === "ArrowUp") next = Math.min(100, confirmed + 5);
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") next = Math.max(0, confirmed - 5);
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = 100;
    if (next === undefined) return;
    event.preventDefault();
    finish(false);
    confirmed = next;
    track.style.setProperty("--confirmed",confirmed);
    draw(next, false);
    dragStatus.textContent = `已确认位置 ${next}`;
  });
  listen(track, "blur", () => finish(false));
  listen(window, "blur", () => finish(false));
  listen(document, "visibilitychange", () => { if (document.hidden) finish(false); });

  function dispose() {
    finish(false);
    generation += 1;
    timers.forEach(clearTimeout);
    timers.clear();
    saveEditor.setAttribute("aria-busy", "false");
    lifecycle.abort();
  }
  // A bfcache page is suspended rather than destroyed. Cancel its preview but
  // retain event handlers so it remains usable on history restoration.
  listen(window, "pagehide", (event) => {
    finish(false);
    if (!event.persisted) dispose();
  });
})();
