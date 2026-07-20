$content = [System.IO.File]::ReadAllText('theme\sections\main-product.liquid')
if ($content -match '(?s){% schema %}(.*?){% endschema %}') {
    $schemaJson = $matches[1] | ConvertFrom-Json
    if ($schemaJson.tag) { Write-Output "TAG: $($schemaJson.tag)" }
    if ($schemaJson.class) { Write-Output "CLASS: $($schemaJson.class)" }
}
