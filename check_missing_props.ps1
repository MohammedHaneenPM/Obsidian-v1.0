$content = [System.IO.File]::ReadAllText('theme\sections\main-product.liquid')
if ($content -match '(?s){% schema %}(.*?){% endschema %}') {
    $schemaJson = $matches[1] | ConvertFrom-Json
    foreach ($block in $schemaJson.blocks) {
        if ($block.settings) {
            foreach ($s in $block.settings) {
                if (-not $s.type) { Write-Output "MISSING TYPE in block $($block.type)" }
                if (-not $s.id -and $s.type -notin @('header', 'paragraph')) { Write-Output "MISSING ID in block $($block.type) for setting type $($s.type)" }
                if (-not $s.label -and $s.type -notin @('header', 'paragraph')) { Write-Output "MISSING LABEL in block $($block.type) for setting $($s.id)" }
            }
        }
    }
}
