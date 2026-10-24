// 櫃體立面拆解施工圖 — 參數化 CAD 風格 SVG（單位 mm）
(function(){
const A='建議配置，待確認';
// ---------- primitives (mm, z up) ----------
function V(title,W,H,opt){return Object.assign({title,W,H,items:[],hd:[],vd:[],vdR:[],tags:[],x0:0},opt||{})}
const R=(v,x,z,w,h,c,o)=>v.items.push(Object.assign({t:'r',x,z,w,h,c},o||{}));
const L=(v,x1,z1,x2,z2,c,o)=>v.items.push(Object.assign({t:'l',x1,z1,x2,z2,c},o||{}));
const T=(v,x,z,s,o)=>v.items.push(Object.assign({t:'t',x,z,s},o||{}));
const Ci=(v,x,z,r,c,o)=>v.items.push(Object.assign({t:'c',x,z,r,c},o||{}));
function door(v,x,z,w,h,hinge,o){R(v,x,z,w,h,'p',o);const a=8;if(hinge=='L'){L(v,x+w-a,z+a,x+a,z+h/2,'s',{d:1});L(v,x+a,z+h/2,x+w-a,z+h-a,'s',{d:1})}else if(hinge=='R'){L(v,x+a,z+a,x+w-a,z+h/2,'s',{d:1});L(v,x+w-a,z+h/2,x+a,z+h-a,'s',{d:1})}else if(hinge=='U'){L(v,x+a,z+a,x+w/2,z+h-a,'s',{d:1});L(v,x+w/2,z+h-a,x+w-a,z+a,'s',{d:1})}}
function doors(v,x,z,w,h,n,o){const dw=w/n;for(let i=0;i<n;i++)door(v,x+i*dw,z,dw,h,(n%2==0?(i%2?'R':'L'):(i%2?'R':'L')),o)}
function drawer(v,x,z,w,h,o){R(v,x,z,w,h,'p',o);L(v,x+w/2-Math.min(80,w/4),z+h-40,x+w/2+Math.min(80,w/4),z+h-40,'p')}
function shelf(v,x,w,z,o){R(v,x,z,w,18,'p',Object.assign({f:'#e7d6bf'},o||{}))}
function rod(v,x,w,z){L(v,x+20,z,x+w-20,z,'p',{sw:2.2});Ci(v,x+20,z,12,'p');Ci(v,x+w-20,z,12,'p')}
// ---------- render ----------
function render(v,k,nar){
  const SP=nar?21:28,B0=nar?54:70,BR=nar?7.5:9;
  const ML=v.vd.length?B0+SP*(v.vd.length-1):(nar?14:30),MR=v.vdR.length?B0+SP*(v.vdR.length-1):(nar?14:30),MT=nar?18:34,MB=(v.hd.length?(nar?40:46)+SP*(v.hd.length-1):20)+(v.foot&&!nar?22:0);
  const W=v.W*k,H=v.H*k,VW=ML+W+MR,VH=MT+H+MB,X=x=>ML+(x-v.x0)*k,Y=z=>MT+(v.H-z)*k;
  let s=`<svg viewBox="0 0 ${VW.toFixed(0)} ${VH.toFixed(0)}" width="${VW.toFixed(0)}" xmlns="http://www.w3.org/2000/svg" class="cad">`;
  if(v.floor!==false)s+=`<line x1="${ML-14}" y1="${Y(0)}" x2="${ML+W+14}" y2="${Y(0)}" class="fl"/><path d="${hatchFloor(ML-14,Y(0),W+28)}" class="ht"/>`;
  if(v.ceil)s+=`<line x1="${ML-14}" y1="${Y(v.ceil)}" x2="${ML+W+14}" y2="${Y(v.ceil)}" class="cl"/><text x="${ML+W+12}" y="${Y(v.ceil)-4}" class="sm" text-anchor="end">天花 CH${v.ceil}</text>`;
  for(const it of v.items){
    const cls={o:'lo',p:'lp',s:'ls',h:'lh',a:'la'}[it.c]||'lp';
    if(it.t=='r'){const x=X(it.x),y=Y(it.z+it.h),w=it.w*k,h=it.h*k;
      s+=`<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" class="${cls}${it.d?' dsh':''}" fill="${it.f||'none'}"/>`;
      if(it.hatch)s+=`<path d="${hatch(x,y,w,h,it.hatch)}" class="ht"/>`;
      if(it.lab&&!(nar&&(String(it.lab).length*11>w||h<22)))s+=`<text x="${(x+w/2).toFixed(1)}" y="${(y+h/2+4).toFixed(1)}" class="il" text-anchor="middle">${it.lab}</text>`;}
    else if(it.t=='l')s+=`<line x1="${X(it.x1).toFixed(1)}" y1="${Y(it.z1).toFixed(1)}" x2="${X(it.x2).toFixed(1)}" y2="${Y(it.z2).toFixed(1)}" class="${cls}${it.d?' dsh':''}"${it.sw?` style="stroke-width:${it.sw}"`:''}/>`;
    else if(it.t=='c')s+=`<circle cx="${X(it.x).toFixed(1)}" cy="${Y(it.z).toFixed(1)}" r="${(it.px?it.r:it.r*k).toFixed(1)}" class="${cls}${it.d?' dsh':''}" fill="${it.f||'none'}"/>`;
    else if(it.t=='t'&&!(nar&&(it.cl||'il')=='il'))s+=`<text x="${X(it.x).toFixed(1)}" y="${(Y(it.z)+4).toFixed(1)}" class="${it.cl||'il'}" text-anchor="${it.a||'middle'}">${it.s}</text>`;
  }
  // balloons / tags
  for(const g of v.tags){const x=X(g.x),y=Y(g.z);s+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${BR}" class="bl${g.a?' ba':''}"/><text x="${x.toFixed(1)}" y="${(y+4).toFixed(1)}" class="bt" text-anchor="middle">${g.n}</text>`}
  // dims horizontal (bottom)
  v.hd.forEach((ch,i)=>{const y=Y(0)+(v.floor!==false?(nar?26:30):22)+i*SP;s+=chainH(ch.map(X),ch,y,Y(0)+6)});
  v.vd.forEach((ch,i)=>{const x=ML-(nar?22:26)-i*SP;s+=chainV(ch.map(Y),ch,x,ML-6,1)});
  v.vdR.forEach((ch,i)=>{const x=ML+W+(nar?22:26)+i*SP;s+=chainV(ch.map(Y),ch,x,ML+W+6,0)});
  if(v.foot&&!nar)s+=`<text x="${ML}" y="${VH-6}" class="sm">${v.foot}</text>`;
  return s+'</svg>';
}
function tick(x,y){return `<line x1="${x-4}" y1="${y+4}" x2="${x+4}" y2="${y-4}" class="tk"/>`}
function chainH(px,mm,y,yo){let s=`<line x1="${px[0]-6}" y1="${y}" x2="${px[px.length-1]+6}" y2="${y}" class="dm"/>`;
  px.forEach(x=>{s+=`<line x1="${x}" y1="${yo}" x2="${x}" y2="${y+5}" class="ex"/>`+tick(x,y)});
  for(let i=0;i<px.length-1;i++){const val=Math.round(Math.abs(mm[i+1]-mm[i])),w=Math.abs(px[i+1]-px[i]),mx=(px[i]+px[i+1])/2;
    if(w>=String(val).length*6.6+4)s+=`<text x="${mx}" y="${y-4}" class="dt" text-anchor="middle">${val}</text>`;
    else s+=`<text x="${mx}" y="${y+13+(i%2)*10}" class="dt dts" text-anchor="middle">${val}</text>`}
  return s}
function chainV(py,mm,x,xo,left){let s=`<line x1="${x}" y1="${Math.max(...py)+6}" x2="${x}" y2="${Math.min(...py)-6}" class="dm"/>`;
  py.forEach(y=>{s+=`<line x1="${xo}" y1="${y}" x2="${left?x-5:x+5}" y2="${y}" class="ex"/>`+tick(x,y)});
  for(let i=0;i<py.length-1;i++){const val=Math.round(Math.abs(mm[i+1]-mm[i])),h=Math.abs(py[i+1]-py[i]),my=(py[i]+py[i+1])/2;
    if(h>=String(val).length*6.6+4)s+=`<text transform="translate(${x-4} ${my}) rotate(-90)" class="dt" text-anchor="middle">${val}</text>`;
    else s+=`<text x="${left?x-6:x+6}" y="${my+3.5}" class="dt dts" text-anchor="${left?'end':'start'}">${val}</text>`}
  return s}
function hatch(x,y,w,h,step){let d='';const st=step===true?6:step;for(let t=-h;t<w;t+=st){const x1=Math.max(x,x+t),y1=x1==x?y+(-t):y,x2=Math.min(x+w,x+t+h),y2=y+(x2-(x+t));d+=`M${x1.toFixed(1)} ${(y1).toFixed(1)}L${x2.toFixed(1)} ${Math.min(y+h,y2).toFixed(1)}`}return d}
function hatchFloor(x,y,w){let d='';for(let t=0;t<w;t+=8)d+=`M${(x+t).toFixed(1)} ${(y+8).toFixed(1)}L${(x+t+8).toFixed(1)} ${y.toFixed(1)}`;return d}
window.CADHTML=function(c,avail){
  const views=c.views(),maxW=Math.max(...views.map(v=>v.W)),maxH=Math.max(...views.map(v=>v.H));
  const mg=v=>narrow?(v.vd.length?54+21*(v.vd.length-1):14)+(v.vdR.length?54+21*(v.vdR.length-1):14):(v.vd.length?70+28*(v.vd.length-1):30)+(v.vdR.length?70+28*(v.vdR.length-1):30);
  avail=avail||1000;const narrow=avail<700;
  // fit: every view must fit available width at one shared scale
  let k=Math.min(c.k||9,980/maxW,(narrow?560:500)/maxH,0.26);
  for(const v of views)k=Math.min(k,(avail-4-mg(v))/v.W);
  let h=`<div class="cadv${narrow?' nar':''}">${views.map((v,i)=>`<div class="cadw" data-i="${i}" title="點擊放大"><div class="cvt">${v.title}</div>${render(v,k,narrow)}${narrow&&v.foot?`<div class="cvf">${v.foot}</div>`:''}</div>`).join('')}</div>`;
  h+=`<p class="sm2">比例約 1:${Math.round(1/k*3.78)}（螢幕示意，尺寸以標註為準，單位 mm）。<span class="tg">橘色編號</span>＝${A}；黑色編號＝依 D8 平面／3D 模型。</p>`;
  h+=`<table class="ctb"><tr><th>#</th><th>部位</th><th>尺寸／說明</th><th>依據</th></tr>${c.parts.map(p=>`<tr><td><span class="nb${p.a?' na':''}">${p.n}</span></td><td>${p.k}</td><td>${p.v}</td><td>${p.a?`<span class="tg">${A}</span>`:'D8'}</td></tr>`).join('')}</table>`;
  h+=`<div class="cnotes"><b>板材</b><ul>${c.mat.map(x=>`<li>${x}</li>`).join('')}</ul><b>五金</b><ul>${c.hw.map(x=>`<li>${x}</li>`).join('')}</ul>${c.warn?`<b>待確認／資料差異</b><ul>${c.warn.map(x=>`<li>${x}</li>`).join('')}</ul>`:''}</div>`;
  return h};
const AS=x=>`${x}<span class="tg">${A}</span>`;
const SYS_MAT=[AS('系統板 18mm 雙面美耐皿塑合板（櫃身、層板、門片），封邊 ABS；背板 8mm'),'木紋色號未定，以實體樣板確認'];
const SYS_HW=[AS('門片：緩衝鉸鏈（每門高 ≤900 用 2 只、≤1600 用 3 只、>1600 用 4 只）'),AS('把手：斜切免把手或隱藏式嵌入把手，色號隨五金樣本')];

