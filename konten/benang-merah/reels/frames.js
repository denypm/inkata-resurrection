const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const out=process.argv[2],fps=30,dur=11;fs.mkdirSync(out,{recursive:true});
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.goto('file://'+process.cwd()+'/reel-01.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(800);
const only=process.argv[3]?process.argv[3].split(',').map(Number):null;
const list=only||[...Array(fps*dur).keys()];
for(const i of list){await p.evaluate(t=>render(t),i/fps);await p.screenshot({path:`${out}/f${String(i).padStart(4,'0')}.jpg`,type:'jpeg',quality:90});}
await b.close();})();
