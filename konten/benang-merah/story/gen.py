HEAD='''<!DOCTYPE html><html lang="id"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Gochi+Hand&family=Instrument+Serif:ital@0;1&family=Jost:wght@300;400;600;700&family=Inter:wght@600;700;800&display=block" rel="stylesheet">
<style>html,body{margin:0}#post{width:1080px;height:1920px;position:relative;overflow:hidden}svg#s{position:absolute;inset:0}
.a{position:absolute}.gh{font-family:'Gochi Hand'}.is{font-family:'Instrument Serif'}.jo{font-family:Jost}.in{font-family:Inter}</style>
<script src="lib.js"></script><script>
function setupS(filter,paperOp=.4,speck=.3){const s=document.getElementById('s');s.innerHTML=DEFS+`<g id="art" ${filter?`filter="url(#${filter})"`:''}></g>
<rect width="1080" height="1920" filter="url(#paper)" style="mix-blend-mode:multiply" opacity="${paperOp}"/>`+(speck?`<rect width="1080" height="1920" filter="url(#speck)" opacity="${speck}"/>`:'');P=document.getElementById('art');}
</script></head><body><div id="post" style="background:%BG%">
<svg id="s" viewBox="0 0 1080 1920" width="1080" height="1920"></svg>%HTML%</div><script>%JS%</script></body></html>'''
T={}
HANDLE='<div class="a in" style="left:0;right:0;bottom:230px;text-align:center;font-weight:600;font-size:22px;letter-spacing:1px;color:%s;opacity:.85">@penerbitbenangmerah</div>'
# 1 Postingan baru (style 1)
T['01-postingan-baru']=dict(BG='#1E4640',HTML='''
<div class="a gh" style="left:0;right:0;top:250px;text-align:center;font-size:96px;color:#F1E6D2">postingan <span style="color:#E8743B">baru</span> ✶</div>
<div class="a gh" style="left:0;right:0;top:1500px;text-align:center;font-size:52px;color:#F1E6D2">ketuk untuk baca →</div>'''+HANDLE%'#F1E6D2',JS='''
setupS('rough');seed=3;
paint('M-30 -30H1110V1950H-30Z',C.teal,TE,420,[10,30],[60,170],0.1);
for(let i=0;i<40;i++){const x=rr(20,1060),y=rr(60,1880);if(x>110&&x<970&&y>390&&y<1460)continue;star(x,y,rr(4,11),R()<.3?C.orange:C.cream)}
paint('M120 400H960V1450H120Z',C.cream,['#E7D8BD','#F7EEDD'],60,[8,20],[60,160],0);
paint('M140 420H940V1430H140Z','#24534B',TE,0);
el('path',{d:'M90 1480C150 1420 100 1360 130 1300M960 380C1000 340 1040 360 1020 300',stroke:C.red,'stroke-width':6,fill:'none','stroke-linecap':'round'});
el('path',{d:'M110 380C200 360 180 440 120 470',stroke:C.red,'stroke-width':6,fill:'none','stroke-linecap':'round'});
''')
# 2 Polling (style 1)
T['02-polling']=dict(BG='#E8743B',HTML='''
<div class="a in" style="left:0;right:0;top:260px;text-align:center;font-weight:700;font-size:22px;letter-spacing:4px;color:#152A3A">#UNTAIANPIKIRAN</div>
<div class="a gh" style="left:80px;right:80px;top:320px;text-align:center;font-size:100px;line-height:1.05;color:#152A3A">kamu tim<br>yang <span style="color:#F1E6D2">mana?</span></div>'''+HANDLE%'#F1E6D2',JS='''
setupS('rough');seed=8;
paint('M-30 -30H1110V1300H-30Z',C.orange,OR,360,[10,30],[60,170],0.05);
paint('M540 1180a110 110 0 1 0 .1 0Z',C.yellow,['#F3B84A','#FAD77E'],60,[5,12],[15,45]);
for(let i=0;i<16;i++)star(rr(60,1020),rr(560,1150),rr(4,9),C.cream);
paint('M-30 1380C200 1260 420 1240 560 1270S880 1380 1110 1340V1950H-30Z',C.dgreen,GR,300,[5,15],[30,100],-.1);
paint('M-30 1560C300 1500 700 1550 1110 1510V1950H-30Z',C.teal,TE,240,[6,16],[30,100],0);
for(let i=0;i<90;i++){const x=rr(0,1080),y=rr(1320,1880);el('path',{d:`M${x} ${y}q${rr(-6,6)} ${-rr(10,22)} ${rr(-10,10)} ${-rr(20,40)}`,stroke:R()<.5?'#3E7C5A':'#2F6B4F','stroke-width':rr(2,4),fill:'none'});if(R()<.25)el('circle',{cx:x,cy:y-rr(28,40),r:rr(3,6),fill:R()<.5?C.cream:C.orange})}
// two figures on hill joined by thread
for(const [x,c] of [[400,'#1C1A1A'],[680,C.orange]]){paint(`M${x-22} 1282C${x-28} 1240 ${x-10} 1222 ${x} 1222C${x+12} 1222 ${x+28} 1240 ${x+22} 1282Z`,C.navy,['#1D3A4F'],10,[3,6],[10,30],1.4);
 paint(`M${x-18} 1200a18 20 0 1 0 36 0a18 20 0 1 0 -36 0Z`,c,[],0)}
el('path',{d:'M420 1250C480 1200 600 1300 660 1250',stroke:C.red,'stroke-width':5,fill:'none','stroke-linecap':'round'});
''')
# 3 Tanya Utas (style 2)
T['03-tanya-utas']=dict(BG='#EFE8DC',HTML='''
<div class="a in" style="left:0;right:0;top:260px;text-align:center;font-weight:700;font-size:22px;letter-spacing:4px;color:#3B1F14">RUANG NASKAH <span style="color:#B5462A">✶</span> SESI TANYA</div>
<div class="a is" style="left:0;right:0;top:310px;text-align:center;font-size:150px;letter-spacing:-5px;line-height:1;color:#3B1F14">Tanya <i style="color:#B5462A">Utas.</i></div>
<div class="a gh" style="left:0;right:0;top:480px;text-align:center;font-size:44px;color:#5A3A2C">apa pun soal menulis & menerbitkan</div>
<div class="a in" style="left:0;right:0;top:550px;text-align:center;font-weight:600;font-size:22px;color:#3B1F14;opacity:.75">@penerbitbenangmerah</div>''',JS='''
setupS(null,.3,0);seed=4;
el('path',{d:'M180 1960V1240a360 360 0 0 1 720 0V1960Z',fill:'#B5462A'});
el('circle',{cx:880,cy:1030,r:60,fill:C.sage});
const g=el('g',{transform:'translate(285 1190) scale(1.5)',filter:'url(#wob)'});utas2(g,'bingung');
''')
# 4 Jawaban Sulam (style 3)
T['04-jawaban-sulam']=dict(BG='#F6F1E7',HTML='''
<div class="a is" style="left:90px;top:260px;font-size:34px;line-height:1.05;color:#555">Jawaban<br>Sulam</div>
<div class="a jo" style="right:70px;top:260px;writing-mode:vertical-rl;font-weight:600;font-size:28px;letter-spacing:7px;color:#1E1E1E">TANYA REDAKSI</div>
<div class="a jo" style="left:90px;top:420px;font-weight:600;font-size:18px;letter-spacing:4px;color:#C8321E">PERTANYAAN</div>
<div class="a jo" style="left:90px;top:960px;font-weight:600;font-size:18px;letter-spacing:4px;color:#C8321E">JAWABAN</div>
<div class="a jo" style="left:90px;bottom:300px;font-weight:600;font-size:18px;line-height:1.5;letter-spacing:2px;color:#1E1E1E">REDAKSI<br>BENANG MERAH</div>''',JS='''
setupS(null,.22,0);seed=6;
el('rect',{x:90,y:460,width:830,height:420,fill:'#EDE6D8',rx:6});
el('path',{d:'M90 1000H920',stroke:'#D8CFC0','stroke-width':2});
el('rect',{x:910,y:1320,width:40,height:40,fill:C.red});
el('clipPath',{id:'cut'});el('rect',{x:0,y:0,width:1080,height:1680},P.lastChild);
const w=el('g',{'clip-path':'url(#cut)'});const g=el('g',{transform:'translate(560 1240) scale(1.1)',filter:'url(#wob)'},w);sulam(g,'tenang');
''')
# 5 Pengumuman + hitung mundur (style 3)
T['05-pengumuman-countdown']=dict(BG='#F6F1E7',HTML='''
<div class="a is" style="left:90px;top:260px;font-size:34px;line-height:1.05;color:#555">Kabar<br>Benang Merah</div>
<div class="a jo" style="right:70px;top:260px;writing-mode:vertical-rl;font-weight:600;font-size:28px;letter-spacing:7px;color:#1E1E1E">SEGERA DITUTUP</div>
<div class="a jo" style="left:0;right:0;top:1060px;text-align:center;font-weight:600;font-size:56px;letter-spacing:6px;color:#1E1E1E">PEMBUKAAN NASKAH</div>
<div class="a jo" style="left:0;right:0;top:1140px;text-align:center;font-weight:300;font-size:30px;color:#333">Gelombang 01 · ditutup dalam</div>
<div class="a gh" style="left:0;right:0;top:1520px;text-align:center;font-size:46px;color:#1E1E1E">daftar lewat tautan di bawah ↓</div>''',JS='''
setupS(null,.22,0);seed=17;
el('clipPath',{id:'cut'});el('rect',{x:0,y:0,width:1080,height:1020},P.lastChild);
const w=el('g',{'clip-path':'url(#cut)'});const g=el('g',{transform:'translate(268 380) scale(1.6)',filter:'url(#wob)'},w);sulam(g,'mengedip');
el('rect',{x:930,y:960,width:44,height:44,fill:C.red});
el('rect',{x:930,y:1660,width:26,height:26,fill:C.sage});
''')
for k,v in T.items():
    open(k+'.html','w').write(HEAD.replace('%BG%',v['BG']).replace('%HTML%',v['HTML']).replace('%JS%',v['JS']))
# 6 Highlight covers
ICONS={
'Kenalan':"const g=el('g',{transform:'translate(150 160) scale(.55) translate(-170 -210)',filter:'url(#wob)'});utas2(g,'senang');",
'Naskah':"paint('M105 80H195V220H105Z',C.cream,['#E7D8BD'],10,[3,6],[10,30]);for(let i=0;i<6;i++)el('path',{d:`M120 ${108+i*18}h${i==5?36:60}`,stroke:'#9A8A72','stroke-width':5,'stroke-linecap':'round'});el('path',{d:'M195 200C230 230 200 260 236 270',stroke:C.red,'stroke-width':6,fill:'none','stroke-linecap':'round'});",
'Program':"paint('M85 95H215V215H85Z',C.cream,['#E7D8BD'],10,[3,6],[10,30]);paint('M85 95H215V130H85Z',C.red,['#A82818'],10,[3,6],[10,30]);for(let r=0;r<3;r++)for(let c=0;c<4;c++)el('rect',{x:100+c*28,y:145+r*22,width:14,height:12,fill:r==1&&c==2?C.red:'#9A8A72'});el('path',{d:'M115 80v28M185 80v28',stroke:C.ink,'stroke-width':7,'stroke-linecap':'round'});",
'Buku':"paint('M90 90L150 104V224L90 210Z',C.red,['#A82818','#D84530'],15,[3,6],[10,30]);paint('M150 104L210 90V210L150 224Z','#B5462A',['#A82818'],15,[3,6],[10,30]);el('path',{d:'M150 104V224',stroke:C.cream,'stroke-width':4});el('path',{d:'M150 224C160 250 140 262 160 276',stroke:C.red,'stroke-width':5,fill:'none'});",
'Tanya':"el('text',{x:150,y:205,'text-anchor':'middle','font-family':'Gochi Hand','font-size':170,fill:C.red}).textContent='?';",
'Kata Mereka':"el('text',{x:150,y:250,'text-anchor':'middle','font-family':'Instrument Serif','font-size':260,fill:C.red}).textContent='“';",
'Untaian':"paint('M100 90H200V108H100Z','#B87A45',[],0);paint('M100 192H200V210H100Z','#B87A45',[],0);paint('M115 108H185V192H115Z',C.red,['#A82818','#D84530','#E2614A'],40,[2,5],[40,80],0);el('path',{d:'M185 160C230 170 220 220 250 230',stroke:C.red,'stroke-width':5,fill:'none','stroke-linecap':'round'});",
}
covers=''
js="setupS(null,.25,0);P=document.getElementById('art');seed=2;\n"
for i,(name,code) in enumerate(ICONS.items()):
    x=60+(i%4)*250; y=380+(i//4)*420
    covers+=f'<div class="a gh" style="left:{x}px;top:{y+250}px;width:220px;text-align:center;font-size:40px;color:#3B1F14">{name}</div>'
    js+=f"P=el('g',{{transform:'translate({x} {y}) scale(.7333)',id:'hc{i}'}},document.getElementById('art'));paint('M150 10a140 140 0 1 0 .1 0Z','#EFE8DC',['#E7D8BD','#F7EEDD'],60,[6,14],[30,80],0);{code}\n"
html='''<div class="a is" style="left:0;right:0;top:200px;text-align:center;font-size:110px;letter-spacing:-3px;color:#3B1F14">Sampul <i style="color:#C8321E">Highlight</i></div>'''+covers
open('06-highlight-covers.html','w').write(HEAD.replace('%BG%','#C8321E').replace('%HTML%',html.replace('#3B1F14','#F1E6D2').replace('color:#C8321E','color:#F7C65A')).replace('%JS%',js))
print('ok')

for i,(name,code) in enumerate(ICONS.items()):
    js1="setupS(null,.25,0);P=document.getElementById('art');seed=2;P=el('g',{transform:'scale(3.6)'});paint('M150 0a150 150 0 1 0 .1 0Z','#EFE8DC',['#E7D8BD','#F7EEDD'],60,[6,14],[30,80],0);"+code
    h=HEAD.replace('%BG%','#EFE8DC').replace('%HTML%','').replace('%JS%',js1).replace('height:1920px','height:1080px').replace('viewBox="0 0 1080 1920" width="1080" height="1920"','viewBox="0 0 1080 1080" width="1080" height="1080"')
    open(f'hl-{i+1}-'+name.lower().replace(' ','-')+'.html','w').write(h)
