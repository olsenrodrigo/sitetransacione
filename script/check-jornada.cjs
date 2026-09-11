const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {chromium, webkit} = require('playwright');
const base = process.env.TEST_URL || 'http://127.0.0.1:4027';
const routes = JSON.parse(fs.readFileSync('.build/aws/routes.json', 'utf8'));
const report = process.env.REPORT_DIR;
const results = [];

(async () => {
  if (report) fs.mkdirSync(report, {recursive:true});
  for (const engine of (process.env.BROWSER_ENGINES || 'chromium,webkit').split(',')) {
    const browser = await ({chromium, webkit}[engine]).launch({headless:true,
      ...(engine === 'chromium' && process.env.CHROMIUM_PATH ? {executablePath:process.env.CHROMIUM_PATH} : {})});
    const context = await browser.newContext({viewport:{width:390,height:844}, reducedMotion:'reduce'});
    await context.addInitScript(() => localStorage.setItem('transacione:cookies','essenciais'));
    const page = await context.newPage();
    let errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => {if(m.type() === 'error') errors.push(m.text());});
    for (const width of [320,390,768,1024,1280,1440]) {
      await page.setViewportSize({width,height:900});
      for (const route of (width === 390 ? routes : ['/','/precatorios','/como-funciona'])) {
        errors = [];
        const response = await page.goto(base + route, {waitUntil:'networkidle'});
        assert.ok([200,304].includes(response.status()),`${route}: HTTP ${response.status()}`);
        assert.equal(await page.locator('h1').count(),1,route);
        assert.ok(await page.locator('h1').isVisible(),route);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
        assert.equal(overflow,false,`${engine} ${width} ${route}: horizontal overflow`);
        const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
        assert.equal(new URL(canonical).pathname.replace(/\/$/,''),route.replace(/\/$/,''));
        for (const href of await page.locator('main a[href^="/"]').evaluateAll(as => as.map(a => a.getAttribute('href')))) {
          const pathname = href.split(/[?#]/)[0];
          assert.ok(routes.includes(pathname), `Broken internal route ${href}`);
        }
        if (route === '/') {
          assert.equal(await page.locator('[data-jornada] > ol > li').count(),4);
          assert.match(await page.locator('h1').innerText(),/Administração estratégica/);
          if (width >= 1280) {
            const nav = await page.getByRole('navigation',{name:'Principal',exact:true}).boundingBox();
            const logo = await page.locator('header a[aria-label="Transacione — página inicial"]').boundingBox();
            const cta = await page.locator('header a[href^="mailto:"]').first().boundingBox();
            assert.ok(logo.x + logo.width < nav.x && nav.x + nav.width < cta.x, 'Header overlaps');
          } else {
            await page.locator('summary[aria-label="Abrir menu"]').click();
            assert.ok(await page.getByRole('navigation',{name:'Principal (móvel)',exact:true}).getByRole('link',{name:'Precatórios',exact:true}).isVisible());
            await page.locator('summary[aria-label="Abrir menu"]').click();
          }
        }
        if (route === '/precatorios') {
          assert.equal(await page.locator('#federal ol > li').count(),10);
          await page.getByRole('link',{name:'Precatório federal',exact:true}).click();
          await page.waitForFunction(() => Math.abs(document.querySelector('#federal').getBoundingClientRect().top - 96) < 5);
        }
        assert.deepEqual(errors,[],`${engine} ${width} ${route}`);
        const timing = await page.evaluate(() => ({
          fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
          load: performance.getEntriesByType('navigation')[0]?.loadEventEnd,
          ttfb: performance.getEntriesByType('navigation')[0]?.responseStart,
        }));
        results.push({engine,width,route,...timing});
        if (report && [390,1440].includes(width) && ['/','/precatorios'].includes(route)) {
          await page.evaluate(() => scrollTo(0,0));
          await page.screenshot({path:path.join(report,`${engine}-${width}-${route === '/' ? 'home' : 'precatorios'}.png`),fullPage:true});
        }
      }
      console.log(JSON.stringify({engine,width,status:'passed'}));
    }
    // Direct entry with an anchor must also work after hydration and without JS.
    for (const javaScriptEnabled of [true,false]) {
      const direct = await browser.newContext({javaScriptEnabled,viewport:{width:390,height:844}});
      const p = await direct.newPage();
      await p.goto(base + '/precatorios#estadual',{waitUntil:'networkidle'});
      // Poll from Node: requestAnimationFrame polling cannot run with page JS disabled.
      let top;
      for (let attempt = 0; attempt < 20; attempt++) {
        top = await p.locator('#estadual').evaluate(e => e.getBoundingClientRect().top);
        if (Math.abs(top - 96) < 10) break;
        await new Promise(resolve => setTimeout(resolve, 150));
      }
      assert.ok(Math.abs(top - 96) < 10, `${engine}, JS=${javaScriptEnabled}: anchor top=${top}`);
      await direct.close();
    }
    await browser.close();
  }
  if (report) fs.writeFileSync(path.join(report,'browser-results.json'),JSON.stringify({base,results},null,2));
  console.log(`${results.length} page/viewport checks passed, plus native anchor navigation.`);
})().catch(e => { console.error(e); process.exit(1); });
