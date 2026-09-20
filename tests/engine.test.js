import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {answerSchema,validateValues,jevValues,previewResult,decision,scenePolicy} from '../shared/engine.js';
import {scene} from '../shared/visual.js';
import {evaluate} from '../shared/providers.js';
const root = new URL('../',import.meta.url);
const catalog=JSON.parse(await readFile(new URL('shared/catalog.json',root),'utf8'));
const demos=await Promise.all(catalog.map(d=>readFile(new URL(`use-cases/${d.id}/scenario.json`,root),'utf8').then(JSON.parse)));
test('50 independent folders, 100 valid fixtures, complete typed questions and visual outputs',async()=>{
 assert.equal(demos.length,50);assert.equal(new Set(demos.map(d=>d.id)).size,50);
 assert.deepEqual((await readdir(new URL('use-cases/',root))).sort(),demos.map(d=>d.id).sort());
 for(const d of demos){
  assert.equal(d.scenarios.length,2);assert.ok(d.sources.length);assert.ok(d.why);assert.ok(d.limitation);
  for(const q of Object.values(d.questions)){assert.ok(['choice','score','noul'].includes(q.type));assert.ok(q.instructions);if(q.type==='choice')assert.ok(Object.keys(q.criteria).length<=255);if(q.type==='score')assert.ok(q.criteria.length>=2&&q.criteria.length<=10);}
  for(let i=0;i<d.scenarios.length;i++)for(const provider of ['jev','openai']){
   const r=previewResult(d,i,provider);validateValues(d.questions,r.values);assert.equal(r.latencyMs,null);assert.equal(r.usage,null);assert.ok(r.decision.label);assert.ok(!/undefined|NaN/.test(r.decision.label));
   const svg=scene(d,r,d.scenarios[i].state);assert.ok(svg.startsWith('<svg'));assert.ok(!/undefined|NaN/.test(svg));
  }
  const schema=answerSchema(d.questions);assert.equal(schema.additionalProperties,false);assert.deepEqual(schema.required,Object.keys(d.questions));
 }
});
test('lecture example keeps the exact ticket and three distinct primitives',()=>{
 const d=demos[0];assert.equal(d.scenarios[0].state,'My flight was cancelled and I need a refund before Friday, this is honestly ridiculous.');
 assert.deepEqual(Object.values(d.questions).map(q=>q.type),['choice','noul','score']);
 const a=d.scenarios[0].previewAnswers;assert.equal(a.refund.confidence,undefined);assert.ok(a.frustration.score%1!==0);
 assert.deepEqual(jevValues(d.questions,{answers:a}),d.scenarios[0].expected);
});
test('rejects invalid labels, types, nonfinite values, missing and extra outputs',()=>{
 const q={x:{type:'choice',criteria:{yes:'Yes',no:'No'}},y:{type:'noul'}};
 for(const value of [{x:'invented',y:.5},{x:'yes',y:'0.5'},{x:'yes',y:Infinity},{x:'yes',y:1.1},{x:'yes'},{x:'yes',y:.5,z:0}])assert.throws(()=>validateValues(q,value));
 assert.throws(()=>jevValues({x:q.x},{answers:{x:{type:'choice',choice:'yes',confidence:.5,probabilities:{yes:.4,no:.4}}}}));
});
test('composite scores, independent labels, confidence gating and skill suppression',()=>{
 const find=s=>demos.find(d=>d.id.endsWith(s));
 assert.equal(previewResult(find('response-quality'),0,'jev').decision.score,2);
 assert.equal(previewResult(find('map-reduce-classification'),1,'jev').decision.counts.bug,2);
 assert.equal(previewResult(find('confidence-escalation'),1,'jev').decision.target,'review');
 assert.equal(previewResult(find('confidence-escalation'),1,'openai').decision.target,'technical');
 assert.equal(previewResult(find('skill-selection'),1,'jev').decision.target,'none');
 assert.equal(previewResult(find('speculative-fanout'),1,'jev').decision.label,'technical');
 assert.equal(previewResult(find('rag-passage-filter'),1,'jev').decision.target,'review');
});
test('the same hard scene constraints override unsafe candidates from either provider',()=>{
 const d=demos.find(d=>d.scene==='driving');
 assert.equal(scenePolicy(d,{ahead:'obstacle',left:'occupied'},{values:{maneuver:'left'},decision:{target:'left'}}).decision.target,'brake');
 const t=demos.find(d=>d.scene==='traffic');
 assert.equal(scenePolicy(t,{crossing:'pedestrian'},{values:{phase:'east_west'},decision:{target:'east_west'}}).decision.target,'all_red');
});
test('OpenAI uses Responses with exact model, same state/questions and strict schema',async()=>{
 let payload;
 const d=demos[0],state=d.scenarios[0].state;
 const result=await evaluate(d,state,'openai','structured',{env:{OPENAI_API_KEY:'test'},openai:{responses:{create:async p=>{payload=p;return {status:'completed',model:p.model,output_text:JSON.stringify(d.scenarios[0].expected),usage:{input_tokens:10,output_tokens:20}};}}}});
 assert.equal(payload.model,'gpt-4o-mini');assert.equal(payload.store,false);assert.equal(payload.service_tier,'default');assert.equal(result.cost.status,'estimated');assert.equal(payload.text.format.strict,true);
 assert.deepEqual(JSON.parse(payload.input),{state,questions:d.questions});assert.deepEqual(result.answers,{});assert.ok(result.latencyMs>=0);
});
test('Jev sends the documented payload and preserves native answers',async()=>{
 let request;
 const d=demos[0];const result=await evaluate(d,d.scenarios[0].state,'jev','structured',{env:{TYPESAFE_API_KEY:'test'},fetch:async(url,options)=>{request={url,options};return {ok:true,json:async()=>({model:'jev-test',answers:d.scenarios[0].previewAnswers,usage:{input_tokens:11,output_tokens:12}})};}});
 assert.equal(request.url,'https://api.typesafe.ai/v1/systemone');assert.equal(request.options.headers.Authorization,'Bearer test');
 assert.deepEqual(JSON.parse(request.options.body),{state:d.scenarios[0].state,model:'jev-latest',questions:d.questions});assert.equal(result.answers.refund.noul,.95);
});
test('plain-text baseline is still validated; failures never masquerade as fixture results',async()=>{
 const d=demos[0];let payload;
 await assert.rejects(evaluate(d,'state','openai','text',{env:{OPENAI_API_KEY:'test'},openai:{responses:{create:async p=>{payload=p;return {status:'completed',output_text:'Here is a paragraph.'};}}}}),/validation/);
 assert.equal(payload.text,undefined);
 await assert.rejects(evaluate(d,'state','openai','structured',{env:{OPENAI_API_KEY:'test'},openai:{responses:{create:async()=>({status:'incomplete'})}}}),/incomplete/);
 await assert.rejects(evaluate(d,'state','jev','structured',{env:{}}),/TYPESAFE_API_KEY/);
 await assert.rejects(evaluate(d,'state','jev','structured',{env:{TYPESAFE_API_KEY:'secret'},fetch:async()=>({ok:false,status:429})}),/HTTP 429/);
 await assert.rejects(evaluate(d,'state','jev','structured',{env:{TYPESAFE_API_KEY:'secret'},fetch:async()=>{throw new Error('secret upstream body');}}),e=>!e.message.includes('secret'));
});
test('generated pages have distinct titles, descriptions, source links and crawlable content',async()=>{
 const titles=new Set();
 for(const d of demos){const html=await readFile(new URL(`use-cases/${d.id}/index.html`,root),'utf8');const title=html.match(/<title>(.*?)<\/title>/)[1];assert.ok(!titles.has(title));titles.add(title);assert.match(html,/name="description"/);assert.match(html,/application\/ld\+json/);assert.match(html,/<h1>/);for(const s of d.sources)assert.ok(html.includes(s.url));assert.ok(html.includes('scenario.json')===false);}
});
