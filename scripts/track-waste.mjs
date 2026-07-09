// scripts/track-waste.mjs
import fs from 'node:fs';
import path from 'node:path';

const EXPORTS_DIR = path.resolve('./exports');
const LITTER_FILE = path.join(EXPORTS_DIR, 'litter-telemetry.json');
const args = process.argv.slice(2);

let current = { unScoopedTurds: 0, lastCleared: new Date().toISOString().split('T')[0] };

if (fs.existsSync(LITTER_FILE)) {
  try { current = JSON.parse(fs.readFileSync(LITTER_FILE, 'utf8')); } catch {}
}

fs.mkdirSync(EXPORTS_DIR, { recursive: true });

if (args.includes('--add')) {
  current.unScoopedTurds += 1;
  console.log(`[TRACKER] Residual sandbox unit logged. Current threshold: ${current.unScoopedTurds}`);
} else if (args.includes('--clear')) {
  current.unScoopedTurds = 0;
  current.lastCleared = new Date().toISOString().split('T')[0];
  console.log(`[TRACKER] Sandbox alignment restored to clean baseline. System green.`);
} else {
  console.log(`Operational Controls:`);
  console.log(`  node scripts/track-waste.mjs --add   # Increment backlog`);
  console.log(`  node scripts/track-waste.mjs --clear # Reset to clear state`);
  process.exit(1);
}

fs.writeFileSync(LITTER_FILE, JSON.stringify(current, null, 2), 'utf8');
process.exit(0);
