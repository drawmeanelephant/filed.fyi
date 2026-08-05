#!/usr/bin/env python3
"""repair_relationships.py — Repair the relationship export so semantic links survive bundling.

Problem
-------
Boris derives the exported ``related`` field from *structural* adjacency:
satellites list their parent trunk, trunks list every child, and in split
(part-based) builds the field frequently contains only ``parts/...`` bundle
container paths (see ``part_manifest.json``).  Explicit record relationships
that live only in source frontmatter (``relations``, legacy ``relatedEntries``)
or as explicit Markdown cross-references in prose are dropped, so semantic
links do not survive bundling.

Repair behavior (per export artifact)
-------------------------------------
* ``parent_entry`` remains the repository parent — untouched.
* ``related`` is rebuilt from **source-supported relationships only**:
    - frontmatter ``relations`` (Boris ``[relates_to=<entity-id>]`` syntax),
    - legacy ``relatedEntries`` (block list of ``collection:``/``id:`` pairs
      or bare scalars),
    - explicit Markdown cross-references in the body that resolve to another
      record file.
  Values are emitted as stable entity IDs (falling back to source-relative
  paths when an ID cannot be resolved), deduplicated, in first-seen order.
* Bundle-part membership (``parts/...`` entries) is moved to a separate
  ``bundle_parts:`` field — never into ``related``.
* Unresolved relationship targets are reported, not silently discarded.

Structural parent/child adjacency is intentionally *not* copied into
``related``: ``parent_entry`` already carries the repository parent, and a
trunk's child list is collection membership, not a semantic relationship.

No relationships are invented from shared tags, and no reverse edges are
inferred — only what the source declares is preserved.

Usage
-----
    python3 scripts/repair_relationships.py \
        --content content \
        --rag-dir publish/rag \
        --context-dir publish/context

Run from the repository root. Idempotent: re-running reports no changes.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path
from urllib.parse import urlsplit

FM_LINE = re.compile(r"^([A-Za-z_][A-Za-z0-9_]*):[ \t]*(.*?)[ \t]*$")
BLOCK_ITEM = re.compile(r"^[ \t]*-[ \t]+(.*)$")
SUB_KEY = re.compile(r"^[ \t]+([A-Za-z_][A-Za-z0-9_]*):[ \t]*(.*?)[ \t]*$")
INLINE_LIST = re.compile(r"^([A-Za-z_][A-Za-z0-9_]*):[ \t]*\[(.*)\][ \t]*$")
LINK = re.compile(r"\]\(([^)\s]+)")
RELATION_KIND = re.compile(r"^([a-z_]+)=(.*)$")

# Accepted target shapes (validated against the entity index at runtime).
ENTITY_ID = re.compile(r"^[A-Za-z0-9][A-Za-z0-9_.-]*(?:/[A-Za-z0-9][A-Za-z0-9_.-]*)+$")
TRUNK_ID = re.compile(r"^[a-z0-9][a-z0-9_-]*$")
SOURCE_PATH = re.compile(r"^[A-Za-z0-9][A-Za-z0-9_. -]*(?:/[A-Za-z0-9][A-Za-z0-9_. -]*)*\.md$")
PART_PATH = re.compile(r"^(?:parts?|bundle)/")
RAG_PATH = re.compile(r"^content/pages/.*\.md$")


def scalar(value: str | None) -> str:
    value = (value or "").strip()
    if len(value) >= 2 and value[0] == value[-1] and value[0] in "\"'":
        return value[1:-1]
    return value


def parse_frontmatter(text: str) -> tuple[dict[str, str | None], dict[str, list[object]]]:
    """Parse the bounded Boris frontmatter into scalars and block lists.

    Returns (fields, blocks) where fields maps scalar keys to their quoted or
    unquoted value (None for empty), and blocks maps list keys to items.  A
    block item is a bare string, or a dict of subfields when the item carries
    ``key: value`` continuations (legacy ``relatedEntries``).
    """
    lines = text.splitlines()
    if not lines or lines[0].rstrip("\r") != "---":
        return {}, {}
    close = next((i for i in range(1, len(lines)) if lines[i].rstrip("\r") == "---"), None)
    if close is None:
        return {}, {}
    fm = lines[1:close]
    fields: dict[str, str | None] = {}
    blocks: dict[str, list[object]] = {}
    index = 0
    while index < len(fm):
        line = fm[index]
        match = INLINE_LIST.match(line)
        if match:
            key, raw = match.groups()
            items = [item.strip() for item in raw.split(",") if item.strip()]
            blocks[key] = items
            index += 1
            continue
        match = FM_LINE.match(line)
        if not match:
            index += 1
            continue
        key, value = match.groups()
        if value.strip() == "" and index + 1 < len(fm) and BLOCK_ITEM.match(fm[index + 1]):
            items: list[object] = []
            cursor = index + 1
            while cursor < len(fm) and BLOCK_ITEM.match(fm[cursor]):
                item_line = fm[cursor]
                head = BLOCK_ITEM.match(item_line).group(1).strip()  # type: ignore[union-attr]
                subfields: dict[str, str] = {}
                cursor += 1
                while cursor < len(fm) and SUB_KEY.match(fm[cursor]):
                    sub_match = SUB_KEY.match(fm[cursor])
                    subfields[sub_match.group(1)] = scalar(sub_match.group(2))  # type: ignore[union-attr]
                    cursor += 1
                if subfields:
                    if head and ":" not in head:
                        subfields["__value"] = scalar(head)
                    items.append(subfields)
                else:
                    items.append(scalar(head))
            blocks[key] = items
            index = cursor
            continue
        fields[key] = scalar(value)
        index += 1
    return fields, blocks


def posix_normalize(target: str) -> str:
    parts: list[str] = []
    for part in target.replace("\\", "/").split("/"):
        if part in ("", "."):
            continue
        if part == "..":
            if parts:
                parts.pop()
            continue
        parts.append(part)
    return "/".join(parts)


class Entity:
    """A record in the source of record (``content/``)."""

    def __init__(self, source: str, entity_id: str, collection: str,
                 parent: str | None, title: str, role: str, text: str):
        self.source = source
        self.entity_id = entity_id
        self.collection = collection
        self.parent = parent
        self.title = title
        self.role = role
        self.text = text


def build_index(content_root: Path) -> tuple[dict[str, Entity], dict[str, Entity], list[str]]:
    """Index every record by entity ID and by source-relative path.

    Returns (by_id, by_source, warnings).
    """
    by_id: dict[str, Entity] = {}
    by_source: dict[str, Entity] = {}
    warnings: list[str] = []
    for path in sorted(content_root.rglob("*.md")):
        rel = path.relative_to(content_root).as_posix()
        try:
            text = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            warnings.append(f"{rel}: not UTF-8, skipped")
            continue
        fields, blocks = parse_frontmatter(text)
        entity_id = scalar(fields.get("id"))
        if not entity_id:
            warnings.append(f"{rel}: no id in frontmatter, skipped")
            continue
        parts = rel.split("/")
        collection = parts[0] if len(parts) > 1 else path.stem
        parent = scalar(fields.get("parent")) or None
        title = scalar(fields.get("title"))
        role = "trunk" if len(parts) == 1 else "satellite"
        entity = Entity(rel, entity_id, collection, parent, title, role, text)
        if entity_id in by_id:
            warnings.append(f"{rel}: duplicate entity id {entity_id!r} (also {by_id[entity_id].source})")
        by_id[entity_id] = entity
        by_source[rel] = entity
    return by_id, by_source, warnings


def extract_relations(by_id: dict[str, Entity], by_source: dict[str, Entity],
                      content_root: Path) -> tuple[dict[str, list[str]], list[tuple[str, str]]]:
    """Derive source-supported relationship targets for every entity.

    Returns (raw_targets, unresolved) where raw_targets maps entity ID to the
    raw target strings declared by that record's source, and unresolved lists
    (source, target) pairs that could not be turned into a canonical value.
    """
    raw_targets: dict[str, list[str]] = {}
    unresolved: list[tuple[str, str]] = []
    for entity in by_id.values():
        fields, blocks = parse_frontmatter(entity.text)
        targets: list[str] = []

        # 1. Boris `relations` field: `relations: [relates_to=<id>, ...]`.
        for item in blocks.get("relations", []):
            value = item if isinstance(item, str) else ""
            kind_match = RELATION_KIND.match(value)
            if kind_match:
                value = kind_match.group(2)
            if value.strip():
                targets.append(value.strip())

        # 2. Legacy `relatedEntries` block: `- collection: X` / `id: Y` or scalars.
        for item in blocks.get("relatedEntries", []):
            if isinstance(item, dict):
                ident = scalar(item.get("id")) or scalar(item.get("__value"))
                if ident:
                    targets.append(ident)
            elif isinstance(item, str) and item.strip():
                targets.append(item.strip())

        # 3. Explicit Markdown cross-references in the body.
        body_offset = 0
        if entity.text.startswith("---"):
            close = entity.text.find("\n---", 3)
            if close != -1:
                body_offset = close + 4
        body = entity.text[body_offset:]
        for destination in LINK.findall(body):
            parsed = urlsplit(destination)
            if parsed.scheme or parsed.netloc or not parsed.path.lower().endswith(".md"):
                continue
            base = Path(entity.source).parent.as_posix()
            joined = posix_normalize(f"{base}/{parsed.path}" if base != "." else parsed.path)
            if joined == entity.source:
                continue
            if joined in by_source:
                targets.append(joined)
            else:
                candidate = content_root / joined
                if candidate.is_file():
                    targets.append(joined)
                else:
                    unresolved.append((entity.source, joined))

        if targets:
            raw_targets[entity.entity_id] = targets
    return raw_targets, unresolved


def resolve_target(target: str, by_id: dict[str, Entity],
                   by_source: dict[str, Entity]) -> str | None:
    """Resolve a raw relationship target to a canonical entity ID.

    Accepts entity IDs, source-relative paths (with or without ``.md``), and
    bare satellite IDs when the suffix is unambiguous.  Returns None when the
    target cannot be resolved (reported, never silently dropped).
    """
    value = target.strip().strip('"\'')
    if not value:
        return None
    if value in by_id:
        return value
    if value in by_source:
        return by_source[value].entity_id
    if not value.endswith(".md") and (value + ".md") in by_source:
        return by_source[value + ".md"].entity_id
    if "/" not in value and not value.endswith(".md"):
        hits = [entity for entity in by_id.values() if entity.entity_id.endswith("/" + value)]
        if len(hits) == 1:
            return hits[0].entity_id
        if len(hits) > 1:
            return None  # ambiguous — leave for the integrity report
    return None


def semantic_relationships(by_id: dict[str, Entity], by_source: dict[str, Entity],
                           content_root: Path
                           ) -> tuple[dict[str, list[str]], list[tuple[str, str]]]:
    """Derive the ordered, deduplicated canonical relationship list per entity.

    Returns (semantic_by_id, unresolved) where semantic_by_id maps entity ID to
    the canonical entity IDs of its source-supported relationships (first-seen
    order, duplicates removed), and unresolved lists (source, raw_target) pairs
    that could not be resolved to a record.

    Shared by the repair and the integrity validator so both compute the
    expected relationship set identically.
    """
    raw_targets, unresolved = extract_relations(by_id, by_source, content_root)
    semantic_by_id: dict[str, list[str]] = {}
    unresolved_list: list[tuple[str, str]] = []
    for entity_id, targets in raw_targets.items():
        canonical: list[str] = []
        for target in targets:
            resolved = resolve_target(target, by_id, by_source)
            if resolved is None:
                unresolved_list.append((by_id[entity_id].source, target))
                continue
            if resolved not in canonical:  # repeated identical values are deduplicated
                canonical.append(resolved)
        if canonical:
            semantic_by_id[entity_id] = canonical
    unresolved_list.extend(unresolved)
    return semantic_by_id, unresolved_list


def related_block(frontmatter: str, key: str) -> tuple[list[str], str]:
    """Return (values, rewritten_block) for a block/inline list field.

    The rewritten block is an indented ``  - value`` block for the given key.
    """
    lines = frontmatter.splitlines()
    values: list[str] = []
    rewrite: str | None = None
    for index, line in enumerate(lines):
        inline = INLINE_LIST.match(line)
        if inline and inline.group(1) == key:
            values = [item.strip() for item in inline.group(2).split(",") if item.strip()]
            rewrite = key + ":\n" + "".join(f"  - {value}\n" for value in values)
            break
        match = FM_LINE.match(line)
        if match and match.group(1) == key and not match.group(2).strip():
            values = []
            cursor = index + 1
            while cursor < len(lines) and BLOCK_ITEM.match(lines[cursor]):
                values.append(BLOCK_ITEM.match(lines[cursor]).group(1).strip())  # type: ignore[union-attr]
                cursor += 1
            rewrite = key + ":\n" + "".join(f"  - {value}\n" for value in values)
            break
    if rewrite is None:
        rewrite = f"{key}:\n" + "".join(f"  - {value}\n" for value in values)
    return values, rewrite


def replace_field(frontmatter: str, key: str, values: list[str]) -> str:
    """Replace (or append) a block field in the frontmatter, preserving order."""
    lines = frontmatter.splitlines()
    block_lines = [key + ":"] + [f"  - {value}" for value in values]
    for index, line in enumerate(lines):
        inline = INLINE_LIST.match(line)
        if inline and inline.group(1) == key:
            cursor = index + 1
            while cursor < len(lines) and BLOCK_ITEM.match(lines[cursor]):
                cursor += 1
            return "\n".join(lines[:index] + block_lines + lines[cursor:])
        match = FM_LINE.match(line)
        if match and match.group(1) == key:
            cursor = index + 1
            while cursor < len(lines) and BLOCK_ITEM.match(lines[cursor]):
                cursor += 1
            return "\n".join(lines[:index] + block_lines + lines[cursor:])
    # Field absent: append at the end of the frontmatter block.
    return "\n".join(lines + block_lines)


def replace_scalar_or_list(frontmatter: str, key: str, inline_values: list[str]) -> str:
    """Replace a scalar/list field with an inline list, or append it."""
    lines = frontmatter.splitlines()
    if inline_values:
        line = f"{key}: [{', '.join(inline_values)}]"
    else:
        line = f"{key}:"
    for index, line_text in enumerate(lines):
        match = FM_LINE.match(line_text)
        if match and match.group(1) == key:
            cursor = index + 1
            while cursor < len(lines) and BLOCK_ITEM.match(lines[cursor]):
                cursor += 1
            return "\n".join(lines[:index] + [line] + lines[cursor:])
    return "\n".join(lines + [line])


def split_frontmatter(text: str) -> tuple[str, str] | None:
    lines = text.splitlines()
    if not lines or lines[0].rstrip("\r") != "---":
        return None
    close = next((i for i in range(1, len(lines)) if lines[i].rstrip("\r") == "---"), None)
    if close is None:
        return None
    return "\n".join(lines[:close]), "\n".join(lines[close:])


def repair_rag_page(path: Path, semantic: list[str], content_root: Path) -> tuple[bool, list[str]]:
    """Repair one RAG page file: rebuild ``related``, split out ``bundle_parts``.

    Returns (changed, diagnostics).
    """
    text = path.read_text(encoding="utf-8")
    split = split_frontmatter(text)
    if split is None:
        return False, []
    frontmatter, body = split
    values, _ = related_block(frontmatter, "related")
    part_paths = [value for value in values if PART_PATH.match(value)]
    # Drop anything pointing at bundle containers or export-internal rag paths;
    # the remaining pre-existing values are structural adjacency, which
    # parent_entry already carries and is intentionally not re-emitted.
    new_frontmatter = replace_field(frontmatter, "related", semantic)

    # Bundle membership is the ordered, deduplicated union of any bundle_parts
    # preserved by an earlier run and any part paths still sitting in related.
    # Existing memberships must survive subsequent runs (idempotency): never
    # clear bundle_parts merely because the current related no longer contains
    # container paths.
    existing_bundle, _ = related_block(frontmatter, "bundle_parts")
    bundle: list[str] = []
    seen: set[str] = set()
    for value in existing_bundle + part_paths:
        if value not in seen:
            seen.add(value)
            bundle.append(value)
    if bundle:
        new_frontmatter = replace_field(new_frontmatter, "bundle_parts", bundle)
    # Nothing to preserve (no existing memberships, no part paths in related):
    # leave any empty bundle_parts field untouched for byte-stable output.
    rebuilt = new_frontmatter + "\n" + body
    if text.endswith("\n") and not rebuilt.endswith("\n"):
        rebuilt += "\n"  # preserve the original trailing newline (byte-stable re-runs)
    diagnostics: list[str] = []
    if part_paths:
        diagnostics.append(f"moved {len(part_paths)} bundle part reference(s) out of related")
    if rebuilt != text:
        path.write_text(rebuilt, encoding="utf-8")
        return True, diagnostics
    return False, diagnostics


def repair_context_page(path: Path, semantic: list[str]) -> tuple[bool, list[str]]:
    """Repair one context page: fill the outer ``relations`` field from source."""
    text = path.read_text(encoding="utf-8")
    split = split_frontmatter(text)
    if split is None:
        return False, []
    frontmatter, body = split
    typed = [f"relates_to={value}" for value in semantic]
    new_frontmatter = replace_scalar_or_list(frontmatter, "relations", typed)
    rebuilt = new_frontmatter + "\n" + body
    if text.endswith("\n") and not rebuilt.endswith("\n"):
        rebuilt += "\n"  # preserve the original trailing newline (byte-stable re-runs)
    if rebuilt != text:
        path.write_text(rebuilt, encoding="utf-8")
        return True, []
    return False, []


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--content", type=Path, default=Path("content"),
                        help="source of record (default: content)")
    parser.add_argument("--rag-dir", type=Path, default=Path("publish/rag"),
                        help="Boris RAG export directory (default: publish/rag)")
    parser.add_argument("--context-dir", type=Path, default=Path("publish/context"),
                        help="Boris context bundle directory (default: publish/context)")
    args = parser.parse_args()

    try:
        by_id, by_source, warnings = build_index(args.content)
    except OSError as error:
        print(f"relationship repair: error: {error}", file=sys.stderr)
        return 2
    if not by_id:
        print(f"relationship repair: error: no records indexed under {args.content}", file=sys.stderr)
        return 2

    semantic_by_id, unresolved_for_entity = semantic_relationships(
        by_id, by_source, args.content)

    changed_files = 0
    moved_parts = 0
    if args.rag_dir.is_dir():
        pages = sorted(args.rag_dir.glob("content/pages/**/*.md"))
        for path in pages:
            text = path.read_text(encoding="utf-8")
            fields, _ = parse_frontmatter(text)
            entity_id = scalar(fields.get("entity_id"))
            if not entity_id:
                continue
            semantic = semantic_by_id.get(entity_id, [])
            changed, diagnostics = repair_rag_page(path, semantic, args.content)
            for note in diagnostics:
                print(f"  {path.relative_to(args.rag_dir)}: {note}")
            if changed:
                changed_files += 1
        print(f"repaired {changed_files} RAG page file(s)")

    if args.context_dir.is_dir():
        pages = sorted(args.context_dir.glob("pages/**/*.md"))
        for path in pages:
            text = path.read_text(encoding="utf-8")
            fields, _ = parse_frontmatter(text)
            entity_id = scalar(fields.get("entity_id"))
            if not entity_id:
                continue
            semantic = semantic_by_id.get(entity_id, [])
            changed, _ = repair_context_page(path, semantic)
            if changed:
                changed_files += 1
        print(f"repaired {changed_files} context page file(s) total (RAG + context)")

    relation_count = sum(len(values) for values in semantic_by_id.values())
    print(f"source-supported relationships: {relation_count} across {len(semantic_by_id)} record(s)")
    if unresolved_for_entity:
        print(f"unresolved relationship targets: {len(unresolved_for_entity)}")
        for source, target in unresolved_for_entity:
            print(f"  {source}: {target}")
    else:
        print("unresolved relationship targets: 0")
    for warning in warnings:
        print(f"warning: {warning}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
