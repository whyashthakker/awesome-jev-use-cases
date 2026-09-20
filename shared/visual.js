const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const text = (x,y,s,more='') => `<text x="${x}" y="${y}" ${more}>${esc(s)}</text>`;
const box = (x,y,w,h,label,active=false) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" class="${active?'selected':'tile'}"/>${text(x+w/2,y+h/2+4,label,'text-anchor="middle"')}`;
const line = (x1,y1,x2,y2,active=false) => `<path d="M${x1} ${y1} L${x2} ${y2}" class="${active?'active-line':'connector'}"/>`;
export function scene(demo, result, state) {
  const d = result?.decision;
  const v = result?.values || {};
  const target = d?.target;
  let body = '';
  if (demo.scene === 'traffic') {
    body = '<rect x="160" y="0" width="120" height="230" class="road"/><rect x="0" y="72" width="440" height="90" class="road"/><path d="M220 0V70 M220 162V230 M0 117H158 M281 117H440" class="lane"/>';
    const ns = target==='north_south', ew=target==='east_west';
    for(const [x,y,on] of [[175,48,ns],[260,178,ns],[132,141,ew],[301,91,ew]]) body+=`<circle cx="${x}" cy="${y}" r="8" fill="${on?'#9beca5':'#ea927f'}"/>`;
    for(const [x,y] of [[188,8],[188,35],[233,189],[233,215],[36,87],[75,87],[330,133]]) body+=`<rect x="${x}" y="${y}" width="16" height="22" rx="4" class="vehicle ${result?'animate':''}"/>`;
    if(state?.crossing?.includes('pedestrian')) body+='<circle cx="216" cy="110" r="7" fill="#ffd98b"/>';
    body+=text(18,25,'INTERSECTION · TOY PHASES');
  } else if (demo.scene === 'driving') {
    body='<rect x="75" y="0" width="290" height="230" class="road"/><path d="M170 0V230 M267 0V230" class="lane"/>';
    body+=box(199,35,34,55,'',false);
    const x = target==='left'?104:200, y=target==='cruise'?86:154;
    body+=`<rect x="${x}" y="${y}" width="34" height="55" rx="8" class="selected moving-car"/>`;
    if(state?.left==='occupied') body+='<rect x="105" y="94" width="34" height="55" rx="8" class="tile"/>';
    body+=text(218,24,'OBSTACLE','text-anchor="middle"');
    if(target==='brake') body+=text(250,180,'STOP');
    body+=text(16,220,'TOP-DOWN · ONE DECISION');
  } else if(demo.scene==='grid' || demo.scene==='home') {
    for(let row=0;row<5;row++)for(let col=0;col<9;col++)body+=`<rect x="${22+col*44}" y="${10+row*42}" width="40" height="38" rx="4" class="cell"/>`;
    if(demo.scene==='home') {
      body+=box(100,45,240,140,'LIVING ROOM',target==='light_on');
      body+=`<circle cx="220" cy="110" r="22" fill="${target==='light_on'?'#ffe192':'#455548'}"/>`;
    } else {
      body+=box(198,95,40,38,'■');
      const positions={left:[110,137],right:[286,137],wait:[198,179],retreat:[66,179],attack:[286,53],patrol:[110,53]};
      const [x,y]=positions[target]||[198,179];
      body+=`<circle cx="${x+20}" cy="${y+18}" r="13" class="selected"/>`;
      body+=text(22,226,demo.scene==='grid'?'ONE TURN · FIXED ACTIONS':'ROOM CONTROL');
    }
  } else if(demo.scene==='rank') {
    const keys = d?.ranking || demo.policy.keys;
    keys.forEach((key,i)=>{const y=25+i*63;body+=text(20,y+27,String(i+1).padStart(2,'0'));body+=box(55,y,290,45,demo.labels[key],i===0&&!!d);body+=text(361,y+28,v[key]===undefined?'—':v[key].toFixed(2));});
  } else if(demo.scene==='gauge' || demo.policy.kind==='composite') {
    const score=d?.score ?? 0, max=d?.max||2, width=348*Math.max(0,Math.min(1,score/max));
    body+=text(28,44,'RUBRIC POSITION');
    body+='<rect x="28" y="78" width="348" height="32" rx="8" class="tile"/>';
    body+=`<rect x="28" y="78" width="${width}" height="32" rx="8" class="selected"/>`;
    body+=text(28,140,'0');body+=text(376,140,String(max),'text-anchor="end"');
    body+=text(28,198,d?`${score.toFixed(2)} / ${max}`:'Ready to score','class="big"');
  } else if(demo.scene==='batch') {
    Object.entries(demo.questions).forEach(([key],i)=>{body+=box(20,20+i*65,148,43,`Record ${i+1}`);body+=line(170,42+i*65,227,42+i*65,!!result);body+=box(230,20+i*65,185,43,v[key]||'Waiting',!!result);});
  } else if(demo.scene==='graph') {
    const merge=['merge','yes'].includes(target);
    body+=line(138,107,300,107,merge);body+=`<circle cx="110" cy="107" r="45" class="tile"/><circle cx="330" cy="107" r="45" class="${merge?'selected':'tile'}"/>`;body+=text(110,111,'Record A','text-anchor="middle"');body+=text(330,111,'Record B','text-anchor="middle"');body+=text(220,200,d?.label||'Compare records','text-anchor="middle"');
  } else if(demo.scene==='learning') {
    ['basics','practice','advance'].forEach((key,i)=>{if(i<2)body+=line(93+i*143,100,175+i*143,100,target===key);body+=box(10+i*143,69,128,65,demo.labels[key],target===key);body+=text(75+i*143,166,`LESSON ${i+1}`,'text-anchor="middle"');});
  } else if(demo.scene==='timeline' && demo.id.includes('voice')) {
    body+=line(24,115,411,115,!!result);
    for(let i=0;i<36;i++){const h=12+(Math.sin(i*1.7)+1)*21;body+=`<rect x="${28+i*10.5}" y="${115-h/2}" width="4" height="${h}" rx="2" class="${result?'selected':'tile'}"/>`;}
    body+=text(24,45,'INPUT → DECISION');body+=text(24,196,d?.label||'Waiting for a decision');
  } else {
    const labels=demo.labels;
    const choices=Object.keys(labels).length?Object.entries(labels):[['no','Continue'],['review','Review'],['yes','Flag']];
    const shown=choices.slice(0,4);
    body+=box(18,86,110,50,demo.scene==='judge'?'Evidence':'Input');
    shown.forEach(([key,label],i)=>{const y=12+i*(205/shown.length);body+=line(130,111,240,y+22,target===key);body+=box(240,y,184,42,label,target===key);});
  }
  return `<svg viewBox="0 0 440 240" role="img" aria-label="${esc(demo.title+': '+(d?.label||'waiting'))}"><title>${esc(demo.title)}</title>${body}</svg>`;
}
