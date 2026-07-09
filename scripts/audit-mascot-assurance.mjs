// scripts/audit-mascot-assurance.mjs
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const mascotsDir = './src/content/docs/mascots';
const outputPath = './exports/mascot-assurance-audit.md';

const INTERVENTION_LIST = [
  {
    pattern: 'nullseal-register',
    shelf: 'Trust-Surface / Adequacy Laundering',
    problem: 'Thinly anchored and directly adjacent to trust-surface and assurance optics work.',
    fix: 'Needs stronger Distinction and Relationships to stabilize the entire doctrinal shelf.',
    priority: 1,
  },
  {
    pattern: 'soft-green-seal',
    shelf: 'Trust-Surface / Adequacy Laundering',
    problem: 'Sits too close to visible calm and reassurance language.',
    fix: 'Needs a sharper Definition of the failure it preserves so it remains structurally important rather than just decorative.',
    priority: 2,
  },
  {
    pattern: 'alibi-seal',
    shelf: 'Trust-Surface / Adequacy Laundering',
    problem: 'Barely a ghost file. One of only four mascots in the adequacy/exoneration summary-laundering cluster.',
    fix: 'Needs an urgent injection of Purpose to keep the exoneration shelf distinct from standard care-delay.',
    priority: 3,
  },
  {
    pattern: 'minute-absolution',
    shelf: 'Trust-Surface / Adequacy Laundering',
    problem: 'Another tiny file in the adequacy-laundering cluster.',
    fix: 'High-leverage target because this specific cluster is small and very easily collapsed without strong Distinction.',
    priority: 4,
  },
  {
    pattern: 'vantage-hollow',
    shelf: 'Trust-Surface / Adequacy Laundering',
    problem: 'Already recognized as important trust-surface residue.',
    fix: 'Tightening its cross-boundary distinction will pay dividends across multiple nearby files.',
    priority: 5,
  },
  {
    pattern: 'seal-of-maybe-enough',
    shelf: 'Trust-Surface / Adequacy Laundering',
    problem: 'Strong concept but lives in a highly crowded provisional-sufficiency zone.',
    fix: 'Must be made maximally distinct from its comfort, adequacy, and proxy-care neighbors.',
    priority: 6,
  },
  {
    pattern: 'recourse-cushion',
    shelf: 'Care-Delay / Side-Channel Relief',
    problem: 'Strong failure signature but belongs to a very dense appeal-softening neighborhood.',
    fix: 'Needs clearer internal boundaries (Distinction) so it does not blur into standard hold-music entities.',
    priority: 7,
  },
  {
    pattern: 'sidebar-mercy',
    shelf: 'Care-Delay / Side-Channel Relief',
    problem: 'File has weight but heavily overlaps with side-channel relief and informal overrides.',
    fix: 'Sharpening its Relationships will naturally help define and bound the nearby, thinner files.',
    priority: 8,
  },
  {
    pattern: 'footnote-pallbearer',
    shelf: 'Annex / Rear-Truth',
    problem: 'Very good archival concept that remains too thinly anchored for the weight it should carry.',
    fix: 'Needs its Purpose clarified, as it is central to the system\'s below-the-line truth burial behavior.',
    priority: 9,
  },
  {
    pattern: 'minute-velvet',
    shelf: 'Annex / Rear-Truth',
    problem: 'Excellent procedural-softening concept that is currently just a ghost.',
    fix: 'Needs a strong Definition so it can be deployed as a useful relationship anchor across many administrative records.',
    priority: 10,
  },
];

const GHOST_THRESHOLD = 1000;
const THIN_THRESHOLD = 2000;
const ADEQUATE_THRESHOLD = 4000;

const PLACEHOLDER_AFFILIATIONS = [
  'Society of Mascot Authors',
  'Council of Mascot Authors',
];

const IDENTITY_FIELDS = ['title', 'description', 'origin', 'manifestedBy'];
const CLASSIFICATION_FIELDS = ['systemAffiliation', 'rotAffinity', 'tags'];
const STATE_FIELDS = ['corruptionLevel', 'glitchFrequency', 'renderState', 'emotionalIntegrity'];
const RELATIONSHIP_FIELDS = ['relatedLorelog', 'relatedEntries', 'breedingProgram'];

function classifyWeight(bytes) {
  if (bytes <= GHOST_THRESHOLD) return '👻 Ghost';
  if (bytes <= THIN_THRESHOLD) return '🪶 Thin';
  if (bytes <= ADEQUATE_THRESHOLD) return '📄 Adequate';
  return '📦 Substantial';
}

function countMissing(data, fields) {
  let missing = [];
  for (const f of fields) {
    const val = data[f];
    if (val === undefined || val === null || val === '' || (Array.isArray(val) && val.length === 0)) {
      missing.push(f);
    }
  }
  return missing;
}

function countBodySections(content) {
  const body = content.replace(/^---[\s\S]*?---/, '').trim();
  const headings = body.match(/^#{2,3}\s+/gm);
  return headings ? headings.length : 0;
}

function getBodyWordCount(content) {
  const body = content.replace(/^---[\s\S]*?---/, '').trim();
  const words = body.split(/\s+/).filter(w => w.length > 0);
  return words.length;
}

function serializeRelatedLorelog(entries) {
  if (!entries || !Array.isArray(entries) || entries.length === 0) {
    return { display: '—', hasObjects: false };
  }
  let hasObjects = false;
  const serialized = entries.map(entry => {
    if (typeof entry === 'string') return entry;
    if (typeof entry === 'object' && entry !== null) {
      hasObjects = true;
      return entry.caseNumber || entry.id || JSON.stringify(entry);
    }
    return String(entry);
  });
  return { display: serialized.join(', '), hasObjects };
}

function isPlaceholderAffiliation(affiliation) {
  return PLACEHOLDER_AFFILIATIONS.includes(affiliation);
}

async function auditMascotAssurance() {
  const dateStr = new Date().toISOString().split('T')[0];

  const files = fs.readdirSync(mascotsDir).filter(f => f.endsWith('.mdx') || f.endsWith('.md'));
  
  const mascots = [];
  for (const file of files) {
    const filePath = path.join(mascotsDir, file);
    const raw = fs.readFileSync(filePath, 'utf8');
    const stat = fs.statSync(filePath);
    let parsed;
    try {
      parsed = matter(raw);
    } catch (e) {
      continue;
    }
    mascots.push({
      file,
      bytes: stat.size,
      data: parsed.data,
      content: raw,
      sections: countBodySections(raw),
      bodyWords: getBodyWordCount(raw),
      identityGaps: countMissing(parsed.data, IDENTITY_FIELDS),
      classificationGaps: countMissing(parsed.data, CLASSIFICATION_FIELDS),
      stateGaps: countMissing(parsed.data, STATE_FIELDS),
      relationshipGaps: countMissing(parsed.data, RELATIONSHIP_FIELDS),
    });
  }

  const selfAuditIssues = [];
  for (const m of mascots) {
    const rl = m.data.relatedLorelog;
    if (Array.isArray(rl)) {
      const hasObj = rl.some(entry => typeof entry === 'object' && entry !== null);
      if (hasObj) {
        selfAuditIssues.push({ file: m.file, issue: '`relatedLorelog` contains object entries (not plain strings). Cross-reference rendering may require special handling.' });
      }
    }
  }
  for (const m of mascots) {
    if (Array.isArray(m.data.tags)) {
      const badTags = m.data.tags.filter(t => typeof t === 'object' && t !== null);
      if (badTags.length > 0) {
        selfAuditIssues.push({ file: m.file, issue: '`tags` array contains non-string entries.' });
      }
    }
  }

  const pendingMascots = mascots.filter(m => !m.data.assuranceAudit || m.data.assuranceAudit < 1);
  const graduatedMascots = mascots.filter(m => m.data.assuranceAudit && m.data.assuranceAudit >= 1);

  const interventions = [];
  for (const entry of INTERVENTION_LIST) {
    const match = mascots.find(m => m.file.toLowerCase().includes(entry.pattern));
    if (match) {
      if (!match.data.assuranceAudit || match.data.assuranceAudit < 1) {
        interventions.push({ ...entry, mascot: match });
      }
    } else {
      interventions.push({ ...entry, mascot: null });
    }
  }

  const totalMascots = mascots.length;
  const ghosts = pendingMascots.filter(m => m.bytes <= GHOST_THRESHOLD);
  const thins = pendingMascots.filter(m => m.bytes > GHOST_THRESHOLD && m.bytes <= THIN_THRESHOLD);
  const adequates = pendingMascots.filter(m => m.bytes > THIN_THRESHOLD && m.bytes <= ADEQUATE_THRESHOLD);
  const substantials = pendingMascots.filter(m => m.bytes > ADEQUATE_THRESHOLD);

  const noOrigin = pendingMascots.filter(m => m.identityGaps.includes('origin'));
  const noDescription = pendingMascots.filter(m => m.identityGaps.includes('description'));
  const noSystemAffiliation = pendingMascots.filter(m => m.classificationGaps.includes('systemAffiliation'));
  const noTags = pendingMascots.filter(m => m.classificationGaps.includes('tags'));
  const noRelationships = pendingMascots.filter(m => m.relationshipGaps.length === RELATIONSHIP_FIELDS.length);
  const noSections = pendingMascots.filter(m => m.sections === 0);

  let report = `---
title: "Mascot Assurance Audit"
description: "Structural triage of the mascot archive. Tracks weight distribution, frontmatter gaps, and intervention targets flagged by the Assurance Desk."
date: ${dateStr}
ghosts_count: ${ghosts.length}
thins_count: ${thins.length}
description_gaps_count: ${noDescription.length}
origin_gaps_count: ${noOrigin.length}
affiliation_gaps_count: ${noSystemAffiliation.length}
tags_gaps_count: ${noTags.length}
relationship_gaps_count: ${noRelationships.length}
structural_depth_gaps_count: ${noSections.length}
self_audit_anomalies_count: ${selfAuditIssues.length}
tags:
  - reference
  - audit
  - mascot-assurance
  - boundary-audit
---

# Mascot Assurance Audit

This report was compiled by the Assurance Desk audit utility. It does not assess quality, tone, or lore fidelity. It observes structural weight, frontmatter completeness, and cross-referenceability—the minimum conditions for a file to be found, shelved, and reviewed without requiring a full read.

A mascot that cannot be located by its metadata is not missing. It is *misfiled into silence.*

---

## Archive Weight Distribution (Pending Only)

| Weight Class | Count | Share |
|---|---|---|
| 👻 Ghost (≤${GHOST_THRESHOLD}b) | ${ghosts.length} | ${pendingMascots.length ? ((ghosts.length / pendingMascots.length) * 100).toFixed(1) : 0}% |
| 🪶 Thin (≤${THIN_THRESHOLD}b) | ${thins.length} | ${pendingMascots.length ? ((thins.length / pendingMascots.length) * 100).toFixed(1) : 0}% |
| 📄 Adequate (≤${ADEQUATE_THRESHOLD}b) | ${adequates.length} | ${pendingMascots.length ? ((adequates.length / pendingMascots.length) * 100).toFixed(1) : 0}% |
| 📦 Substantial (>${ADEQUATE_THRESHOLD}b) | ${substantials.length} | ${pendingMascots.length ? ((substantials.length / pendingMascots.length) * 100).toFixed(1) : 0}% |
| **Total Pending** | **${pendingMascots.length}** | |
| **Graduated (Assurance Pass 1+)** | **${graduatedMascots.length}** | |
| **Total Archive** | **${totalMascots}** | |

---

## Frontmatter Gap Summary

These counts reflect how many mascots are missing key metadata fields. A missing field does not indicate an error; it indicates a file that cannot yet fully participate in cross-referencing, shelving, or automated review workflows.

| Gap Type | Count | Affected Field(s) |
|---|---|---|
| No \`description\` | ${noDescription.length} | Identity |
| No \`origin\` | ${noOrigin.length} | Identity |
| No \`systemAffiliation\` | ${noSystemAffiliation.length} | Classification |
| No \`tags\` or empty | ${noTags.length} | Classification |
| No relationships at all | ${noRelationships.length} | Cross-reference |
| No body sections (h2/h3) | ${noSections.length} | Structural depth |

---

## Priority Intervention List

The following mascots have been flagged by the Assurance Desk for targeted review. They are grouped by doctrinal shelf and ranked by structural leverage—meaning the files whose refinement would most stabilize their surrounding cluster.

This is not a correction queue. It is a triage list. Each entry names the structural gap; it does not prescribe the solution.

`;

  const shelves = {};
  for (const iv of interventions) {
    if (!shelves[iv.shelf]) shelves[iv.shelf] = [];
    shelves[iv.shelf].push(iv);
  }

  for (const [shelfName, entries] of Object.entries(shelves)) {
    report += `### ${shelfName}\n\n`;
    report += `| # | File | Weight | Sections | Words | Diagnosis | Recommended Fix |\n`;
    report += `|---|---|---|---|---|---|---|\n`;

    for (const entry of entries) {
      if (entry.mascot) {
        const m = entry.mascot;
        report += `| ${entry.priority} | \`${m.file}\` | ${classifyWeight(m.bytes)} (${m.bytes}b) | ${m.sections} | ${m.bodyWords} | ${entry.problem} | ${entry.fix} |\n`;
      } else {
        report += `| ${entry.priority} | ⚠️ *Not found* | — | — | — | ${entry.problem} | ${entry.fix} |\n`;
      }
    }
    report += `\n`;
  }

  report += `---\n\n## Intervention Detail Cards\n\nFor each flagged mascot, the following cards summarize the current frontmatter state so that a reviewer (human or otherwise) can begin assessment without reading the full file.\n\n`;

  for (const iv of interventions) {
    if (!iv.mascot) continue;
    const m = iv.mascot;
    const d = m.data;

    report += `### ${iv.priority}. ${d.title || m.file}\n\n`;
    report += `| Property | Value |\n`;
    report += `|---|---|\n`;
    report += `| **File** | \`${m.file}\` |\n`;
    report += `| **Shelf** | ${iv.shelf} |\n`;
    report += `| **Weight** | ${classifyWeight(m.bytes)} (${m.bytes} bytes) |\n`;
    report += `| **Body Sections** | ${m.sections} |\n`;
    report += `| **Body Words** | ${m.bodyWords} |\n`;
    report += `| **Status** | ${d.status || '—'} |\n`;
    report += `| **System Affiliation** | ${d.systemAffiliation || '⚠️ Missing'} |\n`;
    report += `| **Rot Affinity** | ${d.rotAffinity || '⚠️ Missing'} |\n`;
    report += `| **Origin** | ${d.origin || '⚠️ Missing'} |\n`;
    report += `| **Description** | ${d.description ? d.description.substring(0, 120) + (d.description.length > 120 ? '…' : '') : '⚠️ Missing'} |\n`;
    report += `| **Tags** | ${d.tags && d.tags.length > 0 ? d.tags.join(', ') : '⚠️ None'} |\n`;
    const rl = serializeRelatedLorelog(d.relatedLorelog);
    report += `| **Related Lorelog** | ${rl.display}${rl.hasObjects ? ' ⚠️ mixed format' : ''} |\n`;
    report += `| **Corruption** | ${d.corruptionLevel || '—'} |\n`;
    report += `| **Render State** | ${d.renderState || '—'} |\n`;

    if (m.identityGaps.length > 0) {
      report += `| **Identity Gaps** | ${m.identityGaps.map(g => '`' + g + '`').join(', ')} |\n`;
    }
    if (m.classificationGaps.length > 0) {
      report += `| **Classification Gaps** | ${m.classificationGaps.map(g => '`' + g + '`').join(', ')} |\n`;
    }
    if (m.relationshipGaps.length > 0) {
      report += `| **Relationship Gaps** | ${m.relationshipGaps.map(g => '`' + g + '`').join(', ')} |\n`;
    }

    report += `\n**Diagnosis:** ${iv.problem}\n\n`;
    report += `**Recommended Fix:** ${iv.fix}\n\n`;
    report += `---\n\n`;
  }

  const ghostsWithPlaceholder = ghosts.filter(g => isPlaceholderAffiliation(g.data.systemAffiliation));
  const ghostsWithRealAffiliation = ghosts.filter(g => g.data.systemAffiliation && !isPlaceholderAffiliation(g.data.systemAffiliation));
  const ghostsUnaffiliated = ghosts.filter(g => !g.data.systemAffiliation);

  report += `## Ghost Census\n\nThe following files weigh ${GHOST_THRESHOLD} bytes or less. They are not necessarily deficient—some ghosts are correctly sparse. But a ghost that cannot explain what failure it witnesses is a filing accident, not an artifact.\n\n`;

  report += `### Ghost Affiliation Breakdown\n\n`;
  report += `| Category | Count | Observation |\n`;
  report += `|---|---|---|\n`;
  report += `| Placeholder affiliation | ${ghostsWithPlaceholder.length} | Carries a stub affiliation (e.g., "Society of Mascot Authors") that functions as a catch-all rather than a real doctrinal home. These mascots are technically affiliated but functionally unshelved. |\n`;
  report += `| Real affiliation | ${ghostsWithRealAffiliation.length} | Has a specific system affiliation despite low byte weight. May be legitimately sparse. |\n`;
  report += `| No affiliation | ${ghostsUnaffiliated.length} | No \`systemAffiliation\` declared at all. |\n`;
  report += `\n`;

  report += `### Full Ghost Listing\n\n`;
  report += `| File | Bytes | Description | System Affiliation |\n`;
  report += `|---|---|---|---|\n`;

  const sortedGhosts = ghosts.sort((a, b) => a.bytes - b.bytes);
  for (const g of sortedGhosts) {
    const desc = g.data.description ? g.data.description.substring(0, 80) + (g.data.description.length > 80 ? '…' : '') : '⚠️ None';
    const sys = g.data.systemAffiliation || '⚠️ None';
    const placeholder = isPlaceholderAffiliation(g.data.systemAffiliation) ? ' 🏷️' : '';
    report += `| \`${g.file}\` | ${g.bytes} | ${desc} | ${sys}${placeholder} |\n`;
  }

  report += `\n**Total Ghosts:** ${ghosts.length} (${ghostsWithPlaceholder.length} placeholder-affiliated, ${ghostsWithRealAffiliation.length} real-affiliated, ${ghostsUnaffiliated.length} unaffiliated)\n\n`;

  report += `---\n\n## Unaffiliated Mascots\n\nMascots with no \`systemAffiliation\` cannot be shelved by automated processes. They exist, but they do not belong anywhere yet.\n\n`;

  if (noSystemAffiliation.length === 0) {
    report += `*All mascots have declared a system affiliation. The archive is, for once, tidy.*\n\n`;
  } else {
    report += `| File | Bytes | Status |\n`;
    report += `|---|---|---|\n`;
    for (const m of noSystemAffiliation.sort((a, b) => a.file.localeCompare(b.file))) {
      report += `| \`${m.file}\` | ${m.bytes} | ${m.data.status || '—'} |\n`;
    }
    report += `\n**Total Unaffiliated:** ${noSystemAffiliation.length}\n\n`;
  }

  report += `---\n\n## Self-Audit\n\nThe Assurance Desk does not exempt itself from observation. The following anomalies were detected in the data this report attempted to render.\n\n`;



  if (selfAuditIssues.length === 0) {
    report += `*No rendering anomalies detected. The report consumed its own data without incident.*\n\n`;
  } else {
    report += `| File | Issue |\n`;
    report += `|---|---|\n`;
    for (const issue of selfAuditIssues) {
      report += `| \`${issue.file}\` | ${issue.issue} |\n`;
    }
    report += `\n**Total Self-Audit Anomalies:** ${selfAuditIssues.length}\n\n`;
  }

  report += `---\n\n*This report was generated on ${dateStr} by \`scripts/audit-mascot-assurance.mjs\`. It observes. It does not intervene. Interventions require explicit invocation of the Assurance Desk.*\n`;

  fs.mkdirSync('./exports', { recursive: true });
  fs.writeFileSync(outputPath, report);
  console.log(`Mascot Assurance Audit generated at ${outputPath}`);
}

auditMascotAssurance();
