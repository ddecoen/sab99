# SAB 99 Tracker - Deployment Instructions

## Vercel Deployment

### Prerequisites
1. Vercel account (free tier works)
2. GitHub repository connected to Vercel

### Environment Variables
Set these environment variables in your Vercel dashboard:

```
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your-super-secret-key-here
DATABASE_URL=file:./prod.db
```

### Deployment Steps

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect it's a Next.js project

3. **Set Environment Variables**:
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add the three variables listed above
   - Generate a secure NEXTAUTH_SECRET (use: `openssl rand -base64 32`)

4. **Deploy**:
   - Vercel will automatically deploy on every push to main
   - First deployment may take 2-3 minutes

### Database Setup

For production, you may want to use a proper database service:

1. **Option 1: PlanetScale (Recommended)**:
   ```
   DATABASE_URL="mysql://username:password@host/database?sslaccept=strict"
   ```

2. **Option 2: Supabase**:
   ```
   DATABASE_URL="postgresql://username:password@host:5432/database"
   ```

3. **Option 3: Railway**:
   ```
   DATABASE_URL="postgresql://username:password@host:5432/database"
   ```

If using a different database provider, update `prisma/schema.prisma` datasource accordingly.

### Post-Deployment Setup

1. **Initialize Database**:
   After first deployment, you'll need to run migrations:
   ```bash
   npx vercel env pull .env.local
   npx prisma generate
   npx prisma db push
   ```

2. **Test Login**:
   Use the demo credentials:
   - Admin: admin@company.com / admin123
   - Accountant: accountant@company.com / acc123
   - Auditor: auditor@company.com / audit123

## Local Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Setup Environment**:
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your values
   ```

3. **Initialize Database**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## Production Considerations

### Security
- Replace demo credentials with real user authentication
- Use environment variables for all secrets
- Enable HTTPS (Vercel provides this automatically)
- Consider implementing role-based access control

### Database
- Use a production database service
- Implement regular backups
- Monitor database performance

### Monitoring
- Setup error monitoring (Sentry, LogRocket)
- Monitor application performance
- Setup uptime monitoring

### Compliance
- Ensure data encryption at rest and in transit
- Implement audit logging
- Consider data retention policies
- Review security compliance requirements (SOX, etc.)

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check that all environment variables are set
   - Verify database connection string
   - Check for TypeScript errors

2. **Authentication Issues**:
   - Verify NEXTAUTH_URL matches your domain
   - Check NEXTAUTH_SECRET is set
   - Ensure callback URLs are correct

3. **Database Issues**:
   - Run `npx prisma db push` to sync schema
   - Check database permissions
   - Verify connection string format

### Getting Help

- Check Vercel deployment logs
- Review browser console for client-side errors
- Check Prisma documentation for database issues
- NextAuth.js documentation for authentication issues