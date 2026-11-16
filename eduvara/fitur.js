/* Eduvara — fitur tambahan ala bimbel online:
   Mega Tryout serentak, Belajar per bab (rangkuman + latihan bertingkat), Liga XP & lencana,
   pantauan orang tua, Tanya Soal (AI + verifikasi guru), dan Paket Premium.
   Dimuat SEBELUM skrip utama; semua akses ke fungsi/variabel utama (S, render, esc, …) terjadi saat dipanggil. */
"use strict";
const FX = (() => {
  const sb = () => window.SiapAuth && window.SiapAuth.client;
  const st = { events:[], evRes:{}, evAll:{}, rangkuman:{}, paket:[], sub:null, links:[], kidDocs:{}, tanya:[], tanyaCari:null,
               adminTanya:[], code:null, loaded:false, busy:false, lastAnswer:null };
  const now = () => Date.now();
  const T = s => new Date(s).getTime();
  const fmtDT = s => { try{ return new Date(s).toLocaleString("id-ID",{weekday:"short",day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}); }catch(e){ return s; } };
  const rupiah = n => "Rp" + Number(n||0).toLocaleString("id-ID");
  const dur = ms => { ms=Math.max(0,ms); const d=Math.floor(ms/864e5), h=Math.floor(ms%864e5/36e5), m=Math.floor(ms%36e5/6e4); return d?`${d} hari ${h} jam`:h?`${h} jam ${m} menit`:`${m} menit`; };
  const weekKey = (d=new Date()) => { const x=new Date(d); const day=(x.getDay()+6)%7; x.setHours(0,0,0,0); x.setDate(x.getDate()-day); const o=x.getTimezoneOffset(); return new Date(x.getTime()-o*6e4).toISOString().slice(0,10); };
  const inWeek = iso => { if(!iso) return false; return weekKey(new Date(iso))===weekKey(); };

  /* ====================== BAB & RANGKUMAN ====================== */
  const BAB = {
    mat: [
      ["ruang","Bangun Ruang & Volume",/volume|kubus|balok|bangun ruang|jaring|prisma|limas|tabung|kerucut/i],
      ["data","Pengolahan Data & Peluang",/data|rata|median|modus|peluang|statistik|jangkauan|diagram/i],
      ["perbandingan","Perbandingan, Skala, Kecepatan & Debit",/perbandingan|skala|kecepatan|debit|jarak/i],
      ["kpk","KPK, FPB, Faktor & Kelipatan",/kpk|fpb|faktor|kelipatan|prima/i],
      ["pecahan","Pecahan, Desimal & Persen",/pecahan|desimal|persen|diskon|untung|rugi|bunga/i],
      ["ukur","Pengukuran (Waktu, Berat, Panjang)",/waktu|berat|panjang|satuan|pengukuran|volume cair|liter/i],
      ["geometri","Bangun Datar & Koordinat",/luas|keliling|bangun datar|lingkaran|trapesium|segitiga|persegi|koordinat|sudut|simetri/i],
      ["bilangan","Bilangan & Operasi Hitung",/.*/]
    ],
    bind: [
      ["fungsional","Teks Pengumuman, Surat & Jadwal",/pengumuman|undangan|surat|jadwal|tabel|iklan|brosur/i],
      ["sastra","Cerita, Puisi & Unsur Intrinsik",/cerita|watak|amanat|puisi|tokoh|ringkasan|larik|latar|alur|dongeng|fabel/i],
      ["kebahasaan","Ejaan, Tanda Baca & Kalimat",/ejaan|kapital|tanda baca|koma|kata baku|imbuhan|konjungsi|kalimat efektif|kata penghubung|sinonim|antonim/i],
      ["informasi","Memahami Isi Bacaan",/.*/]
    ]
  };
  const babOf = q => { const list=BAB[q.mapel]||[]; const t=(q.topik||"")+" "; const hit=list.find(b=>b[2].test(t)); return hit?hit[0]:"lain"; };
  const babNama = (m,k) => ((BAB[m]||[]).find(b=>b[0]===k)||[k,"Lainnya"])[1];
  const RANGKUMAN = {
    "mat-bilangan":`<p><b>Urutan operasi hitung campuran</b></p><ol><li>Kerjakan yang di dalam kurung lebih dulu.</li><li>Perkalian dan pembagian (dari kiri ke kanan).</li><li>Penjumlahan dan pengurangan (dari kiri ke kanan).</li></ol><p>Contoh: 125 + 75 × 4 − 250 : 5 = 125 + 300 − 50 = <b>375</b>.</p><p><b>Bilangan bulat</b>: bilangan negatif ada di kiri nol. Naik berarti ditambah, turun berarti dikurangi. −3 + 11 = 8; 8 − 5 = 3.</p><p><b>Pola bilangan</b>: cari selisih tetap. Suku ke-n = suku pertama + (n − 1) × selisih. Contoh 8, 11, 14, … suku ke-12 = 8 + 11 × 3 = <b>41</b>.</p>`,
    "mat-pecahan":`<p><b>Pecahan</b>: samakan penyebut sebelum menjumlah/mengurang. Pecahan campuran boleh dihitung bagian bulat dan pecahannya terpisah.</p><p><b>Mengubah bentuk</b>: <sup>3</sup>/<sub>5</sub> = <sup>6</sup>/<sub>10</sub> = 0,6 = 60%. Persen artinya per seratus.</p><p><b>Diskon</b>: potongan = persen diskon × harga awal; harga bayar = harga awal − potongan.</p><p><b>Untung/rugi</b>: untung = harga jual − harga beli. Persentase untung = untung : harga beli × 100%.</p>`,
    "mat-kpk":`<p><b>Faktor</b> = bilangan yang membagi habis. <b>Kelipatan</b> = hasil kali bilangan dengan 1, 2, 3, ….</p><p>Gunakan <b>faktorisasi prima</b> (pohon faktor):</p><ul><li><b>KPK</b>: ambil semua faktor prima, pilih pangkat <b>terbesar</b>. Dipakai untuk soal “bersamaan lagi”, “setiap … hari/detik”.</li><li><b>FPB</b>: ambil faktor prima yang <b>sama</b>, pilih pangkat <b>terkecil</b>. Dipakai untuk soal “dibagi sama banyak”, “paket/kantong paling banyak”.</li></ul><p>Contoh: 48 = 2<sup>4</sup> × 3, 72 = 2<sup>3</sup> × 3<sup>2</sup> → FPB = 2<sup>3</sup> × 3 = 24, KPK = 2<sup>4</sup> × 3<sup>2</sup> = 144.</p>`,
    "mat-perbandingan":`<p><b>Perbandingan a : b</b> dengan jumlah J: bagian A = a/(a+b) × J. Jika yang diketahui selisih S: bagian A = a/(a−b) × S.</p><p><b>Skala</b> 1 : n artinya 1 cm di peta = n cm sebenarnya. Jarak sebenarnya = jarak peta × n. Ingat 1 km = 100.000 cm.</p><p><b>Kecepatan</b> = jarak : waktu. Jarak = kecepatan × waktu. ¼ jam = 15 menit.</p><p><b>Debit</b> = volume : waktu. 1 liter = 1 dm<sup>3</sup> = 1.000 cm<sup>3</sup>.</p>`,
    "mat-ukur":`<p><b>Waktu</b>: 1 jam = 60 menit, 1 menit = 60 detik. Jumlahkan jam dengan jam dan menit dengan menit; jika menit ≥ 60, ubah jadi jam.</p><p><b>Berat</b>: kg – hg (ons) – dag – g, setiap turun satu tangga dikali 10. 1 kg = 10 ons = 1.000 g.</p><p><b>Panjang</b>: km – hm – dam – m – dm – cm – mm, setiap turun satu tangga dikali 10.</p><p>Tip: ubah semua ke satuan terkecil dulu, baru dijumlah.</p>`,
    "mat-geometri":`<ul><li>Persegi: L = s × s, K = 4s</li><li>Persegi panjang: L = p × l, K = 2(p + l)</li><li>Segitiga: L = ½ × a × t</li><li>Trapesium: L = ½ × (jumlah sisi sejajar) × t</li><li>Lingkaran: L = π × r × r, K = π × d (π = <sup>22</sup>/<sub>7</sub> atau 3,14)</li></ul><p><b>Luas</b> dipakai untuk menutup permukaan (rumput, keramik); <b>keliling</b> untuk tepi (pagar, pita).</p><p><b>Koordinat (x, y)</b>: x = ke kanan/kiri, y = ke atas/bawah.</p>`,
    "mat-ruang":`<ul><li>Kubus: V = s × s × s, luas permukaan = 6 × s × s, 12 rusuk, 8 titik sudut, 6 sisi.</li><li>Balok: V = p × l × t, luas permukaan = 2(pl + pt + lt).</li><li>Prisma segitiga: 9 rusuk, 6 titik sudut, 5 sisi.</li><li>Limas segiempat: 8 rusuk, 5 titik sudut, 5 sisi.</li><li>Tabung: jaring-jaring = 2 lingkaran + 1 persegi panjang.</li></ul><p>1 liter = 1.000 cm<sup>3</sup>. Air setinggi sebagian: V = p × l × tinggi air.</p>`,
    "mat-data":`<ul><li><b>Rata-rata</b> = jumlah semua data : banyak data. Dari tabel: kalikan nilai × frekuensi dulu.</li><li><b>Modus</b> = data yang paling sering muncul (bisa lebih dari satu).</li><li><b>Median</b> = nilai tengah setelah data <b>diurutkan</b>. Jika banyak data genap, rata-ratakan dua data tengah.</li><li><b>Jangkauan</b> = data terbesar − data terkecil.</li></ul><p><b>Peluang</b> = banyak kejadian yang diharapkan : banyak semua kemungkinan. Nilainya 0 (mustahil) sampai 1 (pasti).</p>`,
    "bind-informasi":`<ul><li><b>Ide pokok</b>: gagasan utama paragraf, biasanya di kalimat pertama atau terakhir; kalimat lain menjelaskannya.</li><li><b>Informasi tersurat</b>: tertulis langsung di bacaan. <b>Tersirat</b>: disimpulkan dari petunjuk.</li><li><b>Fakta</b> bisa dibuktikan; <b>opini</b> berisi pendapat (seharusnya, sebaiknya, menurut saya).</li><li><b>Simpulan</b>: merangkum isi seluruh bacaan, tidak menambah hal baru.</li><li><b>Makna kata</b>: tebak dari kalimat di sekitarnya (konteks).</li></ul>`,
    "bind-sastra":`<ul><li><b>Tokoh & watak</b>: lihat dari ucapan, tindakan, dan pikiran tokoh.</li><li><b>Amanat</b>: pesan baik yang ingin disampaikan pengarang.</li><li><b>Latar</b>: tempat, waktu, suasana. <b>Alur</b>: urutan peristiwa.</li><li><b>Puisi</b>: larik = baris, bait = kumpulan larik. Kata <i>bagai, seperti</i> menunjukkan perbandingan (majas).</li><li><b>Ringkasan</b> memuat peristiwa penting secara berurutan.</li></ul>`,
    "bind-fungsional":`<p><b>Pengumuman</b> memuat: judul, isi (apa, kapan, di mana, siapa), dan pembuat pengumuman.</p><p><b>Surat undangan</b>: tempat & tanggal surat, salam pembuka, isi (hari/tanggal, waktu, tempat, acara), salam penutup, pengirim.</p><p><b>Jadwal/tabel</b>: baca judul kolom dulu, lalu cari baris yang cocok dengan pertanyaan. Perhatikan catatan di bawah tabel.</p>`,
    "bind-kebahasaan":`<ul><li><b>Huruf kapital</b>: awal kalimat, nama orang, hari, bulan, nama bahasa (bahasa <i>Inggris</i>), nama jalan/geografi.</li><li><b>Koma</b>: di antara rincian (a, b, dan c) dan setelah anak kalimat di depan (Karena hujan, kami …).</li><li><b>Kata baku</b>: apotek, praktik, jadwal, antena, nasihat, kualitas.</li><li><b>Imbuhan me-</b> untuk kata kerja aktif (mengubah), <b>di-</b> untuk pasif (diubah) dan ditulis serangkai.</li><li><b>Kalimat efektif</b>: tidak boros kata (naik ke atas ✗, para siswa-siswa ✗).</li><li><b>Konjungsi antarkalimat</b>: akibatnya (sebab-akibat), meskipun demikian/namun (pertentangan), selain itu (tambahan).</li></ul>`
  };

  /* ====================== DATA ====================== */
  async function init(){
    const c=sb(); if(!c) return;
    const jobs=[
      c.from("events").select("*").order("mulai",{ascending:false}).limit(30).then(r=>{ if(!r.error) st.events=r.data||[]; }),
      c.from("rangkuman").select("id,html").then(r=>{ if(!r.error) (r.data||[]).forEach(x=>st.rangkuman[x.id]=x.html); }),
      c.from("paket").select("*").order("harga").then(r=>{ if(!r.error) st.paket=r.data||[]; })
    ];
    if(S.uid){
      jobs.push(c.from("event_results").select("event_id,data,total").eq("uid",S.uid).then(r=>{ if(!r.error) (r.data||[]).forEach(x=>st.evRes[x.event_id]=x); }));
      jobs.push(c.from("subscriptions").select("plan,until").eq("uid",S.uid).maybeSingle().then(r=>{ if(!r.error) st.sub=r.data; }));
      jobs.push(loadLinks());
      jobs.push(loadTanya());
    }
    await Promise.all(jobs.map(p=>Promise.resolve(p).catch(e=>console.warn(e))));
    st.loaded=true; render();
    setInterval(()=>{ if(document.visibilityState==="visible" && ["beranda","tryout","mega"].includes(S.view) && !S.exam) render(); }, 30000);
  }
  async function loadLinks(){
    const c=sb(); const r=await c.from("links").select("parent,child"); if(r.error) return;
    st.links=r.data||[]; resolveNames(st.links.flatMap(l=>[l.parent,l.child]).filter(x=>x!==S.uid));
  }
  async function loadTanya(){
    const r=await sb().from("tanya").select("id,mapel,teks,gambar,jawaban,status,koreksi,created_at").eq("uid",S.uid).order("created_at",{ascending:false}).limit(30);
    if(!r.error) st.tanya=r.data||[];
  }
  const isPremium = () => !!(st.sub && T(st.sub.until) > now());
  const needLogin = msg => { if(S.uid) return false; confirmBox("Masuk dulu, yuk",msg||"Fitur ini butuh akun supaya hasilmu tersimpan.","Masuk dengan Google",()=>window.SiapAuth.signIn()); return true; };

  /* ====================== SKOR, XP, LIGA, LENCANA ====================== */
  const LIGA=[["Perunggu",0,"#c27c3e"],["Perak",500,"#8a9bb0"],["Emas",1500,"#e0a21a"],["Berlian",4000,"#3fa7e0"]];
  const ligaOf = xp => LIGA.filter(l=>xp>=l[1]).pop();
  function belajarDocs(docs){ return (docs||S.mine).filter(d=>d.data.jenis==="belajar").map(d=>Object.assign({_id:d.id},d.data)); }
  function eventDocs(docs){ return (docs||S.mine).filter(d=>d.data.jenis==="event").map(d=>Object.assign({_id:d.id},d.data)); }
  function extendScore(res){
    const bel=belajarDocs(), ev=eventDocs();
    let belB=0, belW=0; bel.forEach(b=>{ Object.values(b.lv||{}).forEach(x=>belB+=x.b||0); Object.entries(b.log||{}).forEach(([d,n])=>{ if(inWeek(d)) belW+=n; }); });
    const evB=ev.reduce((s,a)=>s+(a.benar||0),0);
    res.poin += belB*5 + evB*10;
    let w=0;
    myAttempts().forEach(a=>{ if(inWeek(a.selesai)) w+=(a.benar||0)*10; });
    myHarian().forEach(h=>{ if(inWeek(h.tanggal)) w+=Object.values(h.cek||{}).filter(x=>x===true).length*5; });
    ev.forEach(a=>{ if(inWeek(a.selesai)) w+=(a.benar||0)*10; });
    w+=belW*5;
    res.xpMinggu=w; res.minggu=weekKey(); res.liga=ligaOf(res.poin)[0];
    res.lencana=lencana(res).filter(l=>l.ok).length;
    return res;
  }
  function lencana(sc){
    const tr=myAttempts(), bel=belajarDocs(), ev=eventDocs();
    const babDone=bel.filter(b=>stars(b)>=1).length;
    const benarAll=tr.reduce((s,a)=>s+(a.benar||0),0)+sc.harianBenar+bel.reduce((s,b)=>s+Object.values(b.lv||{}).reduce((x,y)=>x+(y.b||0),0),0);
    return [
      ["🚀","Langkah Pertama","Selesaikan 1 tryout",tr.length>=1],
      ["🔥","Rajin 3 Hari","Latihan harian 3 hari berturut-turut",sc.streak>=3],
      ["⚡","Pantang Menyerah","Latihan harian 7 hari berturut-turut",sc.streak>=7],
      ["💯","Nilai Sempurna","Dapat skor 100 di tryout",tr.some(a=>a.skor===100)],
      ["🧮","Jagoan Matematika","Skor tryout Matematika ≥ 80",((sc.best.mat||{}).skor||0)>=80],
      ["📖","Jagoan Bahasa","Skor tryout Bahasa Indonesia ≥ 80",((sc.best.bind||{}).skor||0)>=80],
      ["🧭","Penjelajah Bab","Raih bintang di 5 bab berbeda",babDone>=5],
      ["🎯","100 Jawaban Benar","Kumpulkan 100 jawaban benar",benarAll>=100],
      ["🏆","Peserta Mega Tryout","Ikuti 1 Mega Tryout",ev.length>=1],
      ["💎","Liga Berlian","Kumpulkan 4.000 XP",sc.poin>=4000]
    ].map(([ic,n,d,ok])=>({ic,n,d,ok}));
  }

  /* ====================== BELAJAR PER BAB ====================== */
  function stars(doc){ if(!doc||!doc.lv) return 0; return ["mudah","sedang","sulit"].filter(l=>{ const x=doc.lv[l]; return x && x.b>=3 && x.b/x.n>=0.6; }).length; }
  const belId = (m,k) => "b-"+m+"-"+k;
  function babList(m){
    const groups={}; S.soal.filter(q=>q.mapel===m).forEach(q=>{ const k=babOf(q); (groups[k]=groups[k]||[]).push(q); });
    return (BAB[m]||[]).map(b=>({k:b[0],nama:b[1],soal:groups[b[0]]||[]}));
  }
  const starHTML = n => `<span class="stars" aria-label="${n} dari 3 bintang">${[0,1,2].map(i=>`<i class="${i<n?"on":""}">★</i>`).join("")}</span>`;
  function viewBelajar(){
    const m=S.ui.belMapel||"mat";
    if(S.ui.bab) return viewBab(m,S.ui.bab);
    const mine=Object.fromEntries(belajarDocs().map(d=>[d.mapel+"-"+d.bab,d]));
    return `
    <div class="stack" style="gap:4px"><h1>Belajar per Bab</h1><p class="muted">Baca rangkuman materi, lalu latihan bertingkat dari mudah ke sulit. Raih 3 bintang di setiap bab.</p></div>
    <div class="seg" role="tablist">${Object.keys(MAPEL).map(k=>`<button class="${k===m?"on":""}" data-act="fx-belm" data-m="${k}">${esc(MAPEL[k].nama)}</button>`).join("")}</div>
    <section class="babgrid">${babList(m).map(b=>{ const d=mine[m+"-"+b.k]; const s=stars(d); return `
      <button class="babcard" data-act="fx-bab" data-k="${b.k}">
        <span class="babic" style="--t:${m==="mat"?"#1767c2":"#14968b"}">${m==="mat"?"∑":"Aa"}</span>
        <span class="stack" style="gap:2px;text-align:left;flex:1"><b>${esc(b.nama)}</b><span class="small muted">${b.soal.length} soal · ${RANGKUMAN[m+"-"+b.k]||st.rangkuman[m+"-"+b.k]?"ada rangkuman":"rangkuman segera"}</span></span>
        ${starHTML(s)}
      </button>`; }).join("")}</section>`;
  }
  function viewBab(m,k){
    const b=babList(m).find(x=>x.k===k)||{soal:[],nama:babNama(m,k)};
    const d=belajarDocs().find(x=>x.mapel===m&&x.bab===k);
    const html=st.rangkuman[m+"-"+k]||RANGKUMAN[m+"-"+k];
    const topik=[...new Set(b.soal.map(q=>q.topik||"Umum"))];
    const lv=["mudah","sedang","sulit"].map(l=>{ const n=b.soal.filter(q=>q.level===l).length; const x=(d&&d.lv&&d.lv[l])||{b:0,n:0}; return {l,n,x}; });
    return `
    <div class="spread"><button class="btn sm" data-act="fx-babback">‹ Semua bab</button>${starHTML(stars(d))}</div>
    <div class="stack" style="gap:4px"><span class="pill brand" style="align-self:flex-start">${esc(mapelNama(m))}</span><h1>${esc(b.nama)}</h1></div>
    <section class="card stack"><div class="card-h" style="margin:0"><h2>Rangkuman materi</h2></div>
      ${html?`<div class="rangkuman">${rich(html)}</div>`:`<div class="empty">Rangkuman bab ini sedang disiapkan.</div>`}
      ${topik.length?`<p class="small muted">Topik di bank soal: ${topik.map(esc).join(" · ")}</p>`:""}
    </section>
    <section class="card stack"><div class="card-h" style="margin:0"><h2>Latihan bertingkat</h2><span class="small muted">Bintang didapat jika benar ≥ 3 soal dengan ketepatan ≥ 60% di tiap tingkat</span></div>
      <div class="grid g3">${lv.map(o=>`<div class="mcard">
        <div class="spread"><h3 style="text-transform:capitalize">${o.l}</h3>${o.x.b>=3&&o.x.b/o.x.n>=0.6?`<span class="pill good">★ Lulus</span>`:""}</div>
        <span class="small muted num">${o.n} soal tersedia · benar ${o.x.b} dari ${o.x.n} dikerjakan</span>
        <button class="btn ${o.n?"primary":""}" data-act="fx-babgo" data-l="${o.l}" ${o.n?"":"disabled"}>${o.n?"Mulai latihan":"Belum ada soal"}</button></div>`).join("")}</div>
      <button class="btn" data-act="fx-babgo" data-l="" ${b.soal.length?"":"disabled"}>Campuran semua tingkat (${Math.min(10,b.soal.length)} soal acak)</button>
    </section>`;
  }
  let belT=null;
  function startBab(m,k,l){
    const b=babList(m).find(x=>x.k===k); if(!b) return;
    const pool=b.soal.filter(q=>!l||q.level===l);
    S.practice={ids:shuffle(pool).slice(0,10).map(q=>q.id),idx:0,jawaban:{},cek:{},judul:"Belajar · "+b.nama+(l?" · "+l:""),
      onCek(q,ok){
        if(!S.uid) return;
        const id=belId(m,k); const cur=S.mine.find(x=>x.id===id);
        const data=cur?JSON.parse(JSON.stringify(cur.data)):{jenis:"belajar",mapel:m,bab:k,lv:{},log:{}};
        const lvl=q.level||"sedang"; data.lv[lvl]=data.lv[lvl]||{b:0,n:0}; data.lv[lvl].n++; if(ok){ data.lv[lvl].b++; const t=todayStr(); data.log[t]=(data.log[t]||0)+1; }
        data.updatedAt=new Date().toISOString();
        S.mine=S.mine.filter(x=>x.id!==id).concat([{id,data}]);
        clearTimeout(belT); belT=setTimeout(async()=>{ if(S.readonly) return; try{ await S.db.collection("data/users/"+S.uid).doc(id).set(data); await syncScore(); }catch(e){ handleWriteErr(e); } },600);
      }};
    render(); window.scrollTo(0,0);
  }

  /* ====================== MEGA TRYOUT ====================== */
  const evStatus = e => { const t=now(); if(t<T(e.mulai)) return "soon"; if(t<=T(e.selesai)) return "live"; if(t<T(e.umum)) return "wait"; return "done"; };
  const announced = id => { const e=st.events.find(x=>x.id===id); return !e || now()>=T(e.umum); };
  const evMapel = e => (e.mapel||[]).filter(k=>MAPEL[k]);
  function evCard(e,big){
    const s=evStatus(e), r=st.evRes[e.id], done=(r&&r.data)||{};
    const lock=e.premium && !isPremium();
    const btns = s==="live" ? evMapel(e).map(k=>done[k]?`<span class="pill good">✓ ${esc(MAPEL[k].nama)} terkirim</span>`:`<button class="cta" style="padding:10px 16px;font-size:15px" data-act="fx-evgo" data-e="${esc(e.id)}" data-m="${k}">${lock?"🔒 ":""}Kerjakan ${esc(MAPEL[k].nama)}</button>`).join("")
      : s==="done" ? `<a class="cta" style="padding:10px 18px;font-size:15px" href="#mega" data-act="fx-evopen" data-e="${esc(e.id)}">Lihat hasil & ranking</a>` : "";
    const info = s==="soon"?`Dimulai ${fmtDT(e.mulai)} · ${dur(T(e.mulai)-now())} lagi` : s==="live"?`Berlangsung sampai ${fmtDT(e.selesai)}` : s==="wait"?`Hasil diumumkan ${fmtDT(e.umum)}` : `Hasil diumumkan ${fmtDT(e.umum)}`;
    return `<article class="evcard ${big?"big":""}">
      <div class="ev-top"><span class="ev-tag ${s}">${s==="soon"?"Segera":s==="live"?"● Sedang berlangsung":s==="wait"?"Menunggu hasil":"Selesai"}</span>${e.premium?`<span class="ev-tag prem">Premium</span>`:`<span class="ev-tag free">Gratis</span>`}</div>
      <h3>${esc(e.judul)}</h3>
      <p class="small">${evMapel(e).map(k=>`${esc(MAPEL[k].nama)} ${((e.soal||{})[k]||[]).length} soal`).join(" · ")}</p>
      <p class="small ev-info">${esc(info)}</p>
      ${btns?`<div class="row">${btns}</div>`:""}
    </article>`;
  }
  function megaBlock(){
    const list=st.events.filter(e=>evStatus(e)!=="done"||now()-T(e.umum)<14*864e5).slice(0,4);
    if(!list.length) return "";
    return `<section class="stack"><div class="spread"><h2>Mega Tryout serentak</h2><span class="small muted">Dikerjakan bersama di jadwal yang sama, hasil & ranking diumumkan bersamaan</span></div>
      <div class="evgrid">${list.map(e=>evCard(e)).join("")}</div></section>`;
  }
  function homeBlock(){
    const e=st.events.find(x=>evStatus(x)==="live")||st.events.filter(x=>evStatus(x)==="soon").sort((a,b)=>T(a.mulai)-T(b.mulai))[0];
    return e?`<section>${evCard(e,true)}</section>`:"";
  }
  function startEvent(id,k){
    const e=st.events.find(x=>x.id===id); if(!e) return;
    if(needLogin("Mega Tryout butuh akun supaya nilaimu masuk ranking.")) return;
    if(e.premium && !isPremium()){ askPremium("Mega Tryout ini khusus pengguna Premium."); return; }
    if(evStatus(e)!=="live"){ toast("Mega Tryout belum/sudah tidak berlangsung."); return; }
    const done=(st.evRes[id]||{}).data||{}; if(done[k]){ toast("Bagian ini sudah kamu kerjakan."); return; }
    const ids=((e.soal||{})[k]||[]).filter(x=>S.byId[x]); if(!ids.length){ toast("Soal belum tersedia."); return; }
    const menit=e.menit&&e.menit[k]?e.menit[k]:Math.max(3,Math.round(MAPEL[k].menit*ids.length/MAPEL[k].soal));
    const end=Math.min(now()+menit*6e4, T(e.selesai));
    S.exam={mapel:k,event:id,soalIds:ids,jawaban:{},ragu:{},idx:0,mulai:now(),endsAt:end,menit:Math.round((end-now())/6e4),big:false};
    S.pendingExam=null; saveExam(); render();
  }
  async function submitEvent(att){
    const c=sb(); if(!c||!S.uid) return;
    const cur=st.evRes[att.event]||{data:{}};
    const data=Object.assign({},cur.data,{[att.mapel]:{benar:att.benar,n:att.n,skor:att.skor,durasi:att.durasi,selesai:att.selesai}});
    const sk=Object.values(data).map(x=>x.skor); const total=r1(sk.reduce((a,b)=>a+b,0)/sk.length);
    const row={event_id:att.event,uid:S.uid,data,total,updated_at:new Date().toISOString()};
    const r=await c.from("event_results").upsert(row);
    if(r.error){ toast("Nilai Mega Tryout gagal terkirim: "+r.error.message); return; }
    st.evRes[att.event]=row;
  }
  function pendingResult(R){
    const e=st.events.find(x=>x.id===R.event)||{};
    return `<div class="spread"><button class="btn sm" data-act="closeres">‹ Kembali</button></div>
    <section class="card stack" style="align-items:center;text-align:center;padding:36px 20px">
      <div style="font-size:48px">📮</div><h1>Jawabanmu sudah terkirim!</h1>
      <p class="muted" style="max-width:46ch">${esc(e.judul||"Mega Tryout")} · ${esc(mapelNama(R.mapel))}. Nilai, peringkat, dan pembahasan diumumkan bersamaan untuk semua peserta pada <b>${esc(fmtDT(e.umum))}</b>.</p>
      <a class="btn primary" href="#tryout">Kembali ke Tryout</a>
    </section>`;
  }
  async function loadEvAll(id){
    const r=await sb().from("event_results").select("uid,data,total").eq("event_id",id).order("total",{ascending:false}).limit(1000);
    st.evAll[id]=r.error?[]:(r.data||[]); resolveNames(st.evAll[id].map(x=>x.uid)); render();
  }
  function viewMega(){
    const e=st.events.find(x=>x.id===S.ui.event);
    if(!e) return `<div class="stack"><h1>Mega Tryout</h1>${megaBlock()||`<div class="empty">Belum ada Mega Tryout.</div>`}</div>`;
    if(evStatus(e)!=="done") return `<div class="stack"><button class="btn sm" style="align-self:flex-start" data-act="fx-evback">‹ Kembali</button>${evCard(e,true)}</div>`;
    const all=st.evAll[e.id]; if(!all){ loadEvAll(e.id); return `<div class="card"><p class="muted">Memuat hasil…</p></div>`; }
    const myI=all.findIndex(x=>x.uid===S.uid), me=all[myI];
    const pct=me?Math.round((all.length-myI-1)/Math.max(1,all.length-1)*100):null;
    const mine=eventDocs().filter(a=>a.event===e.id);
    return `
    <button class="btn sm" style="align-self:flex-start" data-act="fx-evback">‹ Kembali</button>
    <div class="stack" style="gap:4px"><h1>${esc(e.judul)}</h1><p class="muted">${all.length} peserta · diumumkan ${esc(fmtDT(e.umum))}</p></div>
    ${me?`<section class="card grid g4">
      <div class="stat"><span class="v">${me.total}</span><span class="k">Nilai rata-rata</span></div>
      <div class="stat"><span class="v">#${myI+1}</span><span class="k">Peringkat dari ${all.length}</span></div>
      <div class="stat"><span class="v">${pct}%</span><span class="k">Lebih baik dari peserta lain</span></div>
      <div class="stat"><span class="v">${evMapel(e).map(k=>(me.data[k]||{}).skor??"–").join(" / ")}</span><span class="k">${evMapel(e).map(k=>esc(MAPEL[k].nama)).join(" / ")}</span></div>
    </section>
    <div class="row">${mine.map(a=>`<button class="btn" data-act="fx-evrev" data-id="${esc(a._id)}">Pembahasan ${esc(mapelNama(a.mapel))}</button>`).join("")}</div>`:`<div class="banner info">Kamu tidak mengikuti Mega Tryout ini.</div>`}
    <section class="card"><div class="card-h"><h2>Peringkat</h2></div>
      ${all.length?`<div class="tablewrap"><table class="t"><thead><tr><th>#</th><th>Peserta</th>${evMapel(e).map(k=>`<th style="text-align:right">${esc(MAPEL[k].nama)}</th>`).join("")}<th style="text-align:right">Nilai</th></tr></thead><tbody>
      ${all.slice(0,100).map((x,i)=>`<tr class="${x.uid===S.uid?"me":""}"><td><span class="rank">${i+1}</span></td><td>${esc(nameOf(x.uid))}</td>${evMapel(e).map(k=>`<td class="n">${(x.data[k]||{}).skor??"–"}</td>`).join("")}<td class="n"><b>${x.total}</b></td></tr>`).join("")}</tbody></table></div>`:`<div class="empty">Belum ada peserta.</div>`}
    </section>`;
  }

  /* ====================== RANKING: LIGA ====================== */
  function ligaBlock(){
    const sc=computeMyScore(); const L=ligaOf(sc.poin); const nx=LIGA[LIGA.indexOf(L)+1];
    const wk=weekKey();
    const peers=S.scores.filter(d=>d.data&&d.data.minggu===wk&&d.data.liga===L[0]&&d.data.xpMinggu>0).map(d=>({id:d.id,v:d.data.xpMinggu})).sort((a,b)=>b.v-a.v);
    return `<section class="card liga" style="--lc:${L[2]}">
      <div class="spread"><div class="row"><span class="liga-badge">${L[0][0]}</span><div class="stack" style="gap:0"><b>Liga ${L[0]}</b><span class="small muted num">${sc.poin.toLocaleString("id-ID")} XP${nx?` · ${(nx[1]-sc.poin).toLocaleString("id-ID")} XP lagi ke Liga ${nx[0]}`:" · liga tertinggi"}</span></div></div>
      <span class="pill brand num">${sc.xpMinggu} XP minggu ini</span></div>
      ${peers.length?`<table class="t" style="margin-top:10px"><tbody>${peers.slice(0,10).map((r,i)=>`<tr class="${r.id===S.uid?"me":""}"><td style="width:40px"><span class="rank">${i+1}</span></td><td>${esc(nameOf(r.id))}${i<3?" 🏅":""}</td><td class="n">${r.v} XP</td></tr>`).join("")}</tbody></table>`:`<p class="small muted" style="margin-top:8px">Belum ada peserta Liga ${L[0]} yang mengumpulkan XP minggu ini. Jadilah yang pertama!</p>`}
    </section>`;
  }

  /* ====================== AKUN, LENCANA, ORANG TUA ====================== */
  function viewAkun(){
    if(!S.uid) return `<section class="card stack" style="align-items:center;text-align:center;padding:36px 20px"><div style="font-size:44px">👋</div><h1>Akun Eduvara</h1><p class="muted" style="max-width:44ch">Masuk dengan Google untuk menyimpan nilai, mengumpulkan XP dan lencana, ikut Mega Tryout, dan menghubungkan akun orang tua.</p><button class="cta" style="padding:12px 22px" data-act="login">Masuk dengan Google</button></section>`;
    const sc=computeMyScore(); const L=ligaOf(sc.poin); const lc=lencana(sc);
    const kids=st.links.filter(l=>l.parent===S.uid), parents=st.links.filter(l=>l.child===S.uid);
    return `
    <section class="card akun-h" style="--lc:${L[2]}">
      <span class="liga-badge big">${esc((S.myName||"?")[0].toUpperCase())}</span>
      <div class="stack" style="gap:2px;flex:1"><h1 style="font-size:24px">${esc(S.myName||"Siswa")}</h1>
        <span class="small muted">Liga ${L[0]} · ${sc.poin.toLocaleString("id-ID")} XP · 🔥 ${sc.streak} hari beruntun</span>
        <span>${isPremium()?`<span class="pill acc">⭐ Premium sampai ${esc(new Date(st.sub.until).toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"}))}</span>`:`<a class="pill brand" href="#paket" style="text-decoration:none">Akun Gratis · Lihat Premium ›</a>`}</span>
      </div>
    </section>
    <section class="card"><div class="card-h"><h2>Lencana</h2><span class="pill num">${lc.filter(l=>l.ok).length}/${lc.length}</span></div>
      <div class="badges">${lc.map(l=>`<div class="badge ${l.ok?"ok":""}" title="${esc(l.d)}"><span>${l.ic}</span><b>${esc(l.n)}</b><small>${esc(l.d)}</small></div>`).join("")}</div>
    </section>
    <section class="grid g2">
      <div class="card stack"><h2>Hubungkan orang tua</h2>
        <p class="small muted">Buat kode pantau, lalu minta orang tua masuk ke Eduvara dengan akun Google mereka dan memasukkan kode ini di bagian “Saya orang tua”. Kode berlaku 24 jam.</p>
        ${st.code?`<div class="code-box num">${esc(st.code)}</div>`:""}
        <button class="btn primary" data-act="fx-code">${st.code?"Buat kode baru":"Buat kode pantau"}</button>
        ${parents.length?`<p class="small">Dipantau oleh: ${parents.map(p=>`<b>${esc(S.names[p.parent]||"Orang tua")}</b> <button class="btn sm danger" data-act="fx-unlink" data-p="${p.parent}" data-c="${p.child}">Putuskan</button>`).join(" ")}</p>`:""}
      </div>
      <div class="card stack"><h2>Saya orang tua</h2>
        <p class="small muted">Masukkan kode pantau dari akun anak untuk melihat rapor, nilai tryout, dan latihannya.</p>
        <div class="row"><input id="fxCode" class="input" style="max-width:180px;text-transform:uppercase" maxlength="8" placeholder="Kode"><button class="btn" data-act="fx-claim">Hubungkan</button></div>
        ${kids.length?`<div class="stack">${kids.map(k=>`<a class="btn" href="#anak-${k.child}">Lihat rapor ${esc(S.names[k.child]||"anak")} ›</a>`).join("")}</div>`:""}
      </div>
    </section>
    <section class="card row" style="justify-content:space-between">
      <span class="small muted">Masuk sebagai ${esc((window.SiapAuth.user||{}).email||"")}</span>
      <span class="row">${S.isOwner?`<a class="btn sm" href="#admin">Kelola Soal</a>`:""}<button class="btn sm danger" data-act="logout">Keluar</button></span>
    </section>`;
  }
  async function makeCode(){
    const A="ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; let c=""; const r=crypto.getRandomValues(new Uint8Array(6)); r.forEach(x=>c+=A[x%A.length]);
    const res=await sb().from("link_codes").insert({code:c,child:S.uid,expires:new Date(now()+864e5).toISOString()});
    if(res.error){ toast("Gagal membuat kode: "+res.error.message); return; }
    st.code=c; render();
  }
  async function claimCode(){
    const c=(($("#fxCode")||{}).value||"").trim().toUpperCase(); if(!c) return;
    const r=await sb().rpc("claim_link",{p_code:c});
    if(r.error||!r.data){ toast("Kode tidak valid atau sudah kedaluwarsa."); return; }
    toast("Akun anak terhubung."); await loadLinks(); render();
  }
  async function unlink(p,c){ const r=await sb().from("links").delete().eq("parent",p).eq("child",c); if(r.error) toast(r.error.message); await loadLinks(); render(); }
  function viewAnak(uid){
    if(!st.links.some(l=>l.parent===S.uid&&l.child===uid)) return `<div class="empty">Akun ini belum terhubung denganmu.</div>`;
    const k=st.kidDocs[uid];
    if(!k){ st.kidDocs[uid]="loading"; sb().from("user_docs").select("doc_id,data").eq("uid",uid).then(r=>{ st.kidDocs[uid]=(r.data||[]).map(x=>({id:x.doc_id,data:x.data})); render(); }); }
    if(!Array.isArray(st.kidDocs[uid])) return `<div class="card"><p class="muted">Memuat rapor anak…</p></div>`;
    const keep=S.mine; S.mine=st.kidDocs[uid];
    let html; try{ html=viewRapor(); } finally { S.mine=keep; }
    return `<a class="btn sm" href="#akun" style="align-self:flex-start">‹ Akun</a>`+html.replace("<h1>Rapor</h1>",`<h1>Rapor ${esc(S.names[uid]||"anak")}</h1>`).replace("Perkembangan nilaimu","Perkembangan nilai anak Anda").replace(/data-act="review"/g,'data-act="noop"');
  }

  /* ====================== PREMIUM ====================== */
  const FREE_TRYOUT_PER_WEEK=3;
  function askPremium(msg){ confirmBox("Fitur Premium",esc(msg)+" Upgrade ke Premium untuk akses tanpa batas.","Lihat paket",()=>{ closeModal(); location.hash="#paket"; }); }
  function canStartTryout(){
    if(!S.uid || isPremium()) return true;
    const n=myAttempts().filter(a=>inWeek(a.selesai)).length;
    if(n<FREE_TRYOUT_PER_WEEK) return true;
    askPremium(`Kuota tryout gratis minggu ini (${FREE_TRYOUT_PER_WEEK}×) sudah habis. Kuota baru setiap Senin.`); return false;
  }
  function viewPaket(){
    const back=/bayar=/.test(location.hash);
    const rows=[["Latihan harian & pembahasan","✓","✓"],["Belajar per bab + rangkuman","✓","✓"],["Tryout CBT","3× per minggu","Tanpa batas"],["Mega Tryout gratis","✓","✓"],["Mega Tryout Premium","–","✓"],["Tanya Soal (AI + guru)","3 per hari","30 per hari"],["Liga, lencana & rapor orang tua","✓","✓"]];
    return `
    <div class="stack" style="gap:4px"><h1>Paket Belajar</h1><p class="muted">Semua fitur dasar gratis. Premium membuka tryout tanpa batas, Mega Tryout Premium, dan lebih banyak Tanya Soal.</p></div>
    ${isPremium()?`<div class="banner info">⭐ Akunmu Premium sampai <b>${esc(new Date(st.sub.until).toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"}))}</b>.</div>`:""}
    <section class="pgrid" style="grid-template-columns:repeat(auto-fit,minmax(230px,1fr))">${(st.paket.length?st.paket:[]).map(p=>`
      <article class="pcard" style="--t:${p.populer?"#f2a36b":"#5aa9f0"}"><div class="pc-top">${p.populer?`<span class="pbadge">⭐ Paling hemat</span>`:""}<span class="pc-kick">Eduvara Premium</span><h3>${esc(p.nama)}</h3><p class="small">${esc(p.keterangan||"")}</p></div>
      <div class="pc-body">${p.harga_coret?`<div class="pc-lbl"><s>${rupiah(p.harga_coret)}</s> <span class="pc-tag">${Math.round((1-p.harga/p.harga_coret)*100)}%</span></div>`:""}<div class="pc-big">${rupiah(p.harga)}</div>
      <button class="cta" data-act="fx-buy" data-p="${esc(p.id)}" ${st.busy?"disabled":""}>Beli Paket</button></div></article>`).join("")||`<div class="empty">Paket belum diatur oleh pemilik situs.</div>`}</section>
    <section class="card"><div class="tablewrap"><table class="t"><thead><tr><th>Fitur</th><th>Gratis</th><th>Premium</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td><b>${r[2]}</b></td></tr>`).join("")}</tbody></table></div></section>
    ${back?`<div class="banner info">Terima kasih! Jika pembayaran berhasil, status Premium aktif dalam 1–2 menit. Muat ulang halaman ini untuk memeriksa.</div>`:""}`;
  }
  async function buy(id){
    if(needLogin("Masuk dulu supaya paket tercatat di akunmu.")) return;
    st.busy=true; render();
    try{
      const r=await sb().functions.invoke("bayar",{body:{paket:id,kembali:location.origin+location.pathname+"#paket?bayar=selesai"}});
      if(r.error||!r.data||!r.data.redirect_url) throw new Error((r.data&&r.data.error)||(r.error&&r.error.message)||"Gagal membuat pembayaran");
      location.href=r.data.redirect_url;
    }catch(e){ toast(e.message); }
    finally{ st.busy=false; render(); }
  }

  /* ====================== TANYA SOAL ====================== */
  const md = s => esc(s).replace(/\*\*(.+?)\*\*/g,"<b>$1</b>").replace(/\n/g,"<br>");
  function viewTanya(){
    const lim=isPremium()?30:3; const today=todayStr();
    const used=st.tanya.filter(t=>(t.created_at||"").slice(0,10)===today).length;
    const A=st.lastAnswer;
    return `
    <div class="stack" style="gap:4px"><h1>Tanya Soal</h1><p class="muted">Foto atau ketik soal yang bikin bingung. Kak Vara (AI) menjelaskan langkah demi langkah, lalu guru memeriksa jawabannya.</p></div>
    <section class="card stack">
      <div class="field"><label for="tqM">Mata pelajaran</label><select id="tqM" class="input" style="max-width:260px">${Object.keys(MAPEL).map(k=>`<option value="${k}">${esc(MAPEL[k].nama)}</option>`).join("")}<option value="lain">Lainnya</option></select></div>
      <div class="field"><label for="tqT">Tulis soalnya</label><textarea id="tqT" class="input" maxlength="2000" placeholder="Contoh: KPK dari 12 dan 18 berapa? Bagaimana caranya?"></textarea></div>
      <div class="row"><label class="btn" for="tqF">📷 Foto soal</label><input id="tqF" type="file" accept="image/*" capture="environment" hidden data-act="fx-foto"><span id="tqFn" class="small muted">${st.foto?"1 foto dipilih":""}</span></div>
      ${st.foto?`<img src="${st.foto}" alt="Foto soal" style="max-width:240px;border-radius:10px;border:1px solid var(--line)">`:""}
      <div class="spread"><span class="small muted num">${S.uid?`Sisa hari ini: ${Math.max(0,lim-used)} dari ${lim}`:"Masuk untuk bertanya"}</span><button class="cta" style="padding:11px 22px" data-act="fx-ask" ${st.busy?"disabled":""}>${st.busy?"Kak Vara sedang berpikir…":"Tanyakan"}</button></div>
    </section>
    ${A?`<section class="card stack"><div class="card-h" style="margin:0"><h2>Jawaban</h2><span class="pill">Belum diperiksa guru</span></div><div class="q-text">${md(A.jawaban)}</div></section>`:""}
    <section class="card stack"><div class="card-h" style="margin:0"><h2>Cari soal serupa</h2><span class="small muted">Dari pertanyaan yang sudah diverifikasi guru</span></div>
      <div class="row"><input id="tqC" class="input" style="flex:1;min-width:200px" placeholder="mis. debit air, KPK, majas"><button class="btn" data-act="fx-cari">Cari</button></div>
      ${st.tanyaCari?(st.tanyaCari.length?st.tanyaCari.map(tqItem).join(""):`<div class="empty">Tidak ditemukan.</div>`):""}
    </section>
    ${st.tanya.length?`<section class="stack"><h2>Riwayat pertanyaanmu</h2>${st.tanya.map(tqItem).join("")}</section>`:""}`;
  }
  function tqItem(t){
    const open=S.ui.tqOpen===t.id;
    return `<div class="qcard"><button class="spread" style="border:0;background:none;padding:0;text-align:left;width:100%" data-act="fx-tqopen" data-id="${t.id}">
      <span class="stack" style="gap:2px"><b>${esc((t.teks||"(foto soal)").slice(0,120))}</b><span class="small muted">${esc(mapelNama(t.mapel))} · ${esc(fmtWaktu(t.created_at))}</span></span>
      ${t.status==="diverifikasi"?`<span class="pill good">✓ Diverifikasi guru</span>`:`<span class="pill">Jawaban AI</span>`}</button>
      ${open?`${t.gambar?`<img src="${t.gambar}" alt="Foto soal" style="max-width:240px;border-radius:10px">`:""}<div class="expl">${md(t.koreksi||t.jawaban||"")}</div>`:""}</div>`;
  }
  function pickFoto(input){
    const f=input.files&&input.files[0]; if(!f) return;
    const img=new Image(); const url=URL.createObjectURL(f);
    img.onload=()=>{ const s=Math.min(1,1280/Math.max(img.width,img.height)); const c=document.createElement("canvas"); c.width=Math.round(img.width*s); c.height=Math.round(img.height*s); c.getContext("2d").drawImage(img,0,0,c.width,c.height); st.foto=c.toDataURL("image/jpeg",0.75); URL.revokeObjectURL(url); keepForm(()=>render()); };
    img.onerror=()=>toast("Foto tidak bisa dibaca."); img.src=url;
  }
  function keepForm(fn){ const t=($("#tqT")||{}).value, m=($("#tqM")||{}).value; fn(); if($("#tqT")&&t!=null) $("#tqT").value=t; if($("#tqM")&&m) $("#tqM").value=m; }
  async function ask(){
    if(needLogin("Masuk dulu untuk bertanya, ya.")) return;
    const teks=(($("#tqT")||{}).value||"").trim(), mapel=($("#tqM")||{}).value||"lain";
    if(!teks && !st.foto){ toast("Tulis soal atau pilih foto dulu."); return; }
    st.busy=true; keepForm(()=>render());
    try{
      const r=await sb().functions.invoke("tanya",{body:{teks,mapel,gambar:st.foto||null}});
      if(r.error){ let msg=r.error.message; try{ const j=await r.error.context.json(); msg=j.error||msg; }catch(e){} throw new Error(msg); }
      st.lastAnswer=r.data; st.foto=null; await loadTanya(); if($("#tqT")) $("#tqT").value="";
    }catch(e){ toast(e.message||"Gagal bertanya."); }
    finally{ st.busy=false; render(); }
  }
  async function cari(){
    const q=(($("#tqC")||{}).value||"").trim().replace(/[%,()]/g," "); if(q.length<3){ toast("Ketik minimal 3 huruf."); return; }
    const r=await sb().from("tanya").select("id,mapel,teks,jawaban,koreksi,status,created_at").eq("status","diverifikasi").ilike("teks","%"+q+"%").limit(10);
    st.tanyaCari=r.data||[]; const v=q; render(); if($("#tqC")) $("#tqC").value=v;
  }

  /* ====================== ADMIN ====================== */
  function adminBlock(){
    if(!st.adminLoaded){ st.adminLoaded=true; sb().from("tanya").select("id,uid,mapel,teks,gambar,jawaban,koreksi,status,created_at").order("created_at",{ascending:false}).limit(30).then(r=>{ st.adminTanya=r.data||[]; render(); }); }
    const allBab=Object.keys(BAB).flatMap(m=>BAB[m].map(b=>[m+"-"+b[0],mapelNama(m)+" · "+b[1]]));
    const selB=S.ui.rgBab||allBab[0][0];
    const pad=n=>String(n).padStart(2,"0"); const d=new Date(now()+864e5); const dl=`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T08:00`;
    return `
    <section class="card stack"><h2>Buat Mega Tryout</h2>
      <p class="small muted">Soal dipilih acak dari bank saat dibuat dan sama untuk semua peserta. Hasil, ranking, dan pembahasan baru terlihat setelah waktu pengumuman.</p>
      <div class="grid g3">
        <div class="field"><label for="evJ">Judul</label><input id="evJ" class="input" value="Mega Tryout TKA SD #${st.events.length+1}"></div>
        <div class="field"><label for="evS">Mulai</label><input id="evS" type="datetime-local" class="input" value="${dl}"></div>
        <div class="field"><label for="evD">Lama jendela (jam)</label><input id="evD" type="number" min="1" class="input" value="48"></div>
        <div class="field"><label for="evU">Pengumuman (jam setelah selesai)</label><input id="evU" type="number" min="0" class="input" value="12"></div>
        <div class="field"><label for="evN">Soal per mapel (maks 30)</label><input id="evN" type="number" min="5" max="30" class="input" value="30"></div>
        <div class="field"><label for="evP">Akses</label><select id="evP" class="input"><option value="0">Gratis</option><option value="1">Premium</option></select></div>
      </div>
      <div><button class="btn primary" data-act="fx-evnew">Buat Mega Tryout</button></div>
      ${st.events.length?`<div class="tablewrap"><table class="t"><tbody>${st.events.map(e=>`<tr><td>${esc(e.judul)}</td><td class="small">${esc(fmtDT(e.mulai))} – ${esc(fmtDT(e.selesai))}</td><td>${evStatus(e)}</td><td style="text-align:right"><button class="btn sm danger" data-act="fx-evdel" data-e="${esc(e.id)}">Hapus</button></td></tr>`).join("")}</tbody></table></div>`:""}
    </section>
    <section class="card stack"><h2>Rangkuman per bab</h2>
      <div class="field"><label for="rgB">Bab</label><select id="rgB" class="input" data-act="fx-rgbab">${allBab.map(([k,n])=>`<option value="${k}" ${k===selB?"selected":""}>${esc(n)}</option>`).join("")}</select></div>
      <textarea id="rgT" class="input" style="min-height:160px;font-family:ui-monospace,monospace;font-size:13px">${esc(st.rangkuman[selB]||RANGKUMAN[selB]||"")}</textarea>
      <div class="row"><button class="btn primary" data-act="fx-rgsave">Simpan rangkuman</button><span class="small muted">HTML sederhana: &lt;p&gt;, &lt;b&gt;, &lt;ul&gt;&lt;li&gt;, &lt;sup&gt;…</span></div>
    </section>
    <section class="card stack"><h2>Periksa Tanya Soal</h2>
      ${st.adminTanya.length?st.adminTanya.map(t=>`<div class="qcard"><div class="spread"><b>${esc((t.teks||"(foto)").slice(0,140))}</b><span class="pill ${t.status==="diverifikasi"?"good":""}">${esc(t.status)}</span></div>
        ${t.gambar?`<img src="${t.gambar}" alt="" style="max-width:200px;border-radius:8px">`:""}
        <textarea class="input" id="tk-${t.id}" style="min-height:110px">${esc(t.koreksi||t.jawaban||"")}</textarea>
        <div><button class="btn sm primary" data-act="fx-tqok" data-id="${t.id}">Simpan & tandai diverifikasi</button></div></div>`).join(""):`<div class="empty">Belum ada pertanyaan.</div>`}
    </section>`;
  }
  async function evNew(){
    const g=id=>($("#"+id)||{}).value;
    const mulai=new Date(g("evS")); if(isNaN(mulai)){ toast("Tanggal mulai belum diisi."); return; }
    const selesai=new Date(mulai.getTime()+Math.max(1,+g("evD")||48)*36e5), umum=new Date(selesai.getTime()+Math.max(0,+g("evU")||0)*36e5);
    const n=Math.min(30,Math.max(5,+g("evN")||30)); const soal={};
    Object.keys(MAPEL).forEach(k=>{ soal[k]=shuffle(S.soal.filter(q=>q.mapel===k)).slice(0,n).map(q=>q.id); });
    const id="mt-"+mulai.toISOString().slice(0,10)+"-"+Math.random().toString(36).slice(2,6);
    const r=await sb().from("events").insert({id,judul:g("evJ")||"Mega Tryout",jenjang:JENJANG,mapel:Object.keys(MAPEL),mulai:mulai.toISOString(),selesai:selesai.toISOString(),umum:umum.toISOString(),soal,premium:g("evP")==="1"});
    if(r.error){ toast(r.error.message); return; }
    toast("Mega Tryout dibuat."); await init();
  }

  /* ====================== ROUTING & AKSI ====================== */
  function view(v){
    if(v==="belajar") return viewBelajar();
    if(v==="tanya") return viewTanya();
    if(v==="akun") return viewAkun();
    if(v.startsWith("paket")) return viewPaket();
    if(v==="mega") return viewMega();
    if(v.startsWith("anak-")) return viewAnak(v.slice(5));
    return null;
  }
  const acts={
    "fx-belm":b=>{ S.ui.belMapel=b.dataset.m; S.ui.bab=null; render(); },
    "fx-bab":b=>{ S.ui.bab=b.dataset.k; render(); window.scrollTo(0,0); },
    "fx-babback":()=>{ S.ui.bab=null; render(); },
    "fx-babgo":b=>startBab(S.ui.belMapel||"mat",S.ui.bab,b.dataset.l),
    "fx-evgo":b=>startEvent(b.dataset.e,b.dataset.m),
    "fx-evopen":(b,e)=>{ e.preventDefault(); S.ui.event=b.dataset.e; if(location.hash!=="#mega") location.hash="#mega"; else render(); },
    "fx-evback":()=>{ S.ui.event=null; location.hash="#tryout"; },
    "fx-evrev":b=>{ const a=eventDocs().find(x=>x._id===b.dataset.id); if(a){ S.result=Object.assign({filter:"semua"},a); render(); window.scrollTo(0,0); } },
    "fx-evnew":()=>evNew(),
    "fx-evdel":b=>confirmBox("Hapus Mega Tryout?","Hasil peserta untuk event ini juga akan terhapus.","Hapus",async()=>{ closeModal(); const r=await sb().from("events").delete().eq("id",b.dataset.e); if(r.error) toast(r.error.message); await init(); },true),
    "fx-code":()=>makeCode(),
    "fx-claim":()=>claimCode(),
    "fx-unlink":b=>confirmBox("Putuskan hubungan?","Orang tua tidak bisa lagi melihat rapor akun ini.","Putuskan",()=>{ closeModal(); unlink(b.dataset.p,b.dataset.c); },true),
    "fx-buy":b=>buy(b.dataset.p),
    "fx-ask":()=>ask(),
    "fx-cari":()=>cari(),
    "fx-tqopen":b=>{ S.ui.tqOpen=S.ui.tqOpen===+b.dataset.id?null:+b.dataset.id; keepForm(()=>render()); },
    "fx-rgsave":async()=>{ const k=($("#rgB")||{}).value, html=($("#rgT")||{}).value; const [m,...rest]=k.split("-"); const r=await sb().from("rangkuman").upsert({id:k,mapel:m,bab:rest.join("-"),html,updated_at:new Date().toISOString()}); if(r.error) toast(r.error.message); else { st.rangkuman[k]=html; toast("Rangkuman tersimpan."); } },
    "fx-tqok":async b=>{ const id=+b.dataset.id; const v=($("#tk-"+id)||{}).value; const r=await sb().from("tanya").update({koreksi:v,status:"diverifikasi"}).eq("id",id); if(r.error) toast(r.error.message); else { toast("Tersimpan."); st.adminLoaded=false; render(); } },
    "noop":()=>{}
  };
  const chg={ "fx-foto":t=>pickFoto(t), "fx-rgbab":t=>{ S.ui.rgBab=t.value; render(); } };

  return { init, view, acts, chg, extendScore, megaBlock, homeBlock, ligaBlock, adminBlock, startEvent, submitEvent, announced, pendingResult,
           canStartTryout, isPremium, babOf, st };
})();
window.FX = FX;
