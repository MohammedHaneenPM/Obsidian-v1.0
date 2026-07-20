const fs = require('fs');
const content = fs.readFileSync('theme/sections/main-product.liquid', 'utf-8');
const regex = /{%[-]?\s*(?:render|include)\s+['"]([^'"]+)['"]/g;
let match;
let missing = [];
while ((match = regex.exec(content)) !== null) {
    const snippetName = match[1];
    if (!fs.existsSync('theme/snippets/' + snippetName + '.liquid')) {
        missing.push(snippetName);
    }
}
console.log('Missing snippets:', [...new Set(missing)]);
