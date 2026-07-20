const fs = require('fs');
const schema = JSON.parse(fs.readFileSync('schema.json', 'utf-8'));
let types = new Set();
if(schema.settings) schema.settings.forEach(s => types.add(s.type));
if(schema.blocks) schema.blocks.forEach(b => {
  if(b.settings) b.settings.forEach(s => types.add(s.type));
});
console.log('Setting types used:', [...types]);
