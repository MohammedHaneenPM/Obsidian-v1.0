const fs = require('fs');
const content = fs.readFileSync('theme/sections/main-product.liquid', 'utf-8');
const match = content.match(/{% schema %}([\s\S]*?){% endschema %}/);
const schemaStr = match[1];

let isDuplicate = false;

const types = [...schemaStr.matchAll(/\"type\"\s*:\s*\"([^\"]+)\"/g)].map(m => m[1]);
const dupTypes = types.filter((item, index) => types.indexOf(item) !== index);
console.log('Duplicate type keys in schema:', dupTypes);

const ids = [...schemaStr.matchAll(/\"id\"\s*:\s*\"([^\"]+)\"/g)].map(m => m[1]);
const dupIds = ids.filter((item, index) => ids.indexOf(item) !== index);
console.log('Duplicate id values:', dupIds);
