$snippets = @(
    'product-media-gallery', 'price', 'product-information-premium', 'inventory-urgency-premium', 
    'shipping-estimate-premium', 'free-shipping-indicator-premium', 'return-policy-premium', 
    'secure-checkout-premium', 'product-information-engine', 'loading-spinner', 'share-button', 
    'product-disclosures', 'product-variant-picker', 'buy-buttons', 'icon-accordion', 'card-product', 
    'icon-with-text', 'product-media-modal', 'recently-viewed-tracker-premium'
)
foreach ($s in $snippets) {
    if (-not (Test-Path "theme\snippets\$s.liquid")) {
        Write-Output "MISSING SNIPPET: $s"
    }
}
