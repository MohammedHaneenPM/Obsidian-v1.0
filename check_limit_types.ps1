$content = [System.IO.File]::ReadAllText('theme\sections\main-product.liquid')
if ($content -match '(?s){% schema %}(.*?){% endschema %}') {
    $schemaJson = $matches[1] | ConvertFrom-Json
    foreach ($block in $schemaJson.blocks) {
        if ($block.limit) {
            Write-Output "$($block.type) limit type: $($block.limit.GetType().Name) value: $($block.limit)"
        }
    }
}
