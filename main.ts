// Hearth & Ledger — hand-in program for the household budget site.
// Copies app/ and screenshots/ into the output directory, then writes
// dossier.json with the kit's buildDossier helper. Standard library only;
// run with `node main.ts` (Node 22+). Set MAKEFUN_OUTPUT_DIR to override
// the default /output directory when grading outside the sandbox.
import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = dirname(fileURLToPath(import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });

for (const folder of ['app', 'screenshots']) {
  const src = join(here, folder);
  if (existsSync(src)) {
    cpSync(src, join(out, folder), { recursive: true });
  }
}

const dossier = buildDossier(out, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});

if (!(dossier instanceof Uint8Array) || dossier.byteLength === 0) {
  throw new Error('buildDossier returned an empty dossier');
}

writeFileSync(join(out, 'dossier.json'), dossier);
