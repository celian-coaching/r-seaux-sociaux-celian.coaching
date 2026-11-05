const { chromium } = require('playwright');
const themes = {
  orange: { bg:'#fe721d', pat:'rgba(255,255,255,.16)', title:'#ffffff', sub:'#3a1500', acc1:'#e0fe20', acc2:'#00dc9f', pillBg:'#ffffff', pillTx:'#fe721d', hl:'#e0fe20', hlTx:'#1a1a1a' },
  noir:   { bg:'#151515', pat:'rgba(254,114,29,.20)', title:'#ffffff', sub:'#cfcfcf', acc1:'#e0fe20', acc2:'#00dc9f', pillBg:'#fe721d', pillTx:'#ffffff', hl:'#fe721d', hlTx:'#ffffff' },
  vert:   { bg:'#00dc9f', pat:'rgba(255,255,255,.22)', title:'#151515', sub:'#0b3a2c', acc1:'#fe721d', acc2:'#e0fe20', pillBg:'#151515', pillTx:'#e0fe20', hl:'#fe721d', hlTx:'#ffffff' },
};
const dumbbell = c => `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'><g fill='${c}' transform='rotate(-30 60 60)'><rect x='30' y='56' width='60' height='8' rx='3'/><rect x='22' y='42' width='10' height='36' rx='4'/><rect x='12' y='48' width='8' height='24' rx='3'/><rect x='88' y='42' width='10' height='36' rx='4'/><rect x='100' y='48' width='8' height='24' rx='3'/></g></svg>`;
const html = t => `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,600;1,700;1,900&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:1584px;height:396px;overflow:hidden;background:${t.bg};font-family:Kanit,sans-serif;position:relative}
.pat{position:absolute;inset:0;background-image:url("data:image/svg+xml;utf8,${encodeURIComponent(dumbbell(t.pat))}");background-size:96px 96px}
.glow{position:absolute;right:-120px;top:-160px;width:720px;height:720px;border-radius:50%;background:radial-gradient(circle, rgba(255,255,255,.14), transparent 65%)}
.slash{position:absolute;left:420px;top:-40px;width:56px;height:520px;background:${t.acc1};transform:skewX(-18deg);opacity:.9}
.slash2{position:absolute;left:492px;top:-40px;width:16px;height:520px;background:${t.acc2};transform:skewX(-18deg)}
.content{position:absolute;left:590px;top:46px;right:60px}
.logo{display:flex;align-items:center;gap:12px;color:${t.title};font-weight:700;font-style:italic;font-size:26px;letter-spacing:2px}
.logo svg{width:44px;height:26px}
h1{margin-top:10px;color:${t.title};font-weight:900;font-style:italic;font-size:62px;line-height:1;text-transform:uppercase;letter-spacing:-1px}
h1 span{background:${t.hl};color:${t.hlTx};padding:0 14px;display:inline-block;transform:skewX(-8deg);margin-top:8px;white-space:nowrap}
.sub{margin-top:16px;color:${t.sub};font-weight:600;font-size:23px}
.pills{margin-top:16px;display:flex;gap:12px}
.pill{background:${t.pillBg};color:${t.pillTx};font-weight:700;font-style:italic;font-size:17px;padding:5px 16px;border-radius:40px;text-transform:uppercase}
.bolt{position:absolute;right:70px;top:40px;width:60px;transform:rotate(12deg)}
.arrow{position:absolute;right:60px;bottom:34px;width:100px}
</style></head><body>
<div class="pat"></div><div class="glow"></div><div class="slash"></div><div class="slash2"></div>
<svg class="bolt" viewBox="0 0 60 100"><path d="M20 4 L46 36 L28 42 L50 96" fill="none" stroke="${t.acc1}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/></svg>
<svg class="arrow" viewBox="0 0 120 80"><path d="M8 66 C 30 66, 30 30, 58 34 S 86 18, 100 14" fill="none" stroke="${t.acc2}" stroke-width="11" stroke-linecap="round"/><path d="M82 6 L106 12 L98 36" fill="none" stroke="${t.acc2}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/></svg>
<div class="content">
 <div class="logo"><svg viewBox="0 0 44 26"><g fill="none" stroke="${t.title}" stroke-width="4" stroke-linejoin="round"><rect x="4" y="4" width="10" height="18" rx="2"/><rect x="30" y="4" width="10" height="18" rx="2"/><line x1="14" y1="13" x2="30" y2="13"/></g></svg>CD COACHING</div>
 <h1>Coach sportif<br><span>à domicile &amp; en entreprise</span></h1>
 <div class="sub">Lyon et alentours · Des séances adaptées à votre niveau et à votre agenda</div>
 <div class="pills"><div class="pill">Cadres &amp; dirigeants</div><div class="pill">Sport en entreprise</div><div class="pill">Licence STAPS</div></div>
</div>
</body></html>`;
(async()=>{
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1584,height:396},deviceScaleFactor:2});
  for (const [n,t] of Object.entries(themes)) {
    await p.setContent(html(t),{waitUntil:'networkidle'}); await p.evaluate(()=>document.fonts.ready);
    await p.screenshot({path:`/home/user/r-seaux-sociaux-celian.coaching/linkedin/banniere-${n}.png`});
  }
  await b.close();
})();
