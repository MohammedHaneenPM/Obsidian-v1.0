$ErrorActionPreference = 'Stop'
$content = [System.IO.File]::ReadAllText('theme\sections\main-product.liquid')
if ($content -match '(?s){% schema %}(.*?){% endschema %}') {
    $schemaJson = $matches[1] | ConvertFrom-Json
    foreach ($block in $schemaJson.blocks) {
        if ($block.limit) {
            if ($block.limit -gt 50 -or $block.limit -lt 1) {
                Write-Output "INVALID LIMIT: $($block.limit) in block $($block.type)"
            }
        }
    }
}
