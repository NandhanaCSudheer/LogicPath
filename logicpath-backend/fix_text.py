import re

with open('generate_extra_figures.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix: d.text((x, y), "text", FSS, fill="#...") -> d.text((x, y), "text", fill="#...", font=FSS)
pattern = re.compile(
    r'd\.text\((\([^)]+\)),\s*("[^"]+"),\s*(FS|FSS|FM|FB|FT),\s*fill=("[^"]+")\)'
)
def replacement(m):
    xy, text, font, fill = m.group(1), m.group(2), m.group(3), m.group(4)
    return f'd.text({xy}, {text}, fill={fill}, font={font})'

new_content = pattern.sub(replacement, content)
with open('generate_extra_figures.py', 'w', encoding='utf-8') as f:
    f.write(new_content)
print('Fixed text() calls')
