$content = [System.IO.File]::ReadAllText('theme\sections\main-product.liquid')
if ($content -match '(?s){% schema %}(.*?){% endschema %}') {
    $schemaJson = $matches[1] | ConvertFrom-Json
    if ($schemaJson.default) {
        Write-Output "DEFAULT FOUND:"
        $schemaJson.default | ConvertTo-Json -Depth 5
    } else {
        Write-Output "NO DEFAULT"
    }
}
