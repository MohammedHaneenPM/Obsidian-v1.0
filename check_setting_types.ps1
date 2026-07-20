$ErrorActionPreference = 'Stop'
$content = [System.IO.File]::ReadAllText('theme\sections\main-product.liquid')
if ($content -match '(?s){% schema %}(.*?){% endschema %}') {
    $schemaJson = $matches[1] | ConvertFrom-Json
    $validSettingTypes = @('checkbox', 'number', 'radio', 'range', 'select', 'text', 'textarea', 'article', 'blog', 'collection', 'collection_list', 'color', 'color_background', 'color_scheme', 'font_picker', 'html', 'image_picker', 'link_list', 'liquid', 'page', 'product', 'product_list', 'richtext', 'url', 'video', 'video_url', 'header', 'paragraph', 'inline_richtext')
    
    foreach ($block in $schemaJson.blocks) {
        if ($block.settings) {
            foreach ($s in $block.settings) {
                if (-not ($validSettingTypes -contains $s.type)) {
                    Write-Output "INVALID SETTING TYPE: $($s.type) in block $($block.type)"
                }
            }
        }
    }
    if ($schemaJson.settings) {
        foreach ($s in $schemaJson.settings) {
            if (-not ($validSettingTypes -contains $s.type)) {
                Write-Output "INVALID SETTING TYPE: $($s.type) in section settings"
            }
        }
    }
}
