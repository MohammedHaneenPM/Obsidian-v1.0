$content = [System.IO.File]::ReadAllText('theme\sections\main-product.liquid')
if ($content -match '(?s){% schema %}(.*?){% endschema %}') {
    $schemaJson = $matches[1] | ConvertFrom-Json
    foreach ($block in $schemaJson.blocks) {
        foreach ($prop in $block.psobject.properties) {
            if ($prop.Name -notin @('type', 'name', 'limit', 'settings')) {
                Write-Output "UNEXPECTED BLOCK PROP: $($prop.Name) in $($block.type)"
            }
        }
    }
}
