$ErrorActionPreference = 'Stop'
$content = [System.IO.File]::ReadAllText('theme\sections\main-product.liquid')
if ($content -match '(?s){% schema %}(.*?){% endschema %}') {
    $schemaJson = $matches[1] | ConvertFrom-Json
    
    $locales = [System.IO.File]::ReadAllText('theme\locales\en.default.json') | ConvertFrom-Json
    
    function Check-Key($keyPath, $obj) {
        $parts = $keyPath -split '\.'
        $curr = $obj
        foreach ($p in $parts) {
            if (-not $curr) { return $false }
            $curr = $curr.$p
        }
        return ($curr -ne $null)
    }
    
    $missingKeys = @()
    
    if ($schemaJson.name -and $schemaJson.name.StartsWith('t:')) {
        $k = $schemaJson.name.Substring(2)
        if (-not (Check-Key $k $locales)) { $missingKeys += $k }
    }
    
    foreach ($block in $schemaJson.blocks) {
        if ($block.name.StartsWith('t:')) {
            $k = $block.name.Substring(2)
            if (-not (Check-Key $k $locales)) { $missingKeys += $k }
        }
        if ($block.settings) {
            foreach ($s in $block.settings) {
                if ($s.label -and $s.label.StartsWith('t:')) {
                    $k = $s.label.Substring(2)
                    if (-not (Check-Key $k $locales)) { $missingKeys += $k }
                }
                if ($s.info -and $s.info.StartsWith('t:')) {
                    $k = $s.info.Substring(2)
                    if (-not (Check-Key $k $locales)) { $missingKeys += $k }
                }
            }
        }
    }
    
    if ($schemaJson.settings) {
        foreach ($s in $schemaJson.settings) {
            if ($s.label -and $s.label.StartsWith('t:')) {
                $k = $s.label.Substring(2)
                if (-not (Check-Key $k $locales)) { $missingKeys += $k }
            }
            if ($s.info -and $s.info.StartsWith('t:')) {
                $k = $s.info.Substring(2)
                if (-not (Check-Key $k $locales)) { $missingKeys += $k }
            }
        }
    }
    
    if ($missingKeys.Length -gt 0) {
        Write-Output "Missing translation keys:"
        $missingKeys | Write-Output
    } else {
        Write-Output "All translation keys found!"
    }
}
