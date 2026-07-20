$ErrorActionPreference = 'Stop'
$content = [System.IO.File]::ReadAllText('theme\sections\main-product.liquid')
if ($content -match '(?s){% schema %}(.*?){% endschema %}') {
    $schemaJson = $matches[1] | ConvertFrom-Json
    foreach ($block in $schemaJson.blocks) {
        if ($block.settings) {
            foreach ($s in $block.settings) {
                if ($s.type -eq 'paragraph' -or $s.type -eq 'header') {
                    if (-not $s.content) { Write-Output "MISSING CONTENT: in $($block.type)" }
                }
            }
        }
    }
}
