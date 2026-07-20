$content = [System.IO.File]::ReadAllText('theme\sections\main-product.liquid')
$lines = $content -split "`n"
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match '"id": "return_days"') {
        $start = [Math]::Max(0, $i - 5)
        $end = [Math]::Min($lines.Length - 1, $i + 6)
        for ($j = $start; $j -le $end; $j++) {
            Write-Output "$j: $($lines[$j])"
        }
    }
}
