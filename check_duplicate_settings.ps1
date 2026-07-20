$content = [System.IO.File]::ReadAllText('theme\sections\main-product.liquid')
if ($content -match '(?s){% schema %}(.*?){% endschema %}') {
    $schemaJson = $matches[1] | ConvertFrom-Json
    $globalSettings = @{}
    foreach ($s in $schemaJson.settings) {
        if ($s.id) {
            if ($globalSettings.ContainsKey($s.id)) {
                Write-Output "DUPLICATE GLOBAL SETTING ID: $($s.id)"
            }
            $globalSettings[$s.id] = $true
        }
    }
    foreach ($block in $schemaJson.blocks) {
        $blockSettings = @{}
        if ($block.settings) {
            foreach ($s in $block.settings) {
                if ($s.id) {
                    if ($blockSettings.ContainsKey($s.id)) {
                        Write-Output "DUPLICATE SETTING ID in block $($block.type): $($s.id)"
                    }
                    $blockSettings[$s.id] = $true
                }
            }
        }
    }
}
