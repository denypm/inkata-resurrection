const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const [html,out,only]=process.argv.slice(2);const fps=30,dur=10;fs.mkdirSync(out,{recursive:true});
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file://'+process.cwd()+'/'+html);await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(800);
if(html.includes('04'))fs.writeFileSync(out+'/events.json',JSON.stringify(await p.evaluate(()=>EVENTS())));
const list=only?only.split(',').map(Number):[...Array(fps*dur).keys()];
for(const i of list){await p.evaluate(t=>render(t),i/fps);await p.screenshot({path:`${out}/f${String(i).padStart(4,'0')}.jpg`,type:'jpeg',quality:90});}
await b.close();})();
