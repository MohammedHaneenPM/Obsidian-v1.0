$content = [System.IO.File]::ReadAllText('theme\templates\product.json') | ConvertFrom-Json
$mainProduct = $content.sections.'main-product'
if ($mainProduct) {
    foreach ($k in $mainProduct.blocks.psobject.properties.Name) {
        $block = $mainProduct.blocks.$k
        if ($block.type -eq 'free_shipping_indicator_premium') {
            Write-Output "FOUND OLD BLOCK TYPE IN TEMPLATE: free_shipping_indicator_premium"
        }
    }
}
