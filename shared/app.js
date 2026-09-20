import {previewResult, decision, scenePolicy} from './engine.js';
import {scene} from './visual.js';
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
if ($('#gallery')) {
  const cards = [...document.querySelectorAll('.card')];
  function filter() {
    const query = $('#search').value.toLowerCase().trim(), category = $('#category').value;
    let visible = 0;
    for(const card of cards){ const show = card.textContent.toLowerCase().includes(query) && (!category || card.dataset.category===category);card.hidden=!show;if(show)visible++; }
    $('#count').textContent=`${visible} / 50 demos`;$('#empty').hidden=visible>0;
  }
  $('#search').addEventListener('input',filter);$('#category').addEventListener('change',filter);
} else if ($('#demo')) {
  const demo = await fetch('./scenario.json').then(r=>r.json());
  let index=0, records={}, current=demo, currentState=demo.scenarios[0].state, version=0;
  const primitive = () => $('#primitive')?.value || 'all';
  function selectedDemo() {
    const d = structuredClone(demo);
    if(primitive()!=='all') {
      d.questions=Object.fromEntries(Object.entries(d.questions).filter(([,q])=>q.type===primitive()));
      const [key,q]=Object.entries(d.questions)[0];
      if(q.type!=='choice'){d.labels={};d.scene=q.type==='score'?'gauge':'gate';}
      d.policy=q.type==='choice'?{kind:'choice',key}:q.type==='noul'?{kind:'noul',key,low:.2,high:.8,yes:'Refund requested',no:'No refund request'}:{kind:'score',key,max:2,threshold:1.5,high:'Very frustrated',low:'Lower frustration'};
    }
    return d;
  }
  function render(provider,result,error) {
    const panel=$(`#${provider}`);
    panel.querySelector('.visual').innerHTML=scene(current,result,currentState);
    panel.querySelector('.decision').textContent=error || result?.decision.label || 'Ready when you are';
    panel.querySelector('.decision').classList.toggle('error',!!error);
    panel.querySelector('.metrics').textContent=result ? result.mode==='preview'?'PREVIEW FIXTURE · no timing or tokens':`${result.latencyMs} ms · ${result.usage?.input_tokens ?? '—'} input / ${result.usage?.output_tokens ?? '—'} output tokens`:'No API call yet';
    panel.querySelector('.result-note').textContent=result?.note || '';
    panel.querySelector('.answers').innerHTML=result?Object.entries(current.questions).map(([key,q])=>{
      const a=result.answers?.[key],v=result.values[key];
      let detail = q.type==='noul'?'Probability / estimate of yes · 0.5 means uncertainty':q.type==='score'?`Rubric 0–${q.criteria.length-1} · ${q.criteria.join(' → ')}`:'One known option';
      if(a?.confidence!==undefined)detail+=` · ${result.mode==='preview'?'illustrative':'native'} confidence ${a.confidence.toFixed(2)}`;
      const dist=a?.probabilities?`<div class="distribution" aria-hidden="true">${Object.values(a.probabilities).map(p=>`<span style="width:${p*100}%"></span>`).join('')}</div><small>${Object.entries(a.probabilities).map(([label,p])=>`${esc(a.legend?.[label] || label)} ${(p*100).toFixed(0)}%`).join(' · ')}</small>`:'';
      return `<div class="answer"><div class="answer-top"><span>${esc(key)} <span class="tag">${esc(q.type)}</span></span><strong>${esc(typeof v==='number'?v.toFixed(2):v)}</strong></div><small>${esc(detail)}</small>${dist}</div>`;
    }).join(''):'';
    panel.querySelector('pre').textContent=JSON.stringify(result || {error:error || 'Run to see the response.'},null,2);
  }
  function reset() {
    version++;current=selectedDemo();records={};$('#export').disabled=true;
    currentState=demo.scenarios[index].state;
    for(const provider of ['jev','openai'])render(provider);
    $('#status').textContent=$('#mode').value==='preview'?'Preview uses the selected fixture. Switch to live to evaluate edited input.':'Live sends the same input to both providers. Each run makes two paid requests.';
  }
  function choose() {index=Number($('#scenario').value);$('#state').value=typeof demo.scenarios[index].state==='string'?demo.scenarios[index].state:JSON.stringify(demo.scenarios[index].state,null,2);reset();}
  $('#scenario').addEventListener('change',choose);
  $('#primitive')?.addEventListener('change',reset);
  $('#mode').addEventListener('change',reset);$('#baseline').addEventListener('change',reset);
  $('#state').addEventListener('input',reset);
  $('#run').addEventListener('click',async()=>{
    const mode=$('#mode').value;
    current=selectedDemo();
    if(mode==='live'){
      try {currentState=typeof demo.scenarios[index].state==='string'?$('#state').value:JSON.parse($('#state').value);}
      catch {$('#status').textContent='Input must be valid JSON. Fix it before running.';return;}
    } else currentState=demo.scenarios[index].state;
    const runVersion=++version;
    $('#run').disabled=true;$('#export').disabled=true;records={};
    $('#status').textContent=mode==='live'?'Running both providers…':'Showing the same authored fixture in both panels. This is not model output.';
    for(const p of ['jev','openai'])render(p,null,mode==='live'?'Waiting for provider…':null);
    const baseline=$('#baseline').value,selection=primitive();
    await Promise.all(['jev','openai'].map(async provider=>{
      try {
        let result;
        if(mode==='preview') {
          result=previewResult(demo,index,provider);
          result.values=Object.fromEntries(Object.entries(result.values).filter(([key])=>Object.hasOwn(current.questions,key)));
          result.answers=Object.fromEntries(Object.entries(result.answers).filter(([key])=>Object.hasOwn(current.questions,key)));
          result.decision=decision(current,result.values,result.answers);
          result=scenePolicy(current,currentState,result);
        } else {
          const response=await fetch('/api/evaluate',{method:'POST',headers:{'Content-Type':'application/json','X-Demo-Request':'1'},body:JSON.stringify({id:demo.id,state:currentState,provider,baseline,primitive:selection})});
          const data=await response.json();if(!response.ok)throw new Error(data.error || 'Request failed.');result=data;
        }
        if(runVersion!==version)return;
        records[provider]=result;render(provider,result);
      } catch(error) {if(runVersion!==version)return;records[provider]={error:error.message};render(provider,null,error.message);}
    }));
    $('#run').disabled=false;
    if(runVersion!==version)return;
    $('#export').disabled=false;
    if(mode==='live')$('#status').textContent=Object.values(records).some(r=>r.error)?'One or more providers failed. Successful results remain visible.':'Complete. Timings are single client-observed requests, not a benchmark.';
  });
  $('#export').addEventListener('click',()=>{
    const blob=new Blob([JSON.stringify({id:demo.id,at:new Date().toISOString(),state:currentState,questions:current.questions,results:records},null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=`${demo.id}-comparison.json`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
  choose();
  try {const r=await fetch('/api/status');if(r.ok){const status=await r.json();$('#key-status').textContent=`Jev key ${status.jev?'configured':'missing'} · OpenAI key ${status.openai?'configured':'missing'}`;}else throw new Error();}
  catch {$('#key-status').textContent='Static preview. Run npm start locally to enable live comparisons.';$('#mode').querySelector('[value="live"]').disabled=true;}
}
