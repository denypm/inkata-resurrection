// shared painterly Javan rhino (side view, facing left). returns parts for animation
function drawRhino(parent){const RH=el('g',{filter:'url(#rough)'},parent);const keep=P;P=RH;
 const GRY='#8A8378',GT=['#958E83','#7C756B','#A39C90'];
 for(const x of [-110,-40,60,120])paint(`M${x-18} 40H${x+18}V110H${x-18}Z`,'#7C756B',['#6E675E'],8,[3,6],[10,30],1.57);
 paint('M-170 -10C-170 -80 -100 -120 0 -120C110 -120 170 -80 170 -10C170 50 110 70 0 70C-110 70 -170 50 -170 -10Z',GRY,GT,120,[5,12],[30,90],0);
 const HD=el('g',{},RH);P=HD;
 paint('M-150 -60C-190 -70 -240 -50 -250 -10C-256 20 -230 40 -200 36C-180 34 -160 20 -140 10Z',GRY,GT,40,[4,9],[20,60],0);
 paint('M-238 -20C-246 -44 -244 -64 -236 -76C-226 -60 -222 -40 -224 -22Z','#6E675E',['#5E574F'],6,[2,4],[8,20],1.57);
 el('circle',{cx:-196,cy:-28,r:5,fill:'#2A1A14'});el('path',{d:'M-200 -36q6 -4 12 0',stroke:'#2A1A14','stroke-width':2.5,fill:'none'});
 const EAR=el('path',{d:'M-158 -64C-160 -90 -146 -100 -138 -92C-136 -80 -144 -68 -150 -60Z',fill:'#7C756B'},HD);
 P=RH;for(const d of ['M-90 -112C-100 -60 -96 0 -84 60','M60 -116C50 -60 54 0 64 62','M-170 -10C-120 0 -100 -4 -90 -20','M110 40C140 30 160 10 170 -10'])el('path',{d,stroke:'#5E574F','stroke-width':4,fill:'none','stroke-linecap':'round',opacity:.7});
 const TAIL=el('path',{stroke:'#6E675E','stroke-width':6,fill:'none','stroke-linecap':'round'},RH);P=keep;
 return {RH,HD,EAR,TAIL,anim(t,W0,x,y,sc){const br=Math.sin(W0*2*t);RH.setAttribute('transform',`translate(${x} ${y}) scale(${(sc*(1+br*.012)).toFixed(4)} ${(sc*(1+br*.02)).toFixed(4)})`);
  HD.setAttribute('transform',`rotate(${(Math.sin(W0*t)*2.5).toFixed(2)} -140 -20)`);const tw=Math.max(0,Math.sin(W0*5*t))**8;EAR.setAttribute('transform',`rotate(${(-tw*18).toFixed(1)} -150 -62)`);
  const tl=Math.sin(W0*4*t)*14;TAIL.setAttribute('d',`M168 -30C190 -20 196 10 ${190+tl*.4} ${40+Math.abs(tl)*.3}`)}}}
