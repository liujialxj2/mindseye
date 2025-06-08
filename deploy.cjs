#!/usr/bin/env node

/**
 * Mindseye Project Deployment Helper
 * This script helps users deploy the project to Cloudflare Pages
 */

const { execSync } = require('child_process');

// Display welcome message
console.log('\n====== Mindseye Project Deployment Helper ======\n');
console.log('This script will help you deploy the project to Cloudflare Pages\n');

// Deployment process
try {
  // Step 1: Build the project
  console.log('Step 1: Building the project...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed\n');

  // Step 2: Deploy to Cloudflare Pages
  console.log('Step 2: Deploying to Cloudflare Pages...');
  console.log('Using Wrangler command for deployment...');
  execSync('npx wrangler pages deploy dist', { stdio: 'inherit' });
  
  console.log('\n✅ Deployment completed!');
  console.log('\nCheck the URL in the output above to visit your website.');
  console.log('\n====== Deployment process finished ======\n');

} catch (error) {
  console.error('\n❌ Error occurred during deployment:');
  console.error(error.message);
  console.log('\nIf the error is related to wrangler configuration, please check:');
  console.log('1. wrangler.toml file has correct content');
  console.log('2. You are logged in to Cloudflare account (npx wrangler login)');
  console.log('3. All dependencies are installed (npm install)');
  process.exit(1);
} 