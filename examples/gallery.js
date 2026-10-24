/* SPDX-License-Identifier: MIT — independent controls; no service or asset dependencies. */
(() => {
  "use strict";
  const lifetime = new AbortController();
  const on = (node, event, fn) => node.addEventListener(event, fn, {signal:lifetime.signal});
  const byId = (id) => document.getElementById(id);
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const light = byId("light-studio");
  const alpha = byId("glass-alpha");
  const colors = {
    lilac: {rgb:"184,150,255",second:"255,177,141",name:"紫暮"},
    coral: {rgb:"255,145,151",second:"255,222,156",name:"珊瑚"},
    ice: {rgb:"142,214,255",second:"172,255,220",name:"冰蓝"}
  };
  function updateLight() {
    const color = colors[light.dataset.palette];
    light.style.setProperty("--light-tint",`rgb(${color.rgb})`);
    light.style.setProperty("--light-second",`rgb(${color.second})`);
    light.style.setProperty("--glass",Number(alpha.value)/100);
    byId("glass-alpha-value").value = `${alpha.value}%`;
    byId("light-status").textContent = `${color.name}，透光 ${alpha.value}%。`;
  }
  document.querySelectorAll("[data-light]").forEach(button => on(button,"click",() => {
    light.dataset.palette = button.dataset.light;
    document.querySelectorAll("[data-light]").forEach(b => b.setAttribute("aria-pressed",String(b === button)));
    updateLight();
  }));
  on(alpha,"input",updateLight);
  // Illumination has its own owner; it cannot change text, selections or time.
  on(byId("light-object"),"pointermove",event => {
    if (reduced.matches || byId("reduce-motion").checked) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.max(0,Math.min(100,(event.clientX-rect.left)/rect.width*100));
    const y = Math.max(0,Math.min(100,(event.clientY-rect.top)/rect.height*100));
    light.style.setProperty("--light-x",`${x.toFixed(1)}%`);
    light.style.setProperty("--light-y",`${y.toFixed(1)}%`);
  });
  function resetLight() {
    light.style.removeProperty("--light-x"); light.style.removeProperty("--light-y");
  }
  on(byId("light-object"),"pointerleave",resetLight);
  on(byId("light-object"),"pointercancel",resetLight);
  on(byId("reduce-motion"),"change",resetLight);
  on(reduced,"change",resetLight);

  const composer = byId("type-composer");
  const names = {bold:"大字",space:"留白",offset:"错位"};
  document.querySelectorAll(".layout-buttons button").forEach(button => on(button,"click",() => {
    composer.dataset.layout = button.dataset.layout;
    document.querySelectorAll(".layout-buttons button").forEach(b => b.setAttribute("aria-pressed",String(b === button)));
    byId("type-status").textContent = `${names[button.dataset.layout]}排版。`;
  }));
  on(byId("type-leading"),"input",event => {
    composer.querySelector(".type-art").style.setProperty("--leading",event.target.value);
    byId("type-leading-value").value = Number(event.target.value).toFixed(2).replace(/0$/,"");
  });
  on(byId("invert-type"),"click",event => {
    const inverted = composer.dataset.inverted !== "true";
    composer.dataset.inverted = String(inverted);
    event.currentTarget.setAttribute("aria-pressed",String(inverted));
  });

  const paper = byId("paper-walk");
  let number = "012";
  let collected = false;
  function ticketStatus() {
    byId("ticket-status").textContent = `${collected ? "已收藏" : "尚未收藏"}，当前票面 ${number}。`;
  }
  document.querySelectorAll("[data-ticket]").forEach(button => on(button,"click",() => {
    if (number === button.dataset.ticket) return;
    number = button.dataset.ticket;
    collected = false;
    paper.dataset.collected = "false";
    document.querySelectorAll("[data-ticket]").forEach(b => b.setAttribute("aria-pressed",String(b === button)));
    byId("ticket-number").textContent = number;
    byId("paper-ticket").setAttribute("aria-label",`纸上漫游收藏票 ${number}`);
    byId("collect-ticket").textContent = "收下这张票";
    byId("collect-ticket").setAttribute("aria-pressed","false");
    ticketStatus();
  }));
  on(byId("collect-ticket"),"click",event => {
    collected = !collected;
    paper.dataset.collected = String(collected);
    event.currentTarget.setAttribute("aria-pressed",String(collected));
    event.currentTarget.textContent = collected ? "已收下 · 撤回" : "收下这张票";
    ticketStatus();
  });
  on(byId("paper-ticket"),"pointermove",event => {
    if (reduced.matches || byId("reduce-motion").checked) return;
    const rect=event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--foil-angle",`${((event.clientX-rect.left)/rect.width*180).toFixed(1)}deg`);
  });
  on(byId("paper-ticket"),"pointerleave",() => byId("paper-ticket").style.removeProperty("--foil-angle"));
  on(window,"blur",resetLight);
  on(window,"pagehide",event => { resetLight(); if (!event.persisted) lifetime.abort(); });
  updateLight();
})();
