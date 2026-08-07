#!/usr/bin/env python3
"""test_normalize_literal_newline_haikus.py — Regression tests for the
literal-\\n haiku verse normalization tool.

Covers the migration representation defect and its repair contract:

  * one affected haiku (2 literal escapes in a verse) is repaired,
  * multiple literal escapes inside one intended verse block are repaired,
  * legitimate prose mentioning ``\\n`` is left untouched (refused),
  * a double backslash (``\\\\n``) is intentional text, never touched,
  * fenced code containing ``\\n`` is left untouched,
  * an already-correct physical-line haiku is left byte-identical,
  * an ambiguous case (literal ``\\n`` outside a haiku verse section) is
    refused and reported, never guessed,
  * a second apply changes zero bytes (idempotence),
  * the tool never relies on external historical sources: evidence is the
    structural rule, and anything unprovable fails closed.

Fixtures are raw triple-quoted strings: ``\\n`` in a fixture is the literal
two-character backslash+n defect; real newlines are actual line breaks.

Usage:
    python3 scripts/test_normalize_literal_newline_haikus.py
"""

import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "scripts"))

FAILURES = []


def check(label, condition):
    if condition:
        print(f"  ok  {label}")
    else:
        FAILURES.append(label)
        print(f"  !!  {label}")


class Corpus:
    """A throwaway content tree for one test scenario."""

    def __init__(self):
        self.dir = Path(tempfile.mkdtemp(prefix="bsn-test-"))

    def write(self, rel, text):
        p = self.dir / rel
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(text, encoding="utf-8")
        return p

    def cleanup(self):
        shutil.rmtree(self.dir, ignore_errors=True)


def run_tool(corpus, *args):
    return subprocess.run(
        [sys.executable, os.path.join(ROOT, "scripts",
                                      "normalize_literal_newline_haikus.py"),
         "--content", str(corpus.dir), *args],
        capture_output=True, text=True,
    )


ONE_AFFECTED = r"""---
title: "Cass D Failure"
id: haikus/HAI-0006
parent: haikus
status: archived
tags: ["haikus"]
---

# Cass D Failure

## Haikus


Three forms say sorry  \nI forgot the commit hash  \nritual complete  


Syncing feelings now  \ninconsistent connection  \nbuffer is erased  
"""

MULTI_ESCAPE = r"""---
title: "Style Guide"
id: haikus/HAI-FREF-0030-AVSG
parent: haikus
status: published
tags: ["haikus"]
---

# Style Guide

## Haikus

\nDocument the truth  \nThe manual stands unchanged  \nQuiet policy\n\n\n\nRead the written rule  \nMeaning drifted long ago  \nPaper still remains\n


Style is for the dead  
Formatting will rot away  
Plain text is enough  
"""

PROSE_MENTION = r"""---
title: "Prose"
id: haikus/HAI-0001
parent: haikus
status: published
tags: ["haikus"]
---

# Prose

## Notes

The literal sequence \n (backslash n) is a common escape in many languages.
We do not touch prose text.

## Haikus

One line here  \ntwo lines here  \nthree lines  
"""

DOUBLE_ESCAPE = r"""---
title: "Esc"
id: haikus/HAI-0002
parent: haikus
status: published
tags: ["haikus"]
---

# Esc

## Haikus

print("a\\nb")
second line
third line
"""

FENCED = r"""---
title: "Code"
id: haikus/HAI-0003
parent: haikus
status: published
tags: ["haikus"]
---

# Code

## Haikus

First verse line  \nsecond verse line  \nthird line  

```ts
const s = "line1\nline2";
```

:::note
Literal \n inside a note stays.
:::
"""

CORRECT = r"""---
title: "Correct"
id: haikus/HAI-0004
parent: haikus
status: published
tags: ["haikus"]
---

# Correct

## Haikus


Fault rerouted now  
to a desk that cannot speak  
 ritual is safe  


Triple filed blame  
scapegoat chosen with a smile  
record looks correct  
"""

AMBIGUOUS = r"""---
title: "Alpha"
id: mascots/M-0001
parent: mascots
status: published
tags: ["mascots"]
---

# Alpha

## Biography

A story about \n escapes and newlines in prose.

## Haiku Log

verse one  \nverse two  \nverse three  
"""

SCOPED = r"""---
title: "A"
id: haikus/HAI-0005
parent: haikus
status: published
tags: ["haikus"]
---

# A

## Haikus

line one  \nline two  \nline three  
"""

SCOPED_MASCOT = r"""---
title: "Beta"
id: mascots/M-0002
parent: mascots
status: published
tags: ["mascots"]
---

# Beta

## Haiku Log

line one  \nline two  \nline three  
"""


def test_one_affected_haiku():
    print("== one affected haiku repaired ==")
    c = Corpus()
    try:
        path = c.write("haikus/hai-0006-cass-d-failure.md", ONE_AFFECTED)
        r = run_tool(c, "--check")
        check("check exits 1 while defects remain", r.returncode == 1)
        check("check is read-only", path.read_text() == ONE_AFFECTED)
        r = run_tool(c, "--apply")
        check("apply exits 0", r.returncode == 0)
        repaired = path.read_text()
        check("no literal \\n remains", "\\n" not in repaired)
        check("first verse line breaks are physical",
              "Three forms say sorry  \nI forgot the commit hash  \n"
              "ritual complete" in repaired)
        check("second verse also repaired",
              "Syncing feelings now  \ninconsistent connection  \n"
              "buffer is erased" in repaired)
        check("frontmatter preserved byte-identical",
              'title: "Cass D Failure"\nid: haikus/HAI-0006\n'
              'parent: haikus\nstatus: archived\ntags: ["haikus"]'
              in repaired)
        r = run_tool(c, "--apply")
        check("second apply exits 0", r.returncode == 0)
        check("second apply changes zero bytes", path.read_text() == repaired)
        check("check passes clean after apply",
              run_tool(c, "--check").returncode == 0)
    finally:
        c.cleanup()


def test_multiple_escapes_one_verse():
    print("== multiple literal escapes in one intended verse ==")
    c = Corpus()
    try:
        path = c.write("haikus/hai-fref-0030-avsg.md", MULTI_ESCAPE)
        r = run_tool(c, "--apply")
        check("apply exits 0", r.returncode == 0)
        text = path.read_text()
        check("escaped run fully normalized", "\\n" not in text)
        check("first verse has physical lines",
              "Document the truth  \nThe manual stands unchanged  \n"
              "Quiet policy" in text)
        check("second verse recovered",
              "Read the written rule  \nMeaning drifted long ago  \n"
              "Paper still remains" in text)
        check("already-correct verse untouched",
              "Style is for the dead  \nFormatting will rot away  \n"
              "Plain text is enough  \n" in text)
    finally:
        c.cleanup()


def test_prose_mention_refused():
    print("== legitimate prose mentioning \\n refused, never guessed ==")
    c = Corpus()
    try:
        path = c.write("haikus/hai-0001-prose.md", PROSE_MENTION)
        r = run_tool(c, "--apply")
        check("apply refuses and exits 1",
              r.returncode == 1 and "refused" in (r.stderr or ""))
        check("nothing written on refused run", path.read_text() == PROSE_MENTION)
        check("prose \\n still present", "sequence \\n (backslash" in path.read_text())
    finally:
        c.cleanup()


def test_double_backslash_untouched():
    print("== double backslash \\\\n is intentional text, never touched ==")
    c = Corpus()
    try:
        path = c.write("haikus/hai-0002-escaped.md", DOUBLE_ESCAPE)
        r = run_tool(c, "--apply")
        check("apply exits 0", r.returncode == 0)
        check("double escape preserved", "a\\\\nb" in path.read_text())
        check("file byte-identical", path.read_text() == DOUBLE_ESCAPE)
    finally:
        c.cleanup()


def test_fenced_code_untouched():
    print("== fenced code and notes containing \\n left untouched ==")
    c = Corpus()
    try:
        path = c.write("haikus/hai-0003-code.md", FENCED)
        r = run_tool(c, "--apply")
        check("apply exits 0", r.returncode == 0)
        text = path.read_text()
        check("fenced code \\n untouched", '"line1\\nline2"' in text)
        check("note container \\n untouched",
              "Literal \\n inside a note stays." in text)
        check("verse \\n normalized",
              "First verse line  \nsecond verse line  \nthird line" in text)
        check("fence markers intact", "```ts" in text and "```" in text)
        check("note markers intact", ":::note" in text and ":::" in text)
    finally:
        c.cleanup()


def test_correct_haiku_byte_identical():
    print("== already-correct physical-line haiku left byte-identical ==")
    c = Corpus()
    try:
        path = c.write("haikus/hai-0004-correct.md", CORRECT)
        before = path.read_bytes()
        r = run_tool(c, "--apply")
        check("apply exits 0", r.returncode == 0)
        check("byte-identical after apply", path.read_bytes() == before)
        check("check passes clean", run_tool(c, "--check").returncode == 0)
    finally:
        c.cleanup()


def test_ambiguous_refused():
    print("== ambiguous case refused, never guessed ==")
    c = Corpus()
    try:
        path = c.write("mascots/0001.alpha.md", AMBIGUOUS)
        r = run_tool(c, "--apply")
        check("apply refuses and exits 1",
              r.returncode == 1 and "refused" in (r.stderr or ""))
        check("nothing written on refused run", path.read_text() == AMBIGUOUS)
    finally:
        c.cleanup()


UNICODE = r"""---
title: "Unicode"
id: haikus/HAI-0007
parent: haikus
status: published
tags: ["haikus"]
---

# Unicode

## Haikus

霜の日  \n影が長くなる  \n春はまだ遠い  


もう一息  \n辛抱強く待つ  \n桜が咲く日  
"""


def test_unicode_preserved():
    print("== Unicode verse preserved byte-for-byte ==")
    c = Corpus()
    try:
        path = c.write("haikus/hai-0007-unicode.md", UNICODE)
        r = run_tool(c, "--apply")
        check("apply exits 0", r.returncode == 0)
        text = path.read_text()
        check("no literal \\n remains", "\\n" not in text)
        check("verse text and line breaks preserved",
              "霜の日  \n影が長くなる  \n春はまだ遠い" in text)
        check("second verse intact",
              "もう一息  \n辛抱強く待つ  \n桜が咲く日" in text)
        check("frontmatter unicode untouched", 'title: "Unicode"' in text)
    finally:
        c.cleanup()


def test_scope_haikus_only():
    print("== --scope=haikus restricts to the haikus collection ==")
    c = Corpus()
    try:
        haiku_path = c.write("haikus/hai-0005-a.md", SCOPED)
        mascot_path = c.write("mascots/0002.beta.md", SCOPED_MASCOT)
        r = run_tool(c, "--apply", "--scope=haikus")
        check("apply exits 0", r.returncode == 0)
        check("haiku file repaired", "\\n" not in haiku_path.read_text())
        check("mascot file untouched", "\\n" in mascot_path.read_text())
    finally:
        c.cleanup()


def main():
    tests = [
        test_one_affected_haiku,
        test_multiple_escapes_one_verse,
        test_prose_mention_refused,
        test_double_backslash_untouched,
        test_fenced_code_untouched,
        test_correct_haiku_byte_identical,
        test_ambiguous_refused,
        test_unicode_preserved,
        test_scope_haikus_only,
    ]
    for test in tests:
        test()
        print()

    if FAILURES:
        print("FAILED:")
        for failure in FAILURES:
            print(f"  - {failure}")
        sys.exit(1)
    print("PASS — literal-\\n haiku normalization behaves as specified, "
          "is idempotent, and refuses ambiguous cases.")


if __name__ == "__main__":
    main()
