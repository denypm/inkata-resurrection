const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const m of process.argv.slice(2)){const story=m.endsWith('story');const p=await b.newPage({viewport:{width:1080,height:story?1920:1350}});p.on('pageerror',e=>console.log('ERR',m,e.message));
await p.goto('file://'+process.cwd()+'/sheets.html#'+m);await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(500);
await p.locator('#post').screenshot({path:`karakter-${m}.png`});await p.close();}
await b.close();})();
