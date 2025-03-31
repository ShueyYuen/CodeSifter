import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

const rootDir = path.resolve(__dirname, '../../..');

const sourceFile = path.join(rootDir, 'README.md');
const destDir = path.resolve(__dirname, '../');
const destFile = path.join(destDir, 'README.md');

if (!fs.existsSync(sourceFile)) {
  console.error(`Source README.md not found at: ${sourceFile}`);
  process.exit(1);
}

try {
  fs.copyFileSync(sourceFile, destFile);
  console.log(`README.md successfully copied from root to plugins directory`);
} catch (err) {
  console.error(`Failed to copy README.md: ${err.message}`);
  process.exit(1);
}
