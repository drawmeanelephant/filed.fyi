import re

with open('astro.config.mjs', 'r') as f:
    content = f.read()

content = content.replace("import starlight from '@astrojs/starlight'", "import starlight from '@astrojs/starlight'\nimport mdx from '@astrojs/mdx'")

new_integrations = """cloudflareAnalytics(), starlight({
      title: 'Filed & Forgotten',"""

replacement = """cloudflareAnalytics(), mdx({
      components: {
        Broside: './src/components/Brosides.astro',
        Limerick: './src/components/Limericks.astro',
        CollectionRegister: './src/components/CollectionRegister.astro',
        RelatedEntries: './src/components/RelatedEntries.astro',
      },
    }), starlight({
      title: 'Filed & Forgotten',"""

content = content.replace(new_integrations, replacement)

with open('astro.config.mjs', 'w') as f:
    f.write(content)
