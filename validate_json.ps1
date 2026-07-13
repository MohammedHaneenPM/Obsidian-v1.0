$ErrorActionPreference = 'Stop'
$files = @('theme\sections\main-product.liquid', 'theme\sections\featured-product.liquid')
foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file)
    if ($content -match '(?s){% schema %}(.*?){% endschema %}') {
        $jsonStr = $matches[1]
        try {
            $parsed = $jsonStr | ConvertFrom-Json
            Write-Output "$file JSON is VALID"
        } catch {
            Write-Output "$file JSON is INVALID: $_"
        }
    } else {
        Write-Output "$file has no schema"
    }
}
