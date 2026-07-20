$content = [System.IO.File]::ReadAllText('theme\sections\main-product.liquid')
if ($content -match '(?s){% schema %}(.*?){% endschema %}') {
    $schemaJson = $matches[1] | ConvertFrom-Json
    foreach ($block in $schemaJson.blocks) {
        if ($block.settings) {
            foreach ($s in $block.settings) {
                if ($s.unit -and $s.unit.Length -gt 3) {
                    Write-Output "UNIT > 3: $($s.unit) in $($s.id) in $($block.type)"
                }
            }
        }
    }
    if ($schemaJson.settings) {
        foreach ($s in $schemaJson.settings) {
            if ($s.unit -and $s.unit.Length -gt 3) {
                Write-Output "UNIT > 3: $($s.unit) in $($s.id) in section settings"
            }
        }
    }
}
