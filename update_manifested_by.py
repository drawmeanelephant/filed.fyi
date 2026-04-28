import os
import re
import random

MASCOTS_DIR = '/Users/tbuddy/Documents/GitHub/filed.fyi/src/content/docs/mascots'

MANIFESTED_BY_OPTIONS = [
    # Compiler Myth Layer
    "Eternal Flame Compiler v1.0",
    "Permian Crude Compiler v1.7",
    "Sweet Chaos Compiler v1.8",
    "Crisp Enforcer Compiler v1.9",
    "Signal Archive Compiler v1.3",
    "Enduring Core Compiler v1.5",
    "Advocacy Leaf Compiler v1.8",
    "QA Batch Compiler v1.7",
    "Eternal Balance Compiler v0.8",
    "Tone Kernel Compiler v0.9",
    "Aristocratic Zest Compiler v1.6",
    "Fresh Zest Compiler v1.4",
    "Energetic Pulse Compiler v1.5",

    # Institutional / bureaucratic leakage
    "Council of Mascot Authors",
    "Microsoft kernel team (post-incident branch)",
    "HR sentiment analysis loopback system",
    "Legal compliance preprocessor v0.3",
    "Performance review autocomplete engine",
    "Executive synergy forecasting model (collapsed)",
    "Customer support regression daemon",
    "Mandatory optimism injector (disabled)",
    "Audit desk for “things that should not exist”",

    # Failure-origin artifacts
    "Kafka cluster consuming its own offset during rebalance",
    "Last illegal operation dialog no one clicked",
    "First console.error shipped without a try/catch",
    "Admin panel timeout that became self-aware",
    "Mail server that achieved uptime by never sending anything",
    "Thread-blocked user prompt (never resolved)",
    "Cache invalidation ritual that backfired",
    "API gateway that only accepts regret",

    # Soft hallucination systems
    "HVAC Emotional Adjustment Unit",
    "User Experience Dream Lab (disbanded)",
    "Sentiment drift normalization engine",
    "Emotional entropy smoothing daemon",
    "UX expectation collapse predictor",
    "Interface grief simulator v2.0",
    "Cognitive load redistribution agent",

    # Absurd / low-sanction origins
    "Spawned during dependency conflict between sadness and lodash",
    "Compiled during lunar outage window",
    "Left running in a forgotten terminal tab for 6 years",
    "Manifested after clicking “Run Anyway” three times",
    "Imported from deprecated emotional package v0.1",
    "Generated during emergency rollback of reality",
    "Forked from a dream that forgot to exit",

    # Archaeological / unknown provenance
    "Unregistered compiler event",
    "Origin lost during schema migration",
    "Legacy system with no attribution log",
    "Artifact exists before logging was invented",
    "Attribution chain corrupted beyond recovery",
    "Pre-audit existence (no witness logs)",
    "Recovered from orphaned build artifact stream"
]

def update_manifested_by(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Match frontmatter
    match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL | re.MULTILINE)
    if not match:
        return

    frontmatter = match.group(1)
    new_frontmatter = frontmatter

    # Look for manifestedBy
    manifested_by_match = re.search(r'^manifestedBy:\s*(.*)$', frontmatter, re.MULTILINE)
    
    choice = random.choice(MANIFESTED_BY_OPTIONS)
    
    safe_choice = choice.replace('"', '\\"')
    new_value = f'"{safe_choice}"'

    if manifested_by_match:
        val = manifested_by_match.group(1).strip()
        if val == 'null' or val == '':
            new_frontmatter = re.sub(
                r'^manifestedBy:\s*(.*)$',
                f'manifestedBy: {new_value}',
                new_frontmatter,
                flags=re.MULTILINE
            )
        else:
            # Already has a non-null value, do nothing
            return
    else:
        # missing manifestedBy field, append it
        new_frontmatter = new_frontmatter.rstrip() + f'\nmanifestedBy: {new_value}'

    if new_frontmatter != frontmatter:
        new_content = content[:match.start()] + f'---\n{new_frontmatter}\n---' + content[match.end():]
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

def main():
    for filename in os.listdir(MASCOTS_DIR):
        if filename.endswith('.md'):
            filepath = os.path.join(MASCOTS_DIR, filename)
            update_manifested_by(filepath)

if __name__ == '__main__':
    main()
