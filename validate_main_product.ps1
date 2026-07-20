$ErrorActionPreference = 'Stop'
$content = [System.IO.File]::ReadAllText('theme\sections\main-product.liquid')
if ($content -match '(?s){% schema %}(.*?){% endschema %}') {
    $schemaJson = $matches[1] | ConvertFrom-Json
    
    $blockTypes = @{}
    foreach ($block in $schemaJson.blocks) {
        $blockTypes[$block.type] = $true
    }
    
    if ($schemaJson.presets) {
        foreach ($preset in $schemaJson.presets) {
            if ($preset.blocks) {
                foreach ($presetBlock in $preset.blocks) {
                    if (-not $blockTypes.ContainsKey($presetBlock.type)) {
                        Write-Output "Preset references unknown block type: $($presetBlock.type)"
                    }
                }
            }
        }
    } else {
        Write-Output "No presets found."
    }
    
    if ($schemaJson.default) {
        if ($schemaJson.default.blocks) {
            foreach ($defBlock in $schemaJson.default.blocks) {
                if (-not $blockTypes.ContainsKey($defBlock.type)) {
                    Write-Output "Default references unknown block type: $($defBlock.type)"
                }
            }
        }
    }
}
