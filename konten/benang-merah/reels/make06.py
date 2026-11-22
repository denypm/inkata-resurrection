html=r'''<!DOCTYPE html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Gochi+Hand&family=Instrument+Serif:ital@0;1&family=Inter:wght@700;800&display=block" rel="stylesheet">
<script src="lib.js"></script>
<style>html,body{margin:0}#post{width:1080px;height:1920px;position:relative;overflow:hidden;background:#EFE8DC;color:#3B1F14}
svg{position:absolute;inset:0}.a{position:absolute}.f{position:absolute;left:70px;right:70px;top:330px;text-align:center;font:400 84px/0.98 'Instrument Serif';letter-spacing:-2px;opacity:0}
.f i{color:#B5462A}.b{position:absolute;font:400 44px/1.08 'Gochi Hand';text-align:center;opacity:0;width:420px}
</style></head><body><div id="post"><svg id="s" viewBox="0 0 1080 1920" width="1080" height="1920"></svg>
<div class="a" style="left:0;right:0;top:250px;text-align:center;font:700 22px Inter;letter-spacing:4px">RUANG NASKAH <span style="color:#B5462A">✶</span> TAHUKAH KAMU?</div>
<div class="f" id="f1">Badak jawa liar hanya ada<br>di <i>satu tempat</i> di dunia:<br>Ujung Kulon.</div>
<div class="f" id="f2">Jumlahnya tinggal<br><i>puluhan ekor</i> saja.</div>
<div class="f" id="f3">Setiap makhluk<br>punya <i>rumah.</i><div style="font:800 32px Inter;color:#B5462A;margin-top:26px;letter-spacing:1px">@penerbitbenangmerah</div></div>
<div class="b" id="b1" style="left:60px;top:1190px">"Kenapa badak jawa<br>penting, Lam?"</div>
<div class="b" id="b2" style="left:600px;top:1190px">"Karena mereka nyaris<br>hilang, Tas."</div>
<div class="b" id="b3" style="left:600px;top:1190px">"Catat, ceritakan,<br>jaga."</div>
</div><script>
const L=10,W0=2*Math.PI/L,cl=x=>Math.max(0,Math.min(1,x)),mod=(a,b)=>((a%b)+b)%b,seg=(t,a,b)=>cl(Math.min((t-a)/.4,(b-t)/.4));
const s=document.getElementById('s');
s.innerHTML=DEFS+`<g id="bg"></g><g id="hab"></g><g id="rh"></g><g id="bub"></g><g id="chars"></g><rect width="1080" height="1920" filter="url(#paper)" style="mix-blend-mode:multiply" opacity=".32"/>`;
seed=6;P=document.getElementById('bg');paint('M-30 -30H1110V1950H-30Z','#EFE8DC',['#E7D8BD','#F4ECDC'],160,[10,30],[60,160],0.05);
// habitat circle
P=el('g',{filter:'url(#rough)'},document.getElementById('hab'));
paint('M540 640a250 250 0 1 0 .1 0Z',C.sage,SG,120,[6,16],[40,120],0);
el('clipPath',{id:'hc'});el('circle',{cx:540,cy:890,r:248},P.lastChild);
const HC=el('g',{'clip-path':'url(#hc)'});P=HC;
paint('M280 960C400 930 600 950 800 930V1150H280Z',C.dgreen,GR,80,[5,12],[30,90],0);
paint('M300 1030C450 1010 650 1040 800 1020V1150H300Z','#5E8CA8',['#6E9CB8','#4E7C98'],40,[4,10],[40,100],0);
for(let i=0;i<30;i++){const x=rr(300,780),y=rr(900,980);el('path',{d:`M${x} ${y}q${rr(-6,6)} ${-rr(14,30)} ${rr(-10,10)} ${-rr(30,60)}`,stroke:R()<.5?'#3E7C5A':'#2F6B4F','stroke-width':rr(3,5),fill:'none'})}
P=el('g',{},document.getElementById('hab'));
el('circle',{cx:540,cy:890,r:262,fill:'none',stroke:C.red,'stroke-width':5,'stroke-dasharray':'14 10'});
// rhino (side view, facing left)
const RH=el('g',{id:'rhino',filter:'url(#rough)'},document.getElementById('rh'));P=RH;
const GRY='#8A8378',GT=['#958E83','#7C756B','#A39C90'];
for(const [x,dx] of [[-110,0],[-40,0],[60,0],[120,0]])paint(`M${x-18} 40H${x+18}V110H${x-18}Z`,'#7C756B',['#6E675E'],8,[3,6],[10,30],1.57);
paint('M-170 -10C-170 -80 -100 -120 0 -120C110 -120 170 -80 170 -10C170 50 110 70 0 70C-110 70 -170 50 -170 -10Z',GRY,GT,120,[5,12],[30,90],0);
const HD=el('g',{id:'rhead'},RH);P=HD;
paint('M-150 -60C-190 -70 -240 -50 -250 -10C-256 20 -230 40 -200 36C-180 34 -160 20 -140 10Z',GRY,GT,40,[4,9],[20,60],0);
paint('M-238 -20C-246 -44 -244 -64 -236 -76C-226 -60 -222 -40 -224 -22Z','#6E675E',['#5E574F'],6,[2,4],[8,20],1.57);
el('circle',{cx:-196,cy:-28,r:5,fill:'#2A1A14'});el('path',{d:'M-200 -36q6 -4 12 0',stroke:'#2A1A14','stroke-width':2.5,fill:'none'});
const EAR=el('path',{d:'M-158 -64C-160 -90 -146 -100 -138 -92C-136 -80 -144 -68 -150 -60Z',fill:'#7C756B'},HD);
P=RH;for(const d of ['M-90 -112C-100 -60 -96 0 -84 60','M60 -116C50 -60 54 0 64 62','M-170 -10C-120 0 -100 -4 -90 -20','M110 40C140 30 160 10 170 -10'])el('path',{d,stroke:'#5E574F','stroke-width':4,fill:'none','stroke-linecap':'round',opacity:.7});
const TAIL=el('path',{stroke:'#6E675E','stroke-width':6,fill:'none','stroke-linecap':'round'},RH);
// characters
P=document.getElementById('chars');
el('path',{d:'M70 1920V1520a200 200 0 0 1 400 0V1920Z',fill:'#F2C14E'});el('path',{d:'M610 1920V1520a200 200 0 0 1 400 0V1920Z',fill:'#B5462A'});
const UT=el('g',{},P);const ui=el('g',{transform:'translate(83 1360) scale(1.1)',filter:'url(#wob)'},UT);seed=9;utas2(ui,'bingung');
P=document.getElementById('chars');const SU=el('g',{},P);const si=el('g',{transform:'translate(623 1360) scale(1.1)',filter:'url(#wob)'},SU);seed=9;sulam(si,'tenang');
// bubbles
P=document.getElementById('bub');const BU=[];
for(const [x,tx,id] of [[50,270,'U'],[590,810,'S']]){const g=el('g',{opacity:0});el('path',{d:`M${x} 1170H${x+440}V1310H${tx+20}L${tx} 1350L${tx-12} 1310H${x}Z`,fill:'#F8F4EC',stroke:C.ink,'stroke-width':3,filter:'url(#wob)'},g);BU.push(g)}
window.render=function(t){t=mod(t,L);
 const br=Math.sin(W0*2*t);RH.setAttribute('transform',`translate(590 905) scale(${(.88*(1+br*.012)).toFixed(4)} ${(.88*(1+br*.02)).toFixed(4)})`);
 HD.setAttribute('transform',`rotate(${(Math.sin(W0*1*t)*2.5).toFixed(2)} -140 -20)`);
 const tw=Math.max(0,Math.sin(W0*5*t))**8;EAR.setAttribute('transform',`rotate(${(-tw*18).toFixed(1)} -150 -62)`);
 const tl=Math.sin(W0*4*t)*14;TAIL.setAttribute('d',`M168 -30C190 -20 196 10 ${190+tl*.4} ${40+Math.abs(tl)*.3}`);
 UT.setAttribute('transform',`translate(0 ${(Math.sin(W0*3*t)*4).toFixed(1)})`);SU.setAttribute('transform',`translate(0 ${(Math.sin(W0*3*t+1)*4).toFixed(1)})`);
 const p1=seg(t,0,3.3),p2=seg(t,3.4,6.7),p3=seg(t,6.8,10);
 ['f1','f2','f3'].forEach((id,i)=>document.getElementById(id).style.opacity=[p1,p2,p3][i]);
 document.getElementById('b1').style.opacity=p1;document.getElementById('b2').style.opacity=p2;document.getElementById('b3').style.opacity=p3;
 BU[0].setAttribute('opacity',p1);BU[1].setAttribute('opacity',Math.max(p2,p3));
};
render(0);
</script></body></html>'''
open('reel-06.html','w').write(html)
