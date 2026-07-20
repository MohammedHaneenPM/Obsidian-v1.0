$content = [System.IO.File]::ReadAllText('theme\sections\main-product.liquid')
if ($content -match '(?s){% schema %}(.*?){% endschema %}') {
    $schemaJson = $matches[1] | ConvertFrom-Json
    foreach ($block in $schemaJson.blocks) {
        if ($block.settings) {
            foreach ($s in $block.settings) {
                if ($s.type -eq 'range') {
                    if ($s.max -lt $s.min) { Write-Output "MAX < MIN: $($s.id) in block $($block.type)" }
                    if ($s.max -eq $s.min) { Write-Output "MAX == MIN: $($s.id) in block $($block.type)" }
                }
            }
        }
    }
}
