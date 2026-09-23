import fs from 'node:fs';

const html=fs.readFileSync('index.html','utf8');
const manifest=JSON.parse(fs.readFileSync('manifest.webmanifest','utf8'));
const sw=fs.readFileSync('sw.js','utf8');

const required=[
  'globalSyncIndicator',
  'cloudRestorePrevious',
  'snapshot_history',
  'CLOUD_REV_KEY',
  'localDateString',
  'serviceWorker.register'
];
for(const token of required){
  if(!html.includes(token)) throw new Error('Missing required token: '+token);
}

const forbidden=[
  'self_reference.mp3',
  'self_take_1.m4a',
  'self_take_2.m4a',
  'elllo_001_kerri_omelet.mp3'
];
for(const token of forbidden){
  if(html.includes(token)) throw new Error('Legacy private/static asset reference still present: '+token);
}

const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]).filter(Boolean);
for(const [i,js] of scripts.entries()){
  try{new Function(js)}catch(e){throw new Error('Inline script '+i+' failed to parse: '+e.message)}
}

if(manifest.name!=='My English Lab') throw new Error('Invalid manifest');
if(!sw.includes("my-english-lab-v11")) throw new Error('Unexpected service worker version');
console.log('Smoke test passed');
