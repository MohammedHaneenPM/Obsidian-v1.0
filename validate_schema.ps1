$ErrorActionPreference = 'Stop'
$raw = [System.IO.File]::ReadAllText('schema_dump.json')
$schema = $raw | ConvertFrom-Json

$errors = @()

# 1. Duplicate block types
$blockTypes = @{}
foreach ($block in $schema.blocks) {
    if ($blockTypes.ContainsKey($block.type)) {
        $errors += "Duplicate block type: $($block.type)"
    }
    $blockTypes[$block.type] = $true
}

# 2. Setting IDs globally
$globalSettingIds = @{}
foreach ($s in $schema.settings) {
    if ($s.id) {
        if ($globalSettingIds.ContainsKey($s.id)) {
            $errors += "Duplicate global setting ID: $($s.id)"
        }
        $globalSettingIds[$s.id] = $true
    }
}

# 3. Setting IDs locally & invalid setting properties
$validSettingKeys = @('type', 'id', 'label', 'default', 'info', 'min', 'max', 'step', 'unit', 'options', 'content', 'placeholder', 'limit')
$validBlockKeys = @('type', 'name', 'limit', 'settings')

foreach ($block in $schema.blocks) {
    $blockSettingIds = @{}
    foreach ($s in $block.settings) {
        if ($s.id) {
            if ($blockSettingIds.ContainsKey($s.id)) {
                $errors += "Duplicate setting ID $($s.id) in block $($block.type)"
            }
            $blockSettingIds[$s.id] = $true
        }
        
        foreach ($prop in $s.psobject.properties) {
            if ($prop.Name -notin $validSettingKeys) {
                $errors += "Invalid property '$($prop.Name)' in setting $($s.id) of block $($block.type)"
            }
        }
    }
    
    foreach ($prop in $block.psobject.properties) {
        if ($prop.Name -notin $validBlockKeys) {
            $errors += "Invalid property '$($prop.Name)' in block $($block.type)"
        }
    }
}

# 4. Invalid schema properties
$validSchemaKeys = @('name', 'tag', 'class', 'limit', 'settings', 'blocks', 'max_blocks', 'presets', 'default', 'locales', 'templates')
foreach ($prop in $schema.psobject.properties) {
    if ($prop.Name -notin $validSchemaKeys) {
        $errors += "Invalid property '$($prop.Name)' in root schema"
    }
}

if ($errors.Count -gt 0) {
    Write-Output "ERRORS FOUND:"
    $errors | ForEach-Object { Write-Output $_ }
} else {
    Write-Output "SCHEMA IS PERFECTLY VALID ACCORDING TO VALIDATOR"
}
