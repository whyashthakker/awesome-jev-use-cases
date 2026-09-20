import {readFile} from 'node:fs/promises';
import {run} from '../shared/cli.js';
const catalog = JSON.parse(await readFile(new URL('../shared/catalog.json',import.meta.url),'utf8'));
const id = process.argv[2];
if (!catalog.some(d=>d.id === id)) {
  console.log('Usage: npm run demo -- <id> [--live] [--text] [--scenario=1]\n\n'+catalog.map(d=>d.id).join('\n'));
  process.exitCode = id ? 1 : 0;
} else await run(new URL(`../use-cases/${id}/scenario.json`,import.meta.url));
