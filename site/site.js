/* SPDX-License-Identifier: MIT — presentation state is separate from the exhibits. */
(() => {
  "use strict";
  const lifecycle = new AbortController();
  const on = (node, type, handler) => node.addEventListener(type, handler, {signal:lifecycle.signal});
  const byId = id => document.getElementById(id);
  on(byId("reduce-motion"),"change",event => document.documentElement.classList.toggle("motion-off",event.target.checked));

  function tabGroup(tabs, render) {
    let selected = 0;
    function select(index, focus = false) {
      if (index !== selected) {
        selected = index;
        tabs.forEach((tab,i) => {
          const active = i === index;
          tab.setAttribute("aria-selected",String(active));
          tab.tabIndex = active ? 0 : -1;
          const panel = byId(tab.getAttribute("aria-controls"));
          panel.hidden = !active;
          panel.inert = !active;
        });
        render(index);
      }
      if (focus) tabs[index].focus();
    }
    tabs.forEach((tab,index) => {
      on(tab,"click",() => select(index));
      on(tab,"keydown",event => {
        let next;
        if (event.key === "ArrowRight") next = (index+1)%tabs.length;
        if (event.key === "ArrowLeft") next = (index+tabs.length-1)%tabs.length;
        if (event.key === "Home") next = 0;
        if (event.key === "End") next = tabs.length-1;
        if (next === undefined) return;
        event.preventDefault(); select(next,true);
      });
    });
  }
  tabGroup([...document.querySelectorAll('.specimen-tabs [role="tab"]')],index => {
    document.querySelector(".specimen-indicator").style.transform = `translateX(${index*100}%)`;
  });
  let host = 0;
  let copyGeneration = 0;
  const status = byId("copy-status");
  tabGroup([...document.querySelectorAll('.host-tabs [role="tab"]')],index => {
    host = index;
    byId("skill-invocation").textContent = index === 0 ? "$tact-taste" : "/tact-taste";
    copyGeneration++;
    status.textContent = "";
  });
  on(byId("copy-command"),"click",async () => {
    const request = ++copyGeneration;
    const hostName = host === 0 ? "Codex" : "Claude Code";
    const folder = host === 0 ? ".codex" : ".claude";
    const command = `python3 scripts/install.py --to "$HOME/${folder}/skills/tact-taste"`;
    try {
      if (!navigator.clipboard?.writeText) throw new Error("clipboard unavailable");
      await navigator.clipboard.writeText(command);
      if (request === copyGeneration && !lifecycle.signal.aborted) status.textContent = `已复制 ${hostName} 命令`;
    } catch {
      if (request === copyGeneration && !lifecycle.signal.aborted) status.textContent = "可选择上方命令复制";
    }
  });
  on(window,"pagehide",event => {
    copyGeneration++;
    if (!event.persisted) lifecycle.abort();
  });
})();
