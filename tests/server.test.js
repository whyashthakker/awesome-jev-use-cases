import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
const port=3197,base=`http://127.0.0.1:${port}`;
let child;
test.before(async()=>{
 child=spawn(process.execPath,['server.js'],{cwd:new URL('../',import.meta.url),env:{...process.env,PORT:String(port),TYPESAFE_API_KEY:'',OPENAI_API_KEY:''},stdio:['ignore','pipe','pipe']});
 await Promise.race([once(child.stdout,'data'),once(child,'exit').then(()=>{throw new Error('Server exited');}),new Promise((_,reject)=>{const timer=setTimeout(()=>reject(new Error('Server did not start')),5000);timer.unref();})]);
});
test.after(()=>child?.kill());
test('static server never serves credentials, source code or traversal targets',async()=>{
 for(const pathname of ['/.env','/.git/config','/server.js','/shared/providers.js','/package.json','/%2e%2e/.env'])assert.equal((await fetch(base+pathname)).status,404);
 assert.equal((await fetch(base+'/')).status,200);
 assert.deepEqual(await (await fetch(base+'/api/status')).json(),{jev:false,openai:false});
});
test('rejects cross-origin paid calls and invalid requests; missing keys fail explicitly',async()=>{
 const body=JSON.stringify({id:'01-support-ticket-routing',state:'hello',provider:'jev',baseline:'structured'});
 assert.equal((await fetch(base+'/api/evaluate',{method:'POST',headers:{'Content-Type':'application/json'},body})).status,403);
 const headers={'Content-Type':'application/json',Origin:base,'X-Demo-Request':'1'};
 assert.equal((await fetch(base+'/api/evaluate',{method:'POST',headers,body:'{'})).status,400);
 assert.equal((await fetch(base+'/api/evaluate',{method:'POST',headers,body:JSON.stringify({id:'bad'})})).status,400);
 const response=await fetch(base+'/api/evaluate',{method:'POST',headers,body});assert.equal(response.status,502);assert.match((await response.json()).error,/TYPESAFE_API_KEY/);
});
