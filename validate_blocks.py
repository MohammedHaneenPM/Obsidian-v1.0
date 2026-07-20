import json
import re

with open('theme/sections/main-product.liquid', 'r', encoding='utf-8') as f:
    content = f.read()

m = re.search(r'{%\s*schema\s*%}(.*?){%\s*endschema\s*%}', content, re.DOTALL)
if m:
    schema = json.loads(m.group(1))
    for block in schema.get('blocks', []):
        t = block.get('type', '')
        n = block.get('name', '')
        if len(t) > 25:
            print(f"Type > 25: {t}")
        if len(n) > 25:
            print(f"Name > 25: {n}")
        
        for s in block.get('settings', []):
            if 'unit' in s and len(s['unit']) > 3:
                print(f"Unit > 3: block {t}, unit {s['unit']}")
            if s.get('type') == 'range':
                mx = s.get('max', 0)
                mn = s.get('min', 0)
                step = s.get('step', 1)
                dflt = s.get('default', mn)
                if (mx - mn) / step + 1 > 101:
                    print(f"Range steps > 101: block {t}, max {mx}, min {mn}, step {step}")
                if (dflt - mn) % step != 0:
                    print(f"Range default invalid: block {t}, default {dflt}, min {mn}, step {step}")
                if (mx - mn) % step != 0:
                    print(f"Range max invalid: block {t}, max {mx}, min {mn}, step {step}")
