// Full-body characters at canonical coords: centre x=0, ground y=1192.
function _ink(G){return (d,w=2.6,o=.75)=>{el('path',{d,stroke:'#2A1A14','stroke-width':w,fill:'none','stroke-linecap':'round','stroke-linejoin':'round',opacity:o},G);el('path',{d,stroke:'#2A1A14','stroke-width':w*.6,fill:'none',opacity:o*.4,transform:'translate(2.5 1.5)'},G)}}
function _boots(x,d,col,sole,lace){paint(`M${x-19*d} 1104H${x+19*d}V1160C${x+40*d} 1162 ${x+44*d} 1170 ${x+42*d} 1182H${x-20*d}C${x-22*d} 1170 ${x-19*d} 1150 ${x-19*d} 1104Z`,col,[col],20,[3,6],[10,30],0);
 el('path',{d:`M${x-20*d} 1182H${x+42*d}`,stroke:sole,'stroke-width':7});for(const y of [1118,1132,1146])el('path',{d:`M${x-10} ${y}L${x+10} ${y+4}M${x-10} ${y+4}L${x+10} ${y}`,stroke:lace,'stroke-width':2.5})}
function sulamFull(root,expr='tenang',opt={}){const keep=P;const G=el('g',{},root);const INK=el('g',{filter:'url(#wob)'});const ink=_ink(INK);
 P=G;el('ellipse',{cx:0,cy:1188,rx:150,ry:16,fill:'#2A1A14',opacity:.16,filter:'url(#blur)'});
 P=el('g',{filter:'url(#rough)'},G);
 paint('M-32 880H-10L-14 1110H-30Z','#2A2A33',['#33333D'],10,[3,6],[20,60],1.57);paint('M12 880H34L30 1110H14Z','#2A2A33',['#33333D'],10,[3,6],[20,60],1.57);
 for(const ox of [-22,22]){paint(`M${ox-17} 1060C${ox-22} 1076 ${ox-14} 1092 ${ox-19} 1112H${ox+17}C${ox+21} 1092 ${ox+13} 1076 ${ox+17} 1060Z`,'#F1E6D2',['#E7D8BD'],8,[3,5],[10,20],0);for(const y of [1072,1088,1102])el('path',{d:`M${ox-18} ${y}q18 4 36 0`,stroke:C.red,'stroke-width':4,fill:'none'})}
 _boots(-22,-1,'#9E3A22','#4A2016','#F1E6D2');_boots(22,1,'#9E3A22','#4A2016','#F1E6D2');
 paint('M-82 420C-60 404 60 404 82 420L112 560L158 900C60 914 -60 914 -158 900L-112 560Z',C.teal,TE,220,[5,12],[30,90],1.57);
 if(!opt.candle){
 paint('M-82 424C-120 450 -136 560 -146 760L-96 770C-92 640 -82 540 -66 470Z','#183B37',TE,60,[4,9],[30,80],1.4);
 paint('M82 424C120 450 136 560 146 760L96 770C92 640 82 540 66 470Z','#183B37',TE,60,[4,9],[30,80],1.4);
 paint('M-150 752L-94 762L-96 784L-152 776Z','#0F2826',[],0);paint('M150 752L94 762L96 784L152 776Z','#0F2826',[],0);
 }
 el('path',{d:'M62 426L-104 760',stroke:'#7A3420','stroke-width':12,'stroke-linecap':'round'});
 paint('M-160 740H-40V840C-40 852 -160 852 -160 840Z','#B5462A',['#A23E24','#C8572F'],30,[3,7],[20,60],0);paint('M-162 738H-38V788C-70 800 -130 800 -162 788Z','#9E3A22',['#8A2E1A'],12,[3,6],[20,60],0);
 paint('M-82 712H-58V744H-82Z',C.red,['#A82818','#D84530'],8,[2,4],[10,20],1.57);paint('M-86 708H-54V716H-86Z','#B87A45',[],0);
 paint('M8 440L42 446L36 640L6 636Z','#D9A441',['#C9922F','#E4B356'],20,[3,7],[20,60],1.57);paint('M-30 440L4 444L-6 590L-38 586Z','#D9A441',['#C9922F','#E4B356'],20,[3,7],[20,60],1.57);
 if(!opt.candle)for(const ox of [-122,122])paint(`M${ox-14} 780C${ox-18} 800 ${ox-10} 818 ${ox} 818C${ox+10} 818 ${ox+16} 800 ${ox+12} 780Z`,C.skin,SK,6,[2,4],[6,14]);
 P=G;const k=.78;const HG=el('g',{transform:`translate(${-170*k} ${200-58*k}) scale(${k})`,filter:'url(#wob)'});seed=9;sulam(HG,expr);
 P=el('g',{filter:'url(#rough)'},G);paint('M-60 388C-30 374 30 374 60 388L66 438C30 456 -30 456 -66 438Z','#D9A441',['#C9922F','#E4B356'],30,[3,7],[20,60],0);
 P=G;for(const y of [400,420])el('path',{d:`M-60 ${y}C-20 ${y+10} 20 ${y+10} 60 ${y}`,stroke:C.red,'stroke-width':6,fill:'none'});
 for(const y of [480,520,560,600])el('path',{d:`M8 ${y}L40 ${y+4}`,stroke:C.red,'stroke-width':5});for(const y of [480,520,560])el('path',{d:`M-30 ${y}L2 ${y+3}`,stroke:C.red,'stroke-width':5});
 for(const y of [560,640,720,800]){el('rect',{x:-14,y:y-5,width:28,height:10,rx:5,fill:'#E7D8BD'});el('path',{d:`M-22 ${y}H22`,stroke:'#0F2826','stroke-width':2.5,opacity:.8})}
 el('path',{d:'M0 456V906',stroke:'#0F2826','stroke-width':3,opacity:.7});
 el('path',{d:'M-70 740C-210 800 -150 960 -230 1050S-200 1180 -120 1186',stroke:C.red,'stroke-width':4,fill:'none','stroke-linecap':'round'});
 if(opt.candle){P=el('g',{filter:'url(#rough)'},G);
  // candle held at chest
  paint('M-22 600H22V760H-22Z',C.cream,['#E7D8BD','#F7EEDD'],12,[3,6],[20,50],1.57);el('path',{d:'M0 600v-12',stroke:'#2A1A14','stroke-width':4},G);
  // bent sleeves: shoulder -> elbow -> wrist near candle
  for(const m of [-1,1])paint(`M${82*m} 424C${130*m} 470 ${150*m} 560 ${128*m} 640L${70*m} 700L${34*m} 690L${30*m} 650L${80*m} 610C${96*m} 560 ${84*m} 500 ${60*m} 450Z`,'#183B37',TE,60,[4,9],[30,80],1.4);
  for(const m of [-1,1])paint(`M${40*m} 650L${76*m} 690L${60*m} 708L${26*m} 676Z`,'#0F2826',[],0);
  // cupped hands around candle
  for(const m of [-1,1])paint(`M${30*m} 664C${18*m} 640 ${12*m} 620 ${16*m} 604C${22*m} 598 ${30*m} 604 ${32*m} 616C${40*m} 640 ${42*m} 660 ${36*m} 680Z`,C.skin,SK,8,[2,4],[6,14]);
  P=G;opt.flame=el('g',{transform:'translate(0 588)'},G);}
 G.appendChild(INK);
 ink('M-82 420L-112 560L-158 900C-60 914 60 914 158 900L112 560L82 420');if(!opt.candle){ink('M-82 424C-120 450 -136 560 -146 760M82 424C120 450 136 560 146 760');
 ink('M-96 770C-92 640 -82 540 -66 470M96 770C92 640 82 540 66 470',2,.5);}ink('M-160 740H-40V840C-40 852 -160 852 -160 840Z',2.2,.7);
 ink('M-32 912L-30 1060M-10 912L-14 1060M12 912L14 1060M34 912L30 1060',2,.6);ink('M-60 388C-30 374 30 374 60 388L66 438C30 456 -30 456 -66 438Z',2,.6);
 P=keep;return G}
function utasFull(root,expr='senang'){const keep=P;const G=el('g',{},root);const INK=el('g',{filter:'url(#wob)'});const ink=_ink(INK);
 P=G;el('ellipse',{cx:0,cy:1188,rx:160,ry:16,fill:'#2A1A14',opacity:.16,filter:'url(#blur)'});
 P=el('g',{filter:'url(#rough)'},G);
 // canvas sneakers (cream, red laces) + sock sliver
 for(const [ox,d] of [[-48,-1],[48,1]]){paint(`M${ox-14} 1096H${ox+14}V1112H${ox-14}Z`,C.red,[],0);
  paint(`M${ox-24*d} 1110H${ox+22*d}C${ox+44*d} 1130 ${ox+56*d} 1150 ${ox+54*d} 1170H${ox-26*d}C${ox-28*d} 1150 ${ox-26*d} 1124 ${ox-24*d} 1110Z`,'#F1E6D2',['#E7D8BD','#F7EEDD'],14,[3,6],[10,30],0);
  el('path',{d:`M${ox-28*d} 1176H${ox+56*d}`,stroke:'#D8CBB0','stroke-width':12,'stroke-linecap':'round'});
  for(const y of [1122,1134,1146])el('path',{d:`M${ox-8+4*d} ${y}l16 0`,stroke:C.red,'stroke-width':3.5})}
 // wide cuffed trousers (light denim)
 paint('M-104 740H-6L-14 1094H-96Z','#A9C6CC',['#9AB8BE','#B8D2D6'],40,[4,9],[30,90],1.57);paint('M6 740H104L96 1094H14Z','#A9C6CC',['#9AB8BE','#B8D2D6'],40,[4,9],[30,90],1.57);
 paint('M-98 1064H-12L-14 1094H-96Z','#C6DDE0',[],0);paint('M12 1064H98L96 1094H14Z','#C6DDE0',[],0);
 // tote bag (behind arm, right side)
 el('path',{d:'M62 424L132 680',stroke:'#C9B89A','stroke-width':10,'stroke-linecap':'round'});
 for(const [x,r] of [[118,-8],[140,6],[160,-3]]){const g=el('g',{transform:`rotate(${r} ${x} 650)`});el('rect',{x:x-22,y:610,width:44,height:70,fill:'#F8F4EC'},g);for(let i=0;i<4;i++)el('path',{d:`M${x-14} ${624+i*12}h28`,stroke:'#9A8A72','stroke-width':2.5},g)}
 paint('M96 660H196L204 820H88Z','#E7D8BD',['#DCCCAE','#EFE3CB'],30,[3,7],[20,60],1.57);
 // oversized sage sweater
 paint('M-84 420C-60 404 60 404 84 420L112 560L120 770H-120L-112 560Z',C.sage,SG,200,[5,12],[30,90],1.57);
 paint('M-120 740H120V772H-120Z','#6F8064',['#7D8E72'],20,[3,6],[20,60],0);
 // sleeves hugging the stack
 paint('M-84 424C-124 452 -134 540 -126 612C-118 650 -92 652 -76 632L-70 560C-74 520 -72 470 -60 440Z','#7D8E72',SG,50,[4,9],[30,80],1.4);
 paint('M84 424C124 452 134 540 126 612C118 650 92 652 76 632L70 560C74 520 72 470 60 440Z','#7D8E72',SG,50,[4,9],[30,80],1.4);
 // stack of books/manuscripts at chest
 [[C.red,0,4],[C.yellow,1,-3],[C.cream,2,5],[C.teal,3,-2]].forEach(([c,i,dx])=>{paint(`M${-72+dx} ${650-i*30}h144v28h-144Z`,c,[c],8,[3,6],[20,60],0);el('path',{d:`M${-60+dx} ${664-i*30}h118`,stroke:i==2?'#9A8A72':'#F1E6D2','stroke-width':3})});
 for(const x of [-84,84])paint(`M${x-16} 600C${x-20} 620 ${x-12} 640 ${x} 642C${x+12} 640 ${x+18} 620 ${x+14} 600Z`,C.skin,SK,6,[2,4],[6,14]);
 P=G;const k=.78;const HG=el('g',{transform:`translate(${-170*k} ${200-58*k}) scale(${k})`,filter:'url(#wob)'});seed=9;utas2(HG,expr);
 P=G;
 el('text',{x:146,y:760,'text-anchor':'middle','font-family':'Inter','font-weight':800,'font-size':22,fill:C.red,transform:'rotate(-2 146 760)'}).textContent='BM';
 el('path',{d:'M-80 1066V1092M-40 1066V1092M40 1066V1092M80 1066V1092',stroke:'#9AB8BE','stroke-width':2});
 G.appendChild(INK);
 ink('M-84 420L-112 560L-120 770H120L112 560L84 420');ink('M-84 424C-124 452 -134 540 -126 612M84 424C124 452 134 540 126 612',2.4,.6);
 ink('M-104 772L-96 1094M-6 772L-14 1094M6 772L14 1094M104 772L96 1094',2,.6);ink('M96 660H196L204 820H88Z',2.2,.6);
 ink('M-72 562h144v116h-144Z',2,.5);
 P=keep;return G}
