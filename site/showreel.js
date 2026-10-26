/* SPDX-License-Identifier: MIT. Native video controls and chapter navigation. */
const video=document.querySelector('#reel'),toggle=document.querySelector('#toggle'),status=document.querySelector('#status'),buttons=[...document.querySelectorAll('[data-time]')];
const label=t=>'00:'+String(Math.floor(t)).padStart(2,'0');
function sync(){toggle.textContent=video.paused?(video.ended?'重新播放':'播放 Showreel'):'暂停';document.querySelector('#time').textContent=label(video.currentTime)+' / 00:32';const active=[...buttons].reverse().find(b=>video.currentTime>=Number(b.dataset.time))||buttons[0];buttons.forEach(b=>b.setAttribute('aria-pressed',String(b===active)));}
async function play(){try{await video.play();status.textContent='正在播放。可暂停，或选择任一章节重看。';}catch(error){status.textContent='未能开始播放，可使用视频原生控件或下载 MP4。';}sync();}
toggle.addEventListener('click',()=>video.paused?play():video.pause());
buttons.forEach(b=>b.addEventListener('click',()=>{if(video.readyState<1){status.textContent='视频正在加载，请稍后重试，或下载 MP4。';return;}video.currentTime=Number(b.dataset.time);status.textContent='已跳到 '+b.textContent+'。';sync();}));
for(const event of ['play','pause','timeupdate','seeked','ended'])video.addEventListener(event,sync);
video.addEventListener('ended',()=>{status.textContent='播放结束。可重新播放，或选择章节细看。';});video.addEventListener('error',()=>{status.textContent='视频加载失败，可下载 MP4 观看。';});sync();
