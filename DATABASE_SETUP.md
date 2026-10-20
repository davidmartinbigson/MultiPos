# Database Setup Guide

## Prerequisites

Aapko PostgreSQL database chahiye. Free options:

### Option 1: Neon (Recommended - Free)
1. Go to https://neon.tech
2. Sign up with GitHub
3. Create new project
4. Copy connection string
5. Replace `password` with actual password in connection string

### Option 2: Supabase (Free)
1. Go to https://supabase.com
2. Sign up with GitHub
3. Create new project
4. Go to Settings > Database
5. Copy connection string (URI format)

### Option 3: Local PostgreSQL
```bash
# Install PostgreSQL
# Ubuntu/Debian
sudo apt install postgresql

# macOS
brew install postgresql

# Create database
createdb multipos
```

## Setup Steps

### Step 1: Configure Environment Variables

Edit `.env.local` file:

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@host:5432/multipos?sslmode=require"

# JWT Secret - Change this to a random secure string
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-abc123xyz"

# Master Admin Credentials
MASTER_ADMIN_EMAIL="davidmartinbigson@gmail.com"
MASTER_ADMIN_PASSWORD="123papers"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

**Important:** Replace `DATABASE_URL` with your actual database connection string!

### Step 2: Generate Prisma Client

```bash
npx prisma generate
```

### Step 3: Push Schema to Database

```bash
npx prisma db push
```

### Step 4: Start Development Server

```bash
npm run dev
```

### Step 5: Create Master Admin

1. Open browser: http://localhost:3000/setup
2. Click "Create Master Admin" button
3. Wait for success message
4. Login at: http://localhost:3000/admin/login

**Master Admin Credentials:**
- Email: davidmartinbigson@gmail.com
- Password: 123papers

## Production Deployment

For Vercel deployment:

1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add these variables:
   - `DATABASE_URL` (from Neon/Supabase)
   - `JWT_SECRET` (generate random string)
   - `MASTER_ADMIN_EMAIL`
   - `MASTER_ADMIN_PASSWORD`
5. Redeploy

## Complete Flow

1. **Customer Signup** → `/signup`
2. **Master Admin Approval** → `/admin` (approve user, generate license)
3. **Customer Login** → `/login`
4. **Customer Dashboard** → `/dashboard`

## API Endpoints

- `POST /api/auth/signup` - Customer signup
- `POST /api/auth/login` - Login (customer & admin)
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user
- `POST /api/admin/setup` - Create master admin (one-time)
- `GET /api/admin/users` - Get all customers (admin only)
- `PUT /api/admin/users/[id]` - Approve/Suspend/License user (admin only)

## Troubleshooting

### Database Connection Error
- Check DATABASE_URL is correct
- Ensure database exists
- Check network access (for cloud databases)

### Prisma Client Error
```bash
rm -rf node_modules/.prisma
npx prisma generate
```

### Migration Error
```bash
npx prisma db push --force-reset
```

## Security Notes

- Never commit `.env.local` to Git (already in .gitignore)
- Use strong JWT_SECRET (32+ characters)
- Change master admin password after first login
- Enable SSL for production database connections
- Regular database backups
