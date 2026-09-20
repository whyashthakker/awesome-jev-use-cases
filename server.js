import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {evaluate} from './shared/providers.js';
const root = path.dirname(fileURLToPath(import.meta.url));
const catalog = JSON.parse(await readFile(path.join(root,'shared/catalog.json'),'utf8'));
const ids = new Set(catalog.map(d=>d.id));
const port = Number(process.env.PORT || 3000);
const origin = `http://127.0.0.1:${port}`;
const allowedHosts = new Set([`127.0.0.1:${port}`,`localhost:${port}`]);
const publicFiles = new Set(['index.html','shared/style.css','shared/app.js','shared/visual.js','shared/engine.js','shared/catalog.json','llms.txt','robots.txt','sitemap.xml','social.svg']);
for (const id of ids) for(const file of ['index.html','scenario.json']) publicFiles.add(`use-cases/${id}/${file}`);
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.txt':'text/plain; charset=utf-8','.xml':'application/xml','.svg':'image/svg+xml'};
let active = 0;
let recent = [];
function json(res,status,value) { res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'}); res.end(JSON.stringify(value)); }
export const server = http.createServer(async (req,res) => {
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Referrer-Policy','no-referrer');
  res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'");
  if (!allowedHosts.has(req.headers.host)) return json(res,403,{error:'Invalid local host.'});
  try {
    const pathname = new URL(req.url,origin).pathname;
    if (pathname === '/api/status' && req.method === 'GET') return json(res,200,{jev:!!process.env.TYPESAFE_API_KEY,openai:!!process.env.OPENAI_API_KEY});
    if (pathname === '/api/evaluate' && req.method === 'POST') {
      if (![`http://127.0.0.1:${port}`,`http://localhost:${port}`].includes(req.headers.origin) || req.headers['x-demo-request'] !== '1') return json(res,403,{error:'Use the local demo page to run live comparisons.'});
      if (!req.headers['content-type']?.startsWith('application/json')) return json(res,415,{error:'Expected application/json.'});
      recent = recent.filter(t=>Date.now()-t<60000);
      if(active >= 4 || recent.length >= 30) return json(res,429,{error:'Too many requests. Wait a minute before retrying.'});
      let body = '';
      for await (const chunk of req) {
        body += chunk;
        if (Buffer.byteLength(body)>32000) return json(res,413,{error:'State is too large (32 KB maximum request).'});
      }
      let input;
      try { input = JSON.parse(body); } catch { return json(res,400,{error:'Invalid JSON.'}); }
      if (!input || !ids.has(input.id) || !['jev','openai'].includes(input.provider) || !['structured','text'].includes(input.baseline) || !['string','object'].includes(typeof input.state) || input.state === null) return json(res,400,{error:'Invalid comparison request.'});
      const demo = JSON.parse(await readFile(path.join(root,'use-cases',input.id,'scenario.json'),'utf8'));
      if (input.primitive && input.primitive !== 'all') {
        if (!demo.primitiveExplorer || !['choice','noul','score'].includes(input.primitive)) return json(res,400,{error:'Invalid primitive selection.'});
        demo.questions = Object.fromEntries(Object.entries(demo.questions).filter(([,q])=>q.type===input.primitive));
        const [key,q] = Object.entries(demo.questions)[0];
        demo.policy = q.type === 'choice' ? {kind:'choice',key} : q.type === 'noul' ? {kind:'noul',key,low:.2,high:.8,yes:'Refund requested',no:'No refund request'} : {kind:'score',key,max:2,threshold:1.5,high:'Very frustrated',low:'Lower frustration'};
      }
      recent.push(Date.now()); active++;
      try { return json(res,200,await evaluate(demo,input.state,input.provider,input.baseline)); }
      catch(error) { return json(res,502,{error:error.message}); }
      finally { active--; }
    }
    if (!['GET','HEAD'].includes(req.method)) return json(res,405,{error:'Method not allowed.'});
    const relative = (pathname.endsWith('/') ? pathname+'index.html' : pathname).slice(1);
    if (!publicFiles.has(relative)) return json(res,404,{error:'Not found.'});
    let file;
    try { file = await readFile(path.join(root,relative)); } catch { return json(res,404,{error:'Not found. Run npm run build.'}); }
    res.writeHead(200,{'Content-Type':types[path.extname(relative)] || 'application/octet-stream'});
    res.end(req.method === 'HEAD' ? undefined : file);
  } catch { json(res,500,{error:'The local request could not be completed.'}); }
});
server.requestTimeout = 60000;
server.listen(port,'127.0.0.1',()=>console.log(`Jev visual demos: ${origin} (preview by default)`));
