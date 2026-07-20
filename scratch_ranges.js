const fs = require('fs');
const schema = JSON.parse(fs.readFileSync('schema.json', 'utf-8'));
function checkRanges(settings) {
  if(!settings) return;
  settings.forEach(s => {
    if(s.type === 'range') {
      console.log('Range id ' + s.id + ': min=' + s.min + ', max=' + s.max + ', step=' + s.step + ', default=' + s.default);
      if ((s.default - s.min) % s.step !== 0) {
        console.log('!!! INVALID DEFAULT FOR RANGE ' + s.id);
      }
    }
  });
}
checkRanges(schema.settings);
if (schema.blocks) schema.blocks.forEach(b => checkRanges(b.settings));
