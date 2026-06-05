import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOCK_DIR = path.join(__dirname, '../../.locks');

function ensureLockDir() {
  if (!fs.existsSync(LOCK_DIR)) {
    fs.mkdirSync(LOCK_DIR, { recursive: true });
  }
}

export function acquireLock(name, ttlMs = 60000) {
  ensureLockDir();
  const lockFile = path.join(LOCK_DIR, `${name}.lock`);
  try {
    const stat = fs.statSync(lockFile);
    const age = Date.now() - stat.mtimeMs;
    if (age < ttlMs) {
      return false; // Lock held by another instance
    }
    // Lock expired, remove it
    fs.unlinkSync(lockFile);
  } catch {
    // No lock file, proceed
  }
  fs.writeFileSync(lockFile, String(process.pid));
  return true;
}

export function releaseLock(name) {
  const lockFile = path.join(LOCK_DIR, `${name}.lock`);
  try {
    fs.unlinkSync(lockFile);
  } catch {
    // Ignore
  }
}
