/* SPDX-License-Identifier: MIT. Original deterministic film composition. */
(() => {
  const byId = id => document.getElementById(id);
  const frame = byId('product');
  const clamp = v => Math.min(1, Math.max(0, v));
  const ease = v => {v=clamp(v);return v*v*(3-2*v);};
  const mix = (a,b,p) => a+(b-a)*p;
  const scenes = [
    {id:'sculpture',start:0,end:8.5,index:'01 / 05',chapter:'A FEEL FOR INTERACTION',copy:'有分寸，也有锋芒。'},
    {id:'light',start:8.5,end:13,index:'02 / 05',chapter:'01 / LIGHT & MATERIAL',copy:'配色、透光、高光，在同一个表面相遇。'},
    {id:'type',start:13,end:17.5,index:'03 / 05',chapter:'02 / TYPE & RHYTHM',copy:'排版是关系，不只是字号。'},
    {id:'paper',start:17.5,end:22,index:'04 / 05',chapter:'03 / PAPER & PRESENCE',copy:'一张可以选择，也可以收回的收藏票。'},
    {id:'operations',start:22,end:28.5,index:'05 / 05',chapter:'04 / CONTINUITY & CONTROL',copy:'变化接得住，反悔也有余地。'},
    {id:'closing',start:28.5,end:32,index:'TACT TASTE',chapter:'GOOD TASTE. REAL FEEDBACK.',copy:'让视觉有风格，让操作有回音。'}
  ];
  let initialized = false;
  const animationBirth = new WeakMap();
  window.reelReady = new Promise((resolve,reject) => {
    frame.addEventListener('load', async () => {
      try {
        const doc=frame.contentDocument;
        await doc.fonts.ready;
        const style=doc.createElement('link');style.rel='stylesheet';style.href='../showreel/product-capture.css';
        await new Promise((yes,no)=>{style.onload=yes;style.onerror=no;doc.head.append(style);});
        doc.body.dataset.capture='sculpture';
        doc.querySelector('[data-scene-jump="0"]').click();
        initialized=true;
        resolve(true);
      } catch(error) {reject(error);}
    });
  });
  window.renderFilm = (t) => {
    if(!initialized) throw new Error('Product not ready');
    t=Math.max(0,Math.min(32,t));
    const scene=scenes.find(s=>t>=s.start&&t<s.end)||scenes.at(-1);
    const doc=frame.contentDocument;
    const local=t-scene.start;
    document.body.dataset.scene=scene.id;
    byId('chapter').textContent=scene.chapter;
    byId('scene-index').textContent=scene.index;
    byId('bottom-copy').textContent=scene.copy;
    byId('progress-fill').style.width=`${t/32*100}%`;
    byId('opening').style.opacity=1-ease((t-1.65)/.75);
    byId('opening').style.transform=`translateX(${-ease((t-1.65)/.75)*90}px)`;
    byId('opening').style.display=scene.id==='sculpture'?'block':'none';
    byId('sculpture-note').style.display=scene.id==='sculpture'?'flex':'none';
    byId('sculpture-note').style.opacity=ease((t-2.5)/.5);
    byId('closing').style.display=scene.id==='closing'?'block':'none';
    frame.style.visibility=scene.id==='closing'?'hidden':'visible';
    if(scene.id!=='closing') doc.body.dataset.capture=scene.id;
    const artEase=ease((t-1.7)/1.1);
    doc.body.style.setProperty('--art-left',`${mix(790,230,artEase)}px`);
    doc.body.style.setProperty('--art-top',`${mix(150,75,artEase)}px`);
    doc.body.style.setProperty('--art-width',`${mix(1070,1460,artEase)}px`);
    doc.body.style.setProperty('--art-height',`${mix(760,850,artEase)}px`);
    // Presentation camera only; the actual UI and control states stay in the iframe.
    let camera=1;
    if(scene.id==='light')camera=1+ease(local/4.5)*.014;
    if(scene.id==='paper')camera=1+Math.sin(clamp(local/4.5)*Math.PI)*.012;
    if(scene.id==='light'||scene.id==='type'||scene.id==='paper')camera+=(1-ease(local/.65))*.035;
    frame.style.transform=`scale(${camera})`;
    const cue=ease((t-26.1)/.12)*(1-ease((t-27.0)/.18));
    byId('escape-cue').style.opacity=cue;
    byId('escape-cue').style.transform=`translateY(${(1-cue)*12}px)`;
    if(scene.id==='closing'){
      const p=ease(local/.8);
      byId('closing').querySelector('.closing-wordmark').style.transform=`translateY(${(1-p)*35}px)`;
      byId('closing').querySelector('.closing-rule').style.transformOrigin='0 50%';
      byId('closing').querySelector('.closing-rule').style.transform=`scaleX(${mix(.45,1,p)})`;
    }
    return {scene:scene.id,t,local};
  };
  window.freezeProductAnimations = (t) => {
    const doc=frame.contentDocument;
    document.body.dataset.inverted=doc.querySelector('#type-composer').dataset.inverted;
    for(const animation of doc.getAnimations()){
      if(!animationBirth.has(animation)){
        animationBirth.set(animation,t);
        animation.pause();
      }
      animation.currentTime=Math.max(0,(t-animationBirth.get(animation))*1000);
    }
    // A style flush commits the exact interpolated state before the frame capture.
    void doc.body.offsetHeight;
  };
  window.filmCursor = (x,y,t,visible=true,clickAge=-1) => {
    const pointer=byId('cursor');pointer.style.opacity=visible?1:0;
    pointer.style.transform=`translate(${x-4}px,${y-3}px) scale(${clickAge>=0&&clickAge<.1?.9:1})`;
    const ring=byId('click-ring');const p=clamp(clickAge/.42);
    ring.style.opacity=clickAge>=0&&clickAge<.42?(1-p)*.7:0;
    ring.style.left=`${x}px`;ring.style.top=`${y}px`;
    ring.style.width=ring.style.height=`${mix(28,98,ease(p))}px`;
  };
  window.filmState = () => {
    const d=frame.contentDocument;
    return {scene:document.body.dataset.scene,palette:d.querySelector('#light-studio').dataset.palette,alpha:d.querySelector('#glass-alpha').value,layout:d.querySelector('#type-composer').dataset.layout,inverted:d.querySelector('#type-composer').dataset.inverted,ticket:d.querySelector('#ticket-number').textContent,collected:d.querySelector('#paper-walk').dataset.collected,selection:d.querySelector('#selection-demo').dataset.selection,dragValue:d.querySelector('#drag-track').getAttribute('aria-valuenow'),dragText:d.querySelector('#drag-status').textContent,dragging:d.querySelector('#drag-track').dataset.dragging,renderer:d.querySelector('#theatre').dataset.renderer,particles:d.querySelector('#theatre').dataset.particles};
  };
})();
