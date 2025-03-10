#!/usr/bin/env node

/**
 * This script formats all source files using Prettier and ESLint
 */

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get the project root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname);

console.log('🔍 Starting code formatting process...');

try {
  // Run Prettier on all source files
  console.log('\n📝 Running Prettier on source files...');
  execSync('npx prettier --write "src/**/*.{ts,tsx,js,jsx,json,md}"', {
    cwd: rootDir,
    stdio: 'inherit',
  });

  // Run ESLint with auto-fix (--max-warnings=9999 to ignore warnings)
  console.log('\n🛠️ Running ESLint with auto-fix...');
  execSync('npx eslint --config eslint.config.js src --ext .ts,.tsx --fix --max-warnings=9999', {
    cwd: rootDir,
    stdio: 'inherit',
  });

  console.log('\n✅ Code formatting completed successfully!');
} catch (error) {
  console.error('\n❌ Error during code formatting:', error.message);
  process.exit(1);
}
