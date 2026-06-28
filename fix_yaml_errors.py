#!/usr/bin/env python3
import os
import re
import yaml
from yaml import SafeLoader
import collections

class MergingLoader(SafeLoader):
    def construct_mapping(self, node, deep=False):
        if not isinstance(node, yaml.MappingNode):
            raise yaml.constructor.ConstructorError(None, None,
                    "expected a mapping node, but found %s" % node.id,
                    node.start_mark)
        mapping = {}
        for key_node, value_node in node.value:
            # Crucial fix: use deep=True to recursively construct values immediately
            # so that lists and dicts are fully populated and can be merged.
            key = self.construct_object(key_node, deep=True)
            if not isinstance(key, collections.abc.Hashable):
                raise yaml.constructor.ConstructorError("while constructing a mapping", node.start_mark,
                        "found unhashable key", key_node.start_mark)
            value = self.construct_object(value_node, deep=True)
            
            if key in mapping:
                existing = mapping[key]
                if isinstance(existing, list) and isinstance(value, list):
                    merged = []
                    for item in existing + value:
                        if item not in merged:
                            merged.append(item)
                    mapping[key] = merged
                elif isinstance(existing, dict) and isinstance(value, dict):
                    for k, v in value.items():
                        if k in existing:
                            if isinstance(existing[k], list) and isinstance(v, list):
                                merged = []
                                for item in existing[k] + v:
                                    if item not in merged:
                                        merged.append(item)
                                existing[k] = merged
                            else:
                                existing[k] = v
                        else:
                            existing[k] = v
                else:
                    # For scalar values, overwrite with the latest value
                    mapping[key] = value
            else:
                mapping[key] = value
        return mapping

def preprocess_frontmatter(text):
    # Specific fix for LLG-0857-WLI floating concepts
    if "witness lodge inflation" in text.lower() or "llg-0857-wli" in text.lower():
        lines = text.split('\n')
        new_lines = []
        floating_concepts = []
        seen_summary = False
        for line in lines:
            if line.strip().startswith('summary:'):
                seen_summary = True
                new_lines.append(line)
            elif seen_summary and re.match(r'^\s+-\s+([a-zA-Z0-9_-]+)$', line):
                floating_concepts.append(line)
            else:
                new_lines.append(line)
        text = '\n'.join(new_lines)
        concepts_str = 'concepts:\n' + '\n'.join(floating_concepts)
        text = text.replace('concepts: []', concepts_str)

    # 1. Fix "concepts: []" followed by indented list items
    text = re.sub(r'([a-zA-Z0-9_-]+):\s*\[\]\s*\n(\s+-)', r'\1:\n\2', text)
    
    # 2. Fix duplicate id keys in list items of relatedEntries
    lines = text.split('\n')
    new_lines = []
    current_collection = None
    in_related_entries = False
    has_id_in_item = False
    
    for line in lines:
        if line.strip() == 'relatedEntries:':
            in_related_entries = True
            new_lines.append(line)
            continue
        
        if in_related_entries:
            if line.strip() and not line.startswith(' ') and not line.startswith('-'):
                in_related_entries = False
            
        if in_related_entries:
            match_col = re.match(r'^(\s+)-\s+collection:\s*(\S+)', line)
            if match_col:
                indent = match_col.group(1)
                current_collection = match_col.group(2)
                has_id_in_item = False
                new_lines.append(line)
                continue
            
            match_id = re.match(r'^(\s+)id:\s*(\S+)', line)
            if match_id:
                indent = match_id.group(1)
                if has_id_in_item:
                    new_lines.append(f"{indent[:-2]}- collection: {current_collection}")
                    new_lines.append(line)
                else:
                    has_id_in_item = True
                    new_lines.append(line)
                continue
        
        new_lines.append(line)
        
    return '\n'.join(new_lines)

def process_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        match = re.match(r'^---\s*\n(.*?)\n---\s*\n(.*)$', content, re.DOTALL)
        if not match:
            return False, "No frontmatter found"
        
        frontmatter = match.group(1)
        body = match.group(2)
        
        preprocessed = preprocess_frontmatter(frontmatter)
        data = yaml.load(preprocessed, Loader=MergingLoader)
        
        for key in ['date', 'updatedAt', 'lastKnownGoodState']:
            if key in data and not isinstance(data[key], str):
                data[key] = str(data[key])
        
        # Rule compliance: set updatedAt to '2026-06-28'
        data['updatedAt'] = '2026-06-28'
        
        new_yaml = yaml.dump(data, default_flow_style=False, allow_unicode=True, width=1000, sort_keys=False)
        new_content = f"---\n{new_yaml.strip()}\n---\n{body}"
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        return True, "Success"
    except Exception as e:
        return False, str(e)

def main():
    docs_dir = "./src/content/docs"
    print(f"Scanning & Fixing documents in: {docs_dir}")
    
    success_count = 0
    fail_count = 0
    
    for root, dirs, files in os.walk(docs_dir):
        for file in files:
            if file.endswith(('.mdx', '.md')):
                filepath = os.path.join(root, file)
                
                # Check for errors using unique keys
                has_error = False
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        fc = f.read()
                    m = re.match(r'^---\s*\n(.*?)\n---\s*\n', fc, re.DOTALL)
                    if m:
                        class UniqueKeyLoader(SafeLoader):
                            def construct_mapping(self, node, deep=False):
                                mapping = []
                                for key_node, value_node in node.value:
                                    key = self.construct_object(key_node, deep=deep)
                                    if key in mapping:
                                        raise ValueError(f"Duplicate key: '{key}'")
                                    mapping.append(key)
                                return super().construct_mapping(node, deep=deep)
                        
                        # Also check for concepts: [] followed by indentation
                        frontmatter = m.group(1)
                        if re.search(r'[a-zA-Z0-9_-]+:\s*\[\]\s*\n\s+-', frontmatter):
                            raise ValueError("concepts followed by list indentation")
                            
                        yaml.load(frontmatter, Loader=UniqueKeyLoader)
                except Exception:
                    has_error = True
                
                if has_error:
                    success, msg = process_file(filepath)
                    if success:
                        print(f"Fixed: {filepath}")
                        success_count += 1
                    else:
                        print(f"Failed to fix: {filepath} - {msg}")
                        fail_count += 1
                        
    print(f"\nFinished! Fixed {success_count} files. {fail_count} files failed to fix.")

if __name__ == "__main__":
    main()
