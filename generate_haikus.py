import re

def rewrite(file_path):
    with open(file_path, "r") as f:
        content = f.read()

    new_content = re.sub(
        r'<Limerick[^>]*>.*?</Limerick>',
        """The document is signed
Replaced without releasing
Ancestry preserved

Containment in drawers
Validation is complete
Exceptions denied

The registry hums
A lineage strictly defined
No missing papers

Custody exchanged
Rituals in duplicate
Quiet replacement

Forms filed to the brim
Replaced without a question
The archive is full""",
        content,
        flags=re.DOTALL
    )

    with open(file_path, "w") as f:
        f.write(new_content)

rewrite("src/content/haikus/hai-llg-0436-asf.mdx")
rewrite("src/content/haikus/hai-llg-0446-oqf.mdx")
