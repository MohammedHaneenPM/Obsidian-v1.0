$content = [System.IO.File]::ReadAllText('theme\sections\main-product.liquid')
if ($content -match '(?s){% schema %}(.*?){% endschema %}') {
    $schemaJson = $matches[1] | ConvertFrom-Json
    if ($schemaJson.presets) {
        Write-Output "PRESETS FOUND:"
        $schemaJson.presets | ConvertTo-Json -Depth 5
    } else {
        Write-Output "NO PRESETS"
    }
}
