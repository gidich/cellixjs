import { readFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join } from 'node:path';

// Load root package.json
const rootPkg = JSON.parse(readFileSync('package.json', 'utf8'));
const workspaces = rootPkg.workspaces || [];

const commands = [];

for (const ws of workspaces) {
  const pkgJsonPath = join(ws, 'package.json');

  if (!existsSync(pkgJsonPath)) { continue; }

  const pkgJson = JSON.parse(readFileSync(pkgJsonPath, 'utf8'));
  const hasWatch = pkgJson?.scripts['test:watch'];

  if (hasWatch) {
    commands.push(`npm run --workspace=${pkgJson.name} test:watch`);
  }
}

if (commands.length === 0) {
  console.error('❌ No packages with test:watch scripts found.');
  process.exit(1);
}

const concurrentlyCmd = `npx concurrently -n ${commands.map(c =>
  c.match(/--workspace=(@[^ ]+)/)?.[1] || 'pkg'
).join(',')} "${commands.join('" "')}"`;

execSync(concurrentlyCmd, { stdio: 'inherit', shell: true });