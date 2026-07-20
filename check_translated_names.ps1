$locales = [System.IO.File]::ReadAllText('theme\locales\en.default.json') | ConvertFrom-Json
$content = [System.IO.File]::ReadAllText('theme\sections\main-product.liquid')

function Get-Val($keyPath, $obj) {
    $parts = $keyPath -split '\.'
    $curr = $obj
    foreach ($p in $parts) {
        if (-not $curr) { return $null }
        $curr = $curr.$p
    }
    return $curr
}

if ($content -match '(?s){% schema %}(.*?){% endschema %}') {
    $schemaJson = $matches[1] | ConvertFrom-Json
    foreach ($block in $schemaJson.blocks) {
        $n = $block.name
        if ($n -and $n.StartsWith('t:')) {
            $k = $n.Substring(2)
            $val = Get-Val $k $locales
            if ($val -and $val.Length -gt 25) {
                Write-Output "TRANSLATED NAME > 25: $($block.type) -> $val (length $($val.Length))"
            }
        }
    }
}
