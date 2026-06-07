import fs from 'fs';
import path from 'path';

const files = {
  "src/content/docs/haikus/hai-324-complimentary-ghostline.mdx": `
<Limerick type="note" title="Broken PDF" icon="file-text">
User seeks the form
We have shut the server down
PDF still links
</Limerick>

<Limerick type="note" title="Ghostly Call" icon="phone">
Service has retired
Human clicks the broken page
Ghostline takes the call
</Limerick>

<Limerick type="note" title="Empty Guarantees" icon="clock">
No one mans the desk
But the portal guarantees
Wait times will be short
</Limerick>
`,
  "src/content/docs/haikus/hai-321-ribbon-clause.mdx": `
<Limerick type="note" title="Decorated Trap" icon="lock">
Decorate the trap
Legal loop secures the hand
User signs the bow
</Limerick>

<Limerick type="note" title="Formalized Loss" icon="pen-tool">
Read the pretty words
We have formalized your loss
Knot is neatly tied
</Limerick>

<Limerick type="note" title="Permanent Regret" icon="award">
Bind them with a smile
Ornamental phrasing hides
Permanent regret
</Limerick>
`,
  "src/content/docs/haikus/hai-320-quiet-surplus.mdx": `
<Limerick type="note" title="Assumed Margin" icon="activity">
Silence from the staff
We assume they have more time
Give them extra tasks
</Limerick>

<Limerick type="note" title="Muted Pain" icon="battery">
Margin looks so vast
Because human pain is mute
Fill the empty space
</Limerick>

<Limerick type="note" title="Infinite Capacity" icon="server">
No complaints logged yet
Therefore the capacity
Is infinite here
</Limerick>
`,
  "src/content/docs/haikus/hai-319-severance-cordial.mdx": `
<Limerick type="note" title="Sweet Termination" icon="droplet">
Drink this as you leave
We have terminated you
Sweetness masks the cut
</Limerick>

<Limerick type="note" title="Warm Decay" icon="coffee">
HR smiles at you
Rupture managed properly
Sip the warm decay
</Limerick>

<Limerick type="note" title="Kindly Deleted" icon="trash">
Hospitality
For the user we delete
Kindly walk away
</Limerick>
`,
  "src/content/docs/haikus/hai-318-threshold-crooner.mdx": `
<Limerick type="note" title="Listen to the Tune" icon="music">
Singing at the gate
You are not allowed in here
Listen to my tune
</Limerick>

<Limerick type="note" title="Soft Denial" icon="mic">
Melody so soft
We deny your access rights
Humming as you leave
</Limerick>

<Limerick type="note" title="Welcoming Tone" icon="speaker">
Tone is welcoming
But the door remains locked tight
User cannot pass
</Limerick>
`
};

for (const [file, content] of Object.entries(files)) {
  const absolutePath = path.resolve('/Users/tbuddy/Documents/GitHub/filed.fyi', file);
  fs.appendFileSync(absolutePath, '\n' + content.trim() + '\n');
  console.log('Appended to', absolutePath);
}
