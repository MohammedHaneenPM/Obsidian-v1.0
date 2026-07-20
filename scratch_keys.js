const fs = require('fs');
const schema = JSON.parse(fs.readFileSync('schema.json', 'utf-8'));
let blockKeys = new Set();
if (schema.blocks) {
    schema.blocks.forEach(b => {
        Object.keys(b).forEach(k => blockKeys.add(k));
    });
}
console.log('Block keys:', [...blockKeys]);

let settingKeys = new Set();
function collectSettingKeys(settings) {
    if(!settings) return;
    settings.forEach(s => {
        Object.keys(s).forEach(k => settingKeys.add(k));
    });
}
collectSettingKeys(schema.settings);
if (schema.blocks) {
    schema.blocks.forEach(b => collectSettingKeys(b.settings));
}
console.log('Setting keys:', [...settingKeys]);
