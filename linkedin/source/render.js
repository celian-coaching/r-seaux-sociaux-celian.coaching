const { chromium } = require('playwright'); const path=require('path');
const out=process.argv[2];
const T={
 orange:   {bg:'#FF721D',brand:'#fff',title:'#fff',pill:'#fff',pillTx:'#FF721D',sub:'#fff',hl:'#E0FF20',ring:'#fff',disc:'#00DBA0',logo:'#E0FF20',a1:'#E0FF20',a2:'#00DBA0',a3:'#E0FF20'},
 'orange-logo-blanc':{bg:'#FF721D',fond:'orange',brand:'#fff',title:'#fff',pill:'#fff',pillTx:'#FF721D',sub:'#fff',hl:'#E0FF20',ring:'#fff',disc:'#fff',logo:'#FF721D',a1:'#E0FF20',a2:'#00DBA0',a3:'#E0FF20'},
 'orange-logo-rond-orange':{bg:'#FF721D',fond:'orange',brand:'#fff',title:'#fff',pill:'#fff',pillTx:'#FF721D',sub:'#fff',hl:'#E0FF20',ring:'#fff',disc:'#FF721D',logo:'#fff',a1:'#E0FF20',a2:'#00DBA0',a3:'#E0FF20'},
 'orange-logo-noir':{bg:'#FF721D',fond:'orange',brand:'#fff',title:'#fff',pill:'#fff',pillTx:'#FF721D',sub:'#fff',hl:'#E0FF20',a1:'#E0FF20',a2:'#00DBA0',a3:'#E0FF20',ring:'#fff',disc:'#fff',logo:'#1B1B1B'},
 'orange-rond-noir-logo-orange':{bg:'#FF721D',fond:'orange',brand:'#fff',title:'#fff',pill:'#fff',pillTx:'#FF721D',sub:'#fff',hl:'#E0FF20',a1:'#E0FF20',a2:'#00DBA0',a3:'#E0FF20',ring:'#fff',disc:'#1B1B1B',logo:'#FF721D'},
 'orange-rond-noir-logo-blanc':{bg:'#FF721D',fond:'orange',brand:'#fff',title:'#fff',pill:'#fff',pillTx:'#FF721D',sub:'#fff',hl:'#E0FF20',a1:'#E0FF20',a2:'#00DBA0',a3:'#E0FF20',ring:'#fff',disc:'#1B1B1B',logo:'#fff'},
 turquoise:{bg:'#00DBA0',brand:'#fff',title:'#fff',pill:'#E0FF20',pillTx:'#00A97B',sub:'#fff',hl:'#E0FF20',ring:'#fff',disc:'#FF721D',logo:'#E0FF20',a1:'#FF721D',a2:'#fff',a3:'#FF721D'},
 blanc:    {bg:'#FFFFFF',brand:'#FF721D',title:'#FF721D',pill:'#00DBA0',pillTx:'#fff',sub:'#1B1B1B',hl:'#FF721D',ring:'#00DBA0',disc:'#FF721D',logo:'#E0FF20',a1:'#E0FF20',a2:'#FF721D',a3:'#00DBA0'},
};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1584,height:396},deviceScaleFactor:2});
for(const[n,t] of Object.entries(T)){await p.goto('file://'+path.join(__dirname,'banniere.html'));
 await p.evaluate(([n,t])=>{const s=document.documentElement.style;for(const k in t)s.setProperty('--'+k,t[k]);s.setProperty('--motif',`url(fond-${t.fond||n}.jpg)`)},[n,t]);
 await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(300);
 await p.screenshot({path:`${out}/banniere-${n}.png`});}
await b.close();})();
