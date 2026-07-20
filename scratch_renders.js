const fs = require('fs');
const content = fs.readFileSync('theme/sections/main-product.liquid', 'utf-8');
const allRenders = [...content.matchAll(/{%-?\s*render\s+([^%]+)%}/g)];
allRenders.forEach(m => {
    let inner = m[1].trim();
    if (!inner.startsWith("'") && !inner.startsWith('"')) {
        console.log('Dynamic render:', inner);
    }
});
console.log('Done');
