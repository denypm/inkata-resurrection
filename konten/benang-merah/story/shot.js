const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
for(const f of process.argv.slice(2)){await p.goto('file://'+process.cwd()+'/'+f+'.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(400);
await p.locator('#post').screenshot({path:f+'.png'});}
await b.close();})();
