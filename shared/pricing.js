// Public text-token list prices, verified 2026-09-20. Estimates, not invoices.
const verifiedAt = '2026-09-20';
const sources = {
  jev: 'https://docs.typesafe.ai/models',
  openai: 'https://developers.openai.com/api/docs/models/gpt-4o-mini',
};
const count = n => Number.isSafeInteger(n) && n >= 0;

export function estimateCost(provider, response) {
  const unavailable = reason => ({status:'unavailable', usd:null, currency:'USD', reason});
  const {model, usage} = response;
  if (!usage || !count(usage.input_tokens) || !count(usage.output_tokens)) return unavailable('Provider token usage is missing or invalid.');
  let rates, cached = 0, written = 0, tier = 'standard';
  if (provider === 'jev' && ['jev-1.13.0','jev-latest','jev-preview'].includes(model)) {
    rates = {input:0.042, cachedInput:0.042, cacheWrite:0.042, output:0};
  } else if (provider === 'openai' && ['gpt-4o-mini','gpt-4o-mini-2024-07-18'].includes(model)) {
    tier = response.service_tier ?? 'default';
    if (tier !== 'default') return unavailable('No verified rate for this service tier.');
    const details = usage.input_tokens_details;
    cached = details?.cached_tokens ?? 0;
    written = details?.cache_write_tokens ?? 0;
    if (!count(cached) || !count(written) || cached + written > usage.input_tokens) return unavailable('Invalid cache token breakdown.');
    // GPT-4o Mini has no separate cache-write surcharge or long-context rate.
    rates = {input:0.15, cachedInput:0.075, cacheWrite:0.15, output:0.60};
  } else return unavailable('No verified price for the returned model. Update shared/pricing.js.');
  const tokens = {input:usage.input_tokens - cached - written, cachedInput:cached, cacheWrite:written, output:usage.output_tokens};
  // output_tokens already includes reasoning; never add reasoning_tokens again.
  const breakdownUsd = Object.fromEntries(Object.entries(tokens).map(([key,n]) => [key,n * rates[key] / 1_000_000]));
  return {
    status:'estimated', currency:'USD', usd:Object.values(breakdownUsd).reduce((sum,n)=>sum+n,0),
    tokens, ratesPerMillion:rates, breakdownUsd, model, serviceTier:tier,
    verifiedAt, source:sources[provider],
    note:'Estimated token cost at published list prices; excludes taxes, credits and negotiated rates. Missing cache counts are treated as zero.',
  };
}
