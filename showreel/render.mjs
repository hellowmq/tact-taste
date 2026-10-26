/* SPDX-License-Identifier: MIT. Offline browser-frame renderer and interaction proof. */
import {createRequire} from 'node:module';
import {writeFile,mkdir,readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {spawn,execFileSync} from 'node:child_process';
import {once} from 'node:events';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const require=createRequire(import.meta.url);
const {chromium}=require('playwright');
const here=path.dirname(fileURLToPath(import.meta.url));
const project=path.resolve(here,'..');
const stills=process.argv.includes('--stills');
const fps=30,duration=32,total=fps*duration;
const out=path.join(project,'dist/showreel');
await mkdir(out,{recursive:true});
const proof=path.join(out,'proof');await mkdir(proof,{recursive:true});
const errors=[],warnings=[],requests=[],events=[],clickChecks=[];
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1920,height:1080},deviceScaleFactor:1,reducedMotion:'no-preference'});
const page=await context.newPage();
page.on('pageerror',e=>errors.push(e.message));
page.on('console',m=>{if(m.type()==='error')errors.push(m.text());if(m.type()==='warning')warnings.push(m.text());});
page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:54757/')&&!r.url().startsWith('data:'))requests.push(r.url());});
page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
await page.clock.install({time:new Date('2026-10-25T00:00:00Z')});
await page.clock.pauseAt(new Date('2026-10-25T00:00:02Z'));
await page.goto('http://127.0.0.1:54757/showreel/');
await page.evaluate(()=>window.reelReady);
await page.clock.runFor(400);
await page.waitForFunction(()=>Number(document.querySelector('#product').contentDocument.querySelector('#theatre').dataset.particles)>1000);
const iframe=page.frameLocator('#product');

// All pointer coordinates are derived from the actual rendered DOM, including film camera transforms.
const anchors=[
  {f:255,x:1350,y:850},{f:270,sel:'[data-light="coral"]'},{f:285,sel:'[data-light="coral"]',click:true},
  {f:300,sel:'#glass-alpha',range:.64,down:true},
  {f:320,sel:'#glass-alpha',range:.16},{f:339,sel:'#glass-alpha',range:.88,up:true},
  {f:360,sel:'[data-light="ice"]',click:true},{f:376,sel:'#light-object',rx:.65,ry:.38},
  {f:390,x:1450,y:800},{f:420,sel:'[data-layout="space"]',click:true},
  {f:447,sel:'[data-layout="offset"]',click:true},{f:474,sel:'#invert-type',click:true},
  {f:501,sel:'[data-layout="bold"]',click:true},{f:525,x:600,y:850},
  {f:549,sel:'[data-ticket="024"]',click:true},{f:573,sel:'#collect-ticket',click:true},
  {f:609,sel:'#collect-ticket',click:true},{f:636,sel:'[data-ticket="036"]',click:true},
  {f:660,x:850,y:830},{f:684,sel:'#tab-continuity',click:true},
  {f:696,sel:'#tab-control',click:true},{f:708,sel:'#tab-feedback',click:true},
  {f:723,sel:'#tab-control',click:true},{f:747,sel:'#drag-track',track:.35,down:true},
  {f:771,sel:'#drag-track',track:.78},{f:784,sel:'#drag-track',track:.78,escape:true},
  {f:786,sel:'#drag-track',track:.78,up:true},{f:798,sel:'#drag-track',track:.35},
  {f:810,sel:'#drag-track',track:.35,down:true},{f:831,sel:'#drag-track',track:.62},
  {f:837,sel:'#drag-track',track:.62,up:true},{f:851,x:1690,y:725}
];
const important=new Map([
 [0,'01-opening'],[52,'02-opening-settled'],[100,'03-sculpture-volume'],[153,'04-shared-view'],[204,'05-second-turn'],[244,'06-third-phrase'],
 [255,'07-light-cut'],[295,'08-coral-response'],[325,'09-alpha-drag'],[374,'10-ice-response'],
 [390,'11-type-cut'],[433,'12-type-space'],[462,'13-type-offset'],[491,'14-type-inverted'],
 [525,'15-paper-cut'],[596,'16-ticket-collected'],[626,'17-ticket-withdrawn'],
 [660,'18-operations-cut'],[702,'19-selection-reversal'],[741,'20-control-reading'],
 [779,'21-drag-preview'],[794,'22-drag-cancelled'],[849,'23-drag-committed'],
 [855,'24-closing-cut'],[912,'25-closing-settled'],[959,'26-final-frame']
]);
async function coords(anchor){
 if(!anchor.sel)return{x:anchor.x,y:anchor.y};
 return await page.evaluate(a=>{
  const frame=document.querySelector('#product');const outer=frame.getBoundingClientRect();
  const el=frame.contentDocument.querySelector(a.sel);if(!el)throw new Error('Missing target '+a.sel);
  const r=el.getBoundingClientRect();if(!r.width||!r.height)throw new Error('Invisible target '+a.sel);
  let x=r.left+r.width*(a.rx??.5),y=r.top+r.height*(a.ry??.5);
  if(a.range!==undefined)x=r.left+12+(r.width-24)*a.range;
  if(a.track!==undefined)x=r.left+22+(r.width-44)*a.track;
  return{x:outer.left+x*outer.width/frame.clientWidth,y:outer.top+y*outer.height/frame.clientHeight,box:{x:outer.left+r.left*outer.width/frame.clientWidth,y:outer.top+r.top*outer.height/frame.clientHeight,w:r.width*outer.width/frame.clientWidth,h:r.height*outer.height/frame.clientHeight}};
 },anchor);
}
function curve(p){p=Math.min(1,Math.max(0,p));return p*p*(3-2*p);}
function sceneFor(f){return f<255?'sculpture':f<390?'light':f<525?'type':f<660?'paper':f<855?'operations':'closing';}
function sculptureTime(t){
 if(t<1.7)return 1.2;
 if(t<2.5)return 1.2+(t-1.7)/.8*1.4;
 if(t<4.6)return 2.6+(t-2.5)/2.1*3.6;
 if(t<5.6)return 7.6;
 if(t<7.6)return 9+(t-5.6)/2*3.6;
 return 14.2;
}
let encoder=null,encoderErrors='',encoderDone=null;
if(!stills){
 const dest=path.join(out,'tact-taste-showreel-silent.mp4');
 encoder=spawn('ffmpeg',['-hide_banner','-loglevel','error','-n','-f','image2pipe','-framerate',String(fps),'-vcodec','png','-i','pipe:0','-an','-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart',dest]);
 encoder.stderr.on('data',d=>encoderErrors+=d);
 encoder.stdin.on('error',()=>{});
 encoderDone=new Promise((resolve,reject)=>{encoder.once('error',reject);encoder.once('close',code=>code===0?resolve():reject(new Error(encoderErrors||`Encoder ${code}`)));});
}
let lastClick=-100,lastScene='',previousPos={x:1350,y:850};
const started=Date.now();
try{
 for(let f=0;f<total;f++){
  const t=f/fps,scene=sceneFor(f);
  await page.evaluate(t=>window.renderFilm(t),t);
  await page.clock.runFor(1000/fps);
  if(scene==='sculpture'){
   await iframe.locator('#scene-seek').evaluate((el,n)=>{el.value=String(n);el.dispatchEvent(new Event('input',{bubbles:true}));},sculptureTime(t));
  }
  let visible=scene!=='sculpture'&&scene!=='closing';
  if(visible){
   const same=anchors.filter(a=>sceneFor(a.f)===scene);
   const next=same.find(a=>a.f>=f)||same.at(-1);
   const prev=[...same].reverse().find(a=>a.f<=f)||same[0];
   const a=await coords(prev),b=await coords(next),p=prev.f===next.f?0:curve((f-prev.f)/(next.f-prev.f));
   previousPos={x:a.x+(b.x-a.x)*p,y:a.y+(b.y-a.y)*p};
   await page.mouse.move(previousPos.x,previousPos.y);
  }
  const action=anchors.find(a=>a.f===f&&(a.click||a.down||a.up||a.escape));
  if(action){
   const point=await coords(action);previousPos=point;
   await page.mouse.move(point.x,point.y);
   if(action.click){
    assert(point.x>=point.box.x&&point.x<=point.box.x+point.box.w&&point.y>=point.box.y&&point.y<=point.box.y+point.box.h);
    await page.mouse.click(point.x,point.y);lastClick=t;
    clickChecks.push({frame:f,selector:action.sel,tip:{x:point.x,y:point.y},insideTarget:true});
   }
   if(action.down){await page.mouse.down();lastClick=t;}
   if(action.escape)await page.keyboard.press('Escape');
   if(action.up)await page.mouse.up();
   const state=await page.evaluate(()=>window.filmState());
   events.push({frame:f,time:t,action:action.click?'click':action.down?'pointerdown':action.escape?'Escape':'pointerup',selector:action.sel,state});
   await writeFile(path.join(out,'events-in-progress.json'),JSON.stringify(events,null,2));
   if(action.down&&action.sel==='#drag-track')assert.equal(state.dragging,'true');
   if(f===285)assert.equal(state.palette,'coral');
   if(f===339)assert.equal(state.alpha,'86');
   if(f===360)assert.equal(state.palette,'ice');
   if(f===420)assert.equal(state.layout,'space');
   if(f===447)assert.equal(state.layout,'offset');
   if(f===474)assert.equal(state.inverted,'true');
   if(f===549)assert.equal(state.ticket,'024');
   if(f===573)assert.equal(state.collected,'true');
   if(f===609)assert.equal(state.collected,'false');
   if(f===636)assert.equal(state.ticket,'036');
   if(f===723)assert.equal(state.selection,'2');
   if(f===784){assert.equal(state.dragValue,'35');assert.match(state.dragText,/取消/);}
   if(f===837){assert.equal(state.dragValue,'62');assert.match(state.dragText,/已确认/);}
  }
  await page.evaluate(({t,pos,visible,lastClick})=>{window.freezeProductAnimations(t);window.filmCursor(pos.x,pos.y,t,visible,t-lastClick);},{t,pos:previousPos,visible,lastClick});
  if(important.has(f)||!stills){
   const image=await page.screenshot({type:'png',animations:'allow',timeout:30000});
   if(important.has(f))await writeFile(path.join(proof,`${String(f).padStart(4,'0')}-${important.get(f)}.png`),image);
   if(encoder&&!encoder.stdin.write(image))await once(encoder.stdin,'drain');
  }
  if(f%90===0||scene!==lastScene){console.log(`${stills?'CHECK':'RENDER'} ${f}/${total} ${scene} ${(Date.now()-started)/1000}s`);lastScene=scene;}
 }
 if(encoder){encoder.stdin.end();await encoderDone;}
 assert.deepEqual(errors,[]);assert.deepEqual(requests,[]);
 const hashes={};for(const name of ['index.html','styles.css','gallery.css','gallery.js','demo.js','showcase.js','text-geometry.js','particle-renderer.js'])hashes['examples/'+name]=createHash('sha256').update(await readFile(path.join(project,'examples',name))).digest('hex');
 const report={fps,duration,dimensions:[1920,1080],frames:total,events,clickChecks,errors,requests,warnings:[...new Set(warnings)],sourceCommit:execFileSync('git',['rev-parse','HEAD'],{cwd:project,encoding:'utf8'}).trim(),sourceHashes:hashes,method:'Original examples in a same-origin iframe; Playwright pointer/keyboard input; CSS transition clocks sampled explicitly; sculpture advanced through its real seek input; no product outcomes overwritten.',limits:['Presentation framing and film timing are edited.','No end-to-end claim that a single prompt generated these examples.','Audio is synthesized locally; no third-party music samples.']};
 await writeFile(path.join(out,'capture-report.json'),JSON.stringify(report,null,2));
 console.log(JSON.stringify({out,checks:events.length,clickChecks:clickChecks.length,errors,externalRequests:requests.length,seconds:(Date.now()-started)/1000}));
}finally{
 if(encoder&&!encoder.stdin.destroyed)encoder.stdin.end();
 await context.close();await browser.close();
}
