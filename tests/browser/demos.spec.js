import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
const catalog=JSON.parse(await readFile(new URL('../../shared/catalog.json',import.meta.url),'utf8'));
for(const demo of catalog) {
 test(`${demo.id}: both fixtures render without overflow or browser errors`,async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`/use-cases/${demo.id}/`);
  await expect(page.locator('h1')).toHaveText(demo.title);
  // Let the module bind its controls before interacting.
  await expect(page.locator('#key-status')).toContainText('missing');
  for(const index of ['0','1']){
   await page.locator('#scenario').selectOption(index);
   await page.locator('#run').click();
   for(const provider of ['jev','openai']){
    await expect(page.locator(`#${provider} .decision`)).not.toHaveText('Ready when you are');
    await expect(page.locator(`#${provider} .metrics`)).toContainText('PREVIEW FIXTURE');
    await expect(page.locator(`#${provider} .visual svg`)).toBeVisible();
    await expect(page.locator(`#${provider} .answers`)).not.toBeEmpty();
   }
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  expect(errors).toEqual([]);
 });
}
test('gallery filters and navigation',async({page},testInfo)=>{
 await page.goto('/');await expect(page.locator('.card')).toHaveCount(50);
 await page.getByRole('searchbox').fill('autonomous');await expect(page.locator('.card:visible')).toHaveCount(1);
 await page.getByRole('searchbox').fill('zzzzzz');await expect(page.locator('#empty')).toBeVisible();
 await page.getByRole('searchbox').fill('');await page.locator('#category').selectOption('Simulation');await expect(page.locator('.card:visible')).toHaveCount(5);
 await page.locator('#category').selectOption('');
 await page.screenshot({path:`test-results/gallery-${testInfo.project.name}.png`,fullPage:false});
 await page.getByRole('link',{name:/Start with/}).click();await expect(page.locator('#primitive')).toBeVisible();
});
test('lecture runs all three primitives and each individual mode',async({page},testInfo)=>{
 await page.goto('/use-cases/01-support-ticket-routing/');await expect(page.locator('#key-status')).toContainText('missing');
 await page.locator('#run').click();await expect(page.locator('#jev .answer')).toHaveCount(3);
 await expect(page.locator('#jev .answers')).toContainText('billing 87%');await expect(page.locator('#jev .answers')).toContainText('1.65');
 await page.screenshot({path:`test-results/lecture-${testInfo.project.name}.png`,fullPage:true});
 for(const type of ['choice','noul','score']){
  await page.locator('#primitive').selectOption(type);await page.locator('#run').click();
  await expect(page.locator('#jev .answer')).toHaveCount(1);await expect(page.locator('#openai .answer')).toHaveCount(1);
  await expect(page.locator('#jev .answer .tag')).toHaveText(type);
 }
});
test('missing keys stay errors in live mode, never fixture data',async({page})=>{
 await page.goto('/use-cases/01-support-ticket-routing/');await expect(page.locator('#key-status')).toContainText('missing');
 await page.locator('#mode').selectOption('live');await page.locator('#run').click();
 await expect(page.locator('#jev .decision')).toContainText('TYPESAFE_API_KEY');await expect(page.locator('#openai .decision')).toContainText('OPENAI_API_KEY');
 await expect(page.locator('#jev .answers')).toBeEmpty();await expect(page.locator('#status')).toContainText('failed');
});
test('live panels complete independently, preserve native distributions, and export the exact edited state',async({page})=>{
 const state='A changed ticket about a refund.';
 await page.route('**/api/evaluate',async route=>{
  const body=route.request().postDataJSON();expect(body.state).toBe(state);
  const isJev=body.provider==='jev';
  if(!isJev)await new Promise(r=>setTimeout(r,200));
  await route.fulfill({json:{provider:body.provider,mode:'live',latencyMs:isJev?125:300,model:isJev?'jev-test':'gpt-6-astra',usage:{input_tokens:30,output_tokens:10},values:{department:'billing',refund:.9,frustration:1.5},answers:isJev?{department:{type:'choice',choice:'billing',confidence:.9,probabilities:{billing:.9,technical:.1,sales:0}}}:{},decision:{label:'Billing',target:'billing'},note:'Mocked transport for browser test'}});
 });
 await page.goto('/use-cases/01-support-ticket-routing/');await expect(page.locator('#key-status')).toContainText('missing');
 await page.locator('#state').fill(state);await page.locator('#mode').selectOption('live');await page.locator('#run').click();
 await expect(page.locator('#jev .metrics')).toContainText('125 ms');await expect(page.locator('#openai .metrics')).toContainText('300 ms');
 await expect(page.locator('#jev .answers')).toContainText('native confidence 0.90');
 await page.locator('.options summary').click();const downloaded=page.waitForEvent('download');await page.locator('#export').click();const download=await downloaded;
 const stream=await download.createReadStream();let body='';for await(const chunk of stream)body+=chunk;const exported=JSON.parse(body);expect(exported.state).toBe(state);expect(exported.results.openai.model).toBe('gpt-6-astra');
});
