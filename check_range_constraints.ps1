$content = [System.IO.File]::ReadAllText('theme\sections\main-product.liquid')
if ($content -match '(?s){% schema %}(.*?){% endschema %}') {
    $schemaJson = $matches[1] | ConvertFrom-Json
    foreach ($block in $schemaJson.blocks) {
        if ($block.settings) {
            foreach ($s in $block.settings) {
                if ($s.type -eq 'range') {
                    $steps = ($s.max - $s.min) / $s.step
                    if ($steps -gt 100) { Write-Output "TOO MANY STEPS: $($s.id) in block $($block.type)" }
                    if (($s.default - $s.min) % $s.step -ne 0) { Write-Output "INVALID DEFAULT: $($s.id) in block $($block.type) (min $($s.min) step $($s.step) default $($s.default))" }
                }
            }
        }
    }
}
