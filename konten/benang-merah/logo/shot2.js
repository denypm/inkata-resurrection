const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1080}});p.on('pageerror',e=>console.log('ERR',e.message));
for(const m of ['peek','badge']){await p.goto('file://'+process.cwd()+'/logo-sulam.html#'+m);await p.reload();await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(500);
await p.locator('#post').screenshot({path:'logo-sulam-'+m+'.png'});}await b.close();})();
