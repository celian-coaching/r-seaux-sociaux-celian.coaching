const {chromium}=require('playwright');
(async()=>{
  const [,,out,times]=process.argv;
  const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
  await p.goto('http://127.0.0.1:8765/story.html');await p.evaluate(()=>document.fonts.ready);
  const fs=require('fs');fs.mkdirSync(out,{recursive:true});
  const list=times?times.split(',').map(Number):[...Array(591).keys()].map(i=>i/30);
  for(let i=0;i<list.length;i++){await p.evaluate(t=>setTime(t),list[i]);
    await p.screenshot({path:`${out}/${String(i).padStart(4,'0')}.${times?'png':'jpg'}`,type:times?'png':'jpeg',quality:times?undefined:95});}
  await b.close();})();
