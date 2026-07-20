$ErrorActionPreference = 'Stop'
$content = [System.IO.File]::ReadAllText('theme\sections\main-product.liquid')
if ($content -match '(?s){% schema %}(.*?){% endschema %}') {
    $schemaJson = $matches[1] | ConvertFrom-Json
    foreach ($block in $schemaJson.blocks) {
        if (-not $block.name) {
            Write-Output "BLOCK WITH NO NAME: $($block.type)"
        }
    }
}
