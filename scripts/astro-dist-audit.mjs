// scripts/astro-dist-audit.mjs
import fs from 'node:fs';
import path from 'node:path';

const DIST_DIR = path.resolve('./dist');
const OUTPUT_FILE = path.resolve('./todo/html-output-audit.md');

function getHtmlFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      results.push(...getHtmlFiles(filePath));
    } else if (file.endsWith('.html')) {
      results.push(filePath);
    }
  }
  return results;
}

function checkFileForDuplicates(content) {
  const regex = /<div\s+[^>]*id="([^"]+)"[^>]*class="[^"]*inline-poem-wrapper[^"]*"|<div\s+[^>]*class="[^"]*inline-poem-wrapper[^"]*"[^>]*id="([^"]+)"/g;
  const ids = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    const id = match[1] || match[2];
    if (id) {
      ids.push(id);
    }
  }
  
  const counts = {};
  const duplicates = [];
  for (const id of ids) {
    counts[id] = (counts[id] || 0) + 1;
    if (counts[id] === 2) {
      duplicates.push(id);
    }
  }
  return duplicates;
}

function checkLink(href, currentFile) {
  // Ignore external links, mailto, tel, empty, and same-page anchor links
  if (!href || href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#')) {
    return { ok: true };
  }

  // Remove query parameters and hash anchors
  const urlPath = href.split('?')[0].split('#')[0];
  if (!urlPath) {
    return { ok: true };
  }

  let resolvedPath;
  if (urlPath.startsWith('/')) {
    resolvedPath = path.join(DIST_DIR, urlPath);
  } else {
    // Relative link
    resolvedPath = path.join(path.dirname(currentFile), urlPath);
  }

  // Normalize path
  resolvedPath = path.normalize(resolvedPath);

  // Checks:
  // 1. If resolvedPath exists as a file
  // 2. If resolvedPath exists as a directory, check for index.html in it
  // 3. If resolvedPath + '.html' exists as a file
  if (fs.existsSync(resolvedPath)) {
    const stat = fs.statSync(resolvedPath);
    if (stat.isDirectory()) {
      const indexPath = path.join(resolvedPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        return { ok: true, resolvedPath: indexPath };
      }
    } else {
      return { ok: true, resolvedPath };
    }
  }

  const htmlPath = resolvedPath + '.html';
  if (fs.existsSync(htmlPath)) {
    return { ok: true, resolvedPath: htmlPath };
  }

  // Also check if resolvedPath ends with '/' and without '/' exists
  if (resolvedPath.endsWith('/')) {
    const trimmedPath = resolvedPath.slice(0, -1);
    if (fs.existsSync(trimmedPath)) {
      const stat = fs.statSync(trimmedPath);
      if (!stat.isDirectory()) return { ok: true, resolvedPath: trimmedPath };
    }
  }

  return { ok: false, resolvedPath };
}

function runAudit() {
  console.log(`▶ Starting HTML build output audit in: ${DIST_DIR}...`);
  const htmlFiles = getHtmlFiles(DIST_DIR);
  console.log(`Found ${htmlFiles.length} HTML files.`);

  const duplicateFailures = [];
  const linkFailures = [];
  const objectLeakFailures = [];

  for (const file of htmlFiles) {
    const relPath = path.relative(DIST_DIR, file).replace(/\\/g, '/');
    let content;
    try {
      content = fs.readFileSync(file, 'utf8');
    } catch (err) {
      console.error(`Error reading file ${file}:`, err);
      continue;
    }

    // 1. Check for duplicate poem IDs
    const duplicates = checkFileForDuplicates(content);
    if (duplicates.length > 0) {
      duplicateFailures.push({
        file: relPath,
        duplicates
      });
    }

    // 2. Check for object leak
    if (content.includes('[object Object]')) {
      const occurrences = (content.match(/\[object Object\]/g) || []).length;
      objectLeakFailures.push({
        file: relPath,
        occurrences
      });
    }

    // 3. Check for broken links
    const linkRegex = /\shref=["']([^"']+)["']/g;
    let match;
    const checkedLinks = new Set();
    while ((match = linkRegex.exec(content)) !== null) {
      const href = match[1];
      if (checkedLinks.has(href)) continue;
      checkedLinks.add(href);

      const res = checkLink(href, file);
      if (!res.ok) {
        linkFailures.push({
          page: relPath,
          href,
          attemptedPath: path.relative(DIST_DIR, res.resolvedPath).replace(/\\/g, '/')
        });
      }
    }
  }

  const hasFailures = duplicateFailures.length > 0 || linkFailures.length > 0 || objectLeakFailures.length > 0;
  
  // Ensure todo/ output directory exists
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Generate Markdown report
  let report = `---
title: "HTML Build Output Audit"
date: ${new Date().toISOString().split('T')[0]}
updatedAt: ${new Date().toISOString().split('T')[0]}
total_files_audited: ${htmlFiles.length}
duplicate_failures_count: ${duplicateFailures.length}
broken_links_count: ${linkFailures.length}
object_leaks_count: ${objectLeakFailures.length}
---

# HTML Build Output Audit Report

This audit traverses the compiled HTML files in \`dist/\` to ensure structural integrity and check for output leakage or ghost routing.

## Summary

| Metric | Count | Status |
|--------|-------|--------|
| Total HTML files audited | ${htmlFiles.length} | — |
| Duplicate Poem Wrapper IDs | ${duplicateFailures.length} | ${duplicateFailures.length === 0 ? '✅ PASS' : '🔴 FAIL'} |
| Object Leaks (\`[object Object]\`) | ${objectLeakFailures.length} | ${objectLeakFailures.length === 0 ? '✅ PASS' : '🔴 FAIL'} |
| Broken Local Links / Ghost Routing | ${linkFailures.length} | ${linkFailures.length === 0 ? '✅ PASS' : '🔴 FAIL'} |

---

## 🔴 Duplicate Loop Failures

`;

  if (duplicateFailures.length === 0) {
    report += `No duplicate poem IDs found.\n\n`;
  } else {
    report += `| File | Duplicate IDs |\n|------|----------------|\n`;
    for (const f of duplicateFailures) {
      report += `| \`${f.file}\` | ${f.duplicates.map(id => `\`${id}\``).join(', ')} |\n`;
    }
    report += `\n`;
  }

  report += `## 🔴 Truncation Leak Failures (\`[object Object]\` Leaks)\n\n`;
  if (objectLeakFailures.length === 0) {
    report += `No leaked object tokens found.\n\n`;
  } else {
    report += `| File | Occurrences |\n|------|-------------|\n`;
    for (const f of objectLeakFailures) {
      report += `| \`${f.file}\` | ${f.occurrences} |\n`;
    }
    report += `\n`;
  }

  report += `## 🔴 Ghost Routing / Broken Links Failures\n\n`;
  if (linkFailures.length === 0) {
    report += `No broken local links found.\n\n`;
  } else {
    report += `| Source Page | Linked Route | Resolved Path Checked |\n|-------------|--------------|------------------------|\n`;
    for (const f of linkFailures) {
      report += `| \`${f.page}\` | \`${f.href}\` | \`${f.attemptedPath}\` |\n`;
    }
    report += `\n`;
  }

  fs.writeFileSync(OUTPUT_FILE, report, 'utf8');
  console.log(`✓ Audit report successfully written to: ${OUTPUT_FILE}`);

  console.log('\n============================================================');
  console.log(`HTML Build Output Audit: ${hasFailures ? '🔴 FAIL' : '✅ PASS'}`);
  console.log(`  Duplicate Poem Wrapper IDs: ${duplicateFailures.length}`);
  console.log(`  Object Leaks: ${objectLeakFailures.length}`);
  console.log(`  Broken Local Links: ${linkFailures.length}`);
  console.log('============================================================\n');

  if (hasFailures) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runAudit();
