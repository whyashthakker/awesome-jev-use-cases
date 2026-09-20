export function answerSchema(questions) {
  const properties = Object.fromEntries(Object.entries(questions).map(([id, q]) => [id,
    q.type === 'choice' ? {type: 'string', enum: Object.keys(q.criteria)} :
      {type: 'number', minimum: 0, maximum: q.type === 'noul' ? 1 : q.criteria.length - 1}
  ]));
  return {type: 'object', properties, required: Object.keys(properties), additionalProperties: false};
}
export function validateValues(questions, values) {
  if (!values || typeof values !== 'object' || Array.isArray(values) || Object.keys(values).length !== Object.keys(questions).length) throw new Error('Response does not match the question set.');
  for (const [id, q] of Object.entries(questions)) {
    const v = values[id];
    if (q.type === 'choice' ? !Object.hasOwn(q.criteria, v) || typeof v !== 'string' : typeof v !== 'number' || !Number.isFinite(v) || v < 0 || v > (q.type === 'noul' ? 1 : q.criteria.length - 1)) throw new Error(`Invalid answer for ${id}.`);
  }
  return values;
}
export function jevValues(questions, raw) {
  const values = {};
  for (const [id, q] of Object.entries(questions)) {
    const a = raw.answers?.[id];
    if (a?.type !== q.type) throw new Error(`Invalid Jev answer type for ${id}.`);
    values[id] = a[q.type];
    if (q.type !== 'noul') {
      if (!Number.isFinite(a.confidence) || a.confidence < 0 || a.confidence > 1) throw new Error(`Invalid confidence for ${id}.`);
      const keys = q.type === 'choice' ? Object.keys(q.criteria) : q.criteria.map((_, i) => String(i));
      if (!a.probabilities || Object.keys(a.probabilities).length !== keys.length || keys.some(k => !Number.isFinite(a.probabilities[k]) || a.probabilities[k] < 0 || a.probabilities[k] > 1) || Math.abs(Object.values(a.probabilities).reduce((s,v) => s+v,0)-1) > 0.02) throw new Error(`Invalid probability distribution for ${id}.`);
    }
  }
  return validateValues(questions, values);
}
export function decision(demo, values, answers = {}) {
  const p = demo.policy;
  if (demo.scene === 'batch') {
    const counts = Object.values(values).reduce((out,v) => ({...out,[v]:(out[v] || 0)+1}),{});
    return {label:Object.entries(counts).map(([k,n])=>`${k}: ${n}`).join(' · '), target:'batch', counts};
  }
  if (p.kind === 'fanout') return {label:values.intent === 'refund' ? `Refund · ${values.refund_reason}${values.urgent >= .8 ? ' · urgent' : ''}` : values.intent, target:values.intent};
  if (p.kind === 'date') return {label:`${values.month} ${values.day.replace('d','')} · year unspecified`,target:values.month};
  if (p.require && values[p.require] < 0.8) return {label:'No skill selected',target:'none'};
  if (p.kind === 'rank') {
    const ranking = p.keys.slice().sort((a,b) => values[b] - values[a]);
    return {label: demo.labels[ranking[0]], target: ranking[0], ranking};
  }
  if (p.kind === 'composite') {
    const score = p.keys.reduce((s,k,i) => s + values[k] * p.weights[i], 0);
    return {label: `${score.toFixed(2)} / ${p.max} · ${score >= p.threshold ? p.high : p.low}`, target: score >= p.threshold ? 'high' : 'low', score, max:p.max};
  }
  if (p.guard && values[p.guard] >= 0.5) return {label:p.guardLabel, target:p.guardTarget};
  if (p.confidence && answers[p.key]?.confidence < p.confidence) return {label:'Human review · low confidence', target:'review'};
  const v = values[p.key];
  if (p.kind === 'choice') return {label:demo.labels[v] || v, target:v};
  if (p.kind === 'noul') return {label:v >= p.high ? p.yes : v <= p.low ? p.no : 'Human review · uncertain', target:v >= p.high ? 'yes' : v <= p.low ? 'no' : 'review', score:v, max:1};
  return {label:`${v.toFixed(2)} / ${p.max} · ${v >= p.threshold ? p.high : p.low}`, target:v >= p.threshold ? 'high' : 'low', score:v, max:p.max};
}
export function previewResult(demo, index, provider) {
  const fixture = demo.scenarios[index];
  return scenePolicy(demo,fixture.state,{provider, mode:'preview', model:'Hand-authored fixture', values:fixture.expected, answers:provider === 'jev' ? (fixture.previewAnswers || {}) : {}, latencyMs:null, usage:null, cost:{status:'preview',usd:0,currency:'USD',note:'No API call.'}, decision:decision(demo, fixture.expected, provider === 'jev' ? (fixture.previewAnswers || {}) : {}), note:'Illustrative fixture shared by both panels. No model was called; this is not a benchmark.'});
}

export function scenePolicy(demo,state,result) {
  let override;
  if(demo.scene === 'traffic' && (state?.crossing !== 'clear' || state?.emergency_hold)) override = {label:'All red · crossing interlock',target:'all_red'};
  if(demo.scene === 'driving' && ((result.values.maneuver === 'left' && state?.left !== 'verified clear') || (result.values.maneuver === 'cruise' && state?.ahead !== 'clear'))) override = {label:'Brake · lane interlock',target:'brake'};
  return override ? {...result,proposedDecision:result.decision,decision:override} : result;
}
