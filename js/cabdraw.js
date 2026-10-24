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

const K='#5a504a';
const C={};
// ---------- 主臥 衣櫃＋開放層架 ----------
C.c_mw={n:'主臥 衣櫃＋開放層架（南牆）',k:6,views:()=>{const W=2100,H=2700,D=600;
  const a=V('A 外觀立面｜由北往南看（左＝東、右＝西）',W,H,{ceil:2700});
  R(a,0,0,1600,H,'o');R(a,0,0,1600,100,'p',{f:K});door(a,0,100,540,2500,'L');door(a,545,100,515,2500,'R');door(a,1065,100,535,2500,'R');R(a,0,2600,1600,100,'a',{d:1,lab:'上封板 100'});
  R(a,1600,0,500,H,'o');R(a,1600,100,500,700,'a',{d:1,lab:'下櫃'});[821,1266,1730,2195,2680].forEach(z=>shelf(a,1620,460,z));
  a.hd=[[0,540,545,1060,1065,1600,2100],[0,1600,2100]];a.vd=[[0,100,2600,2700],[0,H]];a.vdR=[[0,821,1266,1730,2195,2700]];
  a.tags=[{x:270,z:1500,n:1},{x:800,z:2650,n:2,a:1},{x:1850,z:1500,n:3},{x:1850,z:450,n:4,a:1}];
  const b=V('B 衣櫃內部立面（門片拆除）',1600,H,{ceil:2700}),m=800;
  R(b,0,0,1600,H,'o');R(b,18,0,1564,100,'p',{f:K});L(b,m,100,m,2600,'a');shelf(b,18,m-18,2200,{d:1,c:'a'});shelf(b,m,782,2200,{d:1});rod(b,18,m-18,2120);rod(b,m,782,2120);shelf(b,m,782,1160,{d:1});rod(b,m,782,1080);
  b.tags=[{x:400,z:1400,n:5,a:1},{x:1200,z:1600,n:6,a:1}];b.hd=[[0,800,1600]];b.vdR=[[0,100,1080,1160,2120,2200,2600]];
  const c=V('C 側剖面',D,H,{ceil:2700});R(c,0,0,D,H,'o');R(c,0,0,8,H,'s',{f:'#ddd'});R(c,D-18,100,18,2500,'p',{hatch:5});R(c,0,0,D-50,100,'p',{f:K});shelf(c,8,D-26,2200,{d:1});Ci(c,D/2,2120,14,'p');T(c,D/2+30,1700,'衣架迴轉 ≥560',{a:'start',cl:'sm'});
  c.hd=[[0,D]];c.vd=[[0,100,2600,2700]];return[a,b,c]},
  parts:[{n:1,k:'衣櫃門片 ×3',v:'540／515／535 × 2500（H100–2600 單片）'},{n:2,k:'上封板',v:'H2600–2700',a:1},{n:3,k:'開放層架（W500）',v:'層板 H821／1266／1730／2195，頂 2680'},{n:4,k:'層架下櫃',v:'H100–800，門片或抽屜待定',a:1},{n:5,k:'長衣區',v:'吊桿 2120＋頂層板 2200',a:1},{n:6,k:'短衣區',v:'上桿 2120、下桿 1080',a:1}],
  mat:SYS_MAT,hw:SYS_HW.concat([AS('衣桿：鋁合金橢圓衣桿')]),
  warn:['外框尺寸取自 SketchUp：衣櫃 W1600×D600、層架 W500、總高 2700 到天花。','SketchUp 門片在 H1101–1121 分上下兩段；依「到頂櫃＝踢腳 100＋單片門 ≤2500」規則改畫單片 2500，剩下的 100 用上封板補，待確認。','衣櫃內部 SketchUp 沒有建模，B 圖整張是建議配置。']};
// ---------- 主臥 書桌 ----------
C.c_md={n:'主臥 書桌（西牆）',k:9,views:()=>{const W=1020,D=480,H=821;
  const a=V('A 立面｜由東往西看（左＝南、右＝北）',W,H,{ceil:false});R(a,0,801,W,20,'o',{f:'#e7d6bf'});R(a,1000,0,20,801,'p');drawer(a,0,601,500,195);drawer(a,500,601,500,195);
  a.hd=[[0,500,1000,1020]];a.vd=[[0,601,796,821]];a.tags=[{x:250,z:700,n:1},{x:510,z:811,n:2}];
  const c=V('C 側剖面',D,H,{ceil:false});R(c,0,801,D,20,'o',{f:'#e7d6bf',hatch:4});R(c,0,601,D-20,195,'s',{d:1});c.hd=[[0,D]];c.vd=[[0,601,801,821]];return[a,c]},
  parts:[{n:1,k:'抽屜 ×2',v:'H601–796，寬約 500 ×2'},{n:2,k:'桌板',v:'1020×480×20，桌面高 821'}],
  mat:SYS_MAT,hw:[AS('抽屜：緩衝滑軌')],warn:['桌面高 821 照 SketchUp，比一般 750 高，請確認。']};
// ---------- 次臥 衣櫃＋層架 ----------
C.c_sw={n:'次臥 衣櫃＋開放層架（北牆）',k:6,views:()=>{const W=1900,H=2700,D=600;
  const a=V('A 外觀立面｜由南往北看（左＝西、右＝東）',W,H,{ceil:2700});
  R(a,0,0,500,H,'o');[825,1201,1621,2061,2481].forEach(z=>shelf(a,20,460,z));R(a,0,100,500,700,'a',{d:1,lab:'書桌側'});
  R(a,500,0,1400,H,'o');R(a,500,0,1400,100,'p',{f:K});door(a,500,100,473,2400,'L');door(a,978,100,449,2400,'R');door(a,1432,100,468,2400,'R');R(a,500,2500,1400,200,'p',{lab:'上櫃／封板 200'});
  a.hd=[[0,500,973,978,1427,1432,1900],[0,500,1900]];a.vd=[[0,100,2500,2700]];a.vdR=[[0,825,1201,1621,2061,2481,2700]];
  a.tags=[{x:736,z:1500,n:1},{x:1200,z:2600,n:2},{x:250,z:1400,n:3}];
  const b=V('B 衣櫃內部立面（門片拆除）',1400,H,{ceil:2700}),m=700;
  R(b,0,0,1400,H,'o');R(b,18,0,1364,100,'p',{f:K});L(b,m,100,m,2500,'a');shelf(b,18,m-18,2100,{d:1});shelf(b,m,682,2100,{d:1});rod(b,18,m-18,2020);rod(b,m,682,2020);shelf(b,m,682,1100,{d:1});rod(b,m,682,1020);
  b.tags=[{x:350,z:1300,n:4,a:1},{x:1050,z:1500,n:5,a:1}];b.hd=[[0,700,1400]];b.vdR=[[0,100,1020,1100,2020,2100,2500]];
  const c=V('C 側剖面',D,H,{ceil:2700});R(c,0,0,D,2500,'o');R(c,50,2500,D-50,200,'p');R(c,0,0,8,2500,'s',{f:'#ddd'});R(c,D-18,100,18,2400,'p',{hatch:5});R(c,0,0,D-50,100,'p',{f:K});c.hd=[[0,D]];c.vd=[[0,100,2500,2700]];return[a,b,c]},
  parts:[{n:1,k:'衣櫃門片 ×3',v:'473／449／468 × 2400（H100–2500）'},{n:2,k:'上櫃／封板',v:'H2500–2700，退縮 50'},{n:3,k:'開放層架（W500）',v:'層板 H825／1201／1621／2061，頂 2481'},{n:4,k:'長衣區',v:'吊桿 2020',a:1},{n:5,k:'短衣區',v:'上桿 2020、下桿 1020',a:1}],
  mat:SYS_MAT,hw:SYS_HW.concat([AS('衣桿：鋁合金橢圓衣桿')]),
  warn:['尺寸取自 SketchUp：衣櫃 W1400×D600、門片 H100–2501；上段 2501–2700 是一個退縮的櫃體。','SketchUp 門片在 H1100–1120 分上下兩段，這裡依規則畫成單片 2400，待確認。','衣櫃內部 SketchUp 沒有建模，B 圖整張是建議配置。']};
// ---------- 次臥 書桌 ----------
C.c_sd={n:'次臥 書桌（西牆）',k:9,views:()=>{const W=1000,D=460,H=825;
  const a=V('A 立面｜由東往西看（左＝南、右＝北）',W,H,{ceil:false});R(a,0,805,W,20,'o',{f:'#e7d6bf'});R(a,0,0,20,805,'p');drawer(a,20,600,490,200);drawer(a,515,600,485,200);
  a.hd=[[0,20,510,515,1000]];a.vd=[[0,600,800,825]];a.tags=[{x:265,z:700,n:1},{x:500,z:815,n:2}];
  const c=V('C 側剖面',D,H,{ceil:false});R(c,0,805,D,20,'o',{f:'#e7d6bf',hatch:4});R(c,0,600,D-20,200,'s',{d:1});c.hd=[[0,D]];c.vd=[[0,600,805,825]];return[a,c]},
  parts:[{n:1,k:'抽屜 ×2',v:'H600–800'},{n:2,k:'桌板',v:'1000×460×20，桌面高 825'}],mat:SYS_MAT,hw:[AS('抽屜：緩衝滑軌')],warn:['桌面高 825 照 SketchUp，請確認。']};
// ---------- 客廳 書牆 ----------
C.c_bk={n:'客廳 書牆（東牆）',k:6,views:()=>{const W=2672,H=2455,D=520,X=y=>9275-y;
  const a=V('A 外觀立面｜由西往東看（左＝北、右＝南）',W,H,{ceil:2460});
  R(a,0,0,W,H,'o');R(a,20,0,W-40,100,'p',{f:K});R(a,0,2440,W,15,'p');
  door(a,X(9255),101,X(8779)-X(9255),2339,'L',{c:'a'});[[585,18],[1049,18],[1494,18],[1976,19]].forEach(([z])=>shelf(a,X(8729),527,z));
  door(a,X(8182),101,506,2339,'R');[585,1188,1599,2010].forEach(z=>shelf(a,X(7656),1033,z));R(a,X(7656),585,1033,210,'p',{f:'#e7d6bf',lab:'厚層板 210'});L(a,X(7148),121,X(7148),585,'p');
  a.hd=[[0,X(8779),X(8202),X(7676),X(6603),W],[0,W]];a.vd=[[0,101,2440,2455]];a.vdR=[[0,585,795,1188,1599,2010,2440]];
  a.tags=[{x:250,z:1800,n:1,a:1},{x:X(8460),z:1250,n:2},{x:X(7930),z:1800,n:3,a:1},{x:X(7140),z:1400,n:4}];
  const c=V('C 側剖面',D,H,{ceil:2460});R(c,0,0,D,H,'o');R(c,0,0,D-20,101,'p',{f:K});R(c,0,0,20,H,'s',{f:'#ddd'});[585,1188,1599,2010].forEach(z=>shelf(c,20,480,z));c.hd=[[0,D]];c.vd=[[0,101,2440,2455]];return[a,c]},
  parts:[{n:1,k:'北段封閉櫃',v:'W476，H101–2440；SketchUp 未分門片',a:1},{n:2,k:'開放格 W527',v:'層板 H585／1049／1494／1976'},{n:3,k:'中段封閉櫃',v:'W506，H101–2440，門片形式待確認',a:1},{n:4,k:'開放格 W1033',v:'H585–795 厚層板，層板 1188／1599／2010；下段中隔 y7148'}],
  mat:SYS_MAT.concat(['層板：淺橡木色（對照金哥渲染圖）']),hw:[AS('層板可調；封閉段用緩衝鉸鏈')],
  warn:['SketchUp 長 2672，跟筆記寫的 2330 對不起來，以 SketchUp 為準，請確認。','高 2455 頂到客廳降板 CH2460；深 520。']};
// ---------- 客廳 矮櫃 ----------
C.c_lo={n:'書桌段・矮櫃（東牆）',k:9,views:()=>{const W=1153,H=795,D=520;
  const a=V('A 立面｜由西往東看（左＝北、右＝南）',W,H,{ceil:false});R(a,0,0,W,H,'o');R(a,0,775,W,20,'p',{f:'#e7d6bf'});drawer(a,20,580,566,190);drawer(a,591,580,542,190);R(a,20,0,1113,580,'s',{lab:'開放下層'});
  a.hd=[[0,20,586,591,1133,1153]];a.vd=[[0,580,770,795]];a.tags=[{x:300,z:675,n:1},{x:576,z:785,n:2},{x:576,z:300,n:3}];
  const c=V('C 側剖面',D,H,{ceil:false});R(c,0,0,D,H,'o');R(c,0,775,D,20,'p',{f:'#e7d6bf',hatch:4});R(c,40,580,480,190,'s',{d:1});c.hd=[[0,D]];c.vd=[[0,580,775,795]];return[a,c]},
  parts:[{n:1,k:'抽屜 ×2',v:'H580–770'},{n:2,k:'木紋檯面',v:'H775–795'},{n:3,k:'下層開放',v:'H0–580'}],mat:SYS_MAT,hw:[AS('抽屜：緩衝滑軌')],
  warn:['SketchUp 長 1153；筆記說書桌 1700，對不起來，請確認。']};
// ---------- 電器櫃 ----------
C.c_ap={n:'電器櫃（東牆）',k:6,views:()=>{const W=640,H=2455,D=520;
  const a=V('A 外觀立面｜由西往東看',W,H,{ceil:2460});R(a,0,0,W,H,'o');R(a,16,0,608,101,'p',{f:K});door(a,0,101,W,650,'L');
  R(a,0,751,W,30,'p');R(a,0,781,W,60,'p',{f:'#e7d6bf',lab:'抽盤'});R(a,16,841,608,500,'s',{lab:'電器格 H500'});R(a,0,1341,W,60,'p',{f:'#e7d6bf',lab:'抽盤'});R(a,16,1401,608,500,'s',{lab:'電器格 H500'});shelf(a,16,608,1901);R(a,16,1921,608,519,'s',{lab:'開放格'});R(a,0,2440,W,15,'p');
  a.hd=[[0,W]];a.vdR=[[0,101,751,781,841,1341,1401,1901,1921,2440,2455]];a.tags=[{x:320,z:430,n:1},{x:320,z:1100,n:2},{x:320,z:2200,n:3}];
  const c=V('C 側剖面',D,H,{ceil:2460});R(c,0,0,D,H,'o');R(c,-20,781,60,60,'p');R(c,-20,1341,60,60,'p');c.hd=[[0,D]];c.vd=[[0,751,841,1341,1401,1901,2455]];return[a,c]},
  parts:[{n:1,k:'下櫃門片',v:'640×650（H101–751）'},{n:2,k:'電器格 ×2＋抽盤 ×2',v:'淨高 500；抽盤 H60 向外凸 20'},{n:3,k:'上層開放格',v:'H1921–2440'}],
  mat:SYS_MAT,hw:[AS('電器抽盤：重型全展滑軌'),AS('背板預留散熱孔與插座')],warn:['SketchUp 寬 640，筆記寫 800，對不起來，請確認電器尺寸。']};
// ---------- 玄關鞋櫃 ----------
C.c_sh={n:'玄關鞋櫃（懸浮・南牆）',k:7,views:()=>{const W=1250,H=2420,D=500,X=x=>8200-x;
  const a=V('A 外觀立面｜由北往南看（左＝東、右＝西）',W,H,{ceil:2420});
  door(a,0,250,595,2170,'L');door(a,X(7600),250,315,750,'L');door(a,X(7280),250,330,750,'R');R(a,X(7600),1000,650,350,'s',{lab:'鏤空檯面＋LED'});door(a,X(7600),1350,315,1070,'L');door(a,X(7280),1350,330,1070,'R');
  a.hd=[[0,595,X(7280),W],[0,W]];a.vd=[[0,250,2420]];a.vdR=[[0,250,1000,1350,2420]];a.tags=[{x:300,z:1300,n:1},{x:800,z:1180,n:2},{x:800,z:600,n:3},{x:800,z:1900,n:3}];
  const b=V('B 內部立面（門片拆除，建議）',W,H,{ceil:2420});R(b,0,250,W,2170,'o');L(b,595,250,595,H,'p');[430,610,790,1150,1530,1710,1890,2070].forEach(z=>shelf(b,18,577,z,{d:1}));[640,1600,1950].forEach(z=>shelf(b,613,619,z,{d:1}));b.tags=[{x:300,z:1300,n:4,a:1}];
  const c=V('C 側剖面',D,H,{ceil:2420});R(c,0,250,D,2170,'o');R(c,0,1000,D-20,350,'s');c.hd=[[0,D]];c.vd=[[0,250,1000,1350,2420]];return[a,b,c]},
  parts:[{n:1,k:'高門片',v:'595×2170（H250–2420）'},{n:2,k:'鏤空檯面',v:'H1000–1350，含 LED'},{n:3,k:'上下門片',v:'約 315／330 寬，下 H250–1000、上 H1350–2420'},{n:4,k:'鞋層板',v:'間距約 180，可調',a:1}],
  mat:SYS_MAT,hw:SYS_HW,warn:['照 SketchUp 是懸浮 250、深 500、到頂 2420；跟「鞋櫃深 45」規則不一樣，請確認。']};
window.CABDRAW=C;
})();
