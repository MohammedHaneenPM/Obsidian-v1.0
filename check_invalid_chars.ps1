$ErrorActionPreference = 'Stop'
$content = [System.IO.File]::ReadAllText('theme\sections\main-product.liquid')
if ($content -match '(?s){% schema %}(.*?){% endschema %}') {
    $schemaJson = $matches[1] | ConvertFrom-Json
    foreach ($block in $schemaJson.blocks) {
        if ($block.type -match '[^a-zA-Z0-9_\-]') { Write-Output "Invalid type chars: $($block.type)" }
        if ($block.settings) {
            foreach ($s in $block.settings) {
                if ($s.id -match '[^a-zA-Z0-9_\-]') {
                    Write-Output "Invalid ID chars: $($s.id) in block $($block.type)"
                }
            }
        }
    }
}
