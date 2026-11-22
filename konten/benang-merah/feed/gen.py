HEAD='''<!DOCTYPE html><html lang="id"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Gochi+Hand&family=Instrument+Serif:ital@0;1&family=Jost:wght@300;400;600;700&family=Inter:wght@600;700;800&display=block" rel="stylesheet">
<style>html,body{margin:0}#post{width:1080px;height:1350px;position:relative;overflow:hidden}svg#s{position:absolute;inset:0}
.a{position:absolute}.gh{font-family:'Gochi Hand'}.is{font-family:'Instrument Serif'}.jo{font-family:Jost}.in{font-family:Inter}
.caps{left:72px;right:72px;bottom:46px;display:flex;justify-content:space-between;font:700 15px Inter;letter-spacing:3px}
%CSS%</style><script src="lib.js"></script></head><body><div id="post" style="background:%BG%">
<svg id="s" viewBox="0 0 1080 1350" width="1080" height="1350"></svg>%HTML%</div><script>%JS%</script></body></html>'''
D={}
# 1 — Style 1: paper kite at dusk
D['01-untaian-kutipan']=dict(BG='#E8743B',CSS='',HTML='''
<div class="a gh" style="left:70px;top:80px;font-size:88px;line-height:1.02;color:#152A3A;transform:rotate(-2deg)">Menulis adalah<br>cara paling pelan<br>untuk <span style="color:#F1E6D2">berteriak.</span></div>
<div class="a in" style="left:72px;bottom:50px;font-weight:600;font-size:22px;color:#F1E6D2;opacity:.9">@penerbitbenangmerah · #UntaianPikiran</div>
<div class="a in" style="right:70px;bottom:40px;width:58px;height:66px;border:3px solid #F1E6D2;color:#F1E6D2;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:26px">BM</div>''',JS='''
setup('rough');seed=31;
paint('M-30 -30H1110V1000H-30Z',C.orange,['#F08A4B','#D9622E','#F3A066','#EC8048'],320,[10,30],[60,170],0.05);
paint('M210 880a120 120 0 1 0 .1 0Z',C.yellow,['#F3B84A','#FAD77E'],60,[5,12],[15,45]);
for(let i=0;i<14;i++)star(rr(620,1040),rr(420,760),rr(4,9),C.cream);
paint('M-30 1010C160 900 300 860 420 870S700 960 1110 930V1390H-30Z',C.dgreen,GR,260,[5,15],[30,100],-.1);
paint('M-30 1130C260 1080 600 1120 1110 1090V1390H-30Z',C.teal,TE,200,[6,16],[30,100],0);
for(let i=0;i<80;i++){const x=rr(0,1080),y=rr(960,1300);el('path',{d:`M${x} ${y}q${rr(-6,6)} ${-rr(10,22)} ${rr(-10,10)} ${-rr(20,40)}`,stroke:R()<.5?'#3E7C5A':'#2F6B4F','stroke-width':rr(2,4),fill:'none'});if(R()<.25)el('circle',{cx:x,cy:y-rr(28,40),r:rr(3,6),fill:R()<.5?C.cream:C.orange})}
// figure sitting on hill
paint('M398 852C392 812 410 790 432 790C456 790 470 812 466 852Z',C.navy,['#1D3A4F'],20,[3,8],[10,30],1.4);
paint('M404 850C430 870 470 868 520 872L522 892C470 892 420 890 400 878Z',C.navy,['#1D3A4F'],10,[3,6],[10,30],0);
paint('M410 766a24 26 0 1 0 48 0a24 26 0 1 0 -48 0Z','#1C1A1A',['#2E2A28'],15,[3,6],[10,25],1.4);
paint('M436 770a14 16 0 1 0 22 0Z',C.skin,[],0);
el('path',{d:'M460 810L500 760',stroke:C.navy,'stroke-width':16,'stroke-linecap':'round'});el('circle',{cx:502,cy:756,r:8,fill:C.skin});
// thread + paper kite
el('path',{d:'M504 752C560 640 520 560 620 500S700 360 760 330',stroke:C.red,'stroke-width':5,fill:'none','stroke-linecap':'round'});
const k=el('g',{transform:'translate(800 300) rotate(-18)'});
el('path',{d:'M-60 -80H60V80H-60Z',fill:C.cream},k);for(let i=0;i<6;i++)el('path',{d:`M-44 ${-58+i*22}h${i==5?50:88}`,stroke:'#9A8A72','stroke-width':4},k);
el('path',{d:'M0 80C10 120 -20 140 0 180',stroke:C.cream,'stroke-width':3,fill:'none'},k);
for(const y of [110,140,170])el('path',{d:`M-8 ${y}l16 -6`,stroke:C.red,'stroke-width':5},k);
''')
# 2 — Style 1: night vs morning
D['02-untaian-tim-mana']=dict(BG='#F1E6D2',CSS='',HTML='''
<div class="a gh" style="left:0;right:0;top:60px;text-align:center;font-size:92px;color:#152A3A">Kamu tim yang mana?</div>
<div class="a gh" style="left:60px;width:460px;top:1028px;text-align:center;font-size:48px;color:#F1E6D2">nulis tengah malam</div>
<div class="a gh" style="left:560px;width:460px;top:1028px;text-align:center;font-size:48px;color:#152A3A">nulis pagi buta</div>
<div class="a gh" style="left:0;right:0;bottom:80px;text-align:center;font-size:52px;color:#152A3A">jawab 🌙 atau ☀️ di komentar</div>
<div class="a in" style="left:0;right:0;bottom:36px;text-align:center;font-weight:600;font-size:20px;color:#152A3A;opacity:.7">@penerbitbenangmerah · #UntaianPikiran</div>''',JS='''
setup('rough');seed=12;
paint('M-30 -30H1110V1390H-30Z',C.cream,['#E7D8BD','#F7EEDD'],200,[8,22],[60,160],0);
paint('M60 200H520V1130H60Z',C.teal,TE,220,[8,22],[50,140],0.1);
paint('M560 200H1020V1130H560Z',C.orange,OR,220,[8,22],[50,140],0.1);
for(let i=0;i<22;i++)star(rr(90,490),rr(230,600),rr(4,10),R()<.3?C.orange:C.cream);
paint('M330 300a70 70 0 1 0 .1 0Z',C.yellow,['#F3B84A','#FAD77E'],40,[4,9],[12,35]);paint('M355 310a58 58 0 1 0 .1 0Z',C.teal,TE,20,[5,10],[15,40]);
paint('M790 330a90 90 0 1 0 .1 0Z',C.yellow,['#F3B84A','#FAD77E'],60,[4,9],[12,35]);
for(let i=0;i<10;i++){const a=i/10*Math.PI*2;el('path',{d:`M${790+Math.cos(a)*120} ${420+Math.sin(a)*120}l${Math.cos(a)*36} ${Math.sin(a)*36}`,stroke:C.yellow,'stroke-width':8,'stroke-linecap':'round'})}
// desk lamp + paper (night)
paint('M110 860H470V884H110Z','#B87A45',['#C98A52','#9C6435'],20,[3,7],[30,90],0);
el('circle',{cx:200,cy:740,r:90,fill:C.yellow,opacity:.18,filter:'url(#blur)'});
paint('M180 760H220V860H180Z',C.cream,['#E7D8BD'],10,[3,6],[10,30],1.57);
paint('M200 700C214 722 214 742 200 750C186 742 186 722 200 700Z',C.yellow,['#F3B84A'],6,[2,4],[6,14]);
el('path',{d:'M200 750V760',stroke:C.ink,'stroke-width':3});
el('g',{transform:'translate(330 832) rotate(-6)'});const pg=P.lastChild;el('rect',{x:-60,y:-30,width:120,height:52,fill:C.cream},pg);for(let i=0;i<3;i++)el('path',{d:`M-48 ${-18+i*14}h${90-i*20}`,stroke:'#9A8A72','stroke-width':3},pg);
// coffee mug (morning)
paint('M700 760H860V900C860 930 840 944 780 944S700 930 700 900Z',C.cream,['#E7D8BD'],20,[4,8],[20,60],1.57);
el('path',{d:'M860 790c50 0 50 70 0 70',stroke:C.cream,'stroke-width':16,fill:'none'});
el('path',{d:'M740 730c-20 -30 20 -50 0 -80M790 730c-20 -30 20 -50 0 -80',stroke:C.cream,'stroke-width':6,fill:'none','stroke-linecap':'round'});
el('path',{d:'M712 830H848',stroke:C.red,'stroke-width':8});
// red thread across both
el('path',{d:'M90 980C250 940 380 1010 540 960S820 930 990 980',stroke:C.red,'stroke-width':6,fill:'none','stroke-linecap':'round'});
''')
# 3 — Style 2: Utas cover
D['03-utas-writers-block']=dict(BG='#EFE8DC',CSS='',HTML='''
<div class="a in" style="left:72px;top:72px;font-weight:700;font-size:20px;letter-spacing:3px;color:#3B1F14">RUANG NASKAH <span style="color:#B5462A">✶</span> NO. 02</div>
<div class="a is" style="left:66px;top:130px;font-size:170px;line-height:.86;letter-spacing:-6px;color:#3B1F14">Writer's<br>block?<br><i style="color:#B5462A">Tenang.</i></div>
<div class="a gh" style="left:76px;top:690px;width:400px;font-size:46px;line-height:1.1;color:#3B1F14;transform:rotate(-3deg)">3 cara kecil untuk mulai menulis lagi.</div>
<div class="a is" style="left:72px;bottom:100px;font-style:italic;font-size:40px;color:#3B1F14">geser →</div>
<div class="a caps" style="color:#3B1F14;bottom:40px"><span>MENULIS</span><span>MENYUNTING</span><span>@PENERBITBENANGMERAH</span></div>''',JS='''
setup(null,.35,0);P=document.getElementById('art');
el('path',{d:'M560 1250V760a230 230 0 0 1 460 0V1250Z',fill:'#B5462A'});
el('circle',{cx:960,cy:520,r:58,fill:C.sage});
const g=el('g',{transform:'translate(568 692) scale(1.3)',filter:'url(#wob)'});utas2(g,'lelah');
el('text',{x:900,y:700,'font-family':'Instrument Serif','font-style':'italic','font-size':72,fill:'#3B1F14'}).textContent='zzz';
el('path',{d:'M560 1150C460 1160 430 1080 360 1110S300 1230 200 1210',stroke:C.red,'stroke-width':4,fill:'none','stroke-linecap':'round'});
''')
# 4 — Style 2: Utas comic
D['04-utas-siklus-revisi']=dict(BG='#EFE8DC',CSS='.cap{position:absolute;width:480px;text-align:center;font:400 40px "Gochi Hand";color:#3B1F14}.n{position:absolute;font:700 18px Inter;letter-spacing:3px;color:#B5462A}',HTML='''
<div class="a is" style="left:0;right:0;top:56px;text-align:center;font-size:96px;letter-spacing:-3px;color:#3B1F14">Siklus hidup <i style="color:#B5462A">sebuah naskah</i></div>
<div class="n" style="left:80px;top:205px">01</div><div class="n" style="left:570px;top:205px">02</div><div class="n" style="left:80px;top:745px">03</div><div class="n" style="left:570px;top:745px">04</div>
<div class="cap" style="left:60px;top:650px">"selesai! ini mahakarya."</div>
<div class="cap" style="left:550px;top:650px">baca ulang besoknya...</div>
<div class="cap" style="left:60px;top:1190px">revisi. revisi. revisi.</div>
<div class="cap" style="left:550px;top:1190px">"oke... ini baru jadi."</div>
<div class="a caps" style="color:#3B1F14"><span>RUANG NASKAH</span><span>KAMU DI FASE BERAPA?</span><span>@PENERBITBENANGMERAH</span></div>''',JS='''
setup(null,.35,0);P=document.getElementById('art');
const cells=[[60,190,'senang','#F6D9B8'],[550,190,'kaget','#D9E3DC'],[60,730,'fokus','#D9E3DC'],[550,730,'ide','#F6D9B8']];
for(const [x,y,e,bg] of cells){el('rect',{x,y,width:470,height:520,fill:bg,stroke:C.ink,'stroke-width':4,filter:'url(#wob)'});
  const g=el('g',{transform:`translate(${x+78} ${y+40}) scale(.95)`,filter:'url(#wob)'});utas2(g,e);
  el('rect',{x,y:y+440,width:470,height:80,fill:'#EFE8DC',opacity:0})}
el('path',{d:'M530 450H550M530 990H550M295 710V730M785 710V730',stroke:C.red,'stroke-width':5,'stroke-linecap':'round'});
''')
# 5 — Style 3: cover reveal
D['05-kabar-cover-reveal']=dict(BG='#F6F1E7',CSS='',HTML='''
<div class="a is" style="left:76px;top:80px;font-size:30px;line-height:1.05;color:#555">Kabar<br>Benang Merah</div>
<div class="a jo" style="right:58px;top:90px;writing-mode:vertical-rl;font-weight:600;font-size:30px;line-height:1.5;letter-spacing:7px;color:#1E1E1E">COVER REVEAL<span style="display:block;font-weight:400;color:#555">SEGERA TERBIT</span></div>
<div class="a" style="right:76px;top:700px;width:44px;height:44px;background:#C8321E"></div>
<div class="a jo" style="left:76px;top:880px;display:flex;align-items:baseline;gap:8px;color:#1E1E1E"><small style="font-weight:600;font-size:30px">Buku.</small><b style="font-weight:700;font-size:140px;line-height:1;letter-spacing:-4px">01</b></div>
<div class="a jo" style="left:80px;top:1050px;width:430px;font-weight:300;font-size:21px;line-height:1.5;color:#333">Kumpulan esai tentang rumah, kepergian, dan kalimat-kalimat yang menunggu kita kembali.</div>
<div class="a jo" style="left:600px;top:900px;width:400px;font-weight:300;font-size:21px;line-height:1.5;color:#333">
<p style="margin:0 0 14px"><b style="display:block;font-weight:600;font-size:15px;letter-spacing:3px;color:#1E1E1E">JUDUL</b>Pulang ke Kalimat</p>
<p style="margin:0 0 14px"><b style="display:block;font-weight:600;font-size:15px;letter-spacing:3px;color:#1E1E1E">PENULIS</b>Nama Penulis</p>
<p style="margin:0"><b style="display:block;font-weight:600;font-size:15px;letter-spacing:3px;color:#1E1E1E">PRE-ORDER</b>Segera · pantau terus</p></div>
<div class="a jo" style="left:80px;bottom:60px;font-weight:600;font-size:18px;line-height:1.5;letter-spacing:2px;color:#1E1E1E">REDAKSI<br>BENANG MERAH</div>
<div class="a jo" style="right:120px;bottom:64px;font-size:18px;letter-spacing:2px;color:#555">@PENERBITBENANGMERAH</div>
<div class="a" style="right:76px;bottom:66px;width:26px;height:26px;background:#8A9A7E"></div>''',JS='''
setup(null,.22,0);P=document.getElementById('art');seed=44;
const b=el('g',{transform:'translate(540 470) rotate(-4)',filter:'url(#shadow)'});P=b;
el('rect',{x:-215,y:-300,width:430,height:600,fill:'#1E4640'});
P=el('g',{filter:'url(#rough)'},b);
paint('M-215 -300H215V300H-215Z',C.teal,TE,140,[6,16],[40,120],0.1);
paint('M-215 120C-80 60 60 110 215 70V300H-215Z',C.dgreen,GR,80,[5,12],[30,90],-.1);
paint('M-60 -150a50 50 0 1 0 .1 0Z',C.yellow,['#F3B84A'],20,[4,8],[10,30]);
for(let i=0;i<12;i++)star(rr(-190,190),rr(-270,0),rr(3,7),C.cream);
el('path',{d:'M-215 160C-100 120 -20 200 60 150S160 120 215 140',stroke:C.red,'stroke-width':5,fill:'none'});
paint('M70 120h40v34h-40Z',C.cream,[],0);paint('M64 122l26-22 26 22Z',C.red,[],0);
P=b;
const t1=el('text',{x:0,y:-200,'text-anchor':'middle','font-family':'Instrument Serif','font-size':64,fill:C.cream});t1.textContent='Pulang ke';
const t2=el('text',{x:0,y:-130,'text-anchor':'middle','font-family':'Instrument Serif','font-style':'italic','font-size':78,fill:C.orange});t2.textContent='Kalimat';
const t3=el('text',{x:0,y:270,'text-anchor':'middle','font-family':'Jost','font-weight':600,'font-size':16,'letter-spacing':4,fill:C.cream});t3.textContent='NAMA PENULIS';
el('rect',{x:-215,y:-300,width:14,height:600,fill:'#000',opacity:.18});
''')
# 6 — Style 3: program info
D['06-kabar-kelas-esai']=dict(BG='#F6F1E7',CSS='',HTML='''
<div class="a is" style="left:76px;top:80px;font-size:30px;line-height:1.05;color:#555">Kabar<br>Benang Merah</div>
<div class="a jo" style="left:770px;top:150px;font-size:30px;color:#9A958C">BM</div>
<div class="a jo" style="right:58px;top:90px;writing-mode:vertical-rl;font-weight:600;font-size:30px;line-height:1.5;letter-spacing:7px;color:#1E1E1E">PROGRAM<span style="display:block;font-weight:400;color:#555">KELAS MENULIS</span></div>
<div class="a" style="right:76px;top:760px;width:44px;height:44px;background:#C8321E"></div>
<div class="a jo" style="left:0;right:0;top:830px;text-align:center;font-weight:600;font-size:50px;letter-spacing:6px;color:#1E1E1E">KELAS MENULIS ESAI</div>
<div class="a jo" style="left:76px;top:920px;display:flex;align-items:baseline;gap:8px;color:#1E1E1E"><small style="font-weight:600;font-size:30px">Sesi.</small><b style="font-weight:700;font-size:140px;line-height:1;letter-spacing:-4px">04</b></div>
<div class="a jo" style="left:80px;top:1090px;width:420px;font-weight:300;font-size:21px;line-height:1.5;color:#333">Empat pertemuan untuk mengubah kegelisahan menjadi esai yang utuh, dibimbing langsung oleh editor.</div>
<div class="a jo" style="left:600px;top:940px;width:400px;font-weight:300;font-size:21px;line-height:1.5;color:#333">
<p style="margin:0 0 14px"><b style="display:block;font-weight:600;font-size:15px;letter-spacing:3px;color:#1E1E1E">FORMAT</b>Daring · 4× pertemuan</p>
<p style="margin:0 0 14px"><b style="display:block;font-weight:600;font-size:15px;letter-spacing:3px;color:#1E1E1E">KUOTA</b>Terbatas</p>
<p style="margin:0"><b style="display:block;font-weight:600;font-size:15px;letter-spacing:3px;color:#1E1E1E">DAFTAR</b>Link di bio</p></div>
<div class="a jo" style="left:80px;bottom:60px;font-weight:600;font-size:18px;line-height:1.5;letter-spacing:2px;color:#1E1E1E">REDAKSI<br>BENANG MERAH</div>
<div class="a jo" style="right:120px;bottom:64px;font-size:18px;letter-spacing:2px;color:#555">@PENERBITBENANGMERAH</div>
<div class="a" style="right:76px;bottom:66px;width:26px;height:26px;background:#8A9A7E"></div>''',JS='''
setup('rough',.25,0);seed=21;portrait({scarf:true,beret:false});
el('path',{d:'M690 760C760 790 800 740 790 690S740 640 760 600',stroke:C.red,'stroke-width':4,fill:'none','stroke-linecap':'round'});
el('line',{x1:760,y1:240,x2:820,y2:190,stroke:'#9A958C','stroke-width':2},document.getElementById('s'));
''')
for k,v in D.items():
    h=HEAD
    for kk in ('CSS','BG','HTML','JS'):h=h.replace('%'+kk+'%',v[kk])
    open(k+'.html','w').write(h)
print('\n'.join(D))
