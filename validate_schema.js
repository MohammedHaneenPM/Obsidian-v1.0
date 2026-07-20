const fs = require('fs');

try {
    const raw = fs.readFileSync('schema_dump.json', 'utf8');
    const schema = JSON.parse(raw);
    let errors = [];

    // 1. Duplicate block types
    const blockTypes = new Set();
    for (const block of schema.blocks || []) {
        if (blockTypes.has(block.type)) {
            errors.push(`Duplicate block type: ${block.type}`);
        }
        blockTypes.add(block.type);
    }

    // 2. Setting IDs globally
    const globalSettingIds = new Set();
    for (const s of schema.settings || []) {
        if (s.id) {
            if (globalSettingIds.has(s.id)) {
                errors.push(`Duplicate global setting ID: ${s.id}`);
            }
            globalSettingIds.add(s.id);
        }
    }

    // 3. Setting IDs locally
    for (const block of schema.blocks || []) {
        const blockSettingIds = new Set();
        for (const s of block.settings || []) {
            if (s.id) {
                if (blockSettingIds.has(s.id)) {
                    errors.push(`Duplicate setting ID ${s.id} in block ${block.type}`);
                }
                blockSettingIds.add(s.id);
            }
            
            // Check valid keys in setting
            const validSettingKeys = ['type', 'id', 'label', 'default', 'info', 'min', 'max', 'step', 'unit', 'options', 'content', 'placeholder'];
            for (const key of Object.keys(s)) {
                if (!validSettingKeys.includes(key)) {
                    errors.push(`Invalid property '${key}' in setting ${s.id || s.type} of block ${block.type}`);
                }
            }
        }
        
        // Check valid keys in block
        const validBlockKeys = ['type', 'name', 'limit', 'settings'];
        for (const key of Object.keys(block)) {
            if (!validBlockKeys.includes(key)) {
                errors.push(`Invalid property '${key}' in block ${block.type}`);
            }
        }
    }

    // 4. Invalid schema properties
    const validSchemaKeys = ['name', 'tag', 'class', 'limit', 'settings', 'blocks', 'max_blocks', 'presets', 'default', 'locales'];
    for (const key of Object.keys(schema)) {
        if (!validSchemaKeys.includes(key)) {
            errors.push(`Invalid property '${key}' in root schema`);
        }
    }

    // 5. Presets
    if (schema.presets) {
        for (const preset of schema.presets) {
            for (const block of preset.blocks || []) {
                if (!blockTypes.has(block.type)) {
                    errors.push(`Preset references unknown block type: ${block.type}`);
                }
            }
        }
    }
    
    // 6. Default
    if (schema.default) {
        for (const block of schema.default.blocks || []) {
            if (!blockTypes.has(block.type)) {
                errors.push(`Default references unknown block type: ${block.type}`);
            }
        }
    }

    // 7. Max Blocks
    if (schema.max_blocks && (schema.max_blocks < 1 || schema.max_blocks > 50)) {
        errors.push(`max_blocks ${schema.max_blocks} is out of bounds (1-50)`);
    }

    if (errors.length > 0) {
        console.log("ERRORS FOUND:");
        console.log(errors.join("\n"));
    } else {
        console.log("SCHEMA IS PERFECTLY VALID ACCORDING TO NODE VALIDATOR");
    }
} catch (e) {
    console.log("JSON PARSE ERROR:");
    console.log(e.message);
}
