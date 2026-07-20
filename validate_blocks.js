const fs = require('fs');
const content = fs.readFileSync('theme/sections/main-product.liquid', 'utf-8');
const match = content.match(/{%\s*schema\s*%}([\s\S]*?){%\s*endschema\s*%}/);
if (match) {
    const schema = JSON.parse(match[1]);
    schema.blocks.forEach(block => {
        const t = block.type || '';
        const n = block.name || '';
        if (t.length > 25) console.log(`Type > 25: ${t}`);
        if (n.length > 25) console.log(`Name > 25: ${n}`);
        
        if (block.settings) {
            block.settings.forEach(s => {
                if (s.unit && s.unit.length > 3) {
                    console.log(`Unit > 3: block ${t}, unit ${s.unit}`);
                }
                if (s.type === 'range') {
                    const mx = s.max || 0;
                    const mn = s.min || 0;
                    const step = s.step || 1;
                    const dflt = s.default !== undefined ? s.default : mn;
                    if ((mx - mn) / step + 1 > 101) {
                        console.log(`Range steps > 101: block ${t}, max ${mx}, min ${mn}, step ${step}`);
                    }
                    if ((dflt - mn) % step !== 0) {
                        console.log(`Range default invalid: block ${t}, default ${dflt}, min ${mn}, step ${step}`);
                    }
                    if ((mx - mn) % step !== 0) {
                        console.log(`Range max invalid: block ${t}, max ${mx}, min ${mn}, step ${step}`);
                    }
                }
            });
        }
    });
}
