import os
import re
import sys

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    match = re.match(r'^---\n(.*?)\n---\n', content, re.DOTALL)
    if not match:
        return

    frontmatter = match.group(1)

    lines = frontmatter.split('\n')
    changed = False
    new_lines = []
    for line in lines:
        m = re.match(r'^(date|updatedAt|lastKnownGoodState):\s*[\'"]?(\d{4}-\d{2}-\d{2}).*?[\'"]?\s*$', line)
        if m:
            new_line = f'{m.group(1)}: "{m.group(2)}"'
            if line != new_line:
                line = new_line
                changed = True
        new_lines.append(line)

    if changed:
        new_content = '---\n' + '\n'.join(new_lines) + '\n---\n' + content[match.end():]
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)

for arg in sys.argv[1:]:
    process_file(arg)
