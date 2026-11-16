/* Eduvara × Supabase
   Menyediakan window.claude.use("db"|"user") dengan API yang sama seperti runtime artifact claude.ai
   (collection/doc, get/set/update/delete, onSnapshot), sehingga kode aplikasi tidak perlu berubah.
   Peta path → tabel:
     bank/{id}                 → public.bank (id, tanggal, jenjang, sumber, soal)
     scores/{uid}              → public.scores (uid, data)
     data/users/{uid}/{docId}  → public.user_docs (uid, doc_id, data)                         */
(function(){
  "use strict";
  const C = window.SIAPTKA_CONFIG || {};
  const configured = C.supabaseUrl && C.supabaseAnonKey && !/PROJECT-ANDA|ISI-ANON/.test(C.supabaseUrl + C.supabaseAnonKey);
  window.SiapAuth = { configured: !!configured, user: null,
    signIn(){ alert("Website belum tersambung ke database. Isi config.js terlebih dahulu."); },
    signOut(){} };
  if(!configured || !window.supabase || !window.supabase.createClient){ return; }

  const sb = window.supabase.createClient(C.supabaseUrl, C.supabaseAnonKey, {
    auth:{ persistSession:true, autoRefreshToken:true, detectSessionInUrl:true, flowType:"pkce" }
  });
  window.SiapAuth.client = sb;
  window.SiapAuth.signIn = () => sb.auth.signInWithOAuth({ provider:"google",
    options:{ redirectTo: location.origin + location.pathname, queryParams:{ prompt:"select_account" } } });
  window.SiapAuth.signOut = async () => { await sb.auth.signOut(); location.reload(); };

  const BANK_FIELDS = ["tanggal","jenjang","sumber","soal"];
  function route(path){
    const p = String(path).split("/").filter(Boolean);
    if(p[0]==="bank") return { kind:"bank", id:p[1] };
    if(p[0]==="scores") return { kind:"scores", id:p[1] };
    if(p[0]==="data" && p[1]==="users") return { kind:"user", uid:p[2], id:p[3] };
    throw Object.assign(new Error("Path tidak dikenal: "+path), { code:"invalid_argument" });
  }
  function mapErr(e){
    if(!e) return e;
    const perm = e.code==="42501" || /row-level security|permission denied/i.test(e.message||"");
    return Object.assign(new Error(e.message||"Gagal"), { code: perm ? "invalid_argument" : (e.code||"unknown") });
  }
  const docOf = (id, data) => ({ id, exists:true, data:()=>JSON.parse(JSON.stringify(data)) });
  const missing = id => ({ id, exists:false, data:()=>undefined });
  const rowToBank = r => { const o={}; BANK_FIELDS.forEach(k=>{ if(r[k]!=null) o[k]=r[k]; }); return o; };

  async function fetchCollection(r){
    if(r.kind==="bank"){
      const { data, error } = await sb.from("bank").select("id,tanggal,jenjang,sumber,soal").order("id");
      if(error) throw mapErr(error); return data.map(x=>docOf(x.id, rowToBank(x)));
    }
    if(r.kind==="scores"){
      const { data, error } = await sb.from("scores").select("uid,data");
      if(error) throw mapErr(error); return data.map(x=>docOf(x.uid, x.data||{}));
    }
    const { data, error } = await sb.from("user_docs").select("doc_id,data").eq("uid", r.uid);
    if(error) throw mapErr(error); return data.map(x=>docOf(x.doc_id, x.data||{}));
  }
  const TABLE = { bank:"bank", scores:"scores", user:"user_docs" };

  /* langganan: ambil awal + realtime (jika diaktifkan) + ambil ulang setelah penulisan lokal */
  const subs = new Set();
  function refreshKind(kind){ subs.forEach(s=>{ if(s.r.kind===kind) s.refresh(); }); }
  function subscribe(path, cb, onErr){
    const r = route(path);
    let t=null, alive=true;
    const s = { r, refresh(){ clearTimeout(t); t=setTimeout(run, 250); } };
    async function run(){
      if(!alive) return;
      try{ const docs = await fetchCollection(r); if(alive) cb({ docs, metadata:{ fromCache:false } }); }
      catch(e){ console.warn(e); if(onErr) onErr(e); }
    }
    subs.add(s); run();
    const filter = r.kind==="user" ? { filter:"uid=eq."+r.uid } : {};
    const ch = sb.channel("rt-"+path+"-"+Math.random().toString(36).slice(2))
      .on("postgres_changes", Object.assign({ event:"*", schema:"public", table:TABLE[r.kind] }, filter), ()=>s.refresh())
      .subscribe();
    const iv = setInterval(()=>{ if(document.visibilityState==="visible") s.refresh(); }, 120000);
    return () => { alive=false; subs.delete(s); clearInterval(iv); try{ sb.removeChannel(ch); }catch(e){} };
  }

  function docRef(path){
    const r = route(path);
    const key = r.kind==="user" ? { uid:r.uid, doc_id:r.id } : r.kind==="scores" ? { uid:r.id } : { id:r.id };
    const match = q => { Object.entries(key).forEach(([k,v])=>{ q=q.eq(k,v); }); return q; };
    async function get(){
      const cols = r.kind==="bank" ? "id,tanggal,jenjang,sumber,soal" : "data";
      const { data, error } = await match(sb.from(TABLE[r.kind]).select(cols)).maybeSingle();
      if(error) throw mapErr(error);
      if(!data) return missing(r.id);
      return docOf(r.id, r.kind==="bank" ? rowToBank(data) : (data.data||{}));
    }
    async function set(obj){
      const row = Object.assign({}, key, { updated_at:new Date().toISOString() });
      if(r.kind==="bank") Object.assign(row, { tanggal:null, jenjang:null, sumber:null, soal:[] }, rowToBank(obj));
      else row.data = obj;
      const { error } = await sb.from(TABLE[r.kind]).upsert(row);
      if(error) throw mapErr(error);
      refreshKind(r.kind);
    }
    async function update(patch){ const cur = await get(); await set(Object.assign({}, cur.exists?cur.data():{}, patch)); }
    async function del(){
      const { error } = await match(sb.from(TABLE[r.kind]).delete());
      if(error) throw mapErr(error); refreshKind(r.kind);
    }
    return { id:r.id, get, set, update, delete:del, onSnapshot(cb){ return subscribe(path.split("/").slice(0,-1).join("/"), snap=>{ const d=snap.docs.find(x=>x.id===r.id); cb(d||missing(r.id)); }); } };
  }

  const db = {
    collection(path){ return { onSnapshot:(cb,err)=>subscribe(path,cb,err), doc:id=>docRef(path+"/"+id), get:async()=>({ docs:await fetchCollection(route(path)) }) }; },
    doc:docRef
  };

  const ready = (async()=>{
    const { data:{ session } } = await sb.auth.getSession();
    const u = session && session.user;
    let admin = false;
    if(u){
      window.SiapAuth.user = u;
      const name = (u.user_metadata && (u.user_metadata.full_name || u.user_metadata.name)) || (u.email||"").split("@")[0];
      try{ await sb.from("profiles").upsert({ uid:u.id, name, updated_at:new Date().toISOString() }); }catch(e){}
      try{ const { data } = await sb.rpc("is_admin"); admin = data===true; }catch(e){}
      window.SiapAuth.name = name;
    }
    sb.auth.onAuthStateChange((ev)=>{ if(ev==="SIGNED_OUT") location.reload(); });
    return { u, admin };
  })();

  window.claude = {
    async use(cap){
      const { u, admin } = await ready;
      if(cap==="db") return db;
      if(cap==="user") return {
        isOwner:()=>admin,
        id:async()=>u?u.id:null,
        me:async()=>u?{ name:window.SiapAuth.name }:null,
        profiles:async ids=>{
          const out={}; if(!ids.length) return out;
          const { data } = await sb.from("profiles").select("uid,name").in("uid", ids);
          (data||[]).forEach(p=>{ out[p.uid]={ name:p.name }; }); return out;
        }
      };
      return null;
    }
  };
})();
