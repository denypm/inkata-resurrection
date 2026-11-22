const NS='http://www.w3.org/2000/svg';let P=null;
let seed=7;const R=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};const rr=(a,b)=>a+R()*(b-a);
function el(t,a,p=P){const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);p.appendChild(e);return e}
let cid=0;
function paint(d,base,tones,n=90,w=[4,14],len=[20,70],ang=0){
  const id='c'+(cid++);const cp=el('clipPath',{id});el('path',{d},cp);el('path',{d,fill:base});
  if(!n)return;const g=el('g',{'clip-path':`url(#${id})`});const tmp=el('path',{d,fill:'none'});const b=tmp.getBBox();tmp.remove();
  for(let i=0;i<n;i++){const x=rr(b.x,b.x+b.width),y=rr(b.y,b.y+b.height),L=rr(...len),a=ang+rr(-.35,.35);
    el('path',{d:`M${x} ${y} q${L/2*Math.cos(a)+rr(-6,6)} ${L/2*Math.sin(a)+rr(-6,6)} ${L*Math.cos(a)} ${L*Math.sin(a)}`,
      stroke:tones[i%tones.length],'stroke-width':rr(...w),'stroke-linecap':'round',fill:'none',opacity:rr(.25,.6)},g)}}
function star(x,y,s,c){el('path',{d:`M${x} ${y-s}Q${x} ${y} ${x+s} ${y}Q${x} ${y} ${x} ${y+s}Q${x} ${y} ${x-s} ${y}Q${x} ${y} ${x} ${y-s}Z`,fill:c})}
const C={cream:'#F1E6D2',orange:'#E8743B',red:'#C8321E',teal:'#1E4640',navy:'#152A3A',dgreen:'#1D4A36',ink:'#3B1F14',skin:'#F2D3B8',skin2:'#E6B898',hair:'#5A3324',sage:'#8A9A7E',yellow:'#F7C65A'};
const OR=['#F08A4B','#D9622E','#F3A066'],TE=['#24534B','#183B37','#2A5C52'],GR=['#24573F','#163B2B','#2A6248'];
const DEFS=`<defs>
<filter id="rough" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="3" seed="3"/><feDisplacementMap in="SourceGraphic" scale="9"/></filter>
<filter id="wob"><feTurbulence type="fractalNoise" baseFrequency=".03" numOctaves="2" seed="5"/><feDisplacementMap in="SourceGraphic" scale="5"/></filter>
<filter id="blur"><feGaussianBlur stdDeviation="8"/></filter>
<filter id="brush"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="3" seed="2"/><feColorMatrix values="0 0 0 0 .3  0 0 0 0 .15  0 0 0 0 .1  0 0 0 7 -5"/><feComposite in2="SourceGraphic" operator="in"/></filter>
<filter id="paper"><feTurbulence type="fractalNoise" baseFrequency=".75" numOctaves="4" seed="8"/><feDiffuseLighting lighting-color="#fff" surfaceScale="2"><feDistantLight azimuth="45" elevation="55"/></feDiffuseLighting></filter>
<filter id="speck"><feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="2"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 .95  0 0 0 0 .85  0 0 0 9 -6.2"/></filter>
<filter id="shadow"><feDropShadow dx="14" dy="22" stdDeviation="16" flood-opacity=".28"/></filter>
</defs>`;
function setup(filter,paperOp=.4,speck=.3){const s=document.getElementById('s');s.innerHTML=DEFS+`<g id="art" ${filter?`filter="url(#${filter})"`:''}></g>
<rect width="1080" height="1350" filter="url(#paper)" style="mix-blend-mode:multiply" opacity="${paperOp}"/>`+(speck?`<rect width="1080" height="1350" filter="url(#speck)" opacity="${speck}"/>`:'');
  P=document.getElementById('art');}
/* ---- Utas ---- */
const S={stroke:C.ink,'stroke-width':4,'stroke-linecap':'round','stroke-linejoin':'round'};
const Pp=(g,d,fill,x={})=>el('path',Object.assign({d,fill},S,x),g);
function utas(g,e){
  Pp(g,'M62 430C62 345 108 308 170 308C232 308 278 345 278 430Z',C.sage);
  el('path',{d:'M62 430C62 345 108 308 170 308C232 308 278 345 278 430Z',fill:'#6F8064',filter:'url(#brush)',opacity:.5},g);
  Pp(g,'M95 395Q170 372 245 395','none',{stroke:C.red,'stroke-dasharray':'12 9'});
  Pp(g,'M150 280H190V315H150Z',C.skin2,{stroke:'none'});Pp(g,'M132 306Q170 336 208 306','#F8F4EC');
  Pp(g,'M78 175a24 28 0 1 0 0 52',C.skin);Pp(g,'M262 175a24 28 0 1 1 0 52',C.skin);
  Pp(g,'M74 182C72 100 118 66 170 66C226 66 268 100 266 186C264 256 224 292 170 292C114 292 76 254 74 182Z',C.skin);
  for(const x of [110,230])el('circle',{cx:x,cy:236,r:24,fill:'#E08A70',opacity:.55,filter:'url(#blur)'},g);
  for(const [x,y] of [[98,222],[108,214],[116,226],[224,226],[234,214],[242,222],[160,212],[180,212]])el('circle',{cx:x,cy:y,r:2.6,fill:'#B0664E'},g);
  const H='M70 178C56 92 112 46 176 48C246 50 290 98 272 176C262 140 244 122 222 116L212 140L198 118L182 142L166 120L148 138L130 122L114 150L98 138L70 178Z';
  Pp(g,H,C.hair);el('path',{d:H,fill:'#7A4733',filter:'url(#brush)',opacity:.6},g);
  Pp(g,'M120 64q-6 -26 14 -34M150 52q2 -22 20 -28M76 120q-18 -4 -24 8M266 116q18 -6 26 6','none');
  Pp(g,'M110 100q20 -12 40 -6M190 84q24 -6 42 10','none',{stroke:'#7A4733','stroke-width':3});
  Pp(g,'M212 58c4 -16 24 -18 26 -4c2 14 -18 16 -18 4','none',{stroke:C.red});Pp(g,'M232 58c18 6 30 22 34 52','none',{stroke:C.red,'stroke-width':3.5});
  const pg=el('g',{transform:'rotate(-35 285 168)'},g);Pp(pg,'M260 160h50v16h-50Z','#F2C14E',{'stroke-width':3});Pp(pg,'M310 160l18 8-18 8Z',C.skin2,{'stroke-width':3});Pp(pg,'M252 160h8v16h-8Z','#E39A80',{'stroke-width':3});
  Pp(g,'M164 204q-8 18 6 22q10 2 10 -6',C.skin2,{'stroke-width':3});face(g,e);}
function eye(g,x,y,r,px,py,pr){Pp(g,`M${x-r} ${y}a${r} ${r} 0 1 0 ${2*r} 0a${r} ${r} 0 1 0 ${-2*r} 0Z`,'#fff',{'stroke-width':3.5});
  el('circle',{cx:x+px,cy:y+py,r:pr,fill:C.ink},g);el('circle',{cx:x+px+pr*.35,cy:y+py-pr*.4,r:pr*.3,fill:'#fff'},g)}
function face(g,e){const L=128,R=212,Y=184;
  if(e==='senang'){Pp(g,`M${L-22} ${Y+4}q22 -24 44 0M${R-22} ${Y+4}q22 -24 44 0`,'none');Pp(g,'M136 238q34 40 68 0Z','#7A2E22',{'stroke-width':3.5});Pp(g,'M150 256q20 10 40 -2','#E07A6A',{stroke:'none'});Pp(g,`M${L-20} ${Y-36}q20 -10 38 -2M${R-18} ${Y-38}q20 -8 38 2`,'none');}
  if(e==='bingung'){eye(g,L,Y,24,8,-10,10);eye(g,R,Y,24,8,-10,10);Pp(g,`M${L-20} ${Y-36}q20 -4 38 2M${R-16} ${Y-46}q20 -14 38 0`,'none');Pp(g,'M146 250q8 -8 16 0t16 0t16 0','none');}
  if(e==='kaget'){eye(g,L,Y,29,0,0,7);eye(g,R,Y,29,0,0,7);Pp(g,`M${L-22} ${Y-46}q22 -14 42 -2M${R-20} ${Y-48}q22 -12 42 2`,'none');Pp(g,'M158 250a12 15 0 1 0 24 0a12 15 0 1 0 -24 0Z','#7A2E22',{'stroke-width':3});Pp(g,'M290 90l10 -24M300 110l22 -12M60 92l-12 -22','none',{stroke:C.red});}
  if(e==='lelah'){eye(g,L,Y+2,24,0,8,10);eye(g,R,Y+2,24,0,8,10);Pp(g,`M${L-24} ${Y+2}a24 24 0 0 1 48 0Z`,C.skin,{'stroke-width':3.5});Pp(g,`M${R-24} ${Y+2}a24 24 0 0 1 48 0Z`,C.skin,{'stroke-width':3.5});Pp(g,`M${L-16} ${Y+34}q16 8 32 0M${R-16} ${Y+34}q16 8 32 0`,'none',{stroke:'#B0664E','stroke-width':3});Pp(g,'M150 256q20 -8 40 0','none');}
  if(e==='ide'){eye(g,L,Y,25,4,-12,10);eye(g,R,Y,25,4,-12,10);Pp(g,`M${L-20} ${Y-44}q20 -14 40 -4M${R-18} ${Y-46}q20 -12 40 0`,'none');Pp(g,'M152 246q18 16 36 0','none');Pp(g,'M296 40l8 20 20 8-20 8-8 20-8-20-20-8 20-8Z','#F2C14E',{'stroke-width':3});}
  if(e==='fokus'){eye(g,L,Y+2,23,-2,10,10);eye(g,R,Y+2,23,-2,10,10);Pp(g,`M${L-20} ${Y-30}l38 10M${R+20} ${Y-30}l-38 10`,'none',{'stroke-width':5});Pp(g,'M146 250q24 6 46 -2','none');Pp(g,'M180 250q8 14 16 4q2 -6 -4 -6','#E07A6A',{'stroke-width':3});}}
/* ---- Style 3 portrait ---- */
function portrait(o){const H=['#2E2A28','#0E0D0D','#3A3330'];
  paint('M412 450C398 560 436 690 540 696C646 698 684 580 672 450C600 470 482 472 412 450Z','#F0D2B4',['#F5DCC2','#E8C4A2'],70,[6,14],[30,80],1.2);
  for(const x of [468,628])el('circle',{cx:x,cy:612,r:34,fill:'#EE8F6A',opacity:.6,filter:'url(#blur)'});
  if(o.scarf){paint('M420 672C470 720 610 722 664 672C700 700 708 760 690 790C610 820 470 820 392 790C378 750 388 700 420 672Z',C.red,['#A82818','#D84530','#E2614A'],120,[5,14],[40,110],0);}
  paint('M372 432C340 520 348 610 392 668C404 650 414 640 426 640C410 580 418 510 452 462Z','#1C1A1A',H,60,[3,8],[30,90],1.5);
  paint('M712 432C742 520 736 610 690 668C678 650 668 640 656 640C672 580 664 510 632 462Z','#1C1A1A',H,60,[3,8],[30,90],1.5);
  if(o.beret){paint('M404 440C430 500 480 486 500 470C520 500 570 492 590 474C612 496 650 488 680 440Z','#1C1A1A',H,50,[3,8],[20,60],1.4);
    paint('M326 438C312 336 446 272 562 280C696 290 772 362 748 446C706 476 602 456 542 460C450 466 376 478 326 438Z',C.red,['#A82818','#D84530','#E2614A','#B52D1B'],220,[5,16],[40,120],-.15);
    el('path',{d:'M556 282q4 -24 18 -30',stroke:'#A82818','stroke-width':9,'stroke-linecap':'round',fill:'none'});}
  else{paint('M366 470C340 360 430 300 540 298C660 296 750 360 718 470C690 440 650 440 620 452C600 470 560 476 540 462C510 480 470 476 450 458C420 446 390 450 366 470Z','#1C1A1A',H,120,[3,9],[30,90],1.3);}
  for(const x of [492,598]){el('ellipse',{cx:x,cy:o.look?560:556,rx:10,ry:13,fill:'#1C1A1A'});el('circle',{cx:x+3,cy:550,r:3.5,fill:'#fff'})}
  el('path',{d:'M472 524q18 -10 36 -2M582 522q18 -8 36 2',stroke:'#1C1A1A','stroke-width':4,'stroke-linecap':'round',fill:'none'});
  el('path',{d:'M546 584q-8 18 6 20',stroke:'#B5785A','stroke-width':4,'stroke-linecap':'round',fill:'none'});
  el('path',{d:'M526 642q18 10 36 -2',stroke:'#7A3B2A','stroke-width':4,'stroke-linecap':'round',fill:'none'});}
/* ---- Utas v2: painterly, no outlines ---- */
const HT=['#6E4130','#40241A','#7A4733','#4E2C20'],SK=['#F5DCC2','#E8C4A2','#F2CDB0'],SG=['#7D8E72','#99A88C','#6F8064'];
function utas2(g,e){const keep=P;P=g;
  paint('M60 432C58 350 104 306 170 306C236 306 282 350 280 432Z',C.sage,SG,90,[6,14],[30,90],0);
  el('path',{d:'M92 396Q170 374 248 396',stroke:C.red,'stroke-width':5,'stroke-dasharray':'12 9','stroke-linecap':'round',fill:'none'});
  paint('M148 276H192V318H148Z','#E6B898',[],0);
  paint('M128 308Q170 338 212 308Q206 300 170 316Q134 300 128 308Z','#F8F4EC',[],0);
  paint('M40 200a26 30 0 1 0 52 0a26 30 0 1 0 -52 0Z',C.skin,SK,10,[3,6],[8,20]);
  paint('M248 200a26 30 0 1 0 52 0a26 30 0 1 0 -52 0Z',C.skin,SK,10,[3,6],[8,20]);
  el('path',{d:'M56 194q10 -6 14 6M284 194q-10 -6 -14 6',stroke:'#C98E70','stroke-width':3,fill:'none','stroke-linecap':'round'});
  paint('M76 178C74 100 118 70 170 70C224 70 266 102 264 184C262 252 224 290 170 290C116 290 78 252 76 178Z','#F0D2B4',SK,90,[6,14],[30,80],1.3);
  for(const x of [108,232])el('circle',{cx:x,cy:228,r:30,fill:'#EE8F6A',opacity:.62,filter:'url(#blur)'});
  for(const [x,y] of [[96,214],[106,206],[114,220],[226,220],[234,206],[244,214]])el('circle',{cx:x,cy:y,r:2.4,fill:'#B0664E',opacity:.8});
  const H='M66 186C50 120 82 58 150 46C220 34 286 80 278 170C270 140 256 124 236 118C232 136 214 146 196 128C184 148 160 150 146 132C130 150 108 150 100 136C92 150 80 166 66 186Z';
  paint(H,C.hair,HT,160,[3,8],[20,70],1.2);
  el('path',{d:'M140 50q-2 -18 12 -24M84 86q-14 -4 -20 6M266 96q14 -6 20 4',stroke:'#40241A','stroke-width':3,fill:'none','stroke-linecap':'round'});
  el('path',{d:'M208 60c4 -16 24 -18 26 -4c2 14 -18 16 -18 4M228 60c18 6 32 24 36 56',stroke:C.red,'stroke-width':4,fill:'none','stroke-linecap':'round'});
  const pg=el('g',{transform:'rotate(-35 285 172)'});el('rect',{x:258,y:164,width:52,height:16,fill:'#F2C14E'},pg);el('path',{d:'M310 164l18 8-18 8Z',fill:'#E6B898'},pg);el('rect',{x:250,y:164,width:8,height:16,fill:'#E39A80'},pg);
  el('path',{d:'M162 210q-8 14 4 20q10 4 14 -4',fill:'#E58A6E',opacity:.9});
  face2(e);P=keep;}
function dot(x,y,rx=8,ry=10){el('ellipse',{cx:x,cy:y,rx,ry,fill:'#1C1A1A'});el('circle',{cx:x+2.5,cy:y-4,r:2.6,fill:'#fff'})}
const L2=(d,w=3.5,c='#2A1A14')=>el('path',{d,stroke:c,'stroke-width':w,fill:'none','stroke-linecap':'round'});
function face2(e){const L=130,R=210,Y=186;
  if(e==='senang'){L2(`M${L-14} ${Y+2}q14 -14 28 0M${R-14} ${Y+2}q14 -14 28 0`,4.5);el('path',{d:'M142 236q28 34 56 0Z',fill:'#9A3324'});el('path',{d:'M156 254q14 8 28 0',fill:'#E07A6A'});L2(`M${L-16} ${Y-30}q16 -8 30 -2M${R-14} ${Y-32}q16 -6 30 2`,3);}
  if(e==='bingung'){dot(L+4,Y-4);dot(R+4,Y-4);L2(`M${L-16} ${Y-30}q16 -4 30 2M${R-12} ${Y-42}q16 -12 30 -2`,3);L2('M150 248q7 -7 14 0t14 0t14 0',3);
    el('text',{x:262,y:64,'font-family':'Gochi Hand','font-size':46,fill:C.red}).textContent='?';}
  if(e==='kaget'){for(const x of [L,R]){el('circle',{cx:x,cy:Y,r:17,fill:'#fff'});dot(x,Y,6,7)}L2(`M${L-18} ${Y-38}q18 -12 34 -2M${R-16} ${Y-40}q18 -10 34 2`,3);
    el('ellipse',{cx:170,cy:248,rx:10,ry:13,fill:'#9A3324'});L2('M292 92l10 -24M302 112l22 -12M56 94l-12 -22',4,C.red);}
  if(e==='lelah'){dot(L,Y+6);dot(R,Y+6);el('path',{d:`M${L-14} ${Y+4}h28v-16h-28Z M${R-14} ${Y+4}h28v-16h-28Z`,fill:'#F0D2B4'});L2(`M${L-12} ${Y+2}h24M${R-12} ${Y+2}h24`,3.5);
    L2(`M${L-10} ${Y+24}q10 5 20 0M${R-10} ${Y+24}q10 5 20 0`,2.5,'#B0664E');L2('M154 252q16 -6 32 0',3);}
  if(e==='ide'){dot(L+3,Y-6);dot(R+3,Y-6);L2(`M${L-16} ${Y-38}q16 -12 32 -4M${R-14} ${Y-40}q16 -10 32 0`,3);L2('M154 244q16 14 32 0',3);
    el('path',{d:'M296 34l8 20 20 8-20 8-8 20-8-20-20-8 20-8Z',fill:'#F2C14E'});}
  if(e==='fokus'){dot(L-2,Y+6);dot(R-2,Y+6);L2(`M${L-16} ${Y-24}l30 10M${R+16} ${Y-24}l-30 10`,4.5);L2('M150 248q20 6 40 -2',3);el('path',{d:'M180 248q6 12 14 4q2 -6 -4 -6Z',fill:'#E07A6A'});}}
