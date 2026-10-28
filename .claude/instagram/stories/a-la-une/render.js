const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.goto('http://127.0.0.1:8766/covers.html');await p.evaluate(()=>document.fonts.ready);
for(const id of ['qui','seances','tarifs','avis']){await p.evaluate(i=>show(i),id);await p.waitForTimeout(100);await p.screenshot({path:`couverture-${id}.png`});}
await b.close();})();
