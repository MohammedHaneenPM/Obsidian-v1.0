const fs = require('fs');
const schema = JSON.parse(fs.readFileSync('schema.json', 'utf-8'));
let errors = [];

function checkDefaults(settings, prefix) {
    if(!settings) return;
    settings.forEach(s => {
        if(s.default !== undefined) {
            let valType = typeof s.default;
            if (s.type === 'checkbox' && valType !== 'boolean') errors.push(prefix + ' checkbox default is not boolean: ' + s.id);
            if (s.type === 'text' && valType !== 'string') errors.push(prefix + ' text default is not string: ' + s.id);
            if (s.type === 'range' && valType !== 'number') errors.push(prefix + ' range default is not number: ' + s.id);
            if (s.type === 'select' && valType !== 'string') errors.push(prefix + ' select default is not string: ' + s.id);
        }
        
        // Also check if select default is in options
        if (s.type === 'select' && s.default !== undefined) {
            let opts = s.options.map(o => o.value);
            if (!opts.includes(s.default)) errors.push(prefix + ' select default not in options: ' + s.id + ' (default: ' + s.default + ')');
        }
    });
}

checkDefaults(schema.settings, 'Global');
if (schema.blocks) schema.blocks.forEach(b => checkDefaults(b.settings, 'Block ' + b.type));

if(errors.length) console.log(errors.join('\n'));
else console.log('Defaults are valid types.');
