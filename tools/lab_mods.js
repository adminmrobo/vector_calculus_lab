/* 실험 패널 모듈 — 모든 데이터는 시드 고정 또는 식으로 계산 */
var MODS={};
function H(el,html){el.insertAdjacentHTML('beforeend',html);}
function plane(W,H,R){var s=Math.min(W,H)/(2*R),cx=W/2,cy=H/2;return {s:s,X:function(x){return cx+x*s},Y:function(y){return cy-y*s},ix:function(px){return (px-cx)/s},iy:function(py){return (cy-py)/s}};}
function axes(c,P,W,H){c.save();c.strokeStyle='#9aa5b1';c.lineWidth=1;c.beginPath();c.moveTo(0,P.Y(0));c.lineTo(W,P.Y(0));c.moveTo(P.X(0),0);c.lineTo(P.X(0),H);c.stroke();
  c.fillStyle='#5b6874';c.font='12px sans-serif';c.fillText('x',W-14,P.Y(0)-6);c.fillText('y',P.X(0)+6,12);c.restore();}
function heat(c,P,W,H,f,lo,hi,col){var step=6;for(var px=0;px<W;px+=step)for(var py=0;py<H;py+=step){var v=f(P.ix(px+step/2),P.iy(py+step/2));var t=Math.max(0,Math.min(1,(v-lo)/(hi-lo)));
  c.fillStyle=col?col(t):'rgba(201,48,44,'+(0.03+0.22*t)+')';c.fillRect(px,py,step,step);}}
function contours(c,P,W,H,f,levels,color){c.save();c.strokeStyle=color||'rgba(22,33,43,.35)';c.lineWidth=1;var n=Math.ceil(W/4),m=Math.ceil(H/4);
  levels.forEach(function(L){c.beginPath();for(var i=0;i<n;i++)for(var j=0;j<m;j++){var x0=i*4,y0=j*4;var a=f(P.ix(x0),P.iy(y0))-L,b=f(P.ix(x0+4),P.iy(y0))-L,d=f(P.ix(x0),P.iy(y0+4))-L;
    if(a*b<0){var t=a/(a-b);c.moveTo(x0+4*t,y0);c.lineTo(x0+4*t,y0+1);}if(a*d<0){var u=a/(a-d);c.moveTo(x0,y0+4*u);c.lineTo(x0+1,y0+4*u);}}c.stroke();});c.restore();}
function field(c,P,W,H,F,R,col,scale,n){n=n||13;var sp=2*R/(n-1);for(var i=0;i<n;i++)for(var j=0;j<n;j++){var x=-R+i*sp,y=-R+j*sp,v=F(x,y),L=Math.hypot(v[0],v[1]);if(L<1e-9)continue;
  var k=Math.min(1,(scale||0.12)*L)*sp*P.s*0.85/L;arrow(c,P.X(x),P.Y(y),P.X(x)+v[0]*k,P.Y(y)-v[1]*k,col||'#1e55c8',1.3,5);}}
function onPick(cv,cb){var down=false;function at(e){var r=cv.getBoundingClientRect();cb(e.clientX-r.left,e.clientY-r.top);}
  cv.addEventListener('pointerdown',function(e){down=true;at(e);});cv.addEventListener('pointermove',function(e){if(down)at(e);});window.addEventListener('pointerup',function(){down=false;});}
function slider(id,label,min,max,step,val){return '<label class="group"><span class="glabel">'+label+'</span><input type="range" id="'+id+'" min="'+min+'" max="'+max+'" step="'+step+'" value="'+val+'"><span class="val" id="'+id+'v"></span></label>';}
function btns(name,list,cur){return '<div class="group" role="group">'+list.map(function(b){return '<button type="button" class="bt" data-'+name+'="'+b[0]+'" aria-pressed="'+(b[0]===cur)+'">'+b[1]+'</button>'}).join('')+'</div>';}
function bindBtns(el,name,cb){$$('[data-'+name+']',el).forEach(function(b){b.addEventListener('click',function(){$$('[data-'+name+']',el).forEach(function(x){x.setAttribute('aria-pressed','false')});b.setAttribute('aria-pressed','true');cb(b.dataset[name]);});});}
function canvasBlock(el,label,h){H(el,'<canvas role="img" aria-label="'+label+'"></canvas>');var cv=el.querySelector('canvas:last-of-type');cv.style.height=h+'px';return cv;}
function out(el){H(el,'<div class="readout" aria-live="polite"></div>');return el.querySelector('.readout:last-of-type');}

/* 0편: 미분 복습 — 접선의 기울기 */
MODS.slope=function(el){H(el,'<div class="ctrl">'+slider('sl-x','점의 위치 x',-2,2,0.1,1)+'</div>');var cv=canvasBlock(el,'y=x² 곡선과 접선',300),ro=out(el),x=1;
  $('#sl-x',el).addEventListener('input',function(){x=+this.value;draw();});
  function draw(){var W=fit(cv,300),Hh=300,c=cv.getContext('2d');c.clearRect(0,0,W,Hh);grid(c,W,Hh);var P={s:Math.min(W/5,60),X:function(v){return W/2+v*Math.min(W/5,60)},Y:function(v){return Hh-30-v*Math.min(W/5,60)*0.55}};
    c.strokeStyle='#9aa5b1';c.beginPath();c.moveTo(0,P.Y(0));c.lineTo(W,P.Y(0));c.moveTo(P.X(0),0);c.lineTo(P.X(0),Hh);c.stroke();
    c.strokeStyle='#13733a';c.lineWidth=2.5;c.beginPath();for(var t=-2.4;t<=2.4;t+=0.02){var px=P.X(t),py=P.Y(t*t);t===-2.4?c.moveTo(px,py):c.lineTo(px,py);}c.stroke();
    var m=2*x;c.strokeStyle='#c42a6e';c.lineWidth=2;c.beginPath();c.moveTo(P.X(x-1.2),P.Y(x*x-1.2*m));c.lineTo(P.X(x+1.2),P.Y(x*x+1.2*m));c.stroke();
    c.fillStyle='#c93030';c.beginPath();c.arc(P.X(x),P.Y(x*x),6,0,7);c.fill();stamp(c,W,'설명용 그림');
    $('#sl-xv',el).textContent=fmt(x,1);ro.innerHTML='점 ('+fmt(x,1)+', '+fmt(x*x,2)+')에서 접선의 기울기 = 2 × '+fmt(x,1)+' = <b>'+fmt(m,1)+'</b> · 오른쪽으로 한 칸 가면 높이가 '+fmt(m,1)+'만큼 '+(m>=0?'오릅니다':'내려갑니다')+'.';}
  LOOP.add(cv,function(dt){if(dt===0)draw();});};

/* 방 1: ∇ 도구상자 — 3D 축과 단위벡터 */
MODS.nabla3d=function(el){var on={x:true,y:true,z:true};H(el,'<div class="ctrl"><div class="group"><button type="button" class="bt" data-ax="x" aria-pressed="true">x̂ 켜기</button><button type="button" class="bt" data-ax="y" aria-pressed="true">ŷ 켜기</button><button type="button" class="bt" data-ax="z" aria-pressed="true">ẑ 켜기</button></div></div>');
  H(el,'<svg viewBox="0 0 520 300" role="img" aria-label="x y z 세 축과 단위 화살표"></svg>');var sv=el.querySelector('svg'),ro=out(el);
  function iso(x,y,z){return [260+(y-x)*86,190+(x+y)*40-z*100];}
  function draw(){var o=iso(0,0,0),s='';[['x',[1.6,0,0],'#1e55c8'],['y',[0,1.6,0],'#13733a'],['z',[0,0,1.3],'#c93030']].forEach(function(a){var e=iso.apply(null,a[1]);s+='<line x1="'+o[0]+'" y1="'+o[1]+'" x2="'+e[0]+'" y2="'+e[1]+'" stroke="#16212b" stroke-width="1.5"/><text x="'+(e[0]+6)+'" y="'+(e[1]+4)+'" font-size="16">'+a[0]+'</text>';});
    var col={x:'#1e55c8',y:'#13733a',z:'#c93030'},vec={x:[0.8,0,0],y:[0,0.8,0],z:[0,0,0.8]};Object.keys(vec).forEach(function(k){if(!on[k])return;var e=iso.apply(null,vec[k]);
      s+='<line x1="'+o[0]+'" y1="'+o[1]+'" x2="'+e[0]+'" y2="'+e[1]+'" stroke="'+col[k]+'" stroke-width="5" marker-end="url(#ah'+k+')"/><text x="'+(e[0]-22)+'" y="'+(e[1]-8)+'" fill="'+col[k]+'" font-size="18" font-weight="700">'+k+'̂</text>';});
    var defs='<defs>'+['x','y','z'].map(function(k){return '<marker id="ah'+k+'" markerWidth="8" markerHeight="8" refX="5" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="'+col[k]+'"/></marker>'}).join('')+'</defs>';
    sv.innerHTML=defs+s+'<text x="12" y="22" font-size="13" fill="#5b6874">길이 1인 화살표 세 개 = 방향을 가리키는 자</text>';
    var parts=[];if(on.x)parts.push('x̂·(x쪽 기울기)');if(on.y)parts.push('ŷ·(y쪽 기울기)');if(on.z)parts.push('ẑ·(z쪽 기울기)');
    ro.innerHTML='∇ = '+(parts.join(' + ')||'(비어 있음)')+'<br>켜 둔 방향 '+parts.length+'개 → 방향별 기울기 '+parts.length+'개를 한 줄로 묶습니다. 바닥 지도(2칸)라면 ẑ를 끄면 됩니다.';}
  $$('[data-ax]',el).forEach(function(b){b.addEventListener('click',function(){var k=b.dataset.ax;on[k]=!on[k];b.setAttribute('aria-pressed',on[k]);draw();});});draw();};

/* 방 2: 그래디언트 */
MODS.grad=function(el){var R=2.5,p=[1,2],down=false;H(el,'<div class="ctrl">'+btns('gm',[['up','오르막 화살표(∇f)'],['down','내리막 화살표(−∇f)']],'up')+'<span class="glabel">캔버스를 눌러 점을 옮겨 보세요</span></div>');
  var cv=canvasBlock(el,'f=x²+y² 언덕과 기울기 화살표',360),ro=out(el);bindBtns(el,'gm',function(v){down=v==='down';draw();});
  onPick(cv,function(x,y){var W=cv.clientWidth,P=plane(W,360,R);p=[Math.round(P.ix(x)*10)/10,Math.round(P.iy(y)*10)/10];draw();});
  function draw(){var W=fit(cv,360),Hh=360,c=cv.getContext('2d'),P=plane(W,Hh,R),f=function(x,y){return x*x+y*y};c.clearRect(0,0,W,Hh);heat(c,P,W,Hh,f,0,12);contours(c,P,W,Hh,f,[1,2,4,6,8,10]);axes(c,P,W,Hh);
    var sg=down?-1:1;field(c,P,W,Hh,function(x,y){return [sg*2*x,sg*2*y]},R,'rgba(30,85,200,.55)',0.15,11);
    var g=[2*p[0],2*p[1]];arrow(c,P.X(p[0]),P.Y(p[1]),P.X(p[0])+sg*g[0]*P.s*0.25,P.Y(p[1])-sg*g[1]*P.s*0.25,down?'#13733a':'#c93030',3.5,10);
    c.fillStyle='#16212b';c.beginPath();c.arc(P.X(p[0]),P.Y(p[1]),5,0,7);c.fill();stamp(c,W,'설명용 그림');
    ro.innerHTML='점 ('+fmt(p[0],1)+', '+fmt(p[1],1)+') · 높이 f = '+fmt(f(p[0],p[1]),2)+'<br>∇f = (2x, 2y) = <b>('+fmt(g[0],1)+', '+fmt(g[1],1)+')</b> · 길이 '+fmt(Math.hypot(g[0],g[1]),2)+' — '+(down?'초록 화살표는 반대로 뒤집은 내리막 방향입니다.':'빨간 화살표가 가장 가파르게 오르는 방향입니다.');}
  LOOP.add(cv,function(dt){if(dt===0)draw();});};

/* 방 3: 발산 */
MODS.div=function(el){var R=2.5,b=[0.8,0.6],hs=0.6,mode='src';var FS={src:function(x,y){return [x,y]},sink:function(x,y){return [-x,-y]},rot:function(x,y){return [-y,x]}},DV={src:2,sink:-2,rot:0};
  H(el,'<div class="ctrl">'+btns('dm',[['src','샘 (x, y)'],['sink','배수구 (−x, −y)'],['rot','소용돌이 (−y, x)']],'src')+slider('dv-s','상자 크기',0.2,1.2,0.1,0.6)+'</div>');var cv=canvasBlock(el,'화살표 밭과 상자',360),ro=out(el);
  bindBtns(el,'dm',function(v){mode=v;draw();});$('#dv-s',el).addEventListener('input',function(){hs=+this.value;draw();});
  onPick(cv,function(x,y){var P=plane(cv.clientWidth,360,R);b=[Math.round(P.ix(x)*10)/10,Math.round(P.iy(y)*10)/10];draw();});
  function flux(F){var n=200,sum=0,s=2*hs/n;for(var i=0;i<n;i++){var t=-hs+(i+.5)*s;sum+=F(b[0]+hs,b[1]+t)[0]*s-F(b[0]-hs,b[1]+t)[0]*s+F(b[0]+t,b[1]+hs)[1]*s-F(b[0]+t,b[1]-hs)[1]*s;}return sum;}
  function draw(){var W=fit(cv,360),Hh=360,c=cv.getContext('2d'),P=plane(W,Hh,R),F=FS[mode];c.clearRect(0,0,W,Hh);grid(c,W,Hh);axes(c,P,W,Hh);field(c,P,W,Hh,F,R,'rgba(30,85,200,.5)',0.18,13);
    c.strokeStyle='#13733a';c.lineWidth=2.5;c.strokeRect(P.X(b[0]-hs),P.Y(b[1]+hs),2*hs*P.s,2*hs*P.s);
    var nOut=0,nIn=0;[[1,0],[-1,0],[0,1],[0,-1]].forEach(function(nv){for(var k=-1;k<=1;k++){var x=b[0]+nv[0]*hs+(nv[1]?k*hs*0.6:0),y=b[1]+nv[1]*hs+(nv[0]?k*hs*0.6:0),v=F(x,y),d=v[0]*nv[0]+v[1]*nv[1];
      if(d>1e-6)nOut++;else if(d<-1e-6)nIn++;arrow(c,P.X(x),P.Y(y),P.X(x)+nv[0]*d*P.s*0.25,P.Y(y)-nv[1]*d*P.s*0.25,d>0?'#c93030':'#13733a',2.5,7);}});stamp(c,W,'설명용 그림');
    var fl=flux(F),area=4*hs*hs;ro.innerHTML='상자 겉면에서 밖으로 나가는 화살표 '+nOut+'개 · 안으로 들어오는 화살표 '+nIn+'개 (빨강 = 나감, 초록 = 들어옴)<br>나가는 양 − 들어오는 양 = <b>'+fmt(fl,2)+'</b> · 상자 넓이 '+fmt(area,2)+'로 나누면 <b>'+fmt(fl/area,2)+'</b> = 발산 '+DV[mode]+' (바닥 2칸 그림이라 2. 공간 3칸이면 (x, y, z)의 발산은 3)';}
  LOOP.add(cv,function(dt){if(dt===0)draw();});};

/* 방 4: 회전 */
MODS.curl=function(el){var R=2.5,p=[1,0.5],mode='rot',ang=0;var FS={rot:function(x,y){return [-y,x]},src:function(x,y){return [x,y]},shear:function(x,y){return [y,0]}},CU={rot:2,src:0,shear:-1};
  H(el,'<div class="ctrl">'+btns('cm',[['rot','소용돌이 (−y, x)'],['src','샘 (x, y)'],['shear','미끄럼 (y, 0)']],'rot')+'<span class="glabel">눌러서 바람개비를 옮겨 보세요</span></div>');var cv=canvasBlock(el,'바람개비가 도는 화살표 밭',360),ro=out(el);
  bindBtns(el,'cm',function(v){mode=v;ang=0;draw(0);});onPick(cv,function(x,y){var P=plane(cv.clientWidth,360,R);p=[P.ix(x),P.iy(y)];draw(0);});
  function draw(dt){var W=fit(cv,360),Hh=360,c=cv.getContext('2d'),P=plane(W,Hh,R),F=FS[mode];ang+=(REDUCE?0:dt)*CU[mode]/2;c.clearRect(0,0,W,Hh);grid(c,W,Hh);axes(c,P,W,Hh);field(c,P,W,Hh,F,R,'rgba(30,85,200,.5)',0.18,13);
    c.save();c.translate(P.X(p[0]),P.Y(p[1]));c.rotate(-ang);for(var i=0;i<4;i++){c.rotate(Math.PI/2);c.fillStyle=i%2?'#c93030':'#a35c00';c.beginPath();c.moveTo(0,0);c.lineTo(22,-6);c.lineTo(22,6);c.closePath();c.fill();}c.restore();
    c.fillStyle='#16212b';c.beginPath();c.arc(P.X(p[0]),P.Y(p[1]),3,0,7);c.fill();stamp(c,W,'설명용 그림');
    if(dt===0||!REDUCE)ro.innerHTML='바람개비 위치 ('+fmt(p[0],1)+', '+fmt(p[1],1)+') · 회전 = (y쪽 바람의 x 방향 변화) − (x쪽 바람의 y 방향 변화) = <b>'+CU[mode]+'</b><br>'+(CU[mode]>0?'시계 반대 방향으로 돕니다. 어디에 두어도 같은 빠르기입니다.':CU[mode]<0?'시계 방향으로 돕니다. 화살표가 곧게 흘러도 위아래 빠르기가 다르면 돕니다.':'화살표가 많아도 바람개비는 돌지 않습니다.');}
  LOOP.add(cv,draw);};

/* 방 5: 라플라시안 */
MODS.lap=function(el){var R=2.5,p=[1,1],h=0.5,mode='bowl';var FS={bowl:function(x,y){return x*x+y*y},flat:function(x,y){return 0.8*x+0.5*y},bump:function(x,y){return 4*Math.exp(-(x*x+y*y))}};
  H(el,'<div class="ctrl">'+btns('lm',[['bowl','그릇 x²+y²'],['flat','비탈면'],['bump','봉우리']],'bowl')+slider('lp-h','이웃까지 거리',0.1,1,0.1,0.5)+'</div>');var cv=canvasBlock(el,'점과 둘레 네 이웃',340),ro=out(el);
  bindBtns(el,'lm',function(v){mode=v;draw();});$('#lp-h',el).addEventListener('input',function(){h=+this.value;draw();});onPick(cv,function(x,y){var P=plane(cv.clientWidth,340,R);p=[Math.round(P.ix(x)*10)/10,Math.round(P.iy(y)*10)/10];draw();});
  function draw(){var W=fit(cv,340),Hh=340,c=cv.getContext('2d'),P=plane(W,Hh,R),f=FS[mode];c.clearRect(0,0,W,Hh);heat(c,P,W,Hh,f,mode==='flat'?-3:0,mode==='flat'?3:(mode==='bump'?4:12));axes(c,P,W,Hh);
    var nb=[[h,0],[-h,0],[0,h],[0,-h]],avg=0;nb.forEach(function(d){avg+=f(p[0]+d[0],p[1]+d[1])/4;c.fillStyle='#1e55c8';c.beginPath();c.arc(P.X(p[0]+d[0]),P.Y(p[1]+d[1]),5,0,7);c.fill();});
    c.fillStyle='#c93030';c.beginPath();c.arc(P.X(p[0]),P.Y(p[1]),6,0,7);c.fill();stamp(c,W,'설명용 그림');var me=f(p[0],p[1]),diff=avg-me,lap=4*diff/(h*h);
    ro.innerHTML='나(빨강) '+fmt(me,3)+' · 이웃 네 점(파랑) 평균 '+fmt(avg,3)+' · 차이 '+fmt(diff,3)+'<br>차이 × 4 ÷ 거리² = <b>'+fmt(lap,2)+'</b> ≈ 라플라시안 '+(mode==='bowl'?'(그릇은 어디서나 4)':mode==='flat'?'(비탈면은 0 — 평균과 같다)':'(봉우리 꼭대기 근처는 음수 — 나만 높다)');}
  LOOP.add(cv,function(dt){if(dt===0)draw();});};

/* 방 6: 좌표 바꾸기 */
MODS.coords=function(el){var v={x:1,y:1,z:Math.SQRT2};H(el,'<div class="ctrl">'+slider('co-x','x',-2,2,0.1,1)+slider('co-y','y',-2,2,0.1,1)+slider('co-z','z',-2,2,0.01,1.41)+'</div>');
  H(el,'<svg viewBox="0 0 520 320" role="img" aria-label="점 하나를 세 가지 좌표로 읽기"></svg>');var sv=el.querySelector('svg'),ro=out(el);
  ['x','y','z'].forEach(function(k){$('#co-'+k,el).addEventListener('input',function(){v[k]=+this.value;draw();});});
  function iso(x,y,z){return [250+y*95-x*60,215+x*38+y*22-z*72];}
  function draw(){var o=iso(0,0,0),p=iso(v.x,v.y,v.z),f=iso(v.x,v.y,0),s='';[['x',[2.2,0,0]],['y',[0,2.2,0]],['z',[0,0,1.9]]].forEach(function(a){var e=iso.apply(null,a[1]);s+='<line x1="'+o[0]+'" y1="'+o[1]+'" x2="'+e[0]+'" y2="'+e[1]+'" stroke="#9aa5b1"/><text x="'+(e[0]+4)+'" y="'+e[1]+'" font-size="14">'+a[0]+'</text>';});
    s+='<line x1="'+o[0]+'" y1="'+o[1]+'" x2="'+f[0]+'" y2="'+f[1]+'" stroke="#c93030" stroke-width="3"/><text x="'+((o[0]+f[0])/2)+'" y="'+((o[1]+f[1])/2+16)+'" fill="#c93030" font-size="14">ρ</text>';
    s+='<line x1="'+f[0]+'" y1="'+f[1]+'" x2="'+p[0]+'" y2="'+p[1]+'" stroke="#a35c00" stroke-dasharray="4 3" stroke-width="2"/>';
    s+='<line x1="'+o[0]+'" y1="'+o[1]+'" x2="'+p[0]+'" y2="'+p[1]+'" stroke="#13733a" stroke-width="3"/><text x="'+((o[0]+p[0])/2-14)+'" y="'+((o[1]+p[1])/2-6)+'" fill="#13733a" font-size="14">r</text>';
    s+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="6" fill="#16212b"/>';sv.innerHTML=s;
    var rho=Math.hypot(v.x,v.y),r=Math.hypot(rho,v.z),phi=Math.atan2(v.y,v.x)*180/Math.PI,th=r?Math.acos(v.z/r)*180/Math.PI:0;['x','y','z'].forEach(function(k){$('#co-'+k+'v',el).textContent=fmt(v[k],2);});
    ro.innerHTML='직교 (x, y, z) = ('+fmt(v.x,2)+', '+fmt(v.y,2)+', '+fmt(v.z,2)+')<br>원통 (ρ, φ, z) = (<b>'+fmt(rho,2)+'</b>, <b>'+fmt(phi,1)+'°</b>, '+fmt(v.z,2)+') — 바닥 그림자 길이, 바닥에서 돈 각도, 높이<br>구 (r, θ, φ) = (<b>'+fmt(r,2)+'</b>, <b>'+fmt(th,1)+'°</b>, '+fmt(phi,1)+'°) — 원점까지 길이, 꼭대기에서 내려온 각도, 바닥에서 돈 각도';}
  draw();};

/* 방 7: 기울기 정리 */
MODS.gradthm=function(el){var R=2.6,t=1,run=false;H(el,'<div class="ctrl"><button type="button" class="bt primary" id="gt-go">두 길을 동시에 걷기</button></div>');var cv=canvasBlock(el,'두 길로 오르는 언덕',340),ro=out(el);
  var f=function(x,y){return x*x+y*y};var A=function(s){return [s,2*s]},B=function(s){return [s*s*1.0,2*Math.sin(s*Math.PI/2)]};
  function walk(path,T){var sum=0,n=200;for(var i=0;i<n;i++){var a=path(T*i/n),b=path(T*(i+1)/n),mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2;sum+=2*mx*(b[0]-a[0])+2*my*(b[1]-a[1]);}return sum;}
  $('#gt-go',el).addEventListener('click',function(){t=REDUCE?1:0;run=!REDUCE;draw(0);});
  function draw(dt){if(run){t+=dt*0.4;if(t>=1){t=1;run=false;}}var W=fit(cv,340),Hh=340,c=cv.getContext('2d'),P=plane(W,Hh,R);c.clearRect(0,0,W,Hh);heat(c,P,W,Hh,f,0,10);contours(c,P,W,Hh,f,[1,2,3,4,5,6,8]);axes(c,P,W,Hh);
    [[A,'#1e55c8'],[B,'#c42a6e']].forEach(function(q){c.strokeStyle=q[1];c.lineWidth=3;c.beginPath();for(var i=0;i<=60;i++){var p=q[0](t*i/60);i?c.lineTo(P.X(p[0]),P.Y(p[1])):c.moveTo(P.X(p[0]),P.Y(p[1]));}c.stroke();var e=q[0](t);c.fillStyle=q[1];c.beginPath();c.arc(P.X(e[0]),P.Y(e[1]),6,0,7);c.fill();});
    c.fillStyle='#16212b';c.font='13px sans-serif';c.fillText('출발 (0,0)',P.X(0)+6,P.Y(0)+16);c.fillText('도착 (1,2)',P.X(1)+8,P.Y(2));stamp(c,W,'설명용 그림');
    ro.innerHTML='파란 곧은 길에서 화살표 성분을 한 걸음씩 더한 값 <b>'+fmt(walk(A,t),2)+'</b> · 분홍 굽은 길 <b>'+fmt(walk(B,t),2)+'</b>'+(t>=1?'<br>도착하면 둘 다 5 = 도착 높이 5 − 출발 높이 0. 길은 달라도 높이 차는 같습니다.':'');}
  LOOP.add(cv,draw);};

/* 방 8: 발산 정리 */
MODS.divthm=function(el){var R=2.5,hs=1,k=0,run=false;H(el,'<div class="ctrl">'+slider('dt-s','상자 반쪽 길이',0.3,1.5,0.1,1)+'<button type="button" class="bt primary" id="dt-go">겉면 화살표 세기</button></div>');var cv=canvasBlock(el,'상자 안쪽 샘과 겉면 화살표',340),ro=out(el);
  var F=function(x,y){return [x,y]};$('#dt-s',el).addEventListener('input',function(){hs=+this.value;k=0;run=false;draw(0);});$('#dt-go',el).addEventListener('click',function(){k=REDUCE?40:0;run=!REDUCE;draw(0);});
  function pts(){var a=[],n=10;for(var i=0;i<n;i++){var t=-hs+(i+.5)*2*hs/n;a.push([hs,t,1,0],[-hs,t,-1,0],[t,hs,0,1],[t,-hs,0,-1]);}return a;}
  function draw(dt){if(run){k+=dt*20;if(k>=40){k=40;run=false;}}var W=fit(cv,340),Hh=340,c=cv.getContext('2d'),P=plane(W,Hh,R);c.clearRect(0,0,W,Hh);grid(c,W,Hh);axes(c,P,W,Hh);
    c.fillStyle='rgba(19,115,58,.08)';c.fillRect(P.X(-hs),P.Y(hs),2*hs*P.s,2*hs*P.s);c.strokeStyle='#13733a';c.lineWidth=2;c.strokeRect(P.X(-hs),P.Y(hs),2*hs*P.s,2*hs*P.s);
    var A=pts(),sum=0,seg=2*hs/10;A.forEach(function(q,i){if(i>=k)return;var v=F(q[0],q[1]),d=v[0]*q[2]+v[1]*q[3];sum+=d*seg;arrow(c,P.X(q[0]),P.Y(q[1]),P.X(q[0])+q[2]*d*P.s*0.3,P.Y(q[1])-q[3]*d*P.s*0.3,'#c93030',2,6);});
    stamp(c,W,'설명용 그림');var inside=2*(2*hs)*(2*hs);ro.innerHTML='안쪽 샘의 합 = 발산 2 × 넓이 '+fmt(4*hs*hs,2)+' = <b>'+fmt(inside,2)+'</b><br>겉면 화살표 '+Math.floor(k)+'/40개 센 합 = <b>'+fmt(sum,2)+'</b>'+(k>=40?' → 같습니다. 안에서 솟은 만큼 겉으로 나갑니다.':'');}
  LOOP.add(cv,draw);};

/* 방 9: 스토크스 */
MODS.stokes=function(el){var R=2.5,r=1,k=0,run=false;H(el,'<div class="ctrl">'+slider('sk-r','원 반지름',0.3,2,0.1,1)+'<button type="button" class="bt primary" id="sk-go">테두리 한 칸씩 더하기</button></div>');var cv=canvasBlock(el,'원 테두리와 안쪽 바람개비',340),ro=out(el);
  var F=function(x,y){return [-y,x]},N=72;$('#sk-r',el).addEventListener('input',function(){r=+this.value;k=0;run=false;draw(0);});$('#sk-go',el).addEventListener('click',function(){k=REDUCE?N:0;run=!REDUCE;draw(0);});
  function draw(dt){if(run){k+=dt*36;if(k>=N){k=N;run=false;}}var W=fit(cv,340),Hh=340,c=cv.getContext('2d'),P=plane(W,Hh,R);c.clearRect(0,0,W,Hh);grid(c,W,Hh);axes(c,P,W,Hh);field(c,P,W,Hh,F,R,'rgba(30,85,200,.35)',0.18,11);
    c.fillStyle='rgba(163,92,0,.08)';c.beginPath();c.arc(P.X(0),P.Y(0),r*P.s,0,7);c.fill();var sum=0;for(var i=0;i<N;i++){var a0=2*Math.PI*i/N,a1=2*Math.PI*(i+1)/N,x0=r*Math.cos(a0),y0=r*Math.sin(a0),x1=r*Math.cos(a1),y1=r*Math.sin(a1),mx=(x0+x1)/2,my=(y0+y1)/2,v=F(mx,my),d=v[0]*(x1-x0)+v[1]*(y1-y0);
      c.strokeStyle=i<k?'#c93030':'#d5dbe2';c.lineWidth=4;c.beginPath();c.moveTo(P.X(x0),P.Y(y0));c.lineTo(P.X(x1),P.Y(y1));c.stroke();if(i<k)sum+=d;}
    stamp(c,W,'설명용 그림');ro.innerHTML='안쪽 바람개비의 합 = 회전 2 × 원 넓이 '+fmt(Math.PI*r*r,2)+' = <b>'+fmt(2*Math.PI*r*r,2)+'</b><br>테두리를 따라 더한 값('+Math.floor(k)+'/'+N+'칸) = <b>'+fmt(sum,2)+'</b>'+(k>=N?' → 같습니다. 반지름 1이면 둘 다 2π ≈ 6.28':'');}
  LOOP.add(cv,draw);};

/* 두 항등식 */
MODS.ident=function(el){var R=2.5,mode='g',p=[0.7,0.4];var psi=function(x,y){return Math.sin(1.3*x)*Math.cos(1.1*y)+0.5*Math.sin(0.7*x+1.7*y)};var d=1e-3;
  function gx(x,y){return (psi(x+d,y)-psi(x-d,y))/(2*d)}function gy(x,y){return (psi(x,y+d)-psi(x,y-d))/(2*d)}
  var FS={g:function(x,y){return [gx(x,y),gy(x,y)]},c:function(x,y){return [gy(x,y),-gx(x,y)]}};
  H(el,'<div class="ctrl">'+btns('im',[['g','언덕에서 만든 화살표 (∇f)'],['c','소용돌이에서 만든 화살표 (회전)']],'g')+'<span class="glabel">눌러서 재는 점을 옮겨 보세요</span></div>');var cv=canvasBlock(el,'두 가지 화살표 밭',340),ro=out(el);
  bindBtns(el,'im',function(v){mode=v;draw();});onPick(cv,function(x,y){var P=plane(cv.clientWidth,340,R);p=[P.ix(x),P.iy(y)];draw();});
  function draw(){var W=fit(cv,340),Hh=340,c=cv.getContext('2d'),P=plane(W,Hh,R),F=FS[mode];c.clearRect(0,0,W,Hh);heat(c,P,W,Hh,psi,-1.5,1.5,function(t){return 'rgba(155,63,181,'+(0.05+0.25*t)+')'});field(c,P,W,Hh,F,R,'rgba(30,85,200,.6)',0.4,15);
    var h=1e-2,x=p[0],y=p[1];var dv=(F(x+h,y)[0]-F(x-h,y)[0]+F(x,y+h)[1]-F(x,y-h)[1])/(2*h),cu=(F(x+h,y)[1]-F(x-h,y)[1]-F(x,y+h)[0]+F(x,y-h)[0])/(2*h);
    c.fillStyle='#16212b';c.beginPath();c.arc(P.X(x),P.Y(y),5,0,7);c.fill();stamp(c,W,'설명용 그림');
    ro.innerHTML='재는 점 ('+fmt(x,2)+', '+fmt(y,2)+') · 회전 = <b>'+fmt(cu,3)+'</b> · 발산 = <b>'+fmt(dv,3)+'</b><br>'+(mode==='g'?'언덕에서 만든 화살표는 어디를 재도 회전 0 — 돌지 않습니다.':'소용돌이에서 만든 화살표는 어디를 재도 발산 0 — 샘이 없습니다.');}
  LOOP.add(cv,function(dt){if(dt===0)draw();});};

/* 방 10: 경사 하강 */
MODS.gd=function(el){var R=2.6,lr=0.1,start=[1,2],path=[[1,2]],shape='round';var FS={round:[1,1],long:[0.3,3]};
  H(el,'<div class="ctrl">'+slider('gd-lr','학습률(보폭)',0.02,0.9,0.02,0.1)+btns('gs',[['round','둥근 그릇'],['long','길쭉한 그릇']],'round')+'<button type="button" class="bt primary" id="gd-step">한 걸음</button><button type="button" class="bt" id="gd-10">열 걸음</button><button type="button" class="bt" id="gd-rs">처음으로</button></div>');
  var cv=canvasBlock(el,'손실 그릇 위 경사 하강',340),ro=out(el);function L(x,y){var a=FS[shape];return a[0]*x*x+a[1]*y*y}function G(x,y){var a=FS[shape];return [2*a[0]*x,2*a[1]*y]}
  function step(){var p=path[path.length-1],g=G(p[0],p[1]);path.push([p[0]-lr*g[0],p[1]-lr*g[1]]);}
  $('#gd-lr',el).addEventListener('input',function(){lr=+this.value;path=[start.slice()];draw();});bindBtns(el,'gs',function(v){shape=v;path=[start.slice()];draw();});
  $('#gd-step',el).addEventListener('click',function(){step();draw();});$('#gd-10',el).addEventListener('click',function(){for(var i=0;i<10;i++)step();draw();});$('#gd-rs',el).addEventListener('click',function(){path=[start.slice()];draw();});
  onPick(cv,function(x,y){var P=plane(cv.clientWidth,340,R);start=[Math.round(P.ix(x)*10)/10,Math.round(P.iy(y)*10)/10];path=[start.slice()];draw();});
  function draw(){var W=fit(cv,340),Hh=340,c=cv.getContext('2d'),P=plane(W,Hh,R);c.clearRect(0,0,W,Hh);heat(c,P,W,Hh,L,0,12);contours(c,P,W,Hh,L,[.5,1,2,3,5,7,9]);axes(c,P,W,Hh);
    c.strokeStyle='#13733a';c.lineWidth=2;c.beginPath();path.forEach(function(p,i){var x=Math.max(-50,Math.min(50,p[0])),y=Math.max(-50,Math.min(50,p[1]));i?c.lineTo(P.X(x),P.Y(y)):c.moveTo(P.X(x),P.Y(y));});c.stroke();
    path.forEach(function(p){c.fillStyle='#13733a';c.beginPath();c.arc(P.X(p[0]),P.Y(p[1]),3.5,0,7);c.fill();});stamp(c,W,'설명용 모형 · 실제 데이터 아님');$('#gd-lrv',el).textContent=fmt(lr,2);
    var p=path[path.length-1],last=L(p[0],p[1]);ro.innerHTML='걸음 '+(path.length-1)+' · 위치 ('+fmt(p[0],3)+', '+fmt(p[1],3)+') · 손실 <b>'+fmt(last,4)+'</b>'+(path.length>1?'<br>첫 걸음: ('+fmt(path[0][0],2)+', '+fmt(path[0][1],2)+') → ('+fmt(path[1][0],3)+', '+fmt(path[1][1],3)+')':'')+(last>1e3||!isFinite(last)?'<br>보폭이 너무 커서 그릇 밖으로 튕겨 나갔습니다.':'');}
  LOOP.add(cv,function(dt){if(dt===0)draw();});};

/* 방 11: 라그랑주 (원 위 x+y) */
MODS.lagrange=function(el){var R=1.8,deg=20;H(el,'<div class="ctrl">'+slider('lg-a','원 위의 위치(각도)',0,360,1,20)+'</div>');var cv=canvasBlock(el,'원 울타리와 높이선',340),ro=out(el);
  $('#lg-a',el).addEventListener('input',function(){deg=+this.value;draw();});
  function draw(){var W=fit(cv,340),Hh=340,c=cv.getContext('2d'),P=plane(W,Hh,R),f=function(x,y){return x+y};c.clearRect(0,0,W,Hh);heat(c,P,W,Hh,f,-2.5,2.5,function(t){return 'rgba(19,115,58,'+(0.04+0.3*t)+')'});
    contours(c,P,W,Hh,f,[-2,-1.5,-1,-0.5,0,0.5,1,1.5,2]);axes(c,P,W,Hh);c.strokeStyle='#c93030';c.lineWidth=3;c.beginPath();c.arc(P.X(0),P.Y(0),P.s,0,7);c.stroke();
    var a=deg*Math.PI/180,x=Math.cos(a),y=Math.sin(a),k=P.s*0.45;arrow(c,P.X(x),P.Y(y),P.X(x)+1*k,P.Y(y)-1*k,'#13733a',3,9);arrow(c,P.X(x),P.Y(y),P.X(x)+2*x*k*0.5,P.Y(y)-2*y*k*0.5,'#c93030',3,9);
    c.fillStyle='#16212b';c.beginPath();c.arc(P.X(x),P.Y(y),6,0,7);c.fill();stamp(c,W,'설명용 그림');$('#lg-av',el).textContent=deg+'°';
    var cos=(x+y)/Math.SQRT2;var ang=Math.acos(Math.max(-1,Math.min(1,cos)))*180/Math.PI;
    ro.innerHTML='위치 ('+fmt(x,3)+', '+fmt(y,3)+') · 점수 x+y = <b>'+fmt(x+y,3)+'</b><br>초록 ∇f=(1,1)과 빨강 ∇g=(2x,2y) 사이 각도 '+fmt(ang,1)+'°'+(Math.abs(deg-45)<=1?' → 나란해졌습니다. 여기가 최고점 (1/√2, 1/√2), 점수 √2 ≈ 1.414, λ = 1/(2x) ≈ 0.707':' — 나란해지는 곳을 찾아보세요.');}
  LOOP.add(cv,function(dt){if(dt===0)draw();});};

/* 방 12·14: 헤시안 */
MODS.hessian=function(el){var R=2.5,shape='bowl',p=[1.5,1.2],trail=[];var S={bowl:[2,2],saddle:[2,-2],dome:[-2,-2]},NM={bowl:'그릇',saddle:'안장',dome:'봉우리'};
  H(el,'<div class="ctrl">'+btns('hs',[['bowl','그릇 x²+y²'],['saddle','안장 x²−y²'],['dome','봉우리 −(x²+y²)']],'bowl')+'<button type="button" class="bt" id="hs-gd">경사 하강 한 걸음</button><button type="button" class="bt primary" id="hs-nt">뉴턴 한 걸음</button><button type="button" class="bt" id="hs-rs">처음으로</button></div>');
  var cv=canvasBlock(el,'곡면 모양과 두 가지 걸음',340),ro=out(el),msg='';function f(x,y){var a=S[shape];return a[0]/2*x*x+a[1]/2*y*y}
  bindBtns(el,'hs',function(v){shape=v;p=[1.5,1.2];trail=[];msg='';draw();});$('#hs-rs',el).addEventListener('click',function(){p=[1.5,1.2];trail=[];msg='';draw();});
  $('#hs-gd',el).addEventListener('click',function(){var a=S[shape];trail.push(p.slice());p=[p[0]-0.2*a[0]*p[0],p[1]-0.2*a[1]*p[1]];msg='경사 하강: 기울기만 보고 0.2배 보폭으로 내려갑니다.';draw();});
  $('#hs-nt',el).addEventListener('click',function(){trail.push(p.slice());p=[0,0];msg=shape==='bowl'?'뉴턴: 굽은 정도까지 알면 그릇 바닥으로 한 번에 갑니다.':'뉴턴: 기울기 0인 점으로 갔지만, 여기는 바닥이 아닙니다('+NM[shape]+'). 굽은 정도의 부호를 꼭 봐야 합니다.';draw();});
  function draw(){var W=fit(cv,340),Hh=340,c=cv.getContext('2d'),P=plane(W,Hh,R),a=S[shape];c.clearRect(0,0,W,Hh);heat(c,P,W,Hh,f,-6,6,function(t){return 'rgba('+(t>.5?'201,48,44':'30,85,200')+','+(0.05+0.4*Math.abs(t-.5))+')'});
    contours(c,P,W,Hh,f,[-5,-4,-3,-2,-1,-.5,.5,1,2,3,4,5]);axes(c,P,W,Hh);c.strokeStyle='#13733a';c.lineWidth=2;c.beginPath();trail.concat([p]).forEach(function(q,i){i?c.lineTo(P.X(q[0]),P.Y(q[1])):c.moveTo(P.X(q[0]),P.Y(q[1]));});c.stroke();
    c.fillStyle='#16212b';c.beginPath();c.arc(P.X(p[0]),P.Y(p[1]),6,0,7);c.fill();stamp(c,W,'설명용 그림');
    var kind=a[0]>0&&a[1]>0?'두 수 모두 + → 그릇(가장 낮은 점)':a[0]<0&&a[1]<0?'두 수 모두 − → 봉우리(가장 높은 점)':'+와 − 섞임 → 안장';
    ro.innerHTML='헤시안(굽은 정도 표) = [['+a[0]+', 0], [0, '+a[1]+']] · 고윳값 <b>'+a[0]+', '+a[1]+'</b> → '+kind+'<br>위치 ('+fmt(p[0],3)+', '+fmt(p[1],3)+') · 높이 '+fmt(f(p[0],p[1]),3)+(msg?'<br>'+msg:'');}
  LOOP.add(cv,function(dt){if(dt===0)draw();});};

/* 방 13: 역전파 */
MODS.backprop=function(el){var x=1;H(el,'<div class="ctrl">'+slider('bp-x','입력 x',-2,2,0.1,1)+'</div>');H(el,'<svg viewBox="0 0 560 190" role="img" aria-label="x에서 u, u에서 y로 이어지는 계산 사슬"></svg>');var sv=el.querySelector('svg'),ro=out(el);
  $('#bp-x',el).addEventListener('input',function(){x=+this.value;draw();});
  function box(cx,lab,val,col){return '<rect x="'+(cx-60)+'" y="50" width="120" height="64" rx="12" fill="#fff" stroke="'+col+'" stroke-width="2"/><text x="'+cx+'" y="76" text-anchor="middle" font-size="15" fill="'+col+'">'+lab+'</text><text x="'+cx+'" y="100" text-anchor="middle" font-size="17" font-weight="700">'+val+'</text>';}
  function draw(){var u=2*x,y=u*u,du=2,dy=2*u;$('#bp-xv',el).textContent=fmt(x,1);
    sv.innerHTML='<defs><marker id="bpa" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8z" fill="#5b6874"/></marker><marker id="bpb" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8z" fill="#c42a6e"/></marker></defs>'+
      box(90,'입력 x',fmt(x,1),'#1e55c8')+box(280,'속 u = 2x',fmt(u,1),'#9b3fb5')+box(470,'겉 y = u²',fmt(y,2),'#13733a')+
      '<line x1="152" y1="70" x2="216" y2="70" stroke="#5b6874" stroke-width="2" marker-end="url(#bpa)"/><line x1="342" y1="70" x2="406" y2="70" stroke="#5b6874" stroke-width="2" marker-end="url(#bpa)"/>'+
      '<line x1="406" y1="98" x2="342" y2="98" stroke="#c42a6e" stroke-width="2" marker-end="url(#bpb)"/><line x1="216" y1="98" x2="152" y2="98" stroke="#c42a6e" stroke-width="2" marker-end="url(#bpb)"/>'+
      '<text x="374" y="140" text-anchor="middle" font-size="14" fill="#c42a6e">겉 미분 2u = '+fmt(dy,1)+'</text><text x="184" y="140" text-anchor="middle" font-size="14" fill="#c42a6e">속 미분 2</text>'+
      '<text x="280" y="178" text-anchor="middle" font-size="15" fill="#c42a6e" font-weight="700">뒤로 전달: '+fmt(dy,1)+' × 2 = '+fmt(dy*du,1)+'</text><text x="280" y="30" text-anchor="middle" font-size="13" fill="#5b6874">앞으로 계산 →  /  ← 뒤로 기울기 전달</text>';
    var e=0.01,y2=Math.pow(2*(x+e),2);ro.innerHTML='x에서 y까지 기울기 = 겉 미분 × 속 미분 = '+fmt(dy,1)+' × 2 = <b>'+fmt(8*x,2)+'</b><br>확인: x를 0.01 늘리면 y는 '+fmt(y,4)+' → '+fmt(y2,4)+', 변화 '+fmt(y2-y,4)+' ≈ '+fmt(8*x,2)+' × 0.01';}
  draw();};

/* 방 14: 안장에서 빠져나오기 */
MODS.saddle=function(el){var R=2,lr=0.1,p=[1.5,0.001],path=[],n=0;function f(x,y){return x*x+0.5*Math.pow(y*y-1,2)}function g(x,y){return [2*x,2*y*(y*y-1)]}
  H(el,'<div class="ctrl"><button type="button" class="bt primary" id="sd-go">스무 걸음</button><button type="button" class="bt" id="sd-kick">작은 흔들림 더하기</button><button type="button" class="bt" id="sd-rs">처음으로</button></div>');var cv=canvasBlock(el,'안장점 근처의 경사 하강',320),ro=out(el);
  function reset(){p=[1.5,0.001];path=[p.slice()];n=0;}reset();
  $('#sd-go',el).addEventListener('click',function(){for(var i=0;i<20;i++){var q=g(p[0],p[1]);p=[p[0]-lr*q[0],p[1]-lr*q[1]];path.push(p.slice());n++;}draw();});
  $('#sd-kick',el).addEventListener('click',function(){p=[p[0],p[1]+0.15];path.push(p.slice());draw();});$('#sd-rs',el).addEventListener('click',function(){reset();draw();});
  function draw(){var W=fit(cv,320),Hh=320,c=cv.getContext('2d'),P=plane(W,Hh,R);c.clearRect(0,0,W,Hh);heat(c,P,W,Hh,f,0,4);contours(c,P,W,Hh,f,[.1,.3,.5,.75,1,1.5,2,3]);axes(c,P,W,Hh);
    c.strokeStyle='#13733a';c.lineWidth=2;c.beginPath();path.forEach(function(q,i){i?c.lineTo(P.X(q[0]),P.Y(q[1])):c.moveTo(P.X(q[0]),P.Y(q[1]));});c.stroke();c.fillStyle='#16212b';c.beginPath();c.arc(P.X(p[0]),P.Y(p[1]),6,0,7);c.fill();
    c.fillStyle='#c93030';[[0,1],[0,-1]].forEach(function(m){c.beginPath();c.arc(P.X(m[0]),P.Y(m[1]),5,0,7);c.fill();});c.fillStyle='#a35c00';c.beginPath();c.arc(P.X(0),P.Y(0),5,0,7);c.fill();stamp(c,W,'설명용 모형 · 실제 데이터 아님');
    ro.innerHTML='걸음 '+n+' · 위치 ('+fmt(p[0],3)+', '+fmt(p[1],3)+') · 손실 <b>'+fmt(f(p[0],p[1]),3)+'</b><br>'+(Math.abs(p[1])>0.9?'바닥(빨간 점 y = ±1, 손실 0)에 닿았습니다.':Math.abs(p[1])>0.3?'안장에서 빠져나와 바닥으로 내려가는 중입니다.':Math.abs(p[0])<0.05?'안장(노란 점, 손실 0.5) 근처에서 거의 멈췄습니다. 기울기가 0에 가까워 빠져나오기 느립니다.':'안장 쪽으로 미끄러지는 중입니다.');}
  LOOP.add(cv,function(dt){if(dt===0)draw();});};

/* 방 15: GAN 도는 학습 */
MODS.gan=function(el){var R=3,eta=0.2,mode='sim',p=[1,0],path=[],k=0;H(el,'<div class="ctrl">'+btns('gm2',[['sim','동시에 한 걸음'],['alt','번갈아 한 걸음']],'sim')+'<button type="button" class="bt primary" id="gn-go">열 걸음</button><button type="button" class="bt" id="gn-rs">처음으로</button></div>');
  var cv=canvasBlock(el,'두 선수의 화살표 밭',340),ro=out(el);function reset(){p=[1,0];path=[p.slice()];k=0;}reset();bindBtns(el,'gm2',function(v){mode=v;reset();draw();});
  $('#gn-go',el).addEventListener('click',function(){for(var i=0;i<10;i++){var x=p[0],y=p[1];if(mode==='sim'){p=[x-eta*y,y+eta*x];}else{var nx=x-eta*y;p=[nx,y+eta*nx];}path.push(p.slice());k++;}draw();});$('#gn-rs',el).addEventListener('click',function(){reset();draw();});
  function draw(){var W=fit(cv,340),Hh=340,c=cv.getContext('2d'),P=plane(W,Hh,R);c.clearRect(0,0,W,Hh);grid(c,W,Hh);axes(c,P,W,Hh);field(c,P,W,Hh,function(x,y){return [-y,x]},R,'rgba(30,85,200,.4)',0.18,11);
    c.strokeStyle='#c42a6e';c.lineWidth=2;c.beginPath();path.forEach(function(q,i){var x=Math.max(-9,Math.min(9,q[0])),y=Math.max(-9,Math.min(9,q[1]));i?c.lineTo(P.X(x),P.Y(y)):c.moveTo(P.X(x),P.Y(y));});c.stroke();c.fillStyle='#16212b';c.beginPath();c.arc(P.X(p[0]),P.Y(p[1]),5,0,7);c.fill();
    c.fillStyle='#13733a';c.beginPath();c.arc(P.X(0),P.Y(0),5,0,7);c.fill();stamp(c,W,'단순화한 학습 규칙');var r=Math.hypot(p[0],p[1]);
    ro.innerHTML='걸음 '+k+' · 균형점(초록, 0,0)까지 거리 <b>'+fmt(r,3)+'</b> (처음 1)<br>'+(mode==='sim'?'동시에 걸으면 한 걸음마다 거리가 √(1+0.2²) ≈ 1.02배 — 빙빙 돌며 멀어집니다.':'번갈아 걸으면 거리가 크게 늘지 않고 같은 고리를 맴돕니다. 그래도 가운데로 들어오지는 않습니다.');}
  LOOP.add(cv,function(dt){if(dt===0)draw();});};

/* 방 16: 표면 법선 */
MODS.normal=function(el){var R=5.4,p=[3,4],ld=45;H(el,'<div class="ctrl">'+slider('nm-l','빛이 오는 방향',0,360,1,45)+'<span class="glabel">눌러서 점을 옮겨 보세요</span></div>');var cv=canvasBlock(el,'공의 단면, 거리, 법선, 밝기',340),ro=out(el);
  $('#nm-l',el).addEventListener('input',function(){ld=+this.value;draw();});onPick(cv,function(x,y){var P=plane(cv.clientWidth,340,R);p=[Math.round(P.ix(x)*10)/10,Math.round(P.iy(y)*10)/10];draw();});
  function draw(){var W=fit(cv,340),Hh=340,c=cv.getContext('2d'),P=plane(W,Hh,R);c.clearRect(0,0,W,Hh);grid(c,W,Hh);axes(c,P,W,Hh);var la=ld*Math.PI/180,L=[Math.cos(la),Math.sin(la)];
    for(var i=0;i<120;i++){var a0=i/120*2*Math.PI,a1=(i+1)/120*2*Math.PI,n=[Math.cos((a0+a1)/2),Math.sin((a0+a1)/2)],b=Math.max(0,n[0]*L[0]+n[1]*L[1]);c.fillStyle='rgb('+Math.round(40+200*b)+','+Math.round(40+180*b)+','+Math.round(60+120*b)+')';
      c.beginPath();c.moveTo(P.X(0),P.Y(0));c.arc(P.X(0),P.Y(0),P.s,-a1,-a0);c.closePath();c.fill();}
    arrow(c,P.X(L[0]*4.5),P.Y(L[1]*4.5),P.X(L[0]*2.2),P.Y(L[1]*2.2),'#a35c00',3,10);var r=Math.hypot(p[0],p[1])||1e-9,nn=[p[0]/r,p[1]/r],d=r-1;
    c.strokeStyle='#5b6874';c.setLineDash([4,4]);c.beginPath();c.moveTo(P.X(p[0]),P.Y(p[1]));c.lineTo(P.X(nn[0]),P.Y(nn[1]));c.stroke();c.setLineDash([]);
    arrow(c,P.X(nn[0]),P.Y(nn[1]),P.X(nn[0]*2),P.Y(nn[1]*2),'#c93030',3,9);c.fillStyle='#16212b';c.beginPath();c.arc(P.X(p[0]),P.Y(p[1]),5,0,7);c.fill();stamp(c,W,'설명용 그림');$('#nm-lv',el).textContent=ld+'°';
    var br=Math.max(0,nn[0]*L[0]+nn[1]*L[1]);ro.innerHTML='점 p = ('+fmt(p[0],1)+', '+fmt(p[1],1)+') · 공 겉면까지 거리 d = |p| − 1 = <b>'+fmt(d,2)+'</b><br>거리의 기울기 = 법선 = p ÷ |p| = <b>('+fmt(nn[0],2)+', '+fmt(nn[1],2)+')</b> · 그 자리 밝기 = 법선과 빛의 겹침 점수 '+fmt(br,2);}
  LOOP.add(cv,function(dt){if(dt===0)draw();});};

/* 방 17: 회전으로 만든 바람 (curl noise) */
MODS.curlnoise=function(el){var mode='curl',N=420,pts=[],r0=rng(17),R=3;function psi(x,y){return Math.sin(1.1*x+0.3)*Math.cos(0.9*y)+0.6*Math.sin(0.5*x-1.3*y+1)}var d=1e-3;
  function gx(x,y){return (psi(x+d,y)-psi(x-d,y))/(2*d)}function gy(x,y){return (psi(x,y+d)-psi(x,y-d))/(2*d)}
  function V(x,y){return mode==='curl'?[gy(x,y),-gx(x,y)]:[gx(x,y),gy(x,y)];}
  function reset(){r0=rng(17);pts=[];for(var i=0;i<N;i++)pts.push([-R+2*R*r0(),-R+2*R*r0()]);}reset();
  H(el,'<div class="ctrl">'+btns('cn',[['curl','회전으로 만든 바람'],['grad','기울기로 만든 바람']],'curl')+'<button type="button" class="bt" id="cn-rs">처음으로</button></div>');var cv=canvasBlock(el,'연기 입자 흐름',340),ro=out(el),t=0;
  bindBtns(el,'cn',function(v){mode=v;reset();t=0;});$('#cn-rs',el).addEventListener('click',function(){reset();t=0;draw(0);});
  function clump(){var g={},n=6;pts.forEach(function(p){var k=Math.floor((p[0]+R)/(2*R)*n)+','+Math.floor((p[1]+R)/(2*R)*n);g[k]=(g[k]||0)+1;});var m=N/(n*n),v=0;for(var i=0;i<n;i++)for(var j=0;j<n;j++){var q=g[i+','+j]||0;v+=(q-m)*(q-m);}return Math.sqrt(v/(n*n))/m;}
  function draw(dt){var W=fit(cv,340),Hh=340,c=cv.getContext('2d'),P=plane(W,Hh,R);if(!REDUCE&&dt>0){t+=dt;pts.forEach(function(p){var v=V(p[0],p[1]);p[0]+=v[0]*dt*0.8;p[1]+=v[1]*dt*0.8;if(p[0]<-R)p[0]+=2*R;if(p[0]>R)p[0]-=2*R;if(p[1]<-R)p[1]+=2*R;if(p[1]>R)p[1]-=2*R;});}
    c.clearRect(0,0,W,Hh);c.fillStyle='#fff';c.fillRect(0,0,W,Hh);c.fillStyle=mode==='curl'?'rgba(30,85,200,.7)':'rgba(201,48,44,.7)';pts.forEach(function(p){c.fillRect(P.X(p[0])-1.5,P.Y(p[1])-1.5,3,3);});stamp(c,W,'설명용 모형 · 실제 데이터 아님');
    if(dt===0||Math.floor(t*4)!==Math.floor((t-dt)*4))ro.innerHTML='흐른 시간 '+fmt(t,1)+'초 · 뭉침 지수 <b>'+fmt(clump(),2)+'</b> (0에 가까울수록 고르게 퍼짐, 처음 값은 약 0.3)<br>'+(mode==='curl'?'회전으로 만든 바람은 발산 0 — 입자가 한곳에 쌓이지 않고 소용돌이칩니다.':'기울기로 만든 바람은 샘과 배수구가 있어 입자가 골짜기로 모입니다.');}
  LOOP.add(cv,draw);};

/* 방 18: 점수 화살표로 그림 만들기 */
MODS.score=function(el){var R=3,N=300,pts=[],r0=rng(5),t=0,run=false;var C=[[-1.3,0.8],[1.4,-0.6]],s2=0.25;
  function grad(x,y){var w=C.map(function(c){return Math.exp(-((x-c[0])*(x-c[0])+(y-c[1])*(y-c[1]))/(2*s2))}),S=w[0]+w[1]+1e-12,gx=0,gy=0;C.forEach(function(c,i){gx+=w[i]*(c[0]-x)/s2;gy+=w[i]*(c[1]-y)/s2;});return [gx/S,gy/S];}
  function reset(){r0=rng(5);pts=[];for(var i=0;i<N;i++)pts.push([-R+2*R*r0(),-R+2*R*r0()]);t=0;run=false;}reset();
  H(el,'<div class="ctrl"><button type="button" class="bt primary" id="sc-go">화살표 따라 걷기</button><button type="button" class="bt" id="sc-rs">잡음으로 되돌리기</button></div>');var cv=canvasBlock(el,'잡음 점이 데이터 모양으로 모임',340),ro=out(el);
  $('#sc-go',el).addEventListener('click',function(){run=true;if(REDUCE){for(var i=0;i<200;i++)stepAll(0.02);run=false;draw(0);}});$('#sc-rs',el).addEventListener('click',function(){reset();draw(0);});
  var nz=rng(9);function stepAll(e){pts.forEach(function(p){var g=grad(p[0],p[1]);var noise=Math.sqrt(2*e)*0.35;p[0]+=e*g[0]+noise*gauss(nz);p[1]+=e*g[1]+noise*gauss(nz);});t+=e;}
  function draw(dt){if(run&&dt>0){stepAll(0.02);if(t>4)run=false;}var W=fit(cv,340),Hh=340,c=cv.getContext('2d'),P=plane(W,Hh,R);c.clearRect(0,0,W,Hh);
    heat(c,P,W,Hh,function(x,y){return C.reduce(function(s,q){return s+Math.exp(-((x-q[0])*(x-q[0])+(y-q[1])*(y-q[1]))/(2*s2))},0)},0,1,function(u){return 'rgba(19,115,58,'+(0.02+0.18*u)+')'});
    field(c,P,W,Hh,grad,R,'rgba(30,85,200,.35)',0.08,11);c.fillStyle='#16212b';pts.forEach(function(p){c.fillRect(P.X(p[0])-1.5,P.Y(p[1])-1.5,3,3);});stamp(c,W,'설명용 모형 · 실제 데이터 아님');
    var near=pts.filter(function(p){return C.some(function(q){return Math.hypot(p[0]-q[0],p[1]-q[1])<0.8})}).length;ro.innerHTML='데이터가 짙은 곳(초록 두 덩어리) 가까이 모인 점 <b>'+Math.round(near/N*100)+'%</b> · 걸은 시간 '+fmt(t,2)+'<br>파란 화살표 = 데이터가 더 짙어지는 쪽(∇log p). 잡음에서 출발해 이 화살표를 따라가면 데이터 모양이 됩니다.';}
  LOOP.add(cv,draw);};

/* 방 19: 가마 온도 퍼짐 (2D 격자) */
MODS.kiln=function(el){var nx=11,ny=7,T=[],run=false,steps=0;function reset(){T=[];for(var j=0;j<ny;j++){var row=[];for(var i=0;i<nx;i++)row.push(900);T.push(row);}T[3][5]=880;T[1][2]=960;T[5][8]=850;steps=0;}reset();
  H(el,'<div class="ctrl"><button type="button" class="bt primary" id="kl-go">시간 흘리기</button><button type="button" class="bt" id="kl-rs">처음으로</button><span class="glabel">칸을 누르면 그 칸이 30℃ 데워집니다</span></div>');var cv=canvasBlock(el,'가마 단면 온도 격자',300),ro=out(el);
  function step(){var a=0.2,N=T.map(function(r){return r.slice()});for(var j=0;j<ny;j++)for(var i=0;i<nx;i++){var s=0,c=0;[[1,0],[-1,0],[0,1],[0,-1]].forEach(function(d){var x=i+d[0],y=j+d[1];if(x>=0&&x<nx&&y>=0&&y<ny){s+=T[y][x];c++;}});N[j][i]=T[j][i]+a*(s-c*T[j][i]);}T=N;steps++;}
  $('#kl-go',el).addEventListener('click',function(){run=!run;this.textContent=run?'멈추기':'시간 흘리기';if(REDUCE){for(var i=0;i<20;i++)step();run=false;draw(0);}});$('#kl-rs',el).addEventListener('click',function(){reset();run=false;$('#kl-go',el).textContent='시간 흘리기';draw(0);});
  cv.addEventListener('pointerdown',function(e){var r=cv.getBoundingClientRect(),i=Math.floor((e.clientX-r.left)/r.width*nx),j=Math.floor((e.clientY-r.top)/300*ny);if(T[j]&&T[j][i]!==undefined){T[j][i]+=30;draw(0);}});
  var acc=0;function draw(dt){if(run&&dt>0){acc+=dt;if(acc>0.12){acc=0;step();}}var W=fit(cv,300),Hh=300,c=cv.getContext('2d'),cw=W/nx,ch=Hh/ny;c.clearRect(0,0,W,Hh);
    for(var j=0;j<ny;j++)for(var i=0;i<nx;i++){var u=Math.max(0,Math.min(1,(T[j][i]-840)/130));c.fillStyle='rgb('+Math.round(255)+','+Math.round(235-150*u)+','+Math.round(200-170*u)+')';c.fillRect(i*cw,j*ch,cw-1,ch-1);
      c.fillStyle='#16212b';c.font='11px sans-serif';c.fillText(Math.round(T[j][i]),i*cw+4,j*ch+ch/2+4);}
    c.strokeStyle='#1e55c8';c.lineWidth=3;c.strokeRect(5*cw,3*ch,cw,ch);stamp(c,W,'가상 수치');var me=T[3][5],av=(T[2][5]+T[4][5]+T[3][4]+T[3][6])/4;
    ro.innerHTML='파란 테두리 칸 '+fmt(me,1)+'℃ · 둘레 네 칸 평균 '+fmt(av,1)+'℃ · 차이(라플라시안 방향) <b>'+(av-me>=0?'+':'')+fmt(av-me,1)+'</b> → '+(av-me>0.05?'데워집니다':av-me<-0.05?'식습니다':'거의 그대로입니다')+' · 시간 '+steps+'칸';}
  LOOP.add(cv,draw);};

/* 방 20: 물질 수지 */
MODS.balance=function(el){var v={in:100,out1:64,out2:36},lvl=50;H(el,'<div class="ctrl">'+slider('mb-in','원료 투입 t/h',60,140,1,100)+slider('mb-o1','클링커 t/h',30,100,1,64)+slider('mb-o2','배출 가스 t/h',10,60,1,36)+'</div>');var cv=canvasBlock(el,'가마 상자와 들고 나는 양',260),ro=out(el);
  [['in','mb-in'],['out1','mb-o1'],['out2','mb-o2']].forEach(function(a){$('#'+a[1],el).addEventListener('input',function(){v[a[0]]=+this.value;});});
  function draw(dt){var acc=v.in-v.out1-v.out2;lvl=Math.max(0,Math.min(100,lvl+(REDUCE?0:dt)*acc*0.5));var W=fit(cv,260),Hh=260,c=cv.getContext('2d');c.clearRect(0,0,W,Hh);grid(c,W,Hh);
    var bx=W/2-90,by=50,bw=180,bh=160;c.fillStyle='rgba(163,92,0,.18)';c.fillRect(bx,by+bh*(1-lvl/100),bw,bh*lvl/100);c.strokeStyle='#16212b';c.lineWidth=2;c.strokeRect(bx,by,bw,bh);
    c.fillStyle='#16212b';c.font='14px sans-serif';c.fillText('가마(상자)',bx+50,by-10);arrow(c,bx-110,by+60,bx-6,by+60,'#13733a',4+v.in/30,12);c.fillText('원료 '+v.in,bx-110,by+48);
    arrow(c,bx+bw+6,by+110,bx+bw+110,by+110,'#c93030',3+v.out1/30,12);c.fillText('클링커 '+v.out1,bx+bw+10,by+98);arrow(c,bx+bw/2,by-4,bx+bw/2+60,by-40,'#5b6874',2+v.out2/30,10);c.fillText('가스 '+v.out2,bx+bw/2+64,by-36);stamp(c,W,'가상 수치');
    $('#mb-inv',el).textContent=v.in;$('#mb-o1v',el).textContent=v.out1;$('#mb-o2v',el).textContent=v.out2;
    if(dt===0||Math.random()<0.1)ro.innerHTML='들어옴 '+v.in+' − 나감 ('+v.out1+' + '+v.out2+') = 쌓이는 양 <b>'+(acc>0?'+':'')+acc+' t/h</b><br>'+(acc===0?'들어온 만큼 나갑니다. 상자 안에 샘도 배수구도 없는 셈입니다(겉면으로 나가는 합 = 0).':acc>0?'상자 안에 쌓입니다. 겉면으로 나가는 양이 모자라 재고가 늘어납니다.':'상자 안이 줄어듭니다. 들어오는 양보다 많이 빼고 있습니다.');}
  LOOP.add(cv,draw);};

/* 방 21: 노동·자본 */
MODS.lagLK=function(el){var B=12,L=4;H(el,'<div class="ctrl">'+slider('lk-b','예산',8,16,1,12)+slider('lk-l','노동 L',0,16,0.5,4)+'</div>');var cv=canvasBlock(el,'예산선 위의 생산량',300),ro=out(el);
  $('#lk-b',el).addEventListener('input',function(){B=+this.value;L=Math.min(L,B);draw();});$('#lk-l',el).addEventListener('input',function(){L=Math.min(+this.value,B);draw();});
  function draw(){var W=fit(cv,300),Hh=300,c=cv.getContext('2d');c.clearRect(0,0,W,Hh);grid(c,W,Hh);var mx=16,X=function(l){return 40+l/mx*(W-60)},Y=function(q){return Hh-30-q/36*(Hh-60)};
    c.strokeStyle='#9aa5b1';c.beginPath();c.moveTo(40,Hh-30);c.lineTo(W-10,Hh-30);c.moveTo(40,Hh-30);c.lineTo(40,10);c.stroke();c.fillStyle='#5b6874';c.font='12px sans-serif';c.fillText('노동 L',W-50,Hh-12);c.fillText('생산',46,18);
    c.strokeStyle='#13733a';c.lineWidth=2.5;c.beginPath();for(var l=0;l<=B;l+=0.1){var q=l*(B-l)/2;l?c.lineTo(X(l),Y(q)):c.moveTo(X(l),Y(q));}c.stroke();
    var K=(B-L)/2,q=L*K;c.fillStyle='#c93030';c.beginPath();c.arc(X(L),Y(q),6,0,7);c.fill();var Ls=B/2;c.strokeStyle='#a35c00';c.setLineDash([4,4]);c.beginPath();c.moveTo(X(Ls),Y(0));c.lineTo(X(Ls),Y(Ls*Ls/2));c.stroke();c.setLineDash([]);stamp(c,W,'예시값');
    $('#lk-bv',el).textContent=B;$('#lk-lv',el).textContent=fmt(L,1);var best=B*B/8;
    ro.innerHTML='노동 L = '+fmt(L,1)+' · 자본 K = (예산 − L) ÷ 2 = '+fmt(K,2)+' · 생산 L × K = <b>'+fmt(q,2)+'</b><br>이 예산의 최고: L = '+fmt(B/2,1)+', K = '+fmt(B/4,2)+', 생산 '+fmt(best,3)+' · 그림자 가격 λ = '+fmt(B/4,2)+' (예산 1 더 주면 최고 생산이 '+fmt((B+1)*(B+1)/8,3)+'로 '+fmt((B+1)*(B+1)/8-best,3)+' 늘어남)';}
  draw();};

/* 생선 데이터 (설명용, 시드 고정) */
function fishData(){var r=rng(2026),A=[];for(var i=0;i<30;i++){A.push({k:0,x:25+6*gauss(r),y:11+1.8*gauss(r)});}for(var j=0;j<30;j++){A.push({k:1,x:22+5*gauss(r),y:6.5+1.4*gauss(r)});}return A;}
/* 방 22: 생선 분류 경사 하강 */
MODS.fish=function(el){var D=fishData(),w=[0,0,0],steps=0,lr=0.5;var mx=24,sx=6,my=8.8,sy=2.6;function z(p){return w[0]*(p.x-mx)/sx+w[1]*(p.y-my)/sy+w[2]}function sg(v){return 1/(1+Math.exp(-v))}
  H(el,'<div class="ctrl"><button type="button" class="bt primary" id="fs-1">한 걸음</button><button type="button" class="bt" id="fs-20">스무 걸음</button><button type="button" class="bt" id="fs-rs">처음으로</button></div>');var cv=canvasBlock(el,'브림과 로치를 가르는 선',320),ro=out(el);
  function loss(){var s=0;D.forEach(function(p){var q=Math.min(1-1e-9,Math.max(1e-9,sg(z(p))));s-=p.k?Math.log(q):Math.log(1-q);});return s/D.length;}
  function acc(){var ok=0;D.forEach(function(p){if((sg(z(p))>0.5?1:0)===p.k)ok++;});return ok/D.length;}
  function step(){var g=[0,0,0];D.forEach(function(p){var e=sg(z(p))-p.k;g[0]+=e*(p.x-mx)/sx;g[1]+=e*(p.y-my)/sy;g[2]+=e;});for(var i=0;i<3;i++)w[i]-=lr*g[i]/D.length;steps++;}
  $('#fs-1',el).addEventListener('click',function(){step();draw();});$('#fs-20',el).addEventListener('click',function(){for(var i=0;i<20;i++)step();draw();});$('#fs-rs',el).addEventListener('click',function(){w=[0,0,0];steps=0;draw();});
  function draw(){var W=fit(cv,320),Hh=320,c=cv.getContext('2d');c.clearRect(0,0,W,Hh);grid(c,W,Hh);var X=function(v){return 40+(v-6)/40*(W-60)},Y=function(v){return Hh-30-(v-2)/14*(Hh-50)};
    c.strokeStyle='#9aa5b1';c.beginPath();c.moveTo(40,Hh-30);c.lineTo(W-10,Hh-30);c.moveTo(40,Hh-30);c.lineTo(40,10);c.stroke();c.fillStyle='#5b6874';c.font='12px sans-serif';c.fillText('길이(cm)',W-70,Hh-12);c.fillText('높이(cm)',46,18);
    D.forEach(function(p){var ok=(sg(z(p))>0.5?1:0)===p.k;c.fillStyle=p.k?'#9b3fb5':'#13733a';c.beginPath();if(p.k){c.arc(X(p.x),Y(p.y),5,0,7);}else{c.rect(X(p.x)-5,Y(p.y)-5,10,10);}c.fill();if(!ok&&steps){c.strokeStyle='#c93030';c.lineWidth=2;c.beginPath();c.arc(X(p.x),Y(p.y),9,0,7);c.stroke();}});
    if(Math.abs(w[1])>1e-6){c.strokeStyle='#16212b';c.lineWidth=2;c.beginPath();for(var xx=6;xx<=46;xx+=1){var yy=my-sy*(w[0]*(xx-mx)/sx+w[2])/w[1];xx===6?c.moveTo(X(xx),Y(yy)):c.lineTo(X(xx),Y(yy));}c.stroke();}stamp(c,W,'설명용 모형 · 실제 데이터 아님');
    ro.innerHTML='걸음 '+steps+' · 손실(틀린 정도) <b>'+fmt(loss(),3)+'</b> · 정확도 <b>'+Math.round(acc()*100)+'%</b><br>초록 네모 = 브림(높이가 큼) · 보라 동그라미 = 로치 · 빨간 고리 = 지금 틀린 생선';}
  LOOP.add(cv,function(dt){if(dt===0)draw();});};

/* 방 23: 시간 벌점 */
MODS.timepen=function(el){var a=2,w=2.5;H(el,'<div class="ctrl">'+slider('tp-a','시간 가중치 α',0,4,0.1,2)+slider('tp-w','모델 크기 w',0,5,0.1,2.5)+'</div>');var cv=canvasBlock(el,'정확도 손실과 시간 벌점',300),ro=out(el);
  $('#tp-a',el).addEventListener('input',function(){a=+this.value;draw();});$('#tp-w',el).addEventListener('input',function(){w=+this.value;draw();});
  function draw(){var W=fit(cv,300),Hh=300,c=cv.getContext('2d');c.clearRect(0,0,W,Hh);grid(c,W,Hh);var X=function(v){return 40+v/5*(W-60)},Y=function(v){return Hh-30-v/16*(Hh-50)};
    c.strokeStyle='#9aa5b1';c.beginPath();c.moveTo(40,Hh-30);c.lineTo(W-10,Hh-30);c.moveTo(40,Hh-30);c.lineTo(40,10);c.stroke();c.fillStyle='#5b6874';c.font='12px sans-serif';c.fillText('모델 크기 w',W-80,Hh-12);
    [[function(v){return (v-3)*(v-3)},'#13733a','틀림 (w−3)²'],[function(v){return a*v},'#1e55c8','시간 벌점 α·w'],[function(v){return (v-3)*(v-3)+a*v},'#16212b','합계']].forEach(function(q,k){c.strokeStyle=q[1];c.lineWidth=k===2?3:2;c.beginPath();for(var v=0;v<=5;v+=0.05){var y=Math.min(16,q[0](v));v?c.lineTo(X(v),Y(y)):c.moveTo(X(v),Y(y));}c.stroke();c.fillStyle=q[1];c.fillText(q[2],W-130,24+k*16);});
    var ws=Math.max(0,3-a/2);c.strokeStyle='#a35c00';c.setLineDash([4,4]);c.beginPath();c.moveTo(X(ws),Y(0));c.lineTo(X(ws),Y(16));c.stroke();c.setLineDash([]);
    var g1=2*(w-3),g2=a,gs=g1+g2,y0=Y(Math.min(16,(w-3)*(w-3)+a*w));c.fillStyle='#16212b';c.beginPath();c.arc(X(w),y0,6,0,7);c.fill();
    arrow(c,X(w),y0-14,X(w)-g1*10,y0-14,'#13733a',3,8);arrow(c,X(w),y0-28,X(w)-g2*10,y0-28,'#1e55c8',3,8);stamp(c,W,'예시값');$('#tp-av',el).textContent=fmt(a,1);$('#tp-wv',el).textContent=fmt(w,1);
    ro.innerHTML='w = '+fmt(w,1)+'에서 내려가는 화살표: 정확도 쪽 '+fmt(-g1,2)+' + 시간 쪽 '+fmt(-g2,2)+' = <b>'+fmt(-gs,2)+'</b><br>두 화살표가 맞서 0이 되는 곳 w = 3 − α/2 = <b>'+fmt(ws,2)+'</b> (α = 0이면 3, α = 2이면 2)';}
  draw();};

/* 방 24: 비싼 생선 */
MODS.cost=function(el){var cr=4,useOpt=true;var F=[],NE=[0,1,1,1,2,2,3,3,3,4],J=[-0.03,-0.01,0.01,0.03];for(var b=0;b<10;b++){for(var k=0;k<4;k++){F.push({p:0.05+0.1*b+J[k],e:k>=4-NE[b]});}}
  H(el,'<div class="ctrl">'+slider('ct-c','비싼 생선을 놓친 손해 (싼 생선 오판 = 1)',1,8,1,4)+btns('ct',[['opt','맞춘 기준 1÷(1+손해)'],['half','늘 0.5']],'opt')+'</div>');var cv=canvasBlock(el,'생선 40마리의 비싼 생선 확률',220),ro=out(el);
  $('#ct-c',el).addEventListener('input',function(){cr=+this.value;draw();});bindBtns(el,'ct',function(v){useOpt=v==='opt';draw();});
  function draw(){var W=fit(cv,220),Hh=220,c=cv.getContext('2d');c.clearRect(0,0,W,Hh);grid(c,W,Hh);var X=function(p){return 30+p*(W-60)};c.strokeStyle='#9aa5b1';c.beginPath();c.moveTo(30,150);c.lineTo(W-30,150);c.stroke();
    c.fillStyle='#5b6874';c.font='12px sans-serif';for(var t=0;t<=1;t+=0.25){c.fillText(t.toFixed(2),X(t)-10,170);}c.fillText('모델이 말한 "비싼 생선일 확률"',30,196);var th=useOpt?1/(1+cr):0.5,miss=0,fa=0;
    F.forEach(function(f,i){var y=60+(i%4)*22,say=f.p>=th;if(f.e&&!say)miss++;if(!f.e&&say)fa++;c.fillStyle=f.e?'#c93030':'#1e55c8';c.beginPath();c.arc(X(f.p),y,5,0,7);c.fill();if((f.e&&!say)||(!f.e&&say)){c.strokeStyle='#a35c00';c.lineWidth=2;c.beginPath();c.arc(X(f.p),y,8,0,7);c.stroke();}});
    c.strokeStyle='#16212b';c.lineWidth=2;c.setLineDash([5,4]);c.beginPath();c.moveTo(X(th),30);c.lineTo(X(th),150);c.stroke();c.setLineDash([]);c.fillStyle='#16212b';c.fillText('기준 '+th.toFixed(2),X(th)+4,28);stamp(c,W,'가상 가격 · 설명용 모형');$('#ct-cv',el).textContent=cr;
    var total=cr*miss+fa;ro.innerHTML='빨강 = 비싼 생선 · 파랑 = 싼 생선 · 노란 고리 = 잘못 판정<br>놓친 비싼 생선 '+miss+'마리 × '+cr+' + 싼 생선 오판 '+fa+'마리 × 1 = 손해 합계 <b>'+total+'</b> (기준 '+th.toFixed(2)+')<br>학습 때는 비싼 생선 오류 화살표를 '+cr+'배로 키워 같은 방향을 냅니다.';}
  draw();};

/* 방 25: 예산 울타리와 그림자 가격 */
MODS.budget=function(el){var B=8,x=1;H(el,'<div class="ctrl">'+slider('bg-b','예산(만 원)',4,12,1,8)+slider('bg-x','카메라 대수 x',0,6,0.25,1)+'</div>');var cv=canvasBlock(el,'예산선과 선별 점수 높이선',320),ro=out(el);
  $('#bg-b',el).addEventListener('input',function(){B=+this.value;x=Math.min(x,B/2);draw();});$('#bg-x',el).addEventListener('input',function(){x=Math.min(+this.value,B/2);draw();});
  function draw(){var W=fit(cv,320),Hh=320,c=cv.getContext('2d');c.clearRect(0,0,W,Hh);grid(c,W,Hh);var X=function(v){return 40+v/6*(W-60)},Y=function(v){return Hh-30-v/12*(Hh-50)};
    c.strokeStyle='#9aa5b1';c.beginPath();c.moveTo(40,Hh-30);c.lineTo(W-10,Hh-30);c.moveTo(40,Hh-30);c.lineTo(40,10);c.stroke();c.fillStyle='#5b6874';c.font='12px sans-serif';c.fillText('카메라 x대',W-70,Hh-12);c.fillText('검사 시간 y',46,18);
    [2,4,8,12,18].forEach(function(L){c.strokeStyle='rgba(19,115,58,.35)';c.beginPath();for(var v=0.2;v<=6;v+=0.05){var yy=L/v;if(yy>12)continue;var px=X(v),py=Y(yy);(v<=0.2||L/(v-0.05)>12)?c.moveTo(px,py):c.lineTo(px,py);}c.stroke();});
    c.strokeStyle='#c93030';c.lineWidth=3;c.beginPath();c.moveTo(X(0),Y(B));c.lineTo(X(B/2),Y(0));c.stroke();var y=B-2*x,s=x*y;c.fillStyle='#16212b';c.beginPath();c.arc(X(x),Y(y),6,0,7);c.fill();stamp(c,W,'가상 수치');
    $('#bg-bv',el).textContent=B;$('#bg-xv',el).textContent=fmt(x,2);var bx=B/4,best=B*B/8;
    ro.innerHTML='카메라 '+fmt(x,2)+'대(대당 2만 원) + 검사 '+fmt(y,2)+'시간(시간당 1만 원) = '+B+'만 원 · 선별 점수 x·y = <b>'+fmt(s,3)+'</b><br>이 예산의 최고: x = '+fmt(bx,2)+', y = '+fmt(B/2,2)+', 점수 '+fmt(best,3)+' · 그림자 가격 λ = <b>'+fmt(B/4,2)+'</b> → 예산 1만 원 더 주면 '+fmt((B+1)*(B+1)/8,3)+' ('+fmt((B+1)*(B+1)/8-best,3)+' 증가)';}
  draw();};

/* 방 26: 세 축 파레토 */
MODS.pareto=function(el){var M=[['A',95,2,3],['B',93,3,4],['C',97,4,5],['D',90,1,2],['E',92,1.5,4],['F',96,2.5,6],['G',88,0.8,1.5],['H',94,1.2,3.5],['I',91,2.2,2.2],['J',98,6,8],['K',89,2.5,3],['L',95,3.5,2.5]],wt=1,wc=1;
  H(el,'<div class="ctrl">'+slider('pr-t','시간 중요도',0,3,0.1,1)+slider('pr-c','비용 중요도',0,3,0.1,1)+'</div>');var cv=canvasBlock(el,'시간과 비용 평면 위 모델 12개',320),ro=out(el);
  $('#pr-t',el).addEventListener('input',function(){wt=+this.value;draw();});$('#pr-c',el).addEventListener('input',function(){wc=+this.value;draw();});
  function dom(a,b){return b[1]>=a[1]&&b[2]<=a[2]&&b[3]<=a[3]&&(b[1]>a[1]||b[2]<a[2]||b[3]<a[3]);}
  function draw(){var W=fit(cv,320),Hh=320,c=cv.getContext('2d');c.clearRect(0,0,W,Hh);grid(c,W,Hh);var X=function(v){return 50+v/7*(W-80)},Y=function(v){return Hh-30-v/9*(Hh-50)};
    c.strokeStyle='#9aa5b1';c.beginPath();c.moveTo(50,Hh-30);c.lineTo(W-10,Hh-30);c.moveTo(50,Hh-30);c.lineTo(50,10);c.stroke();c.fillStyle='#5b6874';c.font='12px sans-serif';c.fillText('판정 시간(초)',W-90,Hh-12);c.fillText('비용(만 원)',56,18);
    var best=null,bs=-1e9;M.forEach(function(m){var sc=m[1]-wt*m[2]*2-wc*m[3]*1.5;if(sc>bs){bs=sc;best=m;}});
    M.forEach(function(m){var d=M.some(function(o){return dom(m,o)});var r=4+(m[1]-86)*0.9;c.fillStyle=d?'rgba(91,104,116,.35)':'#13733a';c.beginPath();c.arc(X(m[2]),Y(m[3]),r,0,7);c.fill();
      if(m===best){c.strokeStyle='#c93030';c.lineWidth=3;c.beginPath();c.arc(X(m[2]),Y(m[3]),r+5,0,7);c.stroke();}c.fillStyle='#16212b';c.fillText(m[0]+' '+m[1]+'%',X(m[2])+r+3,Y(m[3])+4);});stamp(c,W,'가상 수치');
    $('#pr-tv',el).textContent=fmt(wt,1);$('#pr-cv',el).textContent=fmt(wc,1);var front=M.filter(function(m){return !M.some(function(o){return dom(m,o)})}).map(function(m){return m[0]});
    ro.innerHTML='초록 = 경계 위(더는 공짜로 나아질 수 없음): '+front.join(', ')+' · 회색 = 어느 모델보다 모두 나쁨 (예: B는 A보다 정확도·시간·비용 모두 나쁨)<br>점수 = 정확도 − 시간 중요도×시간×2 − 비용 중요도×비용×1.5 → 지금 고른 모델 <b>'+best[0]+'</b> ('+best[1]+'%, '+best[2]+'초, '+best[3]+'만 원). 중요도를 바꾸면 줄다리기의 균형점이 경계를 따라 옮겨 갑니다.';}
  draw();};
