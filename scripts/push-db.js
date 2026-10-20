#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Pushing database schema to Neon PostgreSQL...\n');

try {
  // Generate Prisma Client
  console.log('1️⃣  Generating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Push schema to database
  console.log('\n2️⃣  Pushing schema to database...');
  execSync('npx prisma db push', { stdio: 'inherit' });
  
  console.log('\n✅ Database setup complete!\n');
  console.log('📋 Next Steps:');
  console.log('   1. Deploy to Vercel (automatic)');
  console.log('   2. Visit /setup to create master admin');
  console.log('   3. Login at /admin/login');
  console.log('   4. Email: davidmartinbigson@gmail.com');
  console.log('   5. Password: 123papers\n');
  
} catch (error) {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
}
