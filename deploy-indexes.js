#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

console.log(`\n${colors.bright}${colors.cyan}=== PersonFinder Firestore Indexes Deployment Tool ===${colors.reset}\n`);

// Check if firestore.indexes.json exists
if (!fs.existsSync(path.join(process.cwd(), 'firestore.indexes.json'))) {
  console.error(`${colors.red}Error: firestore.indexes.json file not found.${colors.reset}`);
  console.log(`Please make sure you're running this script from the project root directory.`);
  process.exit(1);
}

// Check if Firebase CLI is installed
try {
  execSync('firebase --version', { stdio: 'ignore' });
} catch (error) {
  console.error(`${colors.red}Error: Firebase CLI is not installed.${colors.reset}`);
  console.log(`Please install it with: npm install -g firebase-tools`);
  process.exit(1);
}

// Check if user is logged in to Firebase
try {
  const output = execSync('firebase projects:list --json', { encoding: 'utf8' });
  if (output.includes('Error:')) {
    throw new Error('Not logged in');
  }
} catch (error) {
  console.error(`${colors.red}Error: You are not logged in to Firebase.${colors.reset}`);
  console.log(`Please log in with: firebase login`);
  process.exit(1);
}

console.log(`${colors.yellow}Deploying Firestore indexes...${colors.reset}`);

try {
  execSync('firebase deploy --only firestore:indexes', { stdio: 'inherit' });
  console.log(`\n${colors.bright}${colors.green}Firestore indexes deployed successfully!${colors.reset}`);
  console.log(`\nThis should fix the "query requires an index" errors.`);
  console.log(`If you still see errors, please click on the URL in the error message to create the required index directly in the Firebase console.`);
} catch (error) {
  console.error(`${colors.red}Error deploying Firestore indexes:${colors.reset}`, error.message);
  console.log(`\nPlease try deploying manually with: firebase deploy --only firestore:indexes`);
  process.exit(1);
} 