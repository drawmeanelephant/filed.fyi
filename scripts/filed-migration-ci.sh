#!/usr/bin/env bash
set -Eeuo pipefail

BORIS_ROOT=${1:?usage: $0 BORIS_ROOT FILED_SOURCE_ROOT}
FILED_ROOT=${2:?usage: $0 BORIS_ROOT FILED_SOURCE_ROOT}
BORIS_ROOT=$(cd "$BORIS_ROOT" && pwd)
FILED_ROOT=$(cd "$FILED_ROOT" && pwd)
TARGET_ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
BORIS="$BORIS_ROOT/zig-out/bin/boris"
LAB="$BORIS_ROOT/tools/migration-lab/zig-out/bin/boris-migration-lab"
BORIS_COMMIT=f14ac7a90587aa5440513df10ad880259f7217a1
FILED_COMMIT=be386dd2000a2dfe853bf57b014af4b4e196e6fc

for tool in jq git shasum; do
  command -v "$tool" >/dev/null || { echo "ERROR: required tool '$tool' is missing" >&2; exit 2; }
done
test -x "$BORIS" || { echo "ERROR: Boris binary was not built at $BORIS" >&2; exit 2; }
test -x "$LAB" || { echo "ERROR: migration lab was not built at $LAB" >&2; exit 2; }
test "$(git -C "$BORIS_ROOT" rev-parse HEAD)" = "$BORIS_COMMIT" || {
  echo "ERROR: Boris checkout is not pinned to $BORIS_COMMIT" >&2; exit 2;
}
test "$(git -C "$FILED_ROOT" rev-parse HEAD)" = "$FILED_COMMIT" || {
  echo "ERROR: Filed source checkout is not pinned to $FILED_COMMIT" >&2; exit 2;
}

TMP=$(mktemp -d)
STAGE="$BORIS_ROOT/.filed-ci-stage"
cleanup() { rm -rf "$TMP" "$STAGE" "$BORIS_ROOT/test-output/filed-ci"; }
trap cleanup EXIT

source_hashes() {
  (cd "$FILED_ROOT" && git ls-files -z | sort -z | xargs -0 shasum -a 256)
}

source_hashes > "$TMP/source-before.sha256"
test -z "$(git -C "$FILED_ROOT" status --porcelain)" || {
  echo "ERROR: Filed source checkout was not clean before conversion" >&2; exit 1;
}

set +e
(cd "$TARGET_ROOT" && "$BORIS" check --input content --format json) > "$TMP/target-check.json" 2>&1
target_check_status=$?
set -e
jq -e '
  .format == "boris-documentation-intelligence" and
  .summary.pages > 500 and .summary.pages < 1000 and
  ([.findings[] | select(.code != "unreferenced_page")] | length == 0)
' "$TMP/target-check.json" >/dev/null || {
  echo "ERROR: target Markdown/frontmatter/graph validation failed" >&2
  cat "$TMP/target-check.json" >&2
  exit 1
}
test "$target_check_status" = 0 -o "$target_check_status" = 1 || {
  echo "ERROR: target graph check exited unexpectedly with $target_check_status" >&2
  exit 1
}

fixture="$TMP/filed-fyi-v08-slice-src"
while read -r rel; do
  test -f "$FILED_ROOT/$rel" || { echo "ERROR: missing fixture source $rel" >&2; exit 1; }
  mkdir -p "$fixture/$(dirname "$rel")"
  cp "$FILED_ROOT/$rel" "$fixture/$rel"
done <<'EOF'
src/content/docs/index.mdx
src/content/docs/lorelog/LLG-0322-FTD.mdx
src/content/docs/mascots/046.svgon-the-line.mdx
src/content/docs/reference/directives/tri-directive-doctrine.mdx
src/content/docs/reference/fref-0050-avoc.mdx
src/assets/svgon-the-line.png
EOF

test "$(find "$fixture/src/content/docs" -type f \( -name '*.md' -o -name '*.mdx' \) | wc -l | tr -d ' ')" = 5 || {
  echo "ERROR: representative fixture must contain exactly five Markdown pages" >&2; exit 1;
}
while read -r page; do
  grep -q '^---$' "$page" || { echo "ERROR: missing frontmatter fence in $page" >&2; exit 1; }
done < <(find "$fixture/src/content/docs" -type f \( -name '*.md' -o -name '*.mdx' \))

run_a="$TMP/run-a"
run_b="$TMP/run-b"
"$LAB" --mode=starlight --root="$fixture" --out="$run_a" --locale=en --max-pages=20
"$LAB" --mode=starlight --root="$fixture" --out="$run_b" --locale=en --max-pages=20

jq -e '
  .selected_candidates == 5 and
  .converted_pages == 8 and
  .inventory_count == 5 and
  .asset_count == 1 and
  .boundary_counts.preserved == 5 and
  .boundary_counts.stripped == 0
' "$run_a/report.json" >/dev/null || {
  echo "ERROR: Filed dogfood inventory/count assertions failed" >&2; exit 1;
}

tree_hashes() {
  (cd "$1" && find . -type f ! -name compile_report.json -print0 | sort -z | xargs -0 shasum -a 256)
}
tree_hashes "$run_a" > "$TMP/run-a.sha256"
tree_hashes "$run_b" > "$TMP/run-b.sha256"
diff -u "$TMP/run-a.sha256" "$TMP/run-b.sha256" >/dev/null || {
  echo "ERROR: repeated migration outputs are not deterministic" >&2; exit 1;
}

mkdir -p "$STAGE/raw" "$STAGE/manual"
cp -R "$run_a/content" "$STAGE/raw/content"
cp -R "$run_a/content" "$STAGE/manual/content"
set +e
(cd "$BORIS_ROOT" && "$BORIS" --input .filed-ci-stage/raw/content \
  --html-dir test-output/filed-ci/raw-html --html-layout layouts/main.html) \
  >"$TMP/raw.stdout" 2>"$TMP/raw.stderr"
raw_status=$?
set -e
test "$raw_status" = 1 && grep -q 'EASSET' "$TMP/raw.stderr" || {
  echo "ERROR: raw migration did not fail with the expected EASSET diagnostic" >&2
  cat "$TMP/raw.stderr" >&2
  exit 1
}

mkdir -p "$STAGE/manual/content/mascots/046.svgon-the-line.assets"
cp "$FILED_ROOT/src/assets/svgon-the-line.png" \
  "$STAGE/manual/content/mascots/046.svgon-the-line.assets/svgon-the-line.png"
sed 's#../../../assets/svgon-the-line.png#046.svgon-the-line.assets/svgon-the-line.png#' \
  "$STAGE/manual/content/mascots/046.svgon-the-line.md" \
  > "$STAGE/manual/content/mascots/046.svgon-the-line.md.tmp"
mv "$STAGE/manual/content/mascots/046.svgon-the-line.md.tmp" \
  "$STAGE/manual/content/mascots/046.svgon-the-line.md"
(cd "$BORIS_ROOT" && "$BORIS" --input .filed-ci-stage/manual/content \
  --html-dir test-output/filed-ci/manual-html --html-layout layouts/main.html --quiet)
test "$(find "$BORIS_ROOT/test-output/filed-ci/manual-html" -type f -name '*.html' | wc -l | tr -d ' ')" = 8 || {
  echo "ERROR: manual asset placement did not produce eight HTML pages" >&2; exit 1;
}

source_hashes > "$TMP/source-after.sha256"
diff -u "$TMP/source-before.sha256" "$TMP/source-after.sha256" >/dev/null || {
  echo "ERROR: migration modified the Filed source checkout" >&2; exit 1;
}
test -z "$(git -C "$FILED_ROOT" status --porcelain)" || {
  echo "ERROR: Filed source checkout is dirty after conversion" >&2; exit 1;
}

echo "Filed migration gate passed: 5 source pages, 8 emitted pages, deterministic output, honest EASSET failure, manual asset compile, and immutable source."
