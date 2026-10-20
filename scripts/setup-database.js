#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🚀 Setting up Neon PostgreSQL database...\n');

try {
  // Check if DATABASE_URL exists
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not found in environment variables');
    process.exit(1);
  }

  console.log('✅ DATABASE_URL found\n');

  // Generate Prisma Client
  console.log('1️⃣  Generating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Push schema to database
  console.log('\n2️⃣  Pushing schema to Neon database...');
  execSync('npx prisma db push', { stdio: 'inherit' });
  
  console.log('\n✅ Database setup complete!\n');
  console.log('📊 Tables created:');
  console.log('   - users (master admin & customers)');
  console.log('   - sessions (authentication tokens)');
  console.log('\n🎉 Ready to use!');
  
} catch (error) {
  console.error('\n❌ Setup failed:', error.message);
  process.exit(1);
}
