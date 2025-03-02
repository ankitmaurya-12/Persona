#!/usr/bin/env node

const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

// Helper function to execute commands
function runCommand(command, errorMessage) {
  try {
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`${colors.red}${errorMessage}${colors.reset}`);
    console.error(`Error details: ${error.message}`);
    return false;
  }
}

// Helper function to check if Firebase CLI is installed
function isFirebaseCliInstalled() {
  try {
    execSync('firebase --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// Helper function to check if user is logged in to Firebase
function isUserLoggedIn() {
  try {
    const output = execSync('firebase projects:list --json', { encoding: 'utf8' });
    return !output.includes('Error:');
  } catch (error) {
    return false;
  }
}

// Main deployment function
async function deploy() {
  console.log(`\n${colors.bright}${colors.cyan}=== PersonFinder Deployment Tool ===${colors.reset}\n`);
  
  // Check if Firebase CLI is installed
  if (!isFirebaseCliInstalled()) {
    console.log(`${colors.yellow}Firebase CLI is not installed. Installing now...${colors.reset}`);
    if (!runCommand('npm install -g firebase-tools', 'Failed to install Firebase CLI.')) {
      return;
    }
  }
  
  // Check if user is logged in to Firebase
  if (!isUserLoggedIn()) {
    console.log(`${colors.yellow}You need to log in to Firebase.${colors.reset}`);
    if (!runCommand('firebase login', 'Failed to log in to Firebase.')) {
      return;
    }
  }
  
  // Check if firebase.json exists
  if (!fs.existsSync(path.join(process.cwd(), 'firebase.json'))) {
    console.log(`${colors.yellow}Initializing Firebase project...${colors.reset}`);
    console.log('Please select your Firebase project when prompted.');
    if (!runCommand('firebase init', 'Failed to initialize Firebase project.')) {
      return;
    }
  }
  
  // Build the application
  console.log(`\n${colors.green}Building the application...${colors.reset}`);
  if (!runCommand('npm run build', 'Failed to build the application.')) {
    return;
  }
  
  // Deploy Firestore rules
  console.log(`\n${colors.green}Deploying Firestore security rules...${colors.reset}`);
  if (!runCommand('firebase deploy --only firestore', 'Failed to deploy Firestore security rules.')) {
    return;
  }
  
  // Deploy hosting
  console.log(`\n${colors.green}Deploying the application...${colors.reset}`);
  if (!runCommand('firebase deploy --only hosting', 'Failed to deploy the application.')) {
    return;
  }
  
  console.log(`\n${colors.bright}${colors.green}Deployment completed successfully!${colors.reset}`);
  console.log(`\nYour application is now live. You can access it at the URL shown above.`);
  console.log(`\nRemember to set up your API keys in the Firebase console for external API integration.`);
  
  rl.close();
}

// Run the deployment function
deploy().catch(error => {
  console.error(`${colors.red}An unexpected error occurred:${colors.reset}`, error);
  rl.close();
}); 