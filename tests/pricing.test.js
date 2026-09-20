import test from 'node:test';
import assert from 'node:assert/strict';
import {estimateCost} from '../shared/pricing.js';
const astra = (usage,service_tier='default') => estimateCost('openai',{model:'gpt-6-astra',usage,service_tier});
test('Jev bills input only at the documented rate',()=>{
 const r=estimateCost('jev',{model:'jev-1.13.0',usage:{input_tokens:1000,output_tokens:80}});
 assert.equal(r.usd,0.000042);assert.equal(r.breakdownUsd.output,0);assert.equal(r.verifiedAt,'2026-09-20');
});
test('Astra partitions normal, cached and cache-write input; reasoning is not counted twice',()=>{
 const r=astra({input_tokens:1000,output_tokens:200,input_tokens_details:{cached_tokens:400,cache_write_tokens:100},output_tokens_details:{reasoning_tokens:150}});
 assert.deepEqual(r.tokens,{input:500,cachedInput:400,cacheWrite:100,output:200});
 assert.ok(Math.abs(r.usd-0.01665)<1e-12);
});
test('missing cache details, zero usage, returned tiers and long context',()=>{
 assert.equal(astra({input_tokens:1000,output_tokens:100}).usd,0.015);
 assert.equal(astra({input_tokens:0,output_tokens:0}).usd,0);
 assert.equal(astra({input_tokens:1000,output_tokens:100},'flex').usd,0.0075);
 assert.equal(astra({input_tokens:1000,output_tokens:100},'priority').usd,0.03);
 assert.equal(astra({input_tokens:272000,output_tokens:0}).ratesPerMillion.input,10);
 assert.equal(astra({input_tokens:272001,output_tokens:0}).ratesPerMillion.input,20);
 assert.equal(astra({input_tokens:272001,output_tokens:0}).ratesPerMillion.output,75);
});
test('unknown models, tiers, missing/invalid usage never silently look free',()=>{
 for(const usage of [undefined,{input_tokens:10},{input_tokens:-1,output_tokens:1},{input_tokens:'10',output_tokens:1},{input_tokens:1,output_tokens:NaN},{input_tokens:10,output_tokens:1,input_tokens_details:{cached_tokens:9,cache_write_tokens:2}}])assert.equal(astra(usage).usd,null);
 assert.equal(astra({input_tokens:10,output_tokens:1},'scale').status,'unavailable');
 assert.equal(estimateCost('jev',{model:'jev-2.0',usage:{input_tokens:10,output_tokens:1}}).usd,null);
 assert.equal(estimateCost('openai',{model:'another-model',usage:{input_tokens:10,output_tokens:1}}).usd,null);
});
