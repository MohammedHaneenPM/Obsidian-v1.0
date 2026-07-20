const fs = require('fs');
const content = fs.readFileSync('schema.json', 'utf-8');

// Use a simple parser to find duplicate keys in objects
let foundDuplicate = false;

function parseAndCheckDuplicates(text) {
    let objStack = [];
    let currentKeys = new Set();
    
    // Very naive check for duplicate "id" keys in the same object
    const lines = text.split('\n');
    let idsInCurrentObject = new Set();
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.includes('{')) {
            idsInCurrentObject.clear();
        }
        
        const idMatch = line.match(/"id"\s*:\s*"([^"]+)"/);
        if (idMatch) {
            const id = idMatch[1];
            if (idsInCurrentObject.has(id)) {
                console.log('DUPLICATE ID IN SAME OBJECT:', id, 'at line', i+1);
                foundDuplicate = true;
            }
            idsInCurrentObject.add(id);
        }
        
        // Also check if multiple "id" exist
        const multipleIds = [...line.matchAll(/"id"\s*:/g)];
        if (multipleIds.length > 1) {
            console.log('MULTIPLE IDs ON SAME LINE at line', i+1);
            foundDuplicate = true;
        }
    }
}

parseAndCheckDuplicates(content);

// Check duplicate block types manually by matching blocks array
const blocksMatch = content.match(/"blocks"\s*:\s*\[([\s\S]*?)\]\s*(?:,\s*"settings"|\})/);
if (blocksMatch) {
    const blocksContent = blocksMatch[1];
    const types = [...blocksContent.matchAll(/"type"\s*:\s*"([^"]+)"/g)].map(m => m[1]);
    
    // Since 'type' is used for settings too, we only care about block types.
    // A block type usually appears right after a '{' in the blocks array, or we can just count.
    // Actually, setting types are basic types. Let's just find duplicates among all "type" in blocks array.
    // That includes setting types. Let's filter setting types.
    const settingTypes = new Set(['checkbox', 'color_scheme', 'header', 'select', 'range', 'inline_richtext', 'paragraph', 'text', 'image_picker', 'richtext', 'liquid', 'page']);
    const potentialBlockTypes = types.filter(t => !settingTypes.has(t));
    
    const duplicates = potentialBlockTypes.filter((item, index) => potentialBlockTypes.indexOf(item) !== index);
    if (duplicates.length > 0) {
        console.log('DUPLICATE BLOCK TYPES (or unknown setting types):', duplicates);
        foundDuplicate = true;
    }
}

if (!foundDuplicate) {
    console.log('No duplicates found.');
}
