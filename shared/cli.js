import {readFile} from 'node:fs/promises';
import {evaluate} from './providers.js';
import {previewResult} from './engine.js';
export async function run(url) {
  const demo = JSON.parse(await readFile(url,'utf8'));
  const live = process.argv.includes('--live');
  const scenarioArg = process.argv.find(a => a.startsWith('--scenario='));
  const index = scenarioArg ? Number(scenarioArg.split('=')[1]) : 0;
  if (!Number.isInteger(index) || !demo.scenarios[index]) throw new Error('Invalid scenario index.');
  const baseline = process.argv.includes('--text') ? 'text' : 'structured';
  const results = await Promise.all(['jev','openai'].map(async provider => {
    try { return live ? await evaluate(demo,demo.scenarios[index].state,provider,baseline) : previewResult(demo,index,provider); }
    catch(error) { process.exitCode = 1; return {provider,error:error.message}; }
  }));
  console.log(JSON.stringify({id:demo.id,scenario:demo.scenarios[index].name,results},null,2));
}
