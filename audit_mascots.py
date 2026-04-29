import os
import re

directory = 'src/content/docs/mascots'
files = [f for f in os.listdir(directory) if f.endswith('.md')]

candidates = []

for filename in files:
    filepath = os.path.join(directory, filename)
    with open(filepath, 'r') as f:
        content = f.read()
        
        # Split frontmatter
        parts = content.split('---')
        if len(parts) < 3:
            continue
        frontmatter = parts[1]
        
        # Simplified checks
        has_haiku = 'haikuLog:' in frontmatter and ('-' in frontmatter.split('haikuLog:')[1].split('\n')[1])
        has_limerick = 'limerickLog:' in frontmatter or 'limerick:' in frontmatter
        
        if not has_haiku or not has_limerick:
            candidates.append({
                'file': filename,
                'has_haiku': bool(has_haiku),
                'has_limerick': bool(has_limerick)
            })

# Sort by filename to be deterministic
candidates.sort(key=lambda x: x['file'])

print(f"Found {len(candidates)} candidates.")
for c in candidates:
    print(f"{c['file']}: Haiku: {c['has_haiku']}, Limerick: {c['has_limerick']}")
