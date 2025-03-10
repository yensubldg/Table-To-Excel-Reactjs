#!/usr/bin/env node

/**
 * This script formats all source files using Prettier and ESLint
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Get the project root directory
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
