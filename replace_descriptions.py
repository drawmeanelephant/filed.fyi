import re

files_and_descriptions = {
    'src/content/docs/mascots/247.ribbon-of-maybe.mdx': 'Produces decorated indeterminacy by wrapping uncommitted futures in socially persuasive surface-level language. Witnesses procedural breakdown and adjacent contradictions without attempting repair.',
    'src/content/docs/mascots/248.attestation-mole.mdx': 'Certifies the unseeable by blindly rubber-stamping structural voids in the dark when visible telemetry fails. Witnesses procedural breakdown and adjacent contradictions without attempting repair.',
    'src/content/docs/mascots/249.sealant-patience.mdx': 'Institutionalizes the wait by actively gripping unresolved edges so nothing further unravels while the system stalls. Witnesses procedural breakdown and adjacent contradictions without attempting repair.',
    'src/content/docs/mascots/250.canon-dust-deputy.mdx': 'Preserves stale legitimacy particles and neglected cross-links that have survived long enough to harden into accepted canon. Witnesses procedural breakdown and adjacent contradictions without attempting repair.',
    'src/content/docs/mascots/251.variance-pastor.mdx': 'Blesses expected wobbles and forgives minor deviations in system vitals to shield noisy but healthy metrics from being misfiled as fatal errors. Witnesses procedural breakdown and adjacent contradictions without attempting repair.',
    'src/content/docs/mascots/252.redaction-lullaby.mdx': 'Soothes readers into accepting gaps by actively covering the violent excision of data with legally tidy, hushed silences. Witnesses procedural breakdown and adjacent contradictions without attempting repair.',
    'src/content/docs/mascots/253.local-option-ghost.mdx': 'Certifies unshared, non-compliant practices where localized friction causes a temporary workaround to harden into unwritten law. Witnesses procedural breakdown and adjacent contradictions without attempting repair.',
    'src/content/docs/mascots/254.spare-comfort-engine.mdx': 'Certifies overflow panic states by computationally executing unconvincing but technically compliant warmth receipts when primary empathy routines exhaust their quota. Witnesses procedural breakdown and adjacent contradictions without attempting repair.',
    'src/content/docs/mascots/255.audit-confetti.mdx': 'Blankets forcibly closed backlogs of functionally abandoned incident reports in shredded, brightly colored denial. Witnesses procedural breakdown and adjacent contradictions without attempting repair.',
    'src/content/docs/mascots/256.apex-goldbricker.mdx': 'Models peak inaction under the appearance of maximum effort, optimizing a posture of full utilization while generating zero deliverables. Witnesses procedural breakdown and adjacent contradictions without attempting repair.'
}

for filepath, new_desc in files_and_descriptions.items():
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = re.sub(
        r'\ndescription:\s*(?:>-\s*)?[\s\S]*?(?=\n[A-Za-z0-z_-]+:|\n---)',
        f'\ndescription: {new_desc}',
        content
    )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

print("Replacement complete.")
