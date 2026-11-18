/* 연구실 공용 모듈 (vector_calculus_lab) — 외부 라이브러리 없음, 브라우저 저장소 없음 */
var REDUCE=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function rng(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function gauss(r){var u=0;while(!u)u=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*r())}
function fit(c,h){var d=window.devicePixelRatio||1,w=c.clientWidth||c.parentElement.clientWidth||600;
  if(c.width!==Math.round(w*d)||c.height!==Math.round(h*d)){c.width=Math.round(w*d);c.height=Math.round(h*d);c.style.height=h+'px';}
  var x=c.getContext('2d');x.setTransform(d,0,0,d,0,0);return w;}
function fmt(v,n){if(n===undefined)n=2;var s=(Math.abs(v)<1e-9?0:v).toFixed(n);if(s.indexOf('.')>=0)s=s.replace(/0+$/,'').replace(/\.$/,'');if(/^-0$/.test(s))s='0';return s;}
function $(s,el){return (el||document).querySelector(s)}
function $$(s,el){return Array.prototype.slice.call((el||document).querySelectorAll(s))}
function stamp(ctx,W,text){ctx.save();ctx.font='12px "IBM Plex Sans KR",sans-serif';var w=ctx.measureText(text).width+12;
  ctx.fillStyle='rgba(253,243,225,.95)';ctx.strokeStyle='#a35c00';ctx.lineWidth=1;ctx.fillRect(W-w-8,8,w,20);ctx.strokeRect(W-w-8,8,w,20);
  ctx.fillStyle='#a35c00';ctx.fillText(text,W-w-2,22);ctx.restore();}
function arrow(ctx,x1,y1,x2,y2,col,lw,head){ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=lw||1.5;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();
  var a=Math.atan2(y2-y1,x2-x1),h=head||6;if(Math.hypot(x2-x1,y2-y1)<2)return;ctx.beginPath();ctx.moveTo(x2,y2);
  ctx.lineTo(x2-h*Math.cos(a-0.45),y2-h*Math.sin(a-0.45));ctx.lineTo(x2-h*Math.cos(a+0.45),y2-h*Math.sin(a+0.45));ctx.closePath();ctx.fill();}
function grid(ctx,W,H){ctx.save();ctx.strokeStyle='rgba(22,33,43,.05)';ctx.lineWidth=1;for(var x=0;x<W;x+=24){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
  for(var y=0;y<H;y+=24){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}ctx.restore();}
/* 보이는 캔버스만 그리는 루프 하나 */
var LOOP=(function(){var mods=[],vis=new Set(),io=('IntersectionObserver' in window)?new IntersectionObserver(function(es){es.forEach(function(e){e.isIntersecting?vis.add(e.target):vis.delete(e.target);});},{rootMargin:'100px'}):null;
  var last=0;function loop(ts){var dt=last?Math.min(0.05,(ts-last)/1000):0.016;last=ts;mods.forEach(function(m){if(!io||vis.has(m.el)){try{m.fn(dt)}catch(e){}}});requestAnimationFrame(loop);}
  function add(el,fn){mods.push({el:el,fn:fn});if(io)io.observe(el);}
  function redrawAll(){mods.forEach(function(m){try{m.fn(0)}catch(e){}});}
  window.addEventListener('resize',function(){redrawAll();});
  return {add:add,start:function(){redrawAll();requestAnimationFrame(loop);},redraw:redrawAll};})();
/* 캐릭터 */
var Cast=(function(){var DEF={doc:'front',asst:'smile',fly:'clip',robo:'smile',sia:'smile',moa:'smile'};
  function key(who,mood){var k=who+'_'+mood;var A=(window.LAB_ALIAS||{});if(A[k])k=A[k];return k;}
  function src(who,mood){var S=window.SPRITE||{};var k=key(who,mood);if(S[k])return S[k];k=key(who,DEF[who]);return S[k]||'';}
  function set(img,who,mood){img.style.transition='opacity .2s';img.style.opacity=0;setTimeout(function(){img.src=src(who,mood);img.style.opacity=1;},REDUCE?0:200);}
  function fill(){$$('img[data-who]').forEach(function(i){var s=src(i.dataset.who,i.dataset.mood||'');if(s)i.src=s;});}
  return {set:set,fill:fill};})();
/* 용어 말풍선 */
function Gloss(dict,core){var tip=document.createElement('div');tip.id='tip';tip.setAttribute('role','tooltip');document.body.appendChild(tip);
  var mode='core',keys=Object.keys(dict).sort(function(a,b){return b.length-a.length});
  function clear(){$$('span.jt').forEach(function(s){s.replaceWith(document.createTextNode(s.textContent));});document.body.normalize();}
  function apply(){clear();if(mode==='off')return;var use=keys.filter(function(k){return mode==='all'||core.indexOf(k)>=0});
    $$('main section:not(#kg):not(#export)').forEach(function(sec){var done={};
      var walker=document.createTreeWalker(sec,NodeFilter.SHOW_TEXT,{acceptNode:function(n){var p=n.parentElement;if(!p)return 2;
        if(p.closest('h1,h2,button,canvas,svg,.kpis,nav,.jt,code,.say .name,label,select,.quiz,.duel'))return 2;return 1;}});
      var nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
      nodes.forEach(function(n){for(var i=0;i<use.length;i++){var k=use[i];if(done[k])continue;var at=n.nodeValue.indexOf(k);if(at<0)continue;
        var r=n.splitText(at);r.splitText(k.length);var s=document.createElement('span');s.className='jt';s.tabIndex=0;s.dataset.k=k;s.textContent=k;r.replaceWith(s);done[k]=1;break;}});});}
  function show(el){var d=dict[el.dataset.k];if(!d)return;tip.innerHTML='<b>'+d[0]+'</b> · <small>'+d[1]+'</small><br>'+d[2];tip.style.display='block';
    var r=el.getBoundingClientRect();var x=Math.min(window.scrollX+r.left,window.scrollX+document.documentElement.clientWidth-310);tip.style.left=Math.max(8,x)+'px';tip.style.top=(window.scrollY+r.bottom+6)+'px';}
  function hide(){tip.style.display='none';}
  document.addEventListener('mouseover',function(e){var t=e.target.closest&&e.target.closest('.jt');if(t)show(t);});
  document.addEventListener('mouseout',function(e){if(e.target.closest&&e.target.closest('.jt'))hide();});
  document.addEventListener('focusin',function(e){if(e.target.classList&&e.target.classList.contains('jt'))show(e.target);});
  document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('.jt');if(t){show(t);}else if(!e.target.closest('#tip'))hide();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')hide();});window.addEventListener('scroll',hide,{passive:true});
  apply();return {cycle:function(){mode={core:'all',all:'off',off:'core'}[mode];apply();return mode;}};}
/* 퀴즈 + 학습 도우미 */
function Study(Q,gloss){var total=0,ok=0,done={};
  $$('.quiz[data-quiz]').forEach(function(box){var items=Q[box.dataset.quiz]||[];items.forEach(function(it,qi){total++;var id=box.dataset.quiz+'_'+qi;
    var wrap=document.createElement('div');wrap.innerHTML='<div class="qq">확인 퀴즈 · '+it.q+'</div><div class="opts"></div><div class="fb" aria-live="polite"></div>';
    var opts=$('.opts',wrap),fb=$('.fb',wrap);it.o.forEach(function(o,oi){var b=document.createElement('button');b.className='bt';b.textContent=o;
      b.addEventListener('click',function(){if(oi===it.a){b.classList.add('ok');fb.textContent='정답이에요. '+it.why;if(!done[id]){done[id]=1;ok++;upd();}}
        else{b.classList.add('no');fb.textContent='힌트: '+(it.hint||it.why);}});opts.appendChild(b);});box.appendChild(wrap);});});
  var st=document.createElement('div');st.id='study';st.innerHTML='<span id="st-read">읽은 곳 0%</span><span id="st-q">퀴즈 0/'+total+'</span><button type="button" id="st-g">밑줄: 핵심</button>';document.body.appendChild(st);
  var prog=document.createElement('div');prog.id='prog';document.body.appendChild(prog);
  function upd(){$('#st-q').textContent='퀴즈 '+ok+'/'+total;}
  function scr(){var h=document.documentElement,p=h.scrollTop/(h.scrollHeight-h.clientHeight||1);prog.style.width=(p*100)+'%';$('#st-read').textContent='읽은 곳 '+Math.round(p*100)+'%';}
  window.addEventListener('scroll',scr,{passive:true});scr();
  $('#st-g').addEventListener('click',function(){var m=gloss?gloss.cycle():'core';this.textContent='밑줄: '+{core:'핵심',all:'전체',off:'끄기'}[m];});}
/* 대결: 초파리(왼쪽) vs 주판봇(오른쪽), 박사 판정 */
function Duel(o){var root=$(o.el);if(!root)return;var shown=false;var fi=$('.side.l img',root),ri=$('.side.r img',root);
  $$('.guess button',root).forEach(function(b){b.addEventListener('click',function(){$$('.guess button',root).forEach(function(x){x.setAttribute('aria-pressed','false')});b.setAttribute('aria-pressed','true');$('.guessed',root).textContent='예상을 적어 두었어요. 결과를 열어 보세요.';});});
  $('.reveal',root).addEventListener('click',function(){if(shown){reset();return;}var r=o.run(),f=r.fly,b=r.robo,res;
    if(r.cond)res='C';else if(Math.abs(f-b)<=o.drawMargin)res='D';else res=((o.higherIsBetter?f-b:b-f)>0)?'F':'R';
    var M={F:['arms','sigh'],R:['coffee','happy'],D:['coffee','meh'],C:['coffee','calc']}[res];Cast.set(fi,'fly',M[0]);Cast.set(ri,'robo',M[1]);
    var mx=Math.max(Math.abs(f),Math.abs(b))||1;function bar(n,v,c){return '<div class="bar"><span>'+n+'</span><div class="track"><div class="fill" style="width:'+(Math.abs(v)/mx*100)+'%;background:'+c+'"></div></div><b>'+fmt(v,2)+(o.unit||'')+'</b></div>';}
    $('.bars',root).innerHTML=bar('초파리 쪽',f,'#c93030')+bar('주판봇 쪽',b,'#0b7a86');
    $('.asst p',root).textContent=o.report(f,b);
    var who={F:'초파리 승.',R:'주판봇 승.',D:'이번 판은 나눠 갖는다.',C:'가정에 따라 갈린다.'}[res];
    $('.verdict p',root).textContent=o.lesson+' '+who;root.classList.add('open');shown=true;this.textContent='다시 닫기';});
  function reset(){Cast.set(fi,'fly','point');Cast.set(ri,'robo','coin');root.classList.remove('open');shown=false;$('.reveal',root).textContent='결과 보기';}}
/* 파일 내려받기 */
function download(name,text,type){var b=new Blob([text],{type:type||'text/plain;charset=utf-8'});var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove();},500);}
/* 압축 없는 ZIP */
var ZIP=(function(){var T=(function(){var t=[];for(var n=0;n<256;n++){var c=n;for(var k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0;}return t})();
  function crc(u){var c=0xFFFFFFFF;for(var i=0;i<u.length;i++)c=T[(c^u[i])&255]^(c>>>8);return (c^0xFFFFFFFF)>>>0;}
  function make(files){var enc=new TextEncoder(),parts=[],cd=[],off=0;
    files.forEach(function(f){var nm=enc.encode(f.name),d=enc.encode(f.text),c=crc(d);var h=new DataView(new ArrayBuffer(30));
      h.setUint32(0,0x04034b50,true);h.setUint16(4,20,true);h.setUint16(6,0x0800,true);h.setUint16(8,0,true);h.setUint32(14,c,true);h.setUint32(18,d.length,true);h.setUint32(22,d.length,true);h.setUint16(26,nm.length,true);
      parts.push(new Uint8Array(h.buffer),nm,d);var e=new DataView(new ArrayBuffer(46));e.setUint32(0,0x02014b50,true);e.setUint16(4,20,true);e.setUint16(6,20,true);e.setUint16(8,0x0800,true);
      e.setUint32(16,c,true);e.setUint32(20,d.length,true);e.setUint32(24,d.length,true);e.setUint16(28,nm.length,true);e.setUint32(42,off,true);cd.push(new Uint8Array(e.buffer),nm);off+=30+nm.length+d.length;});
    var cdl=cd.reduce(function(s,a){return s+a.length},0);var end=new DataView(new ArrayBuffer(22));end.setUint32(0,0x06054b50,true);end.setUint16(8,files.length,true);end.setUint16(10,files.length,true);end.setUint32(12,cdl,true);end.setUint32(16,off,true);
    return new Blob(parts.concat(cd,[new Uint8Array(end.buffer)]),{type:'application/zip'});}
  return {make:make};})();
/* 지식 색인 + 꾸러미 */
function KG(){var raw;try{raw=JSON.parse($('#kg-raw').textContent);}catch(e){return;}var N=raw.nodes,E=raw.edges;
  var KIND={Concept:'개념',Method:'방법',Task:'문제',Metric:'지표',Claim:'주장',Term:'용어',Question:'질문',Analogy:'비유',Limitation:'한계',Simulation:'실험',QuizItem:'퀴즈',Work:'문헌',Identity:'항등식',Section:'섹션'};
  var COL={Concept:'#13733a',Method:'#9b3fb5',Term:'#a35c00',Question:'#1e55c8',Analogy:'#c93030',Limitation:'#5b6874',Simulation:'#0f6f73',QuizItem:'#7a3fd6',Work:'#16212b',Identity:'#c42a6e',Task:'#93651a',Metric:'#0b7a86',Claim:'#1f7a52'};
  var on={};Object.keys(KIND).forEach(function(k){on[k]=true});on.QuizItem=false;
  var chips=$('#kg .chips'),list=$('#kg .list'),q=$('#kg input[type=search]');
  Object.keys(KIND).forEach(function(k){if(!N.some(function(n){return n.type===k}))return;var b=document.createElement('button');b.type='button';b.textContent=KIND[k];b.setAttribute('aria-pressed',on[k]?'true':'false');
    b.addEventListener('click',function(){on[k]=!on[k];b.setAttribute('aria-pressed',on[k]?'true':'false');render();});chips.appendChild(b);});
  function render(){var s=(q.value||'').trim().toLowerCase();list.innerHTML='';N.filter(function(n){if(!on[n.type])return false;if(!s)return true;
      var t=[n.label.ko,n.label.en,(n.definition&&n.definition.ko)||''].join(' ').toLowerCase();return t.indexOf(s)>=0;}).forEach(function(n){
      var d=document.createElement('div');d.className='item';d.id='kgi-'+n.id.replace(/[^a-z0-9]/gi,'_');var ev=E.filter(function(e){return e.s===n.id||e.o===n.id}).length;
      d.innerHTML='<span class="k" style="color:'+(COL[n.type]||'#333')+'">'+(KIND[n.type]||n.type)+'</span><b>'+n.label.ko+'</b> <small>'+n.label.en+'</small>'+((n.definition&&n.definition.ko)?'<div>'+n.definition.ko+'</div>':'')+(n.anchor?'<a href="'+n.anchor+'">설명 보러 가기 →</a>':'')+' <small>연결 '+ev+'</small>';list.appendChild(d);});}
  q.addEventListener('input',render);render();
  var st=$('#kg .stats');if(st){var c={};N.forEach(function(n){c[n.type]=(c[n.type]||0)+1});st.textContent='노드 '+N.length+'개 · 관계 '+E.length+'개 · '+Object.keys(c).map(function(k){return (KIND[k]||k)+' '+c[k]}).join(' · ')+' · 외부 매핑 확인 0';}
  /* 미니 그래프: 시드 고정 힘 배치 200회 */
  var cv=$('#kg canvas');var r=rng(7);var G=N.filter(function(n){return n.type!=='QuizItem'&&n.type!=='Section'}).slice(0,80);var idx={};G.forEach(function(n,i){idx[n.id]=i;n._x=r()-.5;n._y=r()-.5;});
  var GE=E.filter(function(e){return idx[e.s]!==undefined&&idx[e.o]!==undefined});
  for(var it=0;it<200;it++){var fx=G.map(function(){return 0}),fy=G.map(function(){return 0});for(var i=0;i<G.length;i++)for(var j=i+1;j<G.length;j++){var dx=G[i]._x-G[j]._x,dy=G[i]._y-G[j]._y,d2=dx*dx+dy*dy+1e-4,f=0.002/d2;fx[i]+=dx*f;fy[i]+=dy*f;fx[j]-=dx*f;fy[j]-=dy*f;}
    GE.forEach(function(e){var a=idx[e.s],b=idx[e.o],dx=G[b]._x-G[a]._x,dy=G[b]._y-G[a]._y;fx[a]+=dx*.05;fy[a]+=dy*.05;fx[b]-=dx*.05;fy[b]-=dy*.05;});
    G.forEach(function(n,i){n._x+=Math.max(-.05,Math.min(.05,fx[i]-n._x*.01));n._y+=Math.max(-.05,Math.min(.05,fy[i]-n._y*.01));});}
  var mnx=Math.min.apply(null,G.map(function(n){return n._x})),mxx=Math.max.apply(null,G.map(function(n){return n._x})),mny=Math.min.apply(null,G.map(function(n){return n._y})),mxy=Math.max.apply(null,G.map(function(n){return n._y}));
  function P(n,W,H){return [20+(n._x-mnx)/((mxx-mnx)||1)*(W-40),20+(n._y-mny)/((mxy-mny)||1)*(H-40)];}
  function draw(){var W=fit(cv,320),H=320,c=cv.getContext('2d');c.clearRect(0,0,W,H);GE.forEach(function(e){var a=P(G[idx[e.s]],W,H),b=P(G[idx[e.o]],W,H);arrow(c,a[0],a[1],a[0]+(b[0]-a[0])*.92,a[1]+(b[1]-a[1])*.92,'rgba(91,104,116,.35)',1,5);});
    G.forEach(function(n){var p=P(n,W,H);c.fillStyle=COL[n.type]||'#333';c.beginPath();c.arc(p[0],p[1],5,0,7);c.fill();});}
  cv.addEventListener('pointerdown',function(ev){var rc=cv.getBoundingClientRect(),W=rc.width,H=320,mx=ev.clientX-rc.left,my=ev.clientY-rc.top,best=null,bd=144;
    G.forEach(function(n){var p=P(n,W,H),d=(p[0]-mx)*(p[0]-mx)+(p[1]-my)*(p[1]-my);if(d<bd){bd=d;best=n;}});
    if(best){q.value=best.label.ko;render();var it=list.firstChild;if(it)it.classList.add('hl');}});
  LOOP.add(cv,function(dt){if(dt===0)draw();});draw();
  var path=$('#kg .flowchips');if(path){var steps=N.filter(function(n){return n.type==='Concept'&&n.level}).sort(function(a,b){return a.level-b.level});path.innerHTML=steps.map(function(n){return '<span>'+n.label.ko+'</span>'}).join(' → ');}
  var oq=$('#kg .openq');if(oq)oq.innerHTML=N.filter(function(n){return n.type==='Question'}).map(function(n){return '<li>'+n.label.ko+'</li>'}).join('');
  function mermaid(){var L=['graph LR'];var M=G.slice(0,40),ok={};M.forEach(function(n,i){ok[n.id]='n'+i;L.push('  n'+i+'["'+n.label.ko.replace(/"/g,"'")+'"]');});
    GE.forEach(function(e){if(ok[e.s]&&ok[e.o])L.push('  '+ok[e.s]+' -- '+e.p.replace('lab:','')+' --> '+ok[e.o]);});return L.join('\n');}
  function csvq(v){v=String(v==null?'':v);return /[",\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v;}
  function nodesCsv(){return ['id,type,label_ko,label_en,status,level,family,page,anchor'].concat(N.map(function(n){return [n.id,n.type,n.label.ko,n.label.en,n.status,n.level||'',n.family||'',n.page,n.anchor||''].map(csvq).join(',')})).join('\n');}
  function edgesCsv(){return ['source,predicate,target,anchor,confidence'].concat(E.map(function(e){return [e.s,e.p,e.o,e.anchor||'',e.confidence||''].map(csvq).join(',')})).join('\n');}
  function ttl(){var L=['@prefix lab: <urn:lab:> .','@prefix skos: <http://www.w3.org/2004/02/skos/core#> .',''];N.forEach(function(n){L.push('<'+n.id.replace('lab:','urn:lab:')+'> a lab:'+n.type+' ;\n  skos:prefLabel "'+n.label.ko.replace(/"/g,'\\"')+'"@ko , "'+n.label.en.replace(/"/g,'\\"')+'"@en .');});
    E.forEach(function(e){L.push('<'+e.s.replace('lab:','urn:lab:')+'> '+e.p+' <'+e.o.replace('lab:','urn:lab:')+'> .');});return L.join('\n');}
  var bj=$('#kg-json'),bm=$('#kg-mmd');if(bj)bj.addEventListener('click',function(){download(raw.page+'_kg.json',JSON.stringify(raw,null,2),'application/json')});
  if(bm)bm.addEventListener('click',function(){download(raw.page+'_kg.mmd',mermaid())});
  /* 꾸러미 */
  var refs=[];try{refs=JSON.parse($('#refs-csl').textContent);}catch(e){}
  function bib(){return refs.map(function(r,i){return '@misc{'+(r.id||('ref'+i))+',\n  title = {'+r.title+'},\n  author = {'+((r.author||[]).map(function(a){return a.literal||((a.family||'')+', '+(a.given||''))}).join(' and '))+'},\n  year = {'+((r.issued&&r.issued['date-parts'])?r.issued['date-parts'][0][0]:'n.d.')+'},\n  howpublished = {'+(r.URL||r.publisher||'')+'}\n}';}).join('\n\n');}
  var cite=$('#cite-text');
  var zb=$('#zip-all');if(zb)zb.addEventListener('click',function(){var ld='';try{ld=$('#kg-ld').textContent;}catch(e){}
    var files=[{name:'README.txt',text:'온톨로지·서지 꾸러미 — '+raw.page+'\n파일: kg.json(원본), kg.jsonld, kg.ttl, nodes.csv, edges.csv, kg.mmd, references.csl.json, references.bib, citation.txt\n'},
      {name:'kg.json',text:JSON.stringify(raw,null,2)},{name:'kg.jsonld',text:ld},{name:'kg.ttl',text:ttl()},{name:'nodes.csv',text:'﻿'+nodesCsv()},{name:'edges.csv',text:'﻿'+edgesCsv()},
      {name:'kg.mmd',text:mermaid()},{name:'references.csl.json',text:JSON.stringify(refs,null,2)},{name:'references.bib',text:bib()},{name:'citation.txt',text:cite?cite.textContent:''}];
    var b=ZIP.make(files),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=raw.page+'_bundle.zip';document.body.appendChild(a);a.click();setTimeout(function(){a.remove()},500);});
  var cb=$('#cite-copy');if(cb)cb.addEventListener('click',function(){try{navigator.clipboard.writeText(cite.textContent);cb.textContent='복사됨';}catch(e){cb.textContent='직접 선택해 복사해 주세요';}});
  var bb=$('#bib-dl');if(bb)bb.addEventListener('click',function(){download(raw.page+'_references.bib',bib())});}
