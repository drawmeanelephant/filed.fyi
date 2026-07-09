// scripts/governance-suite.mjs
import fs from 'node:fs';
import path from 'node:path';
import { runCaseNumberAudit } from './astro-casenum-audit.mjs';
import { runContainmentAudit } from './audit-containment.mjs';
import { runFrontmatterAudit } from './audit-frontmatter-integrity.mjs';

const CONTENT_DIR = path.resolve('./src/content');
const AUDIT_OUT_DIR = path.resolve('./src/content/docs/reference/audits');

// Rigid schema mappings for the suite output nodes
const SUITE_REGISTRY = {
  casenum:     { prefix: 'FREF-AUDT-CASE', title: 'Case Reciprocity and Alignment Report' },
  containment: { prefix: 'FREF-AUDT-CONT', title: 'Restricted Cluster Containment Audit' },
  integrity:   { prefix: 'FREF-AUDT-INTG', title: 'Frontmatter Data Structural Integrity Audit' }
};

function generateAuditPage(suiteKey, reportBody, telemetryStats = {}) {
  fs.mkdirSync(AUDIT_OUT_DIR, { recursive: true });
  const meta = SUITE_REGISTRY[suiteKey];
  const stamp = new Date().toISOString().split('T')[0];
  const filename = `${meta.prefix.toLowerCase()}.mdx`;

  const frontmatter = `---
title: "${meta.title}"
description: "Automated structural integrity report emitted by the Governance Suite."
caseNumber: "${meta.prefix}-${stamp.replace(/-/g, '')}"
updatedAt: "${stamp}"
classification: "internal"
disposition: "filed"
resolution: "pending"
concepts: ["operational-engines"]
---

# ${meta.title}
**System Entry Date:** ${stamp}  
**Jurisdiction:** Operational Governance Suite

---

${reportBody}

---

## Suite Run Telemetry
*   **Audit Class:** \`${suiteKey.toUpperCase()}\`
*   **Total Gaps Flagged:** ${telemetryStats.gaps || 0}
*   **Action Required:** Manual reconciliation of frontmatter vectors or reciprocal poetry routing anchors.
`;

  fs.writeFileSync(path.join(AUDIT_OUT_DIR, filename), frontmatter, 'utf8');
  console.log(`✓ Compiled Governance Node: reference/audits/${filename}`);
}

function pipelineCaseAudit() {
  console.log('▶ Executing Case Reciprocity Pipeline...');
  
  const { records } = runCaseNumberAudit(false);
  const nonPassing = records.filter(r => r.status !== 'PASS');
  let gapsFound = nonPassing.length;
  
  let reportBody = `### Unresolved Connection Vectors\n\n`;
  reportBody += `| File Path | Extraction Defect | Target Case Reference |\n|---|---|---|\n`;

  for (const r of nonPassing) {
    const escapedRelPath = r.relPath.replace(/`/g, '\\`');
    const escapedIssues = r.issues.join('; ').replace(/\|/g, '\\|');
    const escapedCaseNum = (r.caseNumber || '—').replace(/`/g, '\\`');
    reportBody += `| \`${escapedRelPath}\` | ${escapedIssues} | \`${escapedCaseNum}\` |\n`;
  }

  if (gapsFound === 0) {
    reportBody += `| *No un-reciprocated linkage shapes detected across active content collections.* | - | - |\n`;
  }

  generateAuditPage('casenum', reportBody, { gaps: gapsFound });
}

function pipelineContainmentAudit() {
  console.log('▶ Executing Cluster Containment Pipeline...');
  
  const { violations, count } = runContainmentAudit();
  
  let reportBody = `### Restricted Cluster Containment Failures\n\n`;
  reportBody += `| File Path | Violating Reference | Missing Tags |\n|---|---|---|\n`;

  for (const v of violations) {
    reportBody += `| \`${v.file}\` | ${v.type} | Needs: \`${v.missing}\` |\n`;
  }

  if (count === 0) {
    reportBody += `| *No containment violations detected across active content collections.* | - | - |\n`;
  }

  generateAuditPage('containment', reportBody, { gaps: count });
}

function pipelineIntegrityAudit() {
  console.log('▶ Executing Frontmatter Data Integrity Pipeline...');
  
  const { nullVectors, fragmentedTags, count } = runFrontmatterAudit();
  
  let reportBody = `### Null Vectors\n\n`;
  reportBody += `| File Path | Field | Status |\n|---|---|---|\n`;

  for (const nv of nullVectors) {
    reportBody += `| \`${nv.file}\` | \`${nv.field}\` | Collapsed |\n`;
  }

  if (nullVectors.length === 0) {
    reportBody += `| *No null vectors detected.* | - | - |\n`;
  }

  reportBody += `\n### Tag Fragmentation\n\n`;
  reportBody += `| File Path | Fragment |\n|---|---|\n`;

  for (const ft of fragmentedTags) {
    const safeFragment = ft.fragment.replace(/\|/g, '\\|').replace(/\n/g, ' ');
    reportBody += `| \`${ft.file}\` | \`${safeFragment}\` |\n`;
  }

  if (fragmentedTags.length === 0) {
    reportBody += `| *No fragmented tags detected.* | - |\n`;
  }

  generateAuditPage('integrity', reportBody, { gaps: count });
}

// Execute the entire suite
console.log('Starting Unified Archival Governance Suite...');
pipelineCaseAudit();
pipelineContainmentAudit();
pipelineIntegrityAudit();
console.log('✓ Governance Suite Execution Complete.');
