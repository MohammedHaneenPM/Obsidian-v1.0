$content = [System.IO.File]::ReadAllText('theme\sections\main-product.liquid')
if ($content -match '(?s){% schema %}(.*?){% endschema %}') {
    $schema = $matches[1]
    $lines = $schema -split "`n"
    foreach ($line in $lines) {
        if ($line -match '"type":\s*"(.*?)"') {
            Write-Output "TYPE: $($matches[1])"
        }
        if ($line -match '"name":\s*"(.*?)"') {
            Write-Output "NAME: $($matches[1])"
        }
    }
}
