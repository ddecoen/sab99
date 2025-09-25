# Vercel Deployment Fix

## Environment Variables Setup

In your Vercel dashboard, you need to set these environment variables:

### Required Environment Variables

1. **NEXTAUTH_URL**
   - Value: `https://your-app-name.vercel.app`
   - Replace `your-app-name` with your actual Vercel app name
   - Example: `https://sab99-tracker.vercel.app`

2. **NEXTAUTH_SECRET**
   - Value: Generate a secure secret
   - Run this command to generate one: `openssl rand -base64 32`
   - Example: `your-generated-secret-here`

3. **DATABASE_URL**
   - For SQLite (simple): `file:./prod.db`
   - For production database, use your database provider's connection string

### How to Set Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Click on "Settings"
4. Click on "Environment Variables"
5. Add each variable:
   - Name: `NEXTAUTH_URL`
   - Value: `https://your-app-name.vercel.app`
   - Environment: Production, Preview, Development (check all)

6. Repeat for `NEXTAUTH_SECRET` and `DATABASE_URL`

### Quick Fix Commands

If you're deploying now, set these in Vercel dashboard:

```
NEXTAUTH_URL=https://your-vercel-app-url.vercel.app
NEXTAUTH_SECRET=sab99-secret-key-replace-in-production
DATABASE_URL=file:./prod.db
```

### After Setting Environment Variables

1. Redeploy your application in Vercel
2. The error should be resolved
3. Test login with demo credentials

### Alternative: Use .env.production

Create this file for production-specific variables (but environment variables in Vercel dashboard are recommended).