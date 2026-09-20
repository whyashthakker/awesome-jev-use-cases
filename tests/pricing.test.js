import test from 'node:test';
import assert from 'node:assert/strict';
import {estimateCost} from '../shared/pricing.js';
const mini = (usage,service_tier='default',model='gpt-4o-mini') => estimateCost('openai',{model,usage,service_tier});
test('Jev bills input only at the documented rate',()=>{
 const r=estimateCost('jev',{model:'jev-1.13.0',usage:{input_tokens:1000,output_tokens:80}});
 assert.equal(r.usd,0.000042);assert.equal(r.breakdownUsd.output,0);assert.equal(r.verifiedAt,'2026-09-20');
});
test('GPT-4o Mini partitions ordinary and cached input without a cache-write surcharge',()=>{
 const r=mini({input_tokens:1000,output_tokens:200,input_tokens_details:{cached_tokens:400,cache_write_tokens:100}});
 assert.deepEqual(r.tokens,{input:500,cachedInput:400,cacheWrite:100,output:200});
 assert.ok(Math.abs(r.usd-0.00024)<1e-12);
 assert.equal(r.ratesPerMillion.cacheWrite,0.15);
});
test('missing cache details, zero usage and the returned model snapshot',()=>{
 const usage={input_tokens:1000,output_tokens:100};
 assert.ok(Math.abs(mini(usage).usd-0.00021)<1e-12);
 assert.equal(mini({input_tokens:0,output_tokens:0}).usd,0);
 assert.equal(mini(usage,'default','gpt-4o-mini-2024-07-18').usd,mini(usage).usd);
 assert.equal(mini(usage,'default','gpt-4o-mini-unknown').status,'unavailable');
});
test('unknown models, tiers, missing/invalid usage never silently look free',()=>{
 for(const usage of [undefined,{input_tokens:10},{input_tokens:-1,output_tokens:1},{input_tokens:'10',output_tokens:1},{input_tokens:1,output_tokens:NaN},{input_tokens:10,output_tokens:1,input_tokens_details:{cached_tokens:9,cache_write_tokens:2}}])assert.equal(mini(usage).usd,null);
 for(const tier of ['scale','flex','priority','fast'])assert.equal(mini({input_tokens:10,output_tokens:1},tier).status,'unavailable');
 assert.equal(estimateCost('jev',{model:'jev-2.0',usage:{input_tokens:10,output_tokens:1}}).usd,null);
 assert.equal(estimateCost('openai',{model:'another-model',usage:{input_tokens:10,output_tokens:1}}).usd,null);
});
