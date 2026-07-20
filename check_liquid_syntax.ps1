$content = [System.IO.File]::ReadAllText('theme\sections\main-product.liquid')

$lines = $content -split "`n"
$stack = @()

for ($i = 0; $i -lt $lines.Length; $i++) {
    $line = $lines[$i]
    if ($line -match '{%-?\s*(if|unless|for|case|form|paginate)\b([^%}]*)%-?}') {
        $tag = $matches[1]
        $stack += [PSCustomObject]@{ Tag = $tag; Line = ($i + 1) }
    }
    if ($line -match '{%-?\s*end(if|unless|for|case|form|paginate)\b\s*%-?}') {
        $endTag = $matches[1]
        if ($stack.Length -eq 0) {
            Write-Output "Unmatched end$endTag at line $($i + 1)"
        } else {
            $last = $stack[$stack.Length - 1]
            if ($last.Tag -ne $endTag) {
                Write-Output "Mismatched end$endTag at line $($i + 1). Expected end$($last.Tag)"
            }
            $stack = $stack[0..($stack.Length - 2)]
        }
    }
}

if ($stack.Length -gt 0) {
    foreach ($item in $stack) {
        Write-Output "Unclosed $($item.Tag) from line $($item.Line)"
    }
} else {
    Write-Output "All block tags are perfectly balanced!"
}
