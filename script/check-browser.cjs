const assert = require('node:assert/strict');
const {chromium, webkit, devices} = require('playwright');
const base = process.env.TEST_URL || 'http://127.0.0.1:4027';
(async()=>{
 for(const engine of ['chromium','webkit']){
  const browser = await ({chromium,webkit}[engine]).launch({headless:true,...(engine==='chromium' && process.env.CHROMIUM_PATH ? {executablePath:process.env.CHROMIUM_PATH} : {})});
  for(const mode of ['normal','no-js','blocked-js','blocked-resources','delayed-js','missing-observer','storage-blocked']){
   const context = await browser.newContext({...devices[engine==='webkit'?'iPhone 13 Pro':'Pixel 7'], javaScriptEnabled:mode!=='no-js'});
   if(mode==='missing-observer')await context.addInitScript(()=>{delete window.IntersectionObserver});
   if(mode==='storage-blocked')await context.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw Error('blocked')}})});
   if(mode==='blocked-resources')await context.route('**/*',r=>r.request().resourceType()==='document'?r.continue():r.abort());
   if(mode==='blocked-js')await context.route('**/*.js',r=>r.abort());
   let release;
   const gate = new Promise(r=>release=r);
   if(mode==='delayed-js')await context.route('**/*.js',async r=>{await gate;await r.continue().catch(()=>{})});
   const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error'&&/hydration|Minified React/.test(m.text()))errors.push(m.text())});
   const start=Date.now();await page.goto(base,{waitUntil:'commit'});
   await page.locator('h1').waitFor({state:'visible',timeout:5000});
   assert.equal(await page.locator('h1').evaluate(e=>getComputedStyle(e.closest('.revelar')||e).opacity),'1');
   const visibleMs=Date.now()-start;
   await page.locator('summary[aria-label="Abrir menu"]').click();
   await page.getByRole('navigation',{name:'Principal (móvel)',exact:true}).waitFor({state:'visible'});
   await page.locator('summary[aria-label="Abrir menu"]').click();
   if(mode==='delayed-js')release();
   if(!['no-js','blocked-js','blocked-resources'].includes(mode)){
    await page.waitForLoadState('networkidle');
    await page.locator('main a[href^="mailto:"]').first().click();
    await page.getByRole('dialog',{name:'Diagnóstico de elegibilidade',exact:true}).waitFor({state:'visible',timeout:5000});
   }
   assert.deepEqual(errors,[],`${engine}/${mode}`);
   console.log(JSON.stringify({engine,mode,visibleMs,errors}));
   await context.close();
  }
  await browser.close();
 }
})().catch(e=>{console.error(e);process.exit(1)});
