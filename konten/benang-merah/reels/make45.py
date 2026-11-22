from loopbase import page
# ================= REEL 04: Utas chases Sulam (platformer) =================
titles4=[('<span class="px">SATU BAB,</span><br><span style="display:inline-block;margin-top:16px">satu lompatan.</span>',250),
         ('jangan berhenti<br>sampai jadi <span class="hl">buku.</span>',280),
         ('ikuti, dan kejar<br>bukumu bersama kami.<div class="hd">@penerbitbenangmerah</div>',250)]
js4=r'''
const s=document.getElementById('s');
s.innerHTML=DEFS+`<g id="bg" filter="url(#rough)"></g><g id="stars"></g><g id="hills"></g><g id="ground"></g><g id="obs"></g><g id="col"></g><g id="chars"></g>
<rect width="1080" height="1920" filter="url(#paper)" style="mix-blend-mode:multiply" opacity=".28"/>`;
const V=360,D=3600,GY=1540;
seed=4;P=document.getElementById('bg');paint('M-30 -30H1110V1950H-30Z','#152A3A',['#1D3A4F','#0E1F2C','#1E4640'],380,[10,30],[60,170],0.1);
paint('M880 700a80 80 0 1 0 .1 0Z',C.yellow,['#F3B84A','#FAD77E'],40,[4,9],[12,35]);paint('M905 712a64 64 0 1 0 .1 0Z','#152A3A',['#1D3A4F'],20,[5,10],[15,40]);
const ST=[];P=document.getElementById('stars');for(let i=0;i<40;i++){const x=rr(20,1060),y=rr(200,1250);star(x,y,rr(4,10),R()<.3?C.orange:C.cream);ST.push([P.lastChild,Math.round(rr(1,4)),rr(0,6)])}
// hills parallax tile (1080, seamless ends)
P=document.getElementById('hills');const HG=el('g',{id:'hg',filter:'url(#rough)'});P=HG;
for(const ox of [0,1080]){paint(`M${ox} 1540V1300C${ox+200} 1180 ${ox+380} 1220 ${ox+540} 1280S${ox+880} 1210 ${ox+1080} 1300V1500Z`,C.dgreen,GR,90,[5,14],[30,90],-.1);}
// ground tile (3600) x2
P=document.getElementById('ground');const GG=el('g',{id:'gg'});P=el('g',{filter:'url(#rough)'},GG);seed=21;
for(const ox of [0,3600]){paint(`M${ox-10} ${GY}H${ox+3610}V1960H${ox-10}Z`,C.teal,TE,260,[6,16],[40,120],0);
 paint(`M${ox-10} ${GY-14}H${ox+3610}V${GY+40}H${ox-10}Z`,C.orange,OR,200,[5,12],[30,90],0);}
seed=33;const GR2=[];for(let i=0;i<120;i++)GR2.push([rr(0,3600),rr(GY+60,1900),rr(-6,6),rr(18,40),R()]);
for(const ox of [0,3600])for(const [x,y,dx,h,r] of GR2){el('path',{d:`M${ox+x} ${y}q${dx} ${-h/2} ${dx*2} ${-h}`,stroke:r<.5?'#3E7C5A':'#2F6B4F','stroke-width':3,fill:'none'});if(r<.2)el('circle',{cx:ox+x+dx*2,cy:y-h,r:4,fill:r<.1?C.cream:C.orange})}
// obstacles
const OB=[{p:900,k:'books'},{p:1750,k:'ink'},{p:2550,k:'paper'},{p:3250,k:'thread'}];
P=document.getElementById('obs');
for(const o of OB){const g=el('g',{});o.g=g;P=el('g',{filter:'url(#rough)'},g);
 if(o.k=='books'){const cols=[C.red,C.sage,C.yellow];cols.forEach((c,i)=>{paint(`M${-60+i*6} ${-36*(i+1)}h${120-i*12}v34h${-(120-i*12)}Z`,c,[c],8,[3,6],[20,60],0);el('path',{d:`M${-50+i*6} ${-36*(i+1)+17}h${100-i*12}`,stroke:'#F1E6D2','stroke-width':3})});o.h=110}
 if(o.k=='ink'){paint('M-90 -4C-80 -22 -40 -18 -10 -24C30 -30 70 -20 90 -6C96 4 -96 6 -90 -4Z','#0E0D0D',['#1C1A1A'],10,[3,6],[20,50],0);for(const [x,y] of [[-60,-34],[40,-40],[0,-52]])el('circle',{cx:x,cy:y,r:7,fill:'#0E0D0D'});o.h=40}
 if(o.k=='paper'){for(const [x,r] of [[-40,34],[30,42]]){paint(`M${x} ${-r}a${r} ${r} 0 1 0 .1 0Z`,C.cream,['#E7D8BD','#D8CBB0'],14,[3,6],[10,30]);el('path',{d:`M${x-r*.6} ${-r}l${r*.5} ${r*.3}l${r*.3} ${-r*.4}l${r*.4} ${r*.5}`,stroke:'#9A8A72','stroke-width':3,fill:'none'})}o.h=84}
 if(o.k=='thread'){for(const x of [-60,60])paint(`M${x-8} -150h16v150h-16Z`,'#B87A45',['#9C6435'],6,[3,5],[10,30],1.57);el('path',{d:'M-60 -130C-20 -110 20 -150 60 -130',stroke:C.red,'stroke-width':8,fill:'none','stroke-linecap':'round'});o.h=150}
 P=document.getElementById('obs');}
// collectibles (above each obstacle)
P=document.getElementById('col');for(const o of OB){const g=el('g',{});o.c=g;el('circle',{r:34,fill:C.yellow,opacity:.25},g);el('path',{d:'M0 -26L7 -7L26 0L7 7L0 26L-7 7L-26 0L-7 -7Z',fill:C.yellow},g);}
// characters
P=document.getElementById('chars');
function legs(g,pants,shoe){const L1=el('path',{stroke:pants,'stroke-width':34,'stroke-linecap':'round',fill:'none'},g);const L2=el('path',{stroke:pants,'stroke-width':34,'stroke-linecap':'round',fill:'none'},g);
 const S1=el('ellipse',{rx:26,ry:14,fill:shoe},g),S2=el('ellipse',{rx:26,ry:14,fill:shoe},g);return [L1,L2,S1,S2]}
const SC=1.1;
const UT=el('g',{});const ul=legs(UT,'#A9C6CC','#C8321E');const ub=el('g',{filter:'url(#wob)'},UT);seed=9;utas2(ub,'fokus');P=document.getElementById('chars');
const stack=el('g',{},UT);P=stack;[[C.red,0],[C.sage,1],[C.yellow,2],[C.cream,3]].forEach(([c,i])=>{paint(`M${96+(i%2)*10} ${404-i*30}h${148-(i%2)*14}v28h${-(148-(i%2)*14)}Z`,c,[c],6,[3,6],[20,60],0);el('path',{d:`M${106+(i%2)*10} ${418-i*30}h${126-(i%2)*14}`,stroke:i==3?'#9A8A72':'#F1E6D2','stroke-width':3})});
for(const x of [90,250])el('ellipse',{cx:x,cy:396,rx:20,ry:24,fill:C.skin},stack);
P=document.getElementById('chars');const SU=el('g',{});const sl=legs(SU,'#1C1A1A','#C8321E');const sb=el('g',{filter:'url(#wob)'},SU);seed=9;sulam(sb,'mengedip');P=document.getElementById('chars');
const UX=280,SX=790,R0=V*.42,JH=280;
function jump(xc,t){let h=0;for(const o of OB){const X=mod(o.p-V*t,D)-200;const d=X-xc;if(Math.abs(d)<R0){const u=(R0-d)/(2*R0);h=Math.max(h,JH*4*u*(1-u))}}return h}
function setChar(G,lg,xc,t,ph){const h=jump(xc,t);const air=h>4;const st=W0*25*t+ph;const bob=air?0:Math.abs(Math.sin(st))*10;
 const top=GY-(432+60)*SC-h-bob;G.setAttribute('transform',`translate(${(xc-170*SC).toFixed(1)} ${top.toFixed(1)}) scale(${SC})`);
 const a=air?.6:Math.sin(st),b=air?-.4:-Math.sin(st);
 const leg=(Lp,S,x,sw)=>{const fx=x+sw*34,fy=432+56-(air?20:Math.max(0,-sw)*8);Lp.setAttribute('d',`M${x} 420L${fx.toFixed(1)} ${fy.toFixed(1)}`);S.setAttribute('cx',(fx+8).toFixed(1));S.setAttribute('cy',(fy+12).toFixed(1))};
 leg(lg[0],lg[2],140,a);leg(lg[1],lg[3],200,b);return h}
window.render=function(t){t=mod(t,L);
 for(const [e,k,ph] of ST)e.setAttribute('opacity',(.35+.5*Math.abs(Math.sin(W0*k*t+ph))).toFixed(2));
 document.getElementById('hg').setAttribute('transform',`translate(${(-mod(V*.3*t,1080)).toFixed(1)} 0)`);
 document.getElementById('gg').setAttribute('transform',`translate(${(-mod(V*t,D)).toFixed(1)} 0)`);
 for(const o of OB){const X=mod(o.p-V*t,D)-200;o.g.setAttribute('transform',`translate(${X.toFixed(1)} ${GY})`);
  const got=X<UX;const bob=Math.sin(W0*20*t+o.p)*8;o.c.setAttribute('transform',`translate(${X.toFixed(1)} ${(GY-o.h-170+bob).toFixed(1)}) scale(${got?0:1})`);}
 setChar(SU,sl,SX,t,1.3);const h=setChar(UT,ul,UX,t,0);
 stack.setAttribute('transform',`rotate(${(Math.sin(W0*25*t)*2.5+(h>4?-3:0)).toFixed(2)} 170 400)`);
 document.getElementById('l1').style.opacity=seg(t,0,3.3);document.getElementById('l2').style.opacity=seg(t,3.4,6.7);document.getElementById('l3').style.opacity=seg(t,6.8,10);
};
window.EVENTS=()=>{const ev=[];for(const o of OB){for(const [xc,kind] of [[UX,'U'],[SX,'S']]){const tc=mod((o.p-200-xc)/V,L);ev.push([mod(tc-.4,L),'jump'+kind]);if(kind=='U')ev.push([tc,'coin'])}}return ev};
'''
open('reel-04.html','w').write(page(titles4,js4))
# ================= REEL 05: Sulam waters flowers =================
titles5=[('menulis itu seperti<br><span class="hl">merawat bunga.</span>',260),
         ('disiram sedikit,<br>setiap hari.',280),
         ('ikuti, dan tumbuh<br>bersama kami.<div class="hd">@penerbitbenangmerah</div>',250)]
js5=r'''
const s=document.getElementById('s');
s.innerHTML=DEFS+`<g id="bg" filter="url(#rough)"></g><g id="stars"></g><g id="ground" filter="url(#rough)"></g><g id="sul"></g><g id="flw"></g><g id="drops"></g><g id="can"></g>
<rect width="1080" height="1920" filter="url(#paper)" style="mix-blend-mode:multiply" opacity=".28"/>`;
seed=5;P=document.getElementById('bg');paint('M-30 -30H1110V1950H-30Z','#152A3A',['#1D3A4F','#0E1F2C','#1E4640'],380,[10,30],[60,170],0.1);
paint('M880 640a80 80 0 1 0 .1 0Z',C.yellow,['#F3B84A','#FAD77E'],40,[4,9],[12,35]);paint('M905 652a64 64 0 1 0 .1 0Z','#152A3A',['#1D3A4F'],20,[5,10],[15,40]);
const ST=[];P=document.getElementById('stars');for(let i=0;i<40;i++){const x=rr(20,1060),y=rr(200,1100);star(x,y,rr(4,10),R()<.3?C.orange:C.cream);ST.push([P.lastChild,Math.round(rr(1,4)),rr(0,6)])}
P=document.getElementById('ground');paint('M-30 1600C200 1570 600 1590 1110 1575V1960H-30Z',C.dgreen,GR,200,[5,14],[30,90],0);
for(let i=0;i<70;i++){const x=rr(0,1080),y=rr(1620,1900);el('path',{d:`M${x} ${y}q${rr(-6,6)} ${-rr(10,22)} ${rr(-10,10)} ${-rr(20,40)}`,stroke:R()<.5?'#3E7C5A':'#2F6B4F','stroke-width':rr(2,4),fill:'none'})}
// Sulam
P=document.getElementById('sul');const SGg=el('g',{id:'sg'});const SI=el('g',{transform:'translate(-120 640) scale(2.2)',filter:'url(#wob)'},SGg);seed=9;sulam(SI,'tenang');
P=SGg;el('path',{d:'M440 1430C520 1400 600 1330 650 1260',stroke:C.teal,'stroke-width':70,'stroke-linecap':'round',fill:'none',filter:'url(#wob)'});
// open book with flowers
P=document.getElementById('flw');const FB=el('g',{filter:'url(#rough)'});P=FB;
paint('M650 1580L820 1610L820 1660L650 1630Z',C.red,['#A82818'],12,[3,6],[20,60],0);paint('M820 1610L990 1580L990 1630L820 1660Z',C.red,['#A82818'],12,[3,6],[20,60],0);
paint('M660 1550C730 1530 790 1545 820 1590L820 1640C790 1600 730 1590 660 1605Z',C.cream,['#E7D8BD'],20,[3,6],[20,60],.2);
paint('M980 1550C910 1530 850 1545 820 1590L820 1640C850 1600 910 1590 980 1605Z',C.cream,['#E7D8BD'],20,[3,6],[20,60],-.2);
P=document.getElementById('flw');
const FL=[];[[730,1560,250,C.red,0],[820,1580,330,C.yellow,1.3],[910,1560,220,'#F1E6D2',2.6]].forEach(([x,y,h,c,ph])=>{const g=el('g',{});const stem=el('path',{stroke:'#3E7C5A','stroke-width':9,fill:'none','stroke-linecap':'round'},g);
 const lf=el('path',{d:'M0 0C20 -16 46 -12 56 0C40 10 18 12 0 0Z',fill:'#3E7C5A'},g);const hd=el('g',{},g);P=hd;
 for(let k=0;k<6;k++){el('ellipse',{cx:0,cy:-26,rx:15,ry:26,fill:c,transform:`rotate(${k*60})`,stroke:'#00000022','stroke-width':2})}el('circle',{r:15,fill:c==C.yellow?C.orange:C.yellow});P=document.getElementById('flw');
 FL.push({g,stem,lf,hd,x,y,h,ph})});
// water drops
P=document.getElementById('drops');const DR=[];for(let i=0;i<16;i++)DR.push(el('path',{d:'M0 -10C5 -2 6 4 0 8C-6 4 -5 -2 0 -10Z',fill:'#9FD0F0',opacity:.9}));
// watering can (pivot at handle 640,1240)
P=document.getElementById('can');const CN=el('g',{id:'cn'});const CI=el('g',{filter:'url(#rough)'},CN);P=CI;
paint('M-40 -60H90V40C90 60 70 70 25 70S-40 60 -40 40Z',C.red,['#A82818','#D84530','#E2614A'],50,[4,9],[20,60],0);
el('path',{d:'M-40 -40C-90 -40 -96 30 -40 30',stroke:'#A82818','stroke-width':12,fill:'none'});
el('path',{d:'M80 0L190 -70',stroke:C.red,'stroke-width':18,'stroke-linecap':'round'});el('ellipse',{cx:196,cy:-74,rx:16,ry:10,fill:'#A82818',transform:'rotate(-32 196 -74)'});
el('path',{d:'M-30 -20H80',stroke:C.cream,'stroke-width':6,'stroke-dasharray':'12 9'});
P=CN;paint('M-70 -40C-96 -46 -110 -12 -94 10C-80 26 -54 20 -50 0C-48 -16 -56 -36 -70 -40Z',C.skin,SK,10,[3,6],[8,20]);
window.render=function(t){t=mod(t,L);
 for(const [e,k,ph] of ST)e.setAttribute('opacity',(.35+.5*Math.abs(Math.sin(W0*k*t+ph))).toFixed(2));
 const br=Math.sin(W0*3*t)*5;document.getElementById('sg').setAttribute('transform',`translate(0 ${br.toFixed(1)})`);
 const tilt=24+Math.sin(W0*2*t)*5;const cx=650,cy=1240+br;
 CN.setAttribute('transform',`translate(${cx} ${cy.toFixed(1)}) rotate(${tilt.toFixed(2)}) scale(1.3)`);
 const a=tilt*Math.PI/180;const sx=cx+1.3*(196*Math.cos(a)+74*Math.sin(a)),sy=cy+1.3*(196*Math.sin(a)-74*Math.cos(a));
 DR.forEach((d,i)=>{const u=mod(t*1.0+i/DR.length,1);const x=sx+u*40+Math.sin(i*2.3)*14,y=sy+u*u*420+u*30;d.setAttribute('transform',`translate(${x.toFixed(1)} ${y.toFixed(1)})`);d.setAttribute('opacity',(u<.9?.9:(1-u)*9).toFixed(2))});
 FL.forEach(f=>{const sw=Math.sin(W0*2*t+f.ph)*6+Math.sin(W0*5*t+f.ph*2)*2;const tx=f.x+sw*2.2,ty=f.y-f.h;
  f.stem.setAttribute('d',`M${f.x} ${f.y}C${f.x} ${f.y-f.h*.4} ${tx-sw} ${ty+f.h*.4} ${tx} ${ty}`);
  f.lf.setAttribute('transform',`translate(${f.x+2} ${f.y-f.h*.35}) rotate(${(-20+sw).toFixed(1)})`);
  const bl=1+Math.sin(W0*4*t+f.ph)*.06;f.hd.setAttribute('transform',`translate(${tx.toFixed(1)} ${ty.toFixed(1)}) rotate(${(sw*1.5+W0*t*(180/Math.PI)*.0).toFixed(1)}) scale(${bl.toFixed(3)})`)});
 document.getElementById('l1').style.opacity=seg(t,0,3.3);document.getElementById('l2').style.opacity=seg(t,3.4,6.7);document.getElementById('l3').style.opacity=seg(t,6.8,10);
};
'''
open('reel-05.html','w').write(page(titles5,js5))
