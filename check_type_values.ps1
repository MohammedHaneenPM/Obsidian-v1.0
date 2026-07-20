$content = [System.IO.File]::ReadAllText('theme\sections\main-product.liquid')
if ($content -match '(?s){% schema %}(.*?){% endschema %}') {
    $schemaJson = $matches[1] | ConvertFrom-Json
    foreach ($block in $schemaJson.blocks) {
        if ($block.settings) {
            foreach ($s in $block.settings) {
                if ($s.type -eq 'range') {
                    if ($s.min.GetType().Name -ne 'Int32') { Write-Output "MIN IS NOT INT: $($s.id)" }
                    if ($s.max.GetType().Name -ne 'Int32') { Write-Output "MAX IS NOT INT: $($s.id)" }
                    if ($s.step.GetType().Name -ne 'Int32') { Write-Output "STEP IS NOT INT: $($s.id)" }
                    if ($s.default.GetType().Name -ne 'Int32') { Write-Output "DEFAULT IS NOT INT: $($s.id)" }
                }
                if ($s.type -eq 'number') {
                    if ($s.default.GetType().Name -ne 'Int32') { Write-Output "NUMBER DEFAULT IS NOT INT: $($s.id)" }
                }
                if ($s.type -eq 'checkbox') {
                    if ($s.default.GetType().Name -ne 'Boolean') { Write-Output "CHECKBOX DEFAULT IS NOT BOOL: $($s.id)" }
                }
            }
        }
    }
}
