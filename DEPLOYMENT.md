# Deployment Guide

This guide covers deploying the boilerplate application to Vercel.

## Prerequisites

Before deploying, ensure you have:

1. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository** - Code pushed to GitHub (required for Vercel integration)
3. **Third-Party Accounts**:
   - Clerk account with API keys
   - Supabase project with PostgreSQL database
   - Razorpay account with API keys
4. **Local Build Verification** - Run `npm run build` successfully

## Environment Variables Required

The following environment variables must be configured in Vercel:

### Clerk Authentication

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### Database (Supabase)

```
DATABASE_URL=postgresql://...?pgbouncer=true&connection_limit=1
DIRECT_URL=postgresql://...
```

### Razorpay Payments

```
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_WEBHOOK_SECRET=...
```

### Next.js

```
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

## Deployment Steps

### 1. Prepare GitHub Repository

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: Production-ready boilerplate"

# Add remote origin
git remote add origin https://github.com/yourusername/your-repo.git

# Push to GitHub
git push -u origin main
```

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Select "Import Git Repository"
4. Choose your GitHub repository
5. Vercel auto-detects Next.js framework settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

### 3. Configure Environment Variables

1. In Vercel project settings, navigate to **Settings → Environment Variables**
2. Add each variable listed above
3. For each variable, select the appropriate scope:
   - **Production**: Use for production secrets (recommended for API secrets)
   - **Preview**: Use for preview deployments
   - **Development**: Use for local development (optional)

**Recommended Scopes**:

- Public keys (`NEXT_PUBLIC_*`): All environments
- Secret keys (Clerk, Razorpay secrets): Production only initially
- Database URLs: All environments (use separate databases for dev/preview if available)

### 4. Deploy

1. After adding environment variables, click **Deploy**
2. Vercel automatically triggers build and deployment
3. Monitor deployment logs in real-time
4. Deployment typically takes 2-5 minutes
5. Vercel provides production URL: `https://your-app.vercel.app`

## Post-Deployment Configuration

### Update Third-Party Services

#### Clerk

1. Go to [clerk.com/dashboard](https://clerk.com/dashboard)
2. Navigate to your application
3. Go to **Settings → Domains**
4. Add your Vercel domain: `your-app.vercel.app`
5. Update redirect URLs if needed

#### Razorpay

1. Go to [razorpay.com/dashboard](https://razorpay.com/dashboard)
2. Navigate to **Settings → Webhooks**
3. Add webhook URL: `https://your-app.vercel.app/api/payment/webhook`
4. Subscribe to events:
   - `payment.captured`
   - `payment.failed`
5. Copy webhook secret and add to Vercel environment variables
6. **For production payments**: Switch to Live mode keys in Razorpay dashboard

#### Supabase (Optional)

- If using Supabase Auth features, add your Vercel domain to Allowed Redirect URLs
- For this boilerplate (using Clerk), no additional configuration needed

### Run Database Migrations

If you haven't pushed your schema to the production database:

```bash
# Install Vercel CLI
npm i -g vercel

# Pull environment variables from Vercel
vercel env pull .env.production.local

# Run Prisma migration/push
npx prisma db push
```

## Verification Checklist

After deployment, verify the following:

### Authentication Flow

- [ ] Navigate to `/sign-up` and create test account
- [ ] Verify email (if email verification enabled)
- [ ] Sign in at `/sign-in`
- [ ] Confirm UserButton appears in navbar
- [ ] Sign out successfully

### Database Operations

- [ ] Visit `/dashboard` (protected route)
- [ ] Confirm user created in Supabase database
- [ ] Update profile at `/example-form`
- [ ] Verify profile updates persist

### Payment Flow

- [ ] Navigate to `/test-payment`
- [ ] Click "Pay ₹500" button
- [ ] Complete payment with test card:
  - Card: `4111 1111 1111 1111`
  - Expiry: Any future date
  - CVV: Any 3 digits
- [ ] Verify payment success message
- [ ] Check order created in database
- [ ] Confirm webhook received (check Razorpay dashboard)

### Performance & Security

- [ ] Run Lighthouse audit (Performance, Accessibility, Best Practices, SEO)
- [ ] Verify security headers in browser DevTools (Network tab)
- [ ] Test protected routes redirect to sign-in
- [ ] Confirm API routes return proper status codes

## Custom Domain Configuration (Optional)

1. In Vercel project settings, go to **Settings → Domains**
2. Add your custom domain (e.g., `yourdomain.com`)
3. Follow Vercel's DNS configuration instructions:
   - Add A record pointing to Vercel's IP
   - Or add CNAME record pointing to `cname.vercel-dns.com`
4. Wait for DNS propagation (can take up to 48 hours)
5. Update `NEXT_PUBLIC_APP_URL` environment variable
6. Update Clerk and Razorpay webhook URLs to use new domain

## Continuous Deployment

Vercel automatically deploys on every push to the main branch:

```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push

# Vercel automatically builds and deploys
# View deployment status at vercel.com/dashboard
```

## Troubleshooting

### Build Failures

**Issue**: Build fails with "Module not found"

- **Solution**: Verify all dependencies in `package.json`, run `npm install` locally

**Issue**: Environment variable errors

- **Solution**: Check all required env vars are added in Vercel settings

**Issue**: TypeScript errors during build

- **Solution**: Run `npm run build` locally to identify and fix type errors

### Runtime Errors

**Issue**: Authentication not working

- **Solution**: Verify Clerk domain is added in Clerk dashboard

**Issue**: Database connection errors

- **Solution**: Check DATABASE_URL format, ensure Supabase allows connections

**Issue**: Payment webhook not receiving events

- **Solution**: Verify webhook URL in Razorpay dashboard, check webhook signature verification

### Performance Issues

**Issue**: Slow API responses

- **Solution**: Enable Vercel Edge Functions for API routes (add `export const runtime = 'edge'`)

**Issue**: High database latency

- **Solution**: Ensure using connection pooling (DATABASE_URL with `?pgbouncer=true`)

## Monitoring & Analytics

### Vercel Analytics

- Enable in project settings: **Analytics → Enable**
- Track Web Vitals, page views, and user interactions

### Error Tracking

Consider integrating error tracking services:

- Sentry ([sentry.io](https://sentry.io))
- LogRocket ([logrocket.com](https://logrocket.com))
- Highlight ([highlight.io](https://highlight.io))

### Application Monitoring

- Vercel provides real-time logs in dashboard
- Monitor function execution times
- Track bandwidth usage

## Security Best Practices

1. **Environment Variables**: Never commit `.env` files to Git
2. **API Keys**: Use separate keys for development/production
3. **Webhooks**: Always verify webhook signatures
4. **Rate Limiting**: Consider adding rate limiting to API routes
5. **CORS**: Configure appropriate CORS headers for API routes
6. **Content Security Policy**: Add CSP headers in `next.config.ts`

## Scaling Considerations

### Vercel Plan Limits

- **Hobby (Free)**:
  - 100GB bandwidth/month
  - 100 hours serverless function execution
  - No commercial use

- **Pro**:
  - 1TB bandwidth/month
  - 1000 hours serverless function execution
  - Commercial use allowed

### Database Scaling

- Supabase Free tier: 500MB database, 2GB bandwidth
- Upgrade to Pro for larger databases and connection pooling

### Payment Volume

- Razorpay charges transaction fees
- Contact Razorpay for custom pricing on high volumes

## Support Resources

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Documentation**: [nextjs.org/docs](https://nextjs.org/docs)
- **Clerk Documentation**: [clerk.com/docs](https://clerk.com/docs)
- **Prisma Documentation**: [prisma.io/docs](https://prisma.io/docs)
- **Razorpay Documentation**: [razorpay.com/docs](https://razorpay.com/docs)

---

**Deployment Complete!** Your full-stack application is now live and ready for users.
