# 🚀 MultiPOS Deployment Guide

## ✅ What's Done

- ✅ Neon PostgreSQL database connected
- ✅ Code pushed to GitHub
- ✅ Vercel auto-deploy configured

## 🔧 What You Need To Do

### Step 1: Set Vercel Environment Variables

1. Go to **Vercel Dashboard**: https://vercel.com/dashboard
2. Select your **MultiPOS** project
3. Go to **Settings** → **Environment Variables**
4. Add these **5 variables**:

| Variable Name | Value |
|--------------|-------|
| `DATABASE_URL` | `postgresql://neondb_owner:npg_ZMoL2YQVf1GK@ep-empty-term-b5bp2dnv-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require` |
| `DIRECT_URL` | `postgresql://neondb_owner:npg_ZMoL2YQVf1GK@ep-empty-term-b5bp2dnv-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require` |
| `JWT_SECRET` | `multipos-super-secret-jwt-key-2024-xK9mP3vL8nQ2` |
| `MASTER_ADMIN_EMAIL` | `davidmartinbigson@gmail.com` |
| `MASTER_ADMIN_PASSWORD` | `123papers` |

**For each variable:**
- Select: ✅ Production ✅ Preview ✅ Development
- Click **Save**

### Step 2: Push Database Schema (Local Machine)

On your local computer:

```bash
# Clone the repository
git clone https://github.com/davidmartinbigson/MultiPos.git
cd MultiPos

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Edit .env.local and add your Neon connection string:
# DATABASE_URL="postgresql://neondb_owner:npg_ZMoL2YQVf1GK@ep-empty-term-b5bp2dnv-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
# DIRECT_URL="postgresql://neondb_owner:npg_ZMoL2YQVf1GK@ep-empty-term-b5bp2dnv-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Push database schema
npm run db:push

# Or manually:
npx prisma generate
npx prisma db push
```

### Step 3: Redeploy on Vercel

1. Go to **Vercel Dashboard** → Your project
2. Go to **Deployments** tab
3. Click **⋮** (3 dots) on latest deployment
4. Select **Redeploy**

### Step 4: Setup Master Admin

1. Visit your Vercel URL: `https://your-project.vercel.app/setup`
2. Click **"Create Master Admin"**
3. Success message will appear
4. Login at: `/admin/login`

**Master Admin Credentials:**
- Email: `davidmartinbigson@gmail.com`
- Password: `123papers`

## 🎯 Complete Flow

1. **Customer Signup** → `/signup` (creates pending account)
2. **Master Admin Login** → `/admin/login`
3. **Admin Dashboard** → `/admin` (approve customers, generate licenses)
4. **Customer Login** → `/login` (after approval)
5. **Customer Dashboard** → `/dashboard`

## 🔍 Troubleshooting

### Build Failed?
- Check Vercel build logs
- Ensure all 5 environment variables are set
- Redeploy after adding variables

### Database Connection Error?
- Verify DATABASE_URL in Vercel env vars
- Check Neon dashboard - database should be active
- Ensure no typos in connection string

### Can't Login?
- Visit `/setup` to create master admin
- Check browser console for errors
- Verify MASTER_ADMIN_EMAIL and MASTER_ADMIN_PASSWORD in env vars

## 📊 Database Access (Optional)

To view/edit data directly:

```bash
# Open Prisma Studio (database GUI)
npx prisma studio
```

This opens a web interface at http://localhost:5555 where you can:
- View all users
- Edit licenses
- Manage data

---

**Need help?** Check the error messages and share them! 🚀
