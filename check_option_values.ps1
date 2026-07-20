$content = [System.IO.File]::ReadAllText('theme\sections\main-product.liquid')
if ($content -match '(?s){% schema %}(.*?){% endschema %}') {
    $schemaJson = $matches[1] | ConvertFrom-Json
    foreach ($block in $schemaJson.blocks) {
        if ($block.settings) {
            foreach ($s in $block.settings) {
                if ($s.options) {
                    $vals = @{}
                    foreach ($opt in $s.options) {
                        if ($vals.ContainsKey($opt.value)) {
                            Write-Output "DUPLICATE OPTION VALUE: $($opt.value) in $($s.id) in $($block.type)"
                        }
                        $vals[$opt.value] = $true
                    }
                }
            }
        }
    }
    if ($schemaJson.settings) {
        foreach ($s in $schemaJson.settings) {
            if ($s.options) {
                $vals = @{}
                foreach ($opt in $s.options) {
                    if ($vals.ContainsKey($opt.value)) {
                        Write-Output "DUPLICATE OPTION VALUE: $($opt.value) in $($s.id) in section settings"
                    }
                    $vals[$opt.value] = $true
                }
            }
        }
    }
}
