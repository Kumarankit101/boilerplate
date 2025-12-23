# Full-Stack Boilerplate

Production-ready Next.js 15+ boilerplate with Authentication, Database, Payments, and Modern Tooling.

## Features

- ⚡ **Next.js 16** - App Router, Server Components, Server Actions
- 🎨 **Tailwind CSS v4** - CSS-first configuration with OKLCH colors
- 🧩 **shadcn/ui** - Beautiful, accessible UI components
- 🔐 **Clerk Authentication** - Complete auth solution with middleware protection
- 🗄️ **Prisma + Supabase** - Type-safe ORM with PostgreSQL
- 💳 **Razorpay** - Payment processing with webhook verification
- 📝 **React Hook Form + Zod** - Type-safe form validation
- 🔄 **TanStack Query v5** - Server state management with caching
- 🐻 **Zustand** - Lightweight client state management
- ✅ **Vitest** - Fast unit testing with React Testing Library
- 🎯 **TypeScript** - Strict mode enabled
- 🔍 **ESLint + Prettier** - Code quality and formatting
- 🪝 **Husky + lint-staged** - Pre-commit quality checks
- 🚀 **Vercel-ready** - Optimized for deployment

## Tech Stack

**Frontend:**

- Next.js 16.0.1
- React 19
- Tailwind CSS v4
- shadcn/ui components
- Lucide Icons

**Backend:**

- Next.js API Routes (Route Handlers)
- Clerk Authentication
- Prisma ORM
- Supabase PostgreSQL

**State Management:**

- TanStack Query v5 (server state)
- Zustand (client state)
- React Hook Form (form state)

**Validation:**

- Zod schemas (runtime validation)
- TypeScript (compile-time validation)

**Testing:**

- Vitest
- React Testing Library

**Dev Tools:**

- ESLint 9
- Prettier with Tailwind plugin
- Husky (Git hooks)
- lint-staged

## Prerequisites

Before setup, create accounts and obtain credentials from:

1. **Clerk** (https://clerk.com)
   - Create application
   - Get Publishable Key and Secret Key

2. **Supabase** (https://supabase.com)
   - Create project
   - Get database connection strings (pooling + direct)

3. **Razorpay** (https://razorpay.com)
   - Sign up for account
   - Get Test Mode API keys
   - Generate Webhook Secret

## Getting Started

### 1. Clone and Install

\`\`\`bash
git clone <your-repo-url>
cd boilerplate
npm install
\`\`\`

### 2. Environment Variables

Create `.env.local` file in root:

\`\`\`env

# Clerk Authentication

NEXT*PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test*...
CLERK*SECRET_KEY=sk_test*...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard

# Database (Supabase + Prisma)

DATABASE_URL=postgresql://...6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://...5432/postgres

# Razorpay Payments

RAZORPAY*KEY_ID=rzp_test*...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...
\`\`\`

### 3. Database Setup

\`\`\`bash

# Initialize Prisma (if not done)

npx prisma init

# Run migrations

npx prisma migrate dev

# Generate Prisma Client

npx prisma generate
\`\`\`

### 4. Configure Clerk Webhook (Recommended)

The boilerplate includes a Clerk webhook endpoint at `/api/webhooks/clerk` that automatically creates users in your database when they sign up.

**To enable this:**

1. Go to Clerk Dashboard → Webhooks
2. Click "Add Endpoint"
3. Set URL to: `https://your-domain.com/api/webhooks/clerk` (for local dev, use ngrok)
4. Subscribe to event: `user.created`
5. Copy the "Signing Secret"
6. Add to `.env.local`: `CLERK_WEBHOOK_SECRET=whsec_...`

**Alternative:** Without webhooks, users are created lazily on first API call (default behavior).

### 5. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

\`\`\`
├── app/ # Next.js App Router
│ ├── (auth)/ # Auth route group
│ │ ├── sign-in/ # Sign-in page
│ │ └── sign-up/ # Sign-up page
│ ├── (protected)/ # Protected routes
│ │ ├── dashboard/ # Dashboard page
│ │ ├── profile/ # User profile
│ │ └── example-form/ # Form example
│ ├── api/ # API routes
│ │ ├── user/ # User endpoints
│ │ ├── payment/ # Payment endpoints
│ │ └── webhooks/ # Webhook handlers
│ ├── globals.css # Global styles
│ ├── layout.tsx # Root layout
│ └── page.tsx # Home page
├── components/
│ └── ui/ # shadcn/ui components
├── lib/
│ ├── db/ # Database helpers
│ ├── hooks/ # Custom React hooks
│ ├── providers/ # Context providers
│ ├── store/ # Zustand stores
│ ├── validations/ # Zod schemas
│ ├── prisma.ts # Prisma client
│ ├── razorpay.ts # Razorpay instance
│ └── utils.ts # Utilities
├── prisma/
│ └── schema.prisma # Database schema
├── public/ # Static assets
└── **tests**/ # Test files
\`\`\`

## Available Scripts

\`\`\`bash
npm run dev # Start development server
npm run build # Build for production
npm start # Start production server
npm run lint # Run ESLint
npm run lint:fix # Fix ESLint errors
npm run format # Format code with Prettier
npm run format:check # Check code formatting
npm test # Run tests (watch mode)
npm run test:run # Run tests once
npm run test:coverage # Generate coverage report
\`\`\`

## Development Workflow

### 1. Code Quality

Pre-commit hooks automatically run:

- ESLint (fixes errors)
- Prettier (formats code)

### 2. Testing

\`\`\`bash

# Run tests in watch mode

npm test

# Run tests once (CI)

npm run test:run

# Generate coverage

npm run test:coverage
\`\`\`

### 3. Database Migrations

\`\`\`bash

# Create migration

npx prisma migrate dev --name migration_name

# Apply migrations in production

npx prisma migrate deploy

# Reset database (WARNING: deletes all data)

npx prisma migrate reset
\`\`\`

## Deployment (Vercel)

### 1. Push to GitHub

\`\`\`bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
\`\`\`

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Add environment variables (same as `.env.local`)
4. Deploy

### 3. Post-Deployment

- Update Clerk allowed origins with production URL
- Update Razorpay webhook URL to production endpoint
- Test authentication, database, and payments in production

## API Routes

### Authentication

- Managed by Clerk middleware
- Protected routes require authentication

### User API

- `GET /api/user` - Get current user
- `PATCH /api/user` - Update user profile

### Payment API

- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify` - Verify payment signature
- `POST /api/payment/webhook` - Handle Razorpay webhooks

### Webhook API

- `POST /api/webhooks/clerk` - Handle Clerk webhooks (user creation, updates)

## Environment Variables Reference

| Variable                            | Description                  | Required    |
| ----------------------------------- | ---------------------------- | ----------- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key        | Yes         |
| `CLERK_SECRET_KEY`                  | Clerk secret key             | Yes         |
| `CLERK_WEBHOOK_SECRET`              | Clerk webhook signing secret | Recommended |
| `DATABASE_URL`                      | Supabase pooling connection  | Yes         |
| `DIRECT_URL`                        | Supabase direct connection   | Yes         |
| `RAZORPAY_KEY_ID`                   | Razorpay key ID              | Yes         |
| `RAZORPAY_KEY_SECRET`               | Razorpay secret              | Yes         |
| `RAZORPAY_WEBHOOK_SECRET`           | Razorpay webhook secret      | Yes         |

## Security Notes

- Never commit `.env.local` to git
- Use environment-specific keys (test/production)
- Verify webhook signatures for payments
- Enable Clerk middleware protection for sensitive routes
- Use Prisma's parameterized queries (prevents SQL injection)
- Keep Next.js updated (CVE-2025-29927 requires 15.2.3+)

## Troubleshooting

### Build Errors

\`\`\`bash

# Clear Next.js cache

rm -rf .next

# Reinstall dependencies

rm -rf node_modules package-lock.json
npm install

# Rebuild

npm run build
\`\`\`

### Database Connection Issues

- Verify DATABASE_URL and DIRECT_URL in .env.local
- Check Supabase project is running
- Ensure connection pooling string includes `?pgbouncer=true`

### Clerk Authentication Issues

- Verify environment variables are set
- Check middleware.ts configuration
- Ensure Clerk application has correct allowed origins

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

MIT License - feel free to use this boilerplate for any project.

## Support

For issues and questions:

- Check the [plan.md](./plan.md) for detailed implementation guide
- Review [execution_log.md](./execution_log.md) for setup status
- Open an issue on GitHub

---

Built with ❤️ using Next.js, Clerk, Prisma, and modern web technologies.
