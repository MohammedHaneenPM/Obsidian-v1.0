$ErrorActionPreference = 'Stop'
$content = [System.IO.File]::ReadAllText('theme\sections\main-product.liquid')
if ($content -match '(?s){% schema %}(.*?){% endschema %}') {
    $schemaJson = $matches[1] | ConvertFrom-Json
    foreach ($block in $schemaJson.blocks) {
        if ($block.settings) {
            foreach ($s in $block.settings) {
                if ($s.type -eq 'select' -or $s.type -eq 'radio') {
                    if (-not $s.options -or $s.options.Length -eq 0) { Write-Output "MISSING OPTIONS: $($s.id) in $($block.type)" }
                    foreach ($opt in $s.options) {
                        if (-not $opt.value -and $opt.value -ne '') { Write-Output "MISSING OPTION VALUE: $($s.id) in $($block.type)" }
                        if (-not $opt.label) { Write-Output "MISSING OPTION LABEL: $($s.id) in $($block.type)" }
                    }
                }
            }
        }
    }
}
