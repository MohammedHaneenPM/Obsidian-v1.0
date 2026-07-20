const fs = require('fs');
const content = fs.readFileSync('theme/sections/main-product.liquid', 'utf-8');
const match = content.match(/{% schema %}([\s\S]*?){% endschema %}/);
if (!match) { console.log('No schema found'); process.exit(1); }
const schemaStr = match[1];

let errors = [];
try {
  const parsed = JSON.parse(schemaStr);
  console.log('Valid JSON');
  
  // check duplicate block types
  let types = parsed.blocks.map(b => b.type);
  let duplicateTypes = types.filter((item, index) => types.indexOf(item) !== index);
  if (duplicateTypes.length > 0) console.log('Duplicate block types:', duplicateTypes);
  else console.log('No duplicate block types');
  
  // check duplicate setting ids globally and per block
  let globalSettings = (parsed.settings || []).map(s => s.id).filter(id => id);
  let dupGlobal = globalSettings.filter((item, index) => globalSettings.indexOf(item) !== index);
  if (dupGlobal.length > 0) console.log('Duplicate global settings:', dupGlobal);
  
  for (let b of parsed.blocks) {
    let bSettings = (b.settings || []).map(s => s.id).filter(id => id);
    let dupBSettings = bSettings.filter((item, index) => bSettings.indexOf(item) !== index);
    if (dupBSettings.length > 0) console.log('Duplicate block settings in', b.type, ':', dupBSettings);
  }

  // Check limits
  console.log('Max blocks:', parsed.max_blocks);
  console.log('Number of blocks defined:', parsed.blocks.length);

  // Dump block limit types
  for (let b of parsed.blocks) {
    if (b.limit !== undefined) {
      console.log('Block limit for', b.type, ':', b.limit);
    }
  }

  // Check presets
  if (parsed.presets) {
      console.log('Presets:', JSON.stringify(parsed.presets, null, 2));
  } else {
      console.log('No presets');
  }

} catch (e) {
  console.log('Invalid JSON:', e.message);
}
