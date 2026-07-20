$ErrorActionPreference = 'Stop'
$content = [System.IO.File]::ReadAllText('theme\sections\main-product.liquid')
if ($content -match '(?s){% schema %}(.*?){% endschema %}') {
    $schemaJson = $matches[1] | ConvertFrom-Json
    $reserved = @('type', 'id', 'name', 'settings', 'limit', 'blocks')
    foreach ($block in $schemaJson.blocks) {
        if ($block.settings) {
            foreach ($s in $block.settings) {
                if ($reserved -contains $s.id) {
                    Write-Output "RESERVED ID: $($s.id) in block $($block.type)"
                }
            }
        }
    }
}
