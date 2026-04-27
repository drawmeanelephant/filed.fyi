import os
import glob
import re

directory = "/Users/tbuddy/Documents/GitHub/filed.fyi/src/content/docs/mascots"
files = glob.glob(os.path.join(directory, "*.md"))

updated_count = 0
for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if content.startswith('---'):
        end_idx = content.find('---', 3)
        if end_idx != -1:
            frontmatter = content[3:end_idx]
            
            # Check if emotionalIntegrity is missing
            if not re.search(r'^emotionalIntegrity:', frontmatter, re.MULTILINE):
                # We need to insert it. Let's append it to the frontmatter string.
                # Find where to append it (before the closing ---)
                new_frontmatter = frontmatter.rstrip() + '\nemotionalIntegrity: stable\n'
                new_content = '---\n' + new_frontmatter.lstrip('\n') + content[end_idx:]
                
                with open(file, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                updated_count += 1

print(f"Updated {updated_count} files.")
