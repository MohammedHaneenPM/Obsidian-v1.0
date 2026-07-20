$content = [System.IO.File]::ReadAllText('theme\sections\main-product.liquid')
if ($content -match '(?s){% schema %}(.*?){% endschema %}') {
    [System.IO.File]::WriteAllText('schema_dump.json', $matches[1])
}
