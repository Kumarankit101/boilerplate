# Task: Production-Ready Full-Stack Boilerplate with Next.js 15, Clerk, Prisma, Supabase, and Razorpay

## Summary

Create a modern, type-safe, production-ready full-stack boilerplate using Next.js 15 (App Router), Clerk authentication, Prisma ORM with Supabase PostgreSQL, Razorpay payments, and a comprehensive UI layer with Tailwind CSS v4 and shadcn/ui. The application will feature server-side rendering capabilities, secure authentication flows, database operations, payment processing, and form validation. All backend logic resides within Next.js API routes (route handlers) with no separate backend server. The boilerplate includes complete tooling for code quality (ESLint, Prettier, Husky), testing (Vitest), and Vercel deployment configuration. Success means a fully functional, auto-installable codebase that developers can clone and immediately start building upon with confidence in security, type safety, and modern best practices.

## Knowledge Gathering

### Next.js 15 & App Router

Next.js 15 is the latest stable version featuring the App Router architecture that leverages React Server Components, Server Actions, and Suspense. The App Router uses file-system based routing with special file conventions (page.tsx, layout.tsx, loading.tsx, error.tsx). Server Actions eliminate the need for traditional API routes in many cases by allowing direct server-side function calls from client components using the `use server` directive. However, for webhook endpoints and external API integrations (like Razorpay webhooks), traditional route handlers in `app/api/*` are still necessary. Next.js 15.2.3+ includes critical security patches (CVE-2025-29927) addressing middleware bypass vulnerabilities - this version or higher is mandatory.

**Key architectural patterns:**

- Server Components by default (no `use client` needed)
- Client Components require explicit `use client` directive
- Server Actions for mutations, placed in separate files or inline with `use server`
- Route handlers for webhooks, external APIs, and non-mutation endpoints
- Middleware for authentication checks using Clerk's `clerkMiddleware()`

### Tailwind CSS v4 & shadcn/ui

Tailwind CSS v4 represents a major architectural shift from JavaScript configuration to CSS-first configuration. The `tailwind.config.js` file is eliminated in favor of `@theme` directives directly in CSS files. shadcn/ui has been updated for full Tailwind v4 compatibility and now uses OKLCH color spaces instead of HSL. The CLI (`npx shadcn@latest init`) automatically configures projects for Tailwind v4, installs tw-animate-css (replacing tailwindcss-animate), and sets the default style to "new-york". Components are copied into the project rather than installed as dependencies, allowing full customization.

**Installation approach:**

- Use `create-next-app` with Tailwind option
- Run `npx shadcn@latest init` to configure Tailwind v4 and component structure
- Components install to `components/ui` by default
- Lucide React provides icon library
- CSS configuration in `app/globals.css` using `@theme` directives

### Clerk Authentication

Clerk provides production-ready authentication with minimal setup time (~30 minutes). For Next.js 15 App Router, Clerk offers native Server Component integration through the `auth()` helper and `currentUser()` function. Authentication middleware uses `clerkMiddleware()` with route matchers for protecting specific routes. By default, all routes are public unless explicitly protected.

**Critical implementation details:**

- Install `@clerk/nextjs` package
- Create middleware.ts at project root with `clerkMiddleware()` and route matchers
- Use `auth()` in Server Components and route handlers for user session data
- Use `<ClerkProvider>` wrapper in root layout
- Configure `<SignIn>`, `<SignUp>`, and `<UserButton>` components
- Protect routes using `createRouteMatcher` pattern for dashboard, admin, etc.
- Environment variables: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
- Must use Next.js 15.2.3+ for security patches

### Prisma ORM with Supabase PostgreSQL

Prisma is a type-safe ORM that generates TypeScript types from the database schema. When using Supabase, two connection strings are required: `DATABASE_URL` (for queries via connection pooling, port 6543) and `DIRECT_URL` (for migrations via direct connection, port 5432). Supabase provides both Transaction Pooler and Session Pooler options; Transaction Pooler requires `?pgbouncer=true` parameter.

**Setup workflow:**

- Create Supabase project and obtain connection strings from Connect → ORMs
- Install `prisma` and `@prisma/client`
- Initialize with `npx prisma init`
- Configure `schema.prisma` with datasource containing both `url` and `directUrl`
- Define models in schema
- Run `npx prisma migrate dev` for development migrations
- Run `npx prisma generate` to generate Prisma Client
- Use singleton pattern for Prisma Client instantiation (avoid multiple instances)

**Best practices:**

- Create custom Supabase user "prisma_user" with appropriate permissions
- Use connection pooling (Supavisor) for production
- Implement global Prisma Client singleton to prevent connection exhaustion
- Store schema in `prisma/schema.prisma`

### Razorpay Payment Integration

Razorpay is a payment gateway supporting Indian and international payments. Integration requires creating payment orders server-side, capturing payment on client-side using Razorpay checkout script, and verifying payments via webhook or callback. The Node.js SDK (`razorpay` package) provides order creation and signature verification utilities.

**Implementation flow:**

1. Server creates order via `/api/payment/create-order` using Razorpay SDK
2. Client receives order ID and opens Razorpay checkout modal
3. User completes payment
4. Razorpay sends webhook to `/api/payment/webhook` with signature
5. Server verifies signature using HMAC SHA256
6. Update database with payment status

**Security requirements:**

- Verify webhook signature using `key_secret`
- Use `crypto.createHmac('sha256', secret)` for verification
- Store orders in database before payment initiation
- Update order status only after successful verification
- Environment variables: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`

### React Hook Form + Zod

React Hook Form provides performant, flexible form management with minimal re-renders. Zod is a TypeScript-first schema validation library. The combination offers type-safe form validation with automatic TypeScript inference. Use `@hookform/resolvers/zod` for integration.

**Pattern:**

- Define Zod schema with validation rules
- Infer TypeScript type from schema using `z.infer<typeof schema>`
- Use `useForm` hook with `zodResolver`
- Handle submission with type-safe data
- Display field errors using `formState.errors`

### Zustand & TanStack Query

Zustand manages client-side UI state (modals, theme, user preferences) while TanStack Query (React Query) v5 manages server state (API data, caching, refetching). These libraries complement rather than replace each other.

**Zustand patterns:**

- Create stores in `lib/store` directory
- Use middleware for persistence (localStorage)
- Keep stores focused and single-purpose

**TanStack Query v5 patterns:**

- Wrap app in `QueryClientProvider`
- Use `useQuery` for fetching data
- Use `useMutation` for mutations
- Combine with Zod for runtime API response validation
- Configure stale times, cache times, retry logic

### Testing with Vitest

Vitest is the preferred testing framework for Next.js 15 due to native ES module support, faster execution, and better compatibility with React 19. Vitest is Jest-compatible but designed for Vite. React Testing Library provides utilities for testing React components.

**Important limitation:**
Async Server Components are not currently supported by Vitest. Use E2E tests (Playwright) for testing async Server Components.

**Setup:**

- Install vitest, @vitejs/plugin-react, jsdom, @testing-library/react, @testing-library/dom
- Configure vitest.config.ts with React plugin and jsdom environment
- Create test files with `.test.tsx` or `.test.ts` extension
- Write unit tests for utilities, Client Components, and synchronous Server Components

### Code Quality Tools

ESLint 8 is recommended over ESLint 9 as many plugins lack ESLint 9 support. Prettier handles code formatting. Husky manages Git hooks. lint-staged runs linters on staged files only.

**Configuration flow:**

1. Install ESLint, Prettier, Husky, lint-staged
2. Configure .eslintrc.json with Next.js, TypeScript, Prettier rules
3. Configure .prettierrc for consistent formatting
4. Initialize Husky with `npx husky init`
5. Configure lint-staged in package.json
6. Create pre-commit hook to run lint-staged

### Vercel Deployment

Vercel is the native hosting platform for Next.js with zero-config deployments. Environment variables are configured in Vercel dashboard under Settings → Environment Variables with options for Production, Preview, and Development scopes.

**Deployment checklist:**

- Connect GitHub repository to Vercel
- Configure environment variables for all three scopes
- Set build command (default: `next build`)
- Configure root directory if needed
- After adding variables, trigger redeploy
- Use `vercel env pull` to sync environment variables locally

## Current Dependencies Summary

Since this is a greenfield project (empty directory), there are no existing dependencies. The following dependencies will be installed:

**Core Framework & UI:**

- next (^15.2.3 minimum for security)
- react, react-dom (^19.x)
- typescript
- tailwindcss (^4.x)
- @shadcn/ui (CLI tool, components copied not installed)
- lucide-react

**Authentication:**

- @clerk/nextjs

**Database & ORM:**

- @prisma/client
- prisma (dev dependency)

**Payment Processing:**

- razorpay (Node.js SDK)

**Forms & Validation:**

- react-hook-form
- zod
- @hookform/resolvers

**State Management:**

- zustand
- @tanstack/react-query

**Development Tools:**

- eslint (v8.x)
- eslint-config-next
- eslint-config-prettier
- eslint-plugin-prettier
- prettier
- prettier-plugin-tailwindcss
- @typescript-eslint/eslint-plugin
- @typescript-eslint/parser
- husky
- lint-staged

**Testing:**

- vitest
- @vitejs/plugin-react
- @testing-library/react
- @testing-library/dom
- jsdom

## Codebase Analysis

This is a new project starting from an empty directory. The application will follow Next.js 15 App Router conventions with the following anticipated structure:

**Root-level configuration files:**

- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `next.config.ts` - Next.js configuration
- `middleware.ts` - Clerk authentication middleware
- `.env.example` - Template for environment variables
- `.env.local` - Local environment variables (gitignored)
- `.eslintrc.json` - ESLint rules
- `.prettierrc` - Prettier configuration
- `vitest.config.ts` - Vitest test configuration

**App directory structure (app/):**

- `layout.tsx` - Root layout with ClerkProvider and QueryClientProvider
- `page.tsx` - Home/landing page
- `globals.css` - Global styles with Tailwind v4 @theme directives
- `(auth)/` - Route group for auth pages
  - `sign-in/[[...sign-in]]/page.tsx` - Clerk sign-in
  - `sign-up/[[...sign-up]]/page.tsx` - Clerk sign-up
- `(protected)/` - Route group for authenticated routes
  - `dashboard/page.tsx` - Protected dashboard
  - `profile/page.tsx` - User profile page
  - `example-form/page.tsx` - Form demonstration
- `api/` - API route handlers
  - `user/route.ts` - User CRUD operations
  - `payment/create-order/route.ts` - Razorpay order creation
  - `payment/webhook/route.ts` - Razorpay webhook handler

**Components directory (components/):**

- `ui/` - shadcn/ui components (button, input, form, etc.)
- Custom reusable components (navbar, footer, etc.)

**Library directory (lib/):**

- `prisma.ts` - Prisma Client singleton
- `razorpay.ts` - Razorpay SDK instance
- `utils.ts` - Utility functions (cn helper, etc.)
- `validations/` - Zod schemas
- `store/` - Zustand stores

**Prisma directory (prisma/):**

- `schema.prisma` - Database schema

**No modules currently exist** as this is a fresh project. All integrations will be built from scratch following modern best practices for Next.js 15, TypeScript, and the specified tech stack.

---

## Phase-Based Implementation Plan

### Phase 1: Project Initialization & Base Configuration

**Goal of the Phase:**
Establish the foundational Next.js 15 project with TypeScript, Tailwind CSS v4, and essential configuration files. Create the project structure, install core dependencies, and configure development tools (ESLint, Prettier, Husky) to ensure code quality from the start.

**Detailed Implementation Steps:**

**Step 1.1: Initialize Next.js 15 Project**

- Execute `npx create-next-app@latest` with interactive prompts
- Select TypeScript: Yes
- Select ESLint: Yes
- Select Tailwind CSS: Yes
- Select `src/` directory: No (use app directory at root)
- Select App Router: Yes
- Customize default import alias: No (keep `@/` default)
- This creates initial structure with `app/`, `public/`, basic configuration files
- Verify Next.js version is 15.2.3 or higher in package.json (critical for security)

**Step 1.2: Install shadcn/ui**

- Run `npx shadcn@latest init` in project root
- Select "new-york" style (default for 2025)
- Select base color (slate recommended for professional look)
- Configure CSS variables: Yes
- This modifies `app/globals.css` with Tailwind v4 @theme directives
- Creates `components/ui/` directory
- Adds `lib/utils.ts` with `cn` helper function
- Configures `components.json` for shadcn CLI

**Step 1.3: Install Initial shadcn Components**

- Install commonly needed UI components: `npx shadcn@latest add button input label card form`
- These copy component files to `components/ui/`
- Form component includes integration with react-hook-form
- Verify all components use Tailwind v4 OKLCH colors

**Step 1.4: Configure TypeScript**

- Update `tsconfig.json` with strict type checking
- Enable `"strict": true`, `"noUnusedLocals": true`, `"noUnusedParameters": true`
- Ensure `"paths"` includes `"@/*": ["./*"]` alias
- Add `"exclude": ["node_modules", ".next", "out"]`

**Step 1.5: Set Up ESLint**

- Install ESLint packages: `npm install --save-dev eslint@^8 eslint-config-next eslint-config-prettier eslint-plugin-prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser`
- Create `.eslintrc.json` at root
- Extend `"next/core-web-vitals"`, `"plugin:@typescript-eslint/recommended"`, `"prettier"`
- Add rules for consistent code style (quotes, semi, indent)
- Create `.eslintignore` to exclude `.next/`, `node_modules/`, `out/`, `dist/`

**Step 1.6: Set Up Prettier**

- Install: `npm install --save-dev prettier prettier-plugin-tailwindcss`
- Create `.prettierrc` with configuration: semi: false, singleQuote: true, tabWidth: 2, trailingComma: 'es5', plugins: ['prettier-plugin-tailwindcss']
- The Tailwind plugin automatically sorts class names
- Create `.prettierignore` mirroring `.eslintignore`

**Step 1.7: Configure Husky & lint-staged**

- Install: `npm install --save-dev husky lint-staged`
- Initialize Husky: `npx husky init`
- This creates `.husky/` directory
- Create `.husky/pre-commit` file with content: `npx lint-staged`
- Add lint-staged configuration to `package.json`:
  - Target "\*.{js,jsx,ts,tsx}": run eslint --fix and prettier --write
  - Target "\*.{json,md,css}": run prettier --write
- Verify hook works by staging a file and committing

**Step 1.8: Add Package Scripts**

- Update `package.json` scripts section
- Add `"lint": "eslint . --ext .ts,.tsx --max-warnings 0"`
- Add `"lint:fix": "eslint . --ext .ts,.tsx --fix"`
- Add `"format": "prettier --write ."`
- Add `"format:check": "prettier --check ."`
- Keep existing `dev`, `build`, `start` scripts from create-next-app

**Step 1.9: Create Environment Variable Template**

- Create `.env.example` at root with placeholder keys (empty values)
- Include sections for: Next.js, Clerk, Database, Razorpay
- Add comment headers explaining each section
- Create `.env.local` with actual development values (gitignored by default)
- Add `.env.local` to `.gitignore` if not already present

**Step 1.10: Configure Next.js**

- Update or create `next.config.ts` at root
- Add `reactStrictMode: true` for development warnings
- Configure `images.domains` for Clerk user avatars: `["img.clerk.com"]`
- Add any necessary headers for security (CSP considerations for later)

**Reasoning:**
Starting with proper tooling prevents technical debt and establishes code quality standards from day one. Next.js 15.2.3+ is mandatory due to critical authentication middleware vulnerabilities. Tailwind v4 represents the future of Tailwind configuration and shadcn/ui components are already updated for it. ESLint 8 (not 9) ensures plugin compatibility. Husky and lint-staged prevent bad commits from entering the repository. The package scripts provide consistent commands across the team.

**Expected Outcome:**

- Runnable Next.js 15 application with `npm run dev`
- Formatted, linted codebase with automatic pre-commit checks
- TypeScript configured with strict mode
- Tailwind v4 with shadcn/ui components available
- Basic project structure following Next.js App Router conventions
- Environment variable template ready for service integrations

---

### Phase 2: Authentication Integration with Clerk

**Goal of the Phase:**
Implement secure, production-ready authentication using Clerk with protected routes, sign-in/sign-up pages, user management, and middleware protection. Establish the foundation for role-based access control and user session management throughout the application.

**Detailed Implementation Steps:**

**Step 2.1: Install Clerk Package**

- Install: `npm install @clerk/nextjs`
- Verify installation of latest compatible version with Next.js 15
- Check package.json to confirm @clerk/nextjs is added

**Step 2.2: Obtain Clerk API Keys**

- Sign up or log in to clerk.com
- Create new application (select authentication methods: Email, Google optional)
- Navigate to API Keys section in dashboard
- Copy `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`
- Add both keys to `.env.local`
- Add both keys (with empty values) to `.env.example`

**Step 2.3: Configure Clerk Environment Variables**

- Add to `.env.local`: `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`
- Add: `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`
- Add: `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard`
- Add: `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard`
- These control routing after authentication
- Update `.env.example` with these keys (empty values)

**Step 2.4: Create Authentication Middleware**

- Create `middleware.ts` at project root (not in app directory)
- Import `clerkMiddleware`, `createRouteMatcher`
- Define protected route patterns: `/dashboard`, `/profile`, any routes requiring auth
- Use `createRouteMatcher` to create matcher function for protected routes
- Configure `clerkMiddleware` to check route matcher and call `auth.protect()` for protected routes
- Export middleware with config matching all routes except static files: `matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)']`

**Step 2.5: Wrap Application with ClerkProvider**

- Open `app/layout.tsx`
- Import `ClerkProvider` from '@clerk/nextjs'
- Wrap `{children}` with `<ClerkProvider>`
- Keep existing HTML and body structure
- ClerkProvider must be outside of any Client Components

**Step 2.6: Create Sign-In Page**

- Create directory structure: `app/(auth)/sign-in/[[...sign-in]]/`
- The `[[...sign-in]]` catch-all route handles Clerk's internal routing
- Create `page.tsx` in this directory
- Import `SignIn` component from '@clerk/nextjs'
- Return `<SignIn />` component in default export
- Add page styling (center the form, add background)
- Mark as Server Component (no 'use client' needed)

**Step 2.7: Create Sign-Up Page**

- Create directory structure: `app/(auth)/sign-up/[[...sign-up]]/`
- Create `page.tsx` with `SignUp` component from '@clerk/nextjs'
- Return `<SignUp />` component
- Apply consistent styling with sign-in page
- Clerk handles all form logic, validation, email verification

**Step 2.8: Create Protected Dashboard Page**

- Create directory: `app/(protected)/dashboard/`
- Create `page.tsx` as async Server Component
- Import `auth` from '@clerk/nextjs'
- Call `auth()` to get user session
- Access `userId` from returned object
- If userId exists, display welcome message
- Show sign-out button option
- This tests that protection works

**Step 2.9: Add Navigation with UserButton**

- Create `components/navbar.tsx` as Client Component ('use client')
- Import `UserButton`, `SignedIn`, `SignedOut` from '@clerk/nextjs'
- Use `<SignedIn>` wrapper to show `<UserButton />` when authenticated
- Use `<SignedOut>` wrapper to show sign-in link when not authenticated
- Add navigation links to home, dashboard, etc.
- Add navbar to root layout above {children}

**Step 2.10: Test Authentication Flow**

- Start dev server: `npm run dev`
- Navigate to `/sign-up` and create test account
- Verify email verification flow (check email)
- Complete verification and ensure redirect to `/dashboard`
- Verify dashboard shows user information
- Click UserButton and sign out
- Attempt to access `/dashboard` while signed out
- Verify redirect to sign-in page (middleware protection working)

**Reasoning:**
Clerk provides production-ready authentication without building custom auth logic. Middleware protection at the route level prevents unauthorized access before page renders. The catch-all route syntax `[[...sign-in]]` allows Clerk to handle multi-step flows (email verification, password reset) without additional routing configuration. Using Server Components for auth pages improves initial load performance. The `auth()` helper in Server Components eliminates prop drilling and provides type-safe user data.

**Expected Outcome:**

- Functional sign-in and sign-up flows with email verification
- Middleware protecting all routes under `/dashboard` and `/profile`
- UserButton in navigation showing avatar and account management
- Automatic redirects for unauthenticated users trying to access protected routes
- Type-safe access to user session in Server Components via `auth()`
- Foundation ready for role-based permissions

---

### Phase 3: Database Integration with Prisma & Supabase

**Goal of the Phase:**
Set up Prisma ORM with Supabase PostgreSQL database, define initial schema for users and orders, configure connection pooling, implement Prisma Client singleton, and create database access patterns for use in API routes and Server Components.

**Detailed Implementation Steps:**

**Step 3.1: Create Supabase Project**

- Navigate to supabase.com and sign in
- Click "New Project"
- Choose organization, enter project name, database password (save securely)
- Select region closest to primary users
- Wait for project provisioning (2-3 minutes)
- Project URL will be `https://[project-ref].supabase.co`

**Step 3.2: Obtain Database Connection Strings**

- In Supabase dashboard, navigate to Project Settings → Database
- Alternatively, go to Connect → ORMs → Prisma
- Copy "Connection Pooling" string (Transaction mode, port 6543) for DATABASE_URL
- Copy "Direct Connection" string (port 5432) for DIRECT_URL
- Note: Transaction pooling string includes `?pgbouncer=true` parameter
- These strings contain database password

**Step 3.3: Configure Database Environment Variables**

- Add to `.env.local`: `DATABASE_URL="postgresql://..."` (pooling string)
- Add to `.env.local`: `DIRECT_URL="postgresql://..."` (direct string)
- Replace password placeholder with actual password
- Add empty placeholders to `.env.example`
- Never commit actual connection strings to git

**Step 3.4: Install Prisma**

- Install: `npm install @prisma/client`
- Install dev dependency: `npm install -D prisma`
- Initialize Prisma: `npx prisma init`
- This creates `prisma/` directory with `schema.prisma` file
- Creates or updates `.env` with DATABASE_URL placeholder

**Step 3.5: Configure Prisma Schema**

- Open `prisma/schema.prisma`
- Verify generator: `provider = "prisma-client-js"`
- Update datasource block:
  - `provider = "postgresql"`
  - `url = env("DATABASE_URL")`
  - `directUrl = env("DIRECT_URL")`
- The directUrl is critical for migrations with connection pooling

**Step 3.6: Define Initial Database Schema**

- In `schema.prisma`, define User model with fields:
  - `id` (String, @id @default(cuid()))
  - `clerkUserId` (String, @unique) - links to Clerk user
  - `email` (String, @unique)
  - `name` (String, optional)
  - `createdAt` (DateTime, @default(now()))
  - `updatedAt` (DateTime, @updatedAt)
- Define Order model with fields:
  - `id` (String, @id @default(cuid()))
  - `userId` (String, foreign key to User)
  - `razorpayOrderId` (String, @unique)
  - `razorpayPaymentId` (String, optional)
  - `razorpaySignature` (String, optional)
  - `amount` (Int) - in paise for Razorpay
  - `currency` (String, @default("INR"))
  - `status` (String) - pending/completed/failed
  - `createdAt` (DateTime, @default(now()))
  - `updatedAt` (DateTime, @updatedAt)
- Add relation: `user User @relation(fields: [userId], references: [id])`
- Add reverse relation in User: `orders Order[]`

**Step 3.7: Create Initial Migration**

- Run: `npx prisma migrate dev --name init`
- This creates migration SQL file in `prisma/migrations/`
- Applies migration to database using DIRECT_URL
- Generates Prisma Client types
- Verify migration success (check for errors in output)
- Check Supabase Table Editor to confirm tables created

**Step 3.8: Create Prisma Client Singleton**

- Create `lib/prisma.ts` file
- Import PrismaClient from '@prisma/client'
- Implement singleton pattern to prevent multiple instances in development
- Use globalThis to store instance across hot reloads
- Export single prisma instance
- Pattern prevents "Too many clients" errors in development

**Step 3.9: Test Database Connection**

- Create temporary test API route: `app/api/test-db/route.ts`
- Import prisma from `@/lib/prisma`
- Create GET handler that queries database (e.g., `prisma.user.findMany()`)
- Return JSON response with results
- Start dev server and navigate to `/api/test-db`
- Verify JSON response (should be empty array initially)
- Delete test route after verification

**Step 3.10: Create Database Access Helpers**

- Create `lib/db/users.ts` for user operations
- Implement functions: `getUserByClerkId`, `createUser`, `updateUser`
- Create `lib/db/orders.ts` for order operations
- Implement functions: `createOrder`, `getOrderByRazorpayId`, `updateOrderStatus`
- These abstractions separate database logic from API routes
- Include error handling with try-catch blocks
- Add TypeScript return types using Prisma generated types

**Reasoning:**
Supabase provides managed PostgreSQL with automatic backups and scaling. Using both DATABASE_URL (pooling) and DIRECT_URL (migrations) follows Prisma best practices for serverless environments. The connection pooler prevents exhausting database connections in Next.js API routes. Prisma's type generation eliminates runtime errors from database queries. The singleton pattern is critical in Next.js development due to hot module reloading. Separate database helper functions promote clean architecture and testability.

**Expected Outcome:**

- Prisma schema defining User and Order models
- Database tables created in Supabase PostgreSQL
- Prisma Client generated with TypeScript types
- Singleton Prisma instance preventing connection issues
- Helper functions for common database operations
- Verified database connectivity from Next.js API routes
- Foundation for user profile and payment order storage

---

### Phase 4: State Management with Zustand & TanStack Query

**Goal of the Phase:**
Configure client-side UI state management with Zustand and server state management with TanStack Query v5. Set up query client provider, create example stores for UI state, integrate with API routes, and establish patterns for optimistic updates and cache invalidation.

**Detailed Implementation Steps:**

**Step 4.1: Install State Management Libraries**

- Install: `npm install zustand`
- Install: `npm install @tanstack/react-query`
- Install dev tools: `npm install @tanstack/react-query-devtools`
- Verify latest versions compatible with React 19
- Check package.json for successful installation

**Step 4.2: Configure TanStack Query Provider**

- Create `lib/providers/query-provider.tsx` as Client Component ('use client')
- Import QueryClient, QueryClientProvider from '@tanstack/react-query'
- Import ReactQueryDevtools (optional, for development)
- Create QueryClient instance with default options:
  - `defaultOptions.queries.staleTime`: 60000 (1 minute)
  - `defaultOptions.queries.refetchOnWindowFocus`: false
  - `defaultOptions.queries.retry`: 1
- Export provider component wrapping children with QueryClientProvider
- Conditionally render ReactQueryDevtools in development

**Step 4.3: Wrap Application with Query Provider**

- Open `app/layout.tsx`
- Import QueryProvider from `@/lib/providers/query-provider`
- Wrap {children} with QueryProvider inside ClerkProvider
- Order: ClerkProvider → QueryProvider → children
- QueryProvider must be Client Component, layout remains Server Component

**Step 4.4: Create Example Zustand Store (UI State)**

- Create `lib/store/ui-store.ts`
- Import create from 'zustand'
- Define interface for store state (e.g., theme, sidebarOpen, modalOpen)
- Create store with initial state and actions
- Actions: toggleSidebar, openModal, closeModal, setTheme
- Keep store simple and focused on UI state only
- Export hook: `useUIStore`

**Step 4.5: Create User API Route**

- Create `app/api/user/route.ts`
- Import auth from '@clerk/nextjs'
- Import prisma from '@/lib/prisma'
- Create GET handler:
  - Call `auth()` to get userId (Clerk)
  - If no userId, return 401 Unauthorized
  - Query `prisma.user.findUnique` by clerkUserId
  - If not found in DB, create user with Clerk data
  - Return user JSON
- Create PATCH handler for updating user profile
- Validate request body with Zod schema
- Update user in database
- Return updated user JSON

**Step 4.6: Create TanStack Query Hook for User Data**

- Create `lib/hooks/use-user.ts`
- Import useQuery from '@tanstack/react-query'
- Define `fetchUser` async function calling `/api/user`
- Create `useUser` hook using useQuery:
  - `queryKey`: ['user']
  - `queryFn`: fetchUser
  - `staleTime`: 5 minutes (user data rarely changes)
- Return query object with data, isLoading, error
- Export hook for use in Client Components

**Step 4.7: Create TanStack Mutation Hook for User Updates**

- Create `lib/hooks/use-update-user.ts`
- Import useMutation, useQueryClient from '@tanstack/react-query'
- Define `updateUser` async function with PATCH to `/api/user`
- Create `useUpdateUser` hook using useMutation:
  - `mutationFn`: updateUser
  - `onSuccess`: invalidate ['user'] query to refetch
- Use useQueryClient for cache invalidation
- Return mutation object with mutate, isLoading, error
- Export hook

**Step 4.8: Integrate Zod for API Response Validation**

- Create `lib/validations/user.ts`
- Define Zod schema for User response from API
- Export schema and infer TypeScript type
- Update `fetchUser` in use-user hook:
  - Parse API response with Zod schema
  - Add error handling for schema validation failures
  - This ensures runtime type safety for API responses

**Step 4.9: Demonstrate State Management in Example Component**

- Create `app/(protected)/profile/page.tsx` as Client Component
- Import useUser, useUpdateUser hooks
- Import useUIStore
- Display loading state while fetching user
- Show user data in form (name, email)
- Use react-hook-form for form state
- On submit, call updateUser mutation
- Show success/error feedback
- Demonstrate optimistic updates (update UI before server response)

**Step 4.10: Test State Management Flow**

- Start dev server
- Navigate to `/profile` (requires authentication)
- Verify user data loads from API
- Update user name and submit
- Verify mutation triggers
- Check query invalidation (data refetches)
- Open React Query DevTools (bottom of screen)
- Inspect query cache and mutation states
- Verify Zustand store works (add UI toggle somewhere)

**Reasoning:**
Separating UI state (Zustand) from server state (TanStack Query) follows best practices and prevents conflating concerns. TanStack Query's automatic caching and background refetching reduce unnecessary API calls. Query invalidation on mutations keeps UI synchronized with server. Optimistic updates improve perceived performance. Zod validation on API responses provides runtime type safety beyond TypeScript's compile-time checks, catching API contract violations. DevTools aid debugging during development.

**Expected Outcome:**

- TanStack Query provider wrapping application
- Zustand store for UI state (theme, modals, etc.)
- Working user API route with GET and PATCH handlers
- useUser hook fetching and caching user data
- useUpdateUser hook mutating data with cache invalidation
- Profile page demonstrating full state management flow
- React Query DevTools showing cache status
- Type-safe API responses validated with Zod
- Pattern established for all future queries and mutations

---

### Phase 5: Form Handling with React Hook Form & Zod

**Goal of the Phase:**
Establish robust form handling patterns using React Hook Form for form state and Zod for validation. Create reusable form components with shadcn/ui integration, implement client-side and server-side validation, and build example forms demonstrating various input types and validation scenarios.

**Detailed Implementation Steps:**

**Step 5.1: Install Form Libraries**

- Install: `npm install react-hook-form`
- Install: `npm install @hookform/resolvers`
- Zod already installed from previous phase
- Verify shadcn form component already added (from Phase 1)
- Check `components/ui/form.tsx` exists

**Step 5.2: Create Common Zod Validation Schemas**

- Create `lib/validations/common.ts`
- Define reusable Zod validators:
  - `emailSchema`: z.string().email()
  - `passwordSchema`: z.string().min(8).regex(patterns for complexity)
  - `phoneSchema`: z.string().regex(Indian phone pattern, optional)
  - `nameSchema`: z.string().min(2).max(50)
- Export each for composition in form schemas

**Step 5.3: Create Example Form Schema**

- Create `lib/validations/example-form.ts`
- Define comprehensive Zod schema with various field types:
  - Text input (name, description)
  - Email input (with email validation)
  - Number input (age, amount)
  - Select dropdown (country, category)
  - Checkbox (terms acceptance)
  - Date picker (optional, birth date)
- Use `.refine()` for cross-field validation (e.g., confirm password matches password)
- Export schema and infer TypeScript type

**Step 5.4: Install Additional shadcn Form Components**

- Install required components: `npx shadcn@latest add select checkbox textarea`
- These components integrate with react-hook-form via Controller
- Verify components appear in `components/ui/`

**Step 5.5: Create Example Form Page**

- Create `app/(protected)/example-form/page.tsx` as Client Component
- Import useForm, zodResolver from react-hook-form
- Import form schema and type
- Initialize form with useForm hook:
  - `resolver: zodResolver(exampleFormSchema)`
  - `defaultValues`: provide sensible defaults
- Form state automatically managed by useForm

**Step 5.6: Build Form UI with shadcn Components**

- Import Form, FormField, FormItem, FormLabel, FormControl, FormMessage from `@/components/ui/form`
- Import Input, Select, Checkbox, Button from respective components
- Wrap form in <Form> component passing form object
- For each field, create FormField with:
  - `control`: form.control
  - `name`: field name (type-safe from schema)
  - `render`: render prop receiving field props
- Spread `{...field}` onto input component
- FormMessage automatically shows Zod validation errors
- Add submit button with loading state

**Step 5.7: Create Form Submission API Route**

- Create `app/api/example-form/route.ts`
- Import auth from Clerk
- Import Zod schema for validation
- Create POST handler:
  - Authenticate user with auth()
  - Parse request body JSON
  - Validate with Zod schema using `.safeParse()`
  - If validation fails, return 400 with Zod errors
  - If validation succeeds, process form data
  - For demo, save to database or log
  - Return success response with submitted data

**Step 5.8: Integrate Form with TanStack Mutation**

- In example-form page, create mutation hook inline or separate file
- Import useMutation from '@tanstack/react-query'
- Define mutation function posting to `/api/example-form`
- Configure mutation:
  - `onSuccess`: show success toast, reset form
  - `onError`: show error toast
- Call mutation in form's onSubmit handler
- Pass validated form data to mutation
- Show loading state in submit button during mutation

**Step 5.9: Add Client-Side Field Validation**

- Configure form field validation modes:
  - `mode: 'onBlur'` or `mode: 'onChange'` in useForm
  - onBlur reduces re-renders, onChange provides immediate feedback
- Test validation by submitting invalid data
- Verify error messages appear under fields
- Check that form submission is blocked until valid
- Test cross-field validation (confirm password scenario)

**Step 5.10: Add Success and Error Feedback**

- Install shadcn toast component: `npx shadcn@latest add toast`
- Create `lib/hooks/use-toast.ts` (already created by shadcn)
- Import useToast in example-form page
- On mutation success, call toast({ title: "Success", description: "..." })
- On mutation error, call toast({ title: "Error", description: error.message, variant: "destructive" })
- Add Toaster component to root layout

**Reasoning:**
React Hook Form minimizes re-renders through uncontrolled inputs and isolated field subscriptions. Zod provides declarative, type-safe validation with excellent error messages. Using Zod on both client and server prevents malicious requests bypassing client validation. shadcn/ui form components provide accessible, styled inputs with proper error associations. FormMessage automatically displays Zod errors without manual mapping. The Controller component bridges uncontrolled react-hook-form with controlled component libraries. Separating validation schemas promotes reusability across forms.

**Expected Outcome:**

- Example form page with multiple input types (text, email, number, select, checkbox)
- Client-side validation with immediate error feedback
- Server-side validation in API route preventing invalid submissions
- Type-safe form data throughout submission flow
- Success and error feedback with toast notifications
- Form reset on successful submission
- Reusable Zod validation schemas
- Pattern established for all future forms
- Accessible form with proper labels and error associations

---

### Phase 6: Payment Integration with Razorpay

**Goal of the Phase:**
Implement end-to-end payment processing with Razorpay including order creation, payment capture via Razorpay checkout, webhook verification, and database updates. Ensure secure handling of payment data and proper error states throughout the payment flow.

**Detailed Implementation Steps:**

**Step 6.1: Obtain Razorpay API Keys**

- Sign up or log in to razorpay.com
- Navigate to Settings → API Keys
- Generate Test Mode keys (for development)
- Copy Key ID and Key Secret
- Note: Test mode allows testing without real money
- Generate Webhook Secret from Settings → Webhooks

**Step 6.2: Configure Razorpay Environment Variables**

- Add to `.env.local`: `RAZORPAY_KEY_ID="rzp_test_..."`
- Add to `.env.local`: `RAZORPAY_KEY_SECRET="..."`
- Add to `.env.local`: `RAZORPAY_WEBHOOK_SECRET="..."`
- Add empty placeholders to `.env.example`
- Key ID is public (NEXT*PUBLIC* optional), Secret must remain server-only

**Step 6.3: Install Razorpay SDK**

- Install: `npm install razorpay`
- This is the official Node.js SDK for server-side operations
- Client-side uses Razorpay checkout script (loaded via CDN)

**Step 6.4: Create Razorpay Instance**

- Create `lib/razorpay.ts`
- Import Razorpay from 'razorpay'
- Create instance with key_id and key_secret from environment
- Export instance for use in API routes
- Add type safety with TypeScript

**Step 6.5: Create Payment Order Creation API Route**

- Create `app/api/payment/create-order/route.ts`
- Import auth from Clerk, razorpay instance, prisma
- Create POST handler:
  - Authenticate user with auth()
  - Parse request body (amount in rupees)
  - Convert amount to paise (Razorpay uses smallest currency unit)
  - Create Razorpay order using SDK: `razorpay.orders.create({ amount, currency: 'INR', receipt: unique_id })`
  - Save order to database with userId, razorpayOrderId, amount, status: 'pending'
  - Return order details (id, amount, currency) to client
- Add error handling for Razorpay API failures

**Step 6.6: Create Payment Component**

- Create `components/payment-button.tsx` as Client Component
- Import useScript hook or create custom hook to load Razorpay checkout script
- Load script from: `https://checkout.razorpay.com/v1/checkout.js`
- Create function to initialize Razorpay checkout:
  - Options: key (Key ID), amount, currency, order_id, name, description, handler (success callback)
  - On success, send payment details to verification endpoint
  - On failure, show error message
- Create button triggering payment flow:
  - On click, call create-order API
  - Receive order details
  - Initialize Razorpay checkout with order_id
  - Open Razorpay modal

**Step 6.7: Create Payment Verification API Route**

- Create `app/api/payment/verify/route.ts`
- Import crypto (Node.js built-in)
- Import prisma, auth
- Create POST handler:
  - Authenticate user
  - Parse request body (razorpay_order_id, razorpay_payment_id, razorpay_signature)
  - Verify signature using HMAC SHA256:
    - Create HMAC with key_secret
    - Update with order_id + "|" + payment_id
    - Digest as hex
    - Compare with received signature
  - If signature valid:
    - Update order in database: status 'completed', add payment_id and signature
    - Return success response
  - If invalid, return 400 error
- This prevents fake payment confirmations

**Step 6.8: Create Webhook Handler API Route**

- Create `app/api/payment/webhook/route.ts`
- Import crypto, prisma
- Create POST handler (no auth check - external webhook)
- Parse webhook signature from headers: `x-razorpay-signature`
- Verify webhook signature:
  - Create HMAC with webhook_secret
  - Update with raw request body (important: must be raw, not parsed)
  - Compare with received signature
- If valid, parse event body
- Handle event types:
  - `payment.captured`: update order status to 'completed'
  - `payment.failed`: update order status to 'failed'
- Return 200 OK to acknowledge receipt
- Log webhook events for debugging

**Step 6.9: Configure Webhook in Razorpay Dashboard**

- In Razorpay dashboard, go to Settings → Webhooks
- Create webhook with URL: `https://your-domain.com/api/payment/webhook`
- For local development, use ngrok or Razorpay's test webhooks
- Select events: payment.captured, payment.failed
- Copy Webhook Secret (already added to env in Step 6.2)
- Save webhook configuration

**Step 6.10: Test Payment Flow**

- Create test payment page at `app/(protected)/test-payment/page.tsx`
- Add PaymentButton component
- Start dev server
- Navigate to test payment page
- Click payment button
- Verify order creation API call succeeds
- Verify Razorpay checkout modal opens
- Use Razorpay test card: 4111 1111 1111 1111, any future CVV/expiry
- Complete payment
- Verify success callback fires
- Check verification API succeeds
- Verify order status updated in database
- Test webhook locally with ngrok or Razorpay webhook tester

**Reasoning:**
Razorpay is the leading payment gateway in India with comprehensive documentation. Creating orders server-side prevents amount manipulation. Signature verification using HMAC ensures payment authenticity and prevents replay attacks. Webhooks provide reliable payment notifications even if user closes browser before callback. Storing orders before payment allows tracking incomplete transactions. Using smallest currency unit (paise) prevents floating-point errors. Test mode enables full development without financial risk.

**Expected Outcome:**

- Working payment flow from order creation to verification
- Razorpay checkout modal opening on button click
- Successful test payments updating order status in database
- Signature verification preventing fraudulent payment confirmations
- Webhook handler processing Razorpay events
- Error handling for payment failures
- Orders table in database tracking all payment attempts
- Test payment page demonstrating full integration
- Secure key management with server-only secrets
- Foundation for production payment processing

---

### Phase 7: Testing Infrastructure with Vitest

**Goal of the Phase:**
Set up Vitest testing framework with React Testing Library for unit and integration tests. Configure test environment, create example tests for utilities, components, and API routes, and establish patterns for writing maintainable tests.

**Detailed Implementation Steps:**

**Step 7.1: Install Vitest and Testing Libraries**

- Install: `npm install -D vitest @vitejs/plugin-react`
- Install: `npm install -D @testing-library/react @testing-library/dom @testing-library/user-event`
- Install: `npm install -D jsdom`
- Install: `npm install -D @testing-library/jest-dom`
- jsdom provides browser-like environment for tests

**Step 7.2: Create Vitest Configuration**

- Create `vitest.config.ts` at project root
- Import defineConfig from 'vitest/config'
- Import react from '@vitejs/plugin-react'
- Configure:
  - `plugins: [react()]` for React JSX support
  - `test.environment: 'jsdom'` for DOM simulation
  - `test.setupFiles: ['./vitest.setup.ts']` for global setup
  - `test.globals: true` for global test functions (describe, it, expect)
  - `test.coverage.provider: 'v8'` for coverage reports
- Add path alias resolution matching tsconfig: `resolve.alias: { '@': '/src' }` (adjust path as needed)

**Step 7.3: Create Vitest Setup File**

- Create `vitest.setup.ts` at project root
- Import '@testing-library/jest-dom'
- This adds custom matchers like `toBeInTheDocument`
- Mock environment variables if needed for tests
- Mock Next.js router if needed
- Setup runs before each test file

**Step 7.4: Add Test Scripts to Package.json**

- Add `"test": "vitest"` for watch mode
- Add `"test:run": "vitest run"` for CI (single run)
- Add `"test:coverage": "vitest run --coverage"` for coverage report
- Add `"test:ui": "vitest --ui"` for visual test UI (optional, requires @vitest/ui)

**Step 7.5: Create Utility Function Tests**

- Create `__tests__/lib/utils.test.ts`
- Import cn function from `@/lib/utils`
- Write tests for cn utility (class name merging)
- Test cases: merging classes, conditional classes, tailwind class conflicts
- Use describe and it blocks for organization
- Use expect assertions with matchers
- Example: `expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')`

**Step 7.6: Create Zod Schema Tests**

- Create `__tests__/lib/validations/example-form.test.ts`
- Import form schema from validations
- Test valid data passes validation: `schema.safeParse(validData).success === true`
- Test invalid data fails validation with expected errors
- Test edge cases: empty strings, invalid email formats, boundary values
- Test cross-field validation rules
- This ensures validation logic is correct before UI integration

**Step 7.7: Create Component Tests**

- Create `__tests__/components/navbar.test.tsx`
- Import render, screen from '@testing-library/react'
- Mock Clerk hooks (useAuth, useUser) to simulate authenticated/unauthenticated states
- Test navbar renders for signed-in user (shows UserButton)
- Test navbar renders for signed-out user (shows sign-in link)
- Use screen.getByRole, screen.getByText for queries
- Use userEvent for interaction testing
- Note: Client Components can be tested, async Server Components require E2E tests

**Step 7.8: Create API Route Tests (Optional)**

- API route testing is challenging with App Router
- Consider integration tests hitting actual endpoints with test server
- Alternative: unit test database helper functions directly
- Create `__tests__/lib/db/users.test.ts`
- Mock Prisma Client using jest.mock or vi.mock
- Test getUserByClerkId returns user
- Test createUser creates new user
- Verify function behavior isolated from actual database

**Step 7.9: Create Test Factories**

- Create `__tests__/factories/user.ts`
- Define factory functions creating test data:
  - `createMockUser()`: returns valid User object
  - `createMockOrder()`: returns valid Order object
- Use in multiple test files to reduce duplication
- Allows changing test data structure in one place

**Step 7.10: Run Tests and Verify Coverage**

- Run: `npm test` (starts watch mode)
- Verify all tests pass
- Run: `npm run test:coverage`
- Check coverage report in terminal and `coverage/` directory
- Aim for >80% coverage on utility functions and helpers
- Components may have lower coverage (visual testing needed)
- Add test files to `.gitignore` exceptions (tests should be committed)

**Reasoning:**
Vitest offers superior performance and DX compared to Jest for modern projects. Its native ES module support and compatibility with Vite make it ideal for Next.js projects. React Testing Library promotes testing behavior over implementation details. Testing utilities and validation logic provides high ROI with simple tests. Testing components with Clerk requires mocking, demonstrating realistic testing scenarios. Test factories reduce duplication and improve maintainability. Coverage reports identify untested code paths.

**Expected Outcome:**

- Vitest configured with jsdom environment
- React Testing Library integrated for component tests
- Passing test suite for utility functions (cn helper)
- Passing tests for Zod validation schemas
- Component tests demonstrating mocking patterns
- Test factories for generating mock data
- Test scripts in package.json (test, test:run, test:coverage)
- Coverage report showing tested code
- Foundation for adding tests throughout development
- CI-ready test configuration

---

### Phase 8: Vercel Deployment Configuration

**Goal of the Phase:**
Prepare application for production deployment on Vercel with proper environment variable management, build optimization, security headers, and deployment settings. Create deployment documentation and verify successful production builds.

**Detailed Implementation Steps:**

**Step 8.1: Verify Production Build Locally**

- Run: `npm run build`
- This creates optimized production build in `.next/` directory
- Verify build completes without errors
- Check for warnings about unused dependencies or large bundles
- Address any build-time errors (TypeScript, ESLint)
- Test production build locally: `npm start`
- Navigate through app verifying all features work

**Step 8.2: Optimize Next.js Configuration for Production**

- Update `next.config.ts` with production settings:
  - Ensure `reactStrictMode: true` (catches bugs)
  - Add `images.remotePatterns` for Clerk avatars (replaces deprecated domains)
  - Configure `swcMinify: true` (default in Next.js 15)
  - Add `compress: true` for gzip compression
  - Consider `output: 'standalone'` for Docker deployments (optional)
- Add security headers in headers() config:
  - X-Frame-Options: DENY (prevent clickjacking)
  - X-Content-Type-Options: nosniff
  - Referrer-Policy: origin-when-cross-origin

**Step 8.3: Create Environment Variable Documentation**

- Update `.env.example` with comprehensive documentation
- For each variable, add comment explaining:
  - Purpose of the variable
  - Where to obtain the value (Clerk dashboard, Supabase settings, etc.)
  - Whether it's required for production vs development
  - Example format (without real values)
- Group variables by service (Next.js, Clerk, Database, Razorpay)

**Step 8.4: Create Production Environment Checklist**

- Create `DEPLOYMENT.md` in project root
- Document prerequisites:
  - Vercel account
  - GitHub repository
  - All third-party accounts (Clerk, Supabase, Razorpay)
- List all environment variables needed in Vercel
- Document webhook URL configuration (Razorpay needs production URL)
- Include post-deployment verification steps

**Step 8.5: Set Up Vercel Project**

- Go to vercel.com and sign in
- Click "Add New Project"
- Import GitHub repository
- Vercel auto-detects Next.js framework
- Configure project:
  - Root Directory: ./ (default)
  - Build Command: npm run build (or leave default)
  - Output Directory: .next (default)
  - Install Command: npm install (or leave default)

**Step 8.6: Configure Environment Variables in Vercel**

- In Vercel project settings, go to Environment Variables
- Add each variable from `.env.local`:
  - Select environment scope: Production, Preview, Development
  - For secrets (CLERK_SECRET_KEY, RAZORPAY_KEY_SECRET), use Production only initially
  - For public keys (NEXT*PUBLIC*\*), add to all environments
- Verify all required variables are added
- Save changes (triggers redeploy if already deployed)

**Step 8.7: Update URLs for Production**

- In Clerk dashboard:
  - Add production domain to Allowed Origins
  - Update redirect URLs to production domain
- In Razorpay dashboard:
  - Update webhook URL to `https://yourdomain.com/api/payment/webhook`
  - Switch to Live mode keys for production payments (when ready)
- In Supabase:
  - Add production domain to Allowed Redirect URLs (if using Supabase Auth, not applicable here)

**Step 8.8: Deploy to Vercel**

- Push code to GitHub main branch
- Vercel automatically triggers deployment
- Monitor deployment logs in Vercel dashboard
- Check for build errors (incorrect env vars often cause issues)
- Wait for deployment to complete (~2-5 minutes)
- Vercel provides preview URL: `your-app.vercel.app`

**Step 8.9: Verify Production Deployment**

- Navigate to production URL
- Test authentication flow:
  - Sign up with new account
  - Verify email (if email verification enabled)
  - Sign in and access dashboard
- Test database operations:
  - Update user profile
  - Verify data persists
- Test payment flow:
  - Create test order
  - Complete payment with test card
  - Verify webhook received and order updated
- Check all pages load without errors
- Monitor Vercel logs for runtime errors

**Step 8.10: Configure Custom Domain (Optional)**

- In Vercel project settings, go to Domains
- Add custom domain (requires domain ownership)
- Configure DNS records as instructed by Vercel
- Vercel automatically provisions SSL certificate
- Update all webhook URLs and redirect URLs to custom domain
- Verify HTTPS works and redirects from www subdomain

**Reasoning:**
Vercel is the native hosting platform for Next.js with automatic optimizations and zero-config deployments. Building locally before deploying catches errors early. Security headers protect against common attacks (XSS, clickjacking). Environment variable scoping prevents leaking production secrets to preview deployments. Webhook URL updates are critical - development webhooks point to localhost/ngrok, production must point to actual domain. Testing authentication, database, and payments in production catches environment-specific issues. Custom domains improve branding and SEO.

**Expected Outcome:**

- Successful production build locally
- Next.js configuration optimized for production with security headers
- Comprehensive environment variable documentation
- Vercel project created and connected to GitHub
- All environment variables configured in Vercel for appropriate scopes
- Production deployment live and accessible
- Authentication flow working in production
- Database operations persisting data
- Payment integration functional with updated webhook URL
- Deployment documentation for future reference
- Automatic deployments on git push
- Production-ready application serving real users

---

## Integration Details

### Backend Integration

All backend logic resides in Next.js API route handlers (`app/api/*`) with no separate backend server. Route handlers execute server-side only and can safely use secrets. Server Actions provide alternative for mutations directly from components but webhooks (Razorpay) require traditional route handlers. Clerk's `auth()` helper in route handlers provides user session. Prisma Client connects to Supabase PostgreSQL using connection pooling (DATABASE_URL) for queries and direct connection (DIRECT_URL) for migrations.

### Frontend Integration

Next.js App Router uses Server Components by default, reducing JavaScript sent to client. Client Components (marked with 'use client') needed for interactivity, hooks, and browser APIs. ClerkProvider wraps entire app providing authentication context. QueryClientProvider wraps app enabling TanStack Query in Client Components. Server Components can fetch data directly (no client-side fetch) and pass as props to Client Components. Forms use Client Components (react-hook-form requires hooks) but submit to Server Actions or API routes.

### Database Integration

Prisma Client singleton in `lib/prisma.ts` prevents connection exhaustion. All database operations go through Prisma (type-safe queries). User records created on first sign-in (Clerk webhook or lazy creation on first API call). Order records created before Razorpay payment initiation. Webhook handler updates order status after payment. Migrations run manually with `npx prisma migrate dev` (development) or automatically in CI pipeline. Supabase handles connection pooling, backups, and scaling.

### Authentication Integration

Clerk middleware (`middleware.ts`) intercepts all requests and checks authentication. Protected routes defined via route matchers. Sign-in/sign-up pages use Clerk components handling full flow. `auth()` helper in Server Components and route handlers provides userId. UserButton component in navbar displays avatar and account menu. Clerk handles session management, JWTs, and security. Database stores user profile extending Clerk data. clerkUserId field links Prisma User to Clerk user.

### Payment Integration

Payment flow: Client → Create Order API → Razorpay SDK → Client receives order_id → Razorpay checkout modal → Payment completion → Razorpay webhook → Server verification → Database update. Client-side never handles sensitive payment details (Razorpay iframe handles card data). Server-side signature verification prevents payment fraud. Orders stored in database before payment for idempotency. Webhook provides reliable payment confirmation even if user closes browser.

### State Management Integration

Zustand stores handle client-side UI state (theme, modals, sidebar) with localStorage persistence. TanStack Query handles server state (user data, orders) with automatic caching and background refetching. Query invalidation on mutations keeps cache fresh. React Hook Form manages form state (inputs, validation, submission). Zod validates on both client (immediate feedback) and server (security). No prop drilling needed - hooks access stores and queries anywhere in component tree.

### Data Flow Example (User Profile Update)

1. User navigates to `/profile` (Server Component checks auth, renders Client Component)
2. Client Component calls `useUser()` hook (TanStack Query)
3. Query checks cache, if stale, fetches from `/api/user` route
4. Route handler calls `auth()`, queries Prisma, returns user JSON
5. User edits form (react-hook-form tracks changes)
6. User submits (Zod validates client-side)
7. Form calls `useUpdateUser()` mutation hook
8. Mutation POSTs to `/api/user` (Zod validates server-side)
9. Route handler updates Prisma, returns updated user
10. Mutation invalidates ['user'] query key
11. TanStack Query refetches, UI updates automatically

## Environment Variables

### Next.js Configuration

- **NEXT_PUBLIC_APP_URL** (optional): Full URL of deployed app for sitemap/canonical URLs

### Clerk Authentication

- **NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY** (required): Publishable key from Clerk dashboard → API Keys. Safe to expose client-side. Used for Clerk components.
- **CLERK_SECRET_KEY** (required): Secret key from Clerk dashboard → API Keys. Server-only. Used for auth() verification.
- **NEXT_PUBLIC_CLERK_SIGN_IN_URL** (required): `/sign-in` - Path to sign-in page.
- **NEXT_PUBLIC_CLERK_SIGN_UP_URL** (required): `/sign-up` - Path to sign-up page.
- **NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL** (required): `/dashboard` - Redirect after sign-in.
- **NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL** (required): `/dashboard` - Redirect after sign-up.

### Database (Supabase + Prisma)

- **DATABASE_URL** (required): Connection string from Supabase → Settings → Database → Connection Pooling (Transaction mode, port 6543). Used by Prisma Client for queries. Format: `postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true`
- **DIRECT_URL** (required): Direct connection string from Supabase (port 5432). Used for Prisma migrations. Format: `postgresql://postgres.[project-ref]:[password]@db.[project-ref].supabase.co:5432/postgres`

### Razorpay Payments

- **RAZORPAY_KEY_ID** (required): Key ID from Razorpay dashboard → Settings → API Keys. Can be public (used in checkout). Test mode: `rzp_test_...`, Live mode: `rzp_live_...`
- **RAZORPAY_KEY_SECRET** (required): Key Secret from Razorpay dashboard. Server-only. Used for order creation and verification.
- **RAZORPAY_WEBHOOK_SECRET** (required): Webhook secret from Razorpay dashboard → Settings → Webhooks. Used for webhook signature verification.

### Local Development Only

Create `.env.local` file at project root with all above variables filled. This file is gitignored and never committed. For team onboarding, share values securely (1Password, etc.) or use team-specific test accounts.

### Vercel Production

Add all variables in Vercel project → Settings → Environment Variables. Set appropriate scopes:

- Production: Live Clerk/Razorpay keys, production database
- Preview: Test/staging keys and database
- Development: Same as local .env.local for `vercel dev` command

### Missing Variable Errors

Next.js throws errors on build if environment variables are missing. To validate env vars at runtime, create `lib/env.ts` with Zod schema validating process.env, import in next.config.ts. This catches missing vars early.

## Testing After Implementation

### Manual Testing Checklist

**Authentication Flow:**

1. Navigate to `/sign-up`, create account with email
2. Check email for verification link, complete verification
3. Verify redirect to dashboard
4. Check UserButton appears in navbar
5. Access `/profile`, verify user data loads
6. Sign out via UserButton
7. Attempt accessing `/dashboard` while signed out
8. Verify redirect to `/sign-in`
9. Sign in with credentials, verify dashboard access restored

**Database Operations:**

1. Sign in and navigate to `/profile`
2. Update name field and submit
3. Verify success message appears
4. Refresh page, verify name persists
5. Check Supabase Table Editor, verify user record exists
6. Check updatedAt timestamp changed

**Form Validation:**

1. Navigate to `/example-form`
2. Submit empty form, verify validation errors appear
3. Fill email field with invalid email, verify error
4. Fill all fields with valid data, submit
5. Verify success message
6. Check form reset after submission

**Payment Flow:**

1. Navigate to test payment page
2. Click "Pay Now" button
3. Verify Razorpay modal opens
4. Enter test card: 4111 1111 1111 1111, CVV: 123, expiry: any future date
5. Complete payment
6. Verify success message
7. Check database, verify order status changed to 'completed'
8. Verify razorpayPaymentId populated
9. Check Razorpay dashboard, verify payment recorded

**Webhook Testing:**

1. Use ngrok or Razorpay webhook tester for local development
2. Trigger webhook from Razorpay dashboard (test webhook feature)
3. Monitor API logs for webhook receipt
4. Verify signature validation succeeds
5. Check database, verify order updated
6. Test invalid signature (modify secret), verify rejection

### Automated Testing

**Unit Tests (Vitest):**

- Run: `npm run test:run`
- All utility function tests must pass
- All Zod validation schema tests must pass
- All database helper function tests must pass (with mocks)
- Component tests must pass (with Clerk mocks)
- Aim for >80% coverage on utilities and helpers

**Integration Tests:**

- Test API routes with supertest or similar (optional setup)
- Test database operations with test database (not mocked)
- Seed test data, run queries, verify results
- Clean up test data after tests

**End-to-End Tests (Optional - Playwright):**

- Install Playwright: `npm install -D @playwright/test`
- Write E2E tests for critical paths:
  - Sign-up → email verification → dashboard access
  - Sign-in → profile update → verification
  - Payment flow from start to finish
- Run: `npx playwright test`
- E2E tests catch issues missed by unit tests

### Performance Testing

- Run Lighthouse audit on production deployment
- Target scores: Performance >90, Accessibility >95, Best Practices >90, SEO >90
- Check First Contentful Paint (FCP) <1.8s
- Check Largest Contentful Paint (LCP) <2.5s
- Check Cumulative Layout Shift (CLS) <0.1
- Optimize images, use next/image for automatic optimization
- Review bundle size with `npm run build`, address large dependencies

### Security Testing

- Verify all API routes check authentication (`auth()` called)
- Test accessing protected routes without token (should fail)
- Verify webhook signature validation (invalid signatures rejected)
- Check environment variables not exposed to client (except NEXT*PUBLIC*\*)
- Scan dependencies for vulnerabilities: `npm audit`
- Address high/critical vulnerabilities
- Enable Vercel security headers (already configured in next.config.ts)

### Browser Compatibility Testing

- Test on Chrome, Firefox, Safari, Edge (latest versions)
- Test on mobile devices (iOS Safari, Chrome Android)
- Verify responsive design at 320px, 768px, 1024px, 1920px widths
- Check shadcn/ui components render correctly across browsers
- Test form submission on mobile (keyboard issues, autofill)

## Progress Tracker

Use this checklist to track implementation progress. Check off each item as completed.

### Phase 1: Project Initialization

- [ ] Initialize Next.js 15 project with TypeScript and Tailwind
- [ ] Install and configure shadcn/ui
- [ ] Install initial UI components (button, input, label, card, form)
- [ ] Configure TypeScript with strict mode
- [ ] Set up ESLint with Next.js and TypeScript rules
- [ ] Set up Prettier with Tailwind plugin
- [ ] Configure Husky and lint-staged
- [ ] Add package.json scripts (lint, format, test)
- [ ] Create .env.example template
- [ ] Configure next.config.ts with security headers

### Phase 2: Authentication with Clerk

- [ ] Install @clerk/nextjs package
- [ ] Obtain Clerk API keys and add to environment variables
- [ ] Create authentication middleware with route protection
- [ ] Wrap application with ClerkProvider in root layout
- [ ] Create sign-in page with Clerk SignIn component
- [ ] Create sign-up page with Clerk SignUp component
- [ ] Create protected dashboard page
- [ ] Add navbar with UserButton component
- [ ] Test sign-up flow with email verification
- [ ] Test sign-in flow and route protection

### Phase 3: Database with Prisma & Supabase

- [ ] Create Supabase project and obtain connection strings
- [ ] Add database environment variables
- [ ] Install Prisma and Prisma Client
- [ ] Initialize Prisma and configure schema
- [ ] Define User and Order models in schema
- [ ] Run initial migration to create tables
- [ ] Create Prisma Client singleton
- [ ] Test database connection with temporary API route
- [ ] Create database helper functions for users
- [ ] Create database helper functions for orders

### Phase 4: State Management

- [ ] Install Zustand and TanStack Query
- [ ] Create and configure TanStack Query provider
- [ ] Wrap application with QueryProvider
- [ ] Create example Zustand store for UI state
- [ ] Create user API route (GET and PATCH)
- [ ] Create useUser hook with TanStack Query
- [ ] Create useUpdateUser mutation hook
- [ ] Integrate Zod validation for API responses
- [ ] Create profile page demonstrating state management
- [ ] Test query caching and mutation invalidation

### Phase 5: Forms with React Hook Form & Zod

- [ ] Install react-hook-form and resolvers
- [ ] Create common Zod validation schemas
- [ ] Create example form validation schema
- [ ] Install additional shadcn form components
- [ ] Create example form page with multiple input types
- [ ] Build form UI with shadcn components
- [ ] Create form submission API route
- [ ] Integrate form with TanStack mutation
- [ ] Test client-side validation
- [ ] Add toast notifications for feedback

### Phase 6: Payment with Razorpay

- [ ] Obtain Razorpay API keys (test mode)
- [ ] Add Razorpay environment variables
- [ ] Install Razorpay SDK
- [ ] Create Razorpay instance in lib
- [ ] Create payment order creation API route
- [ ] Create payment button component with checkout
- [ ] Create payment verification API route
- [ ] Create webhook handler API route
- [ ] Configure webhook URL in Razorpay dashboard
- [ ] Test complete payment flow end-to-end

### Phase 7: Testing with Vitest

- [ ] Install Vitest and React Testing Library
- [ ] Create Vitest configuration
- [ ] Create Vitest setup file
- [ ] Add test scripts to package.json
- [ ] Write tests for utility functions
- [ ] Write tests for Zod validation schemas
- [ ] Write tests for React components
- [ ] Create test factories for mock data
- [ ] Run test suite and verify all pass
- [ ] Generate and review coverage report

### Phase 8: Vercel Deployment

- [ ] Verify production build succeeds locally
- [ ] Optimize Next.js configuration for production
- [ ] Update .env.example with comprehensive documentation
- [ ] Create DEPLOYMENT.md with deployment instructions
- [ ] Set up Vercel project from GitHub
- [ ] Configure all environment variables in Vercel
- [ ] Update webhook URLs to production domain
- [ ] Deploy to Vercel and monitor build logs
- [ ] Verify production authentication flow
- [ ] Test database, forms, and payments in production

### Documentation & Polish

- [ ] Create comprehensive README.md with setup instructions
- [ ] Document all environment variables
- [ ] Add code comments for complex logic
- [ ] Create example .env.local file (gitignored)
- [ ] Add screenshots to README (optional)
- [ ] Document API endpoints and data models
- [ ] Add troubleshooting section to docs
- [ ] Create contributing guidelines (if open source)

## Risks & Considerations

### Security Risks

**Authentication & Authorization:**

- **Risk:** Middleware bypass vulnerability (CVE-2025-29927) in Next.js <15.2.3 allows unauthorized access.
- **Mitigation:** Enforce Next.js 15.2.3+ minimum version. Verify middleware protection with automated tests.
- **Risk:** Exposing CLERK_SECRET_KEY or RAZORPAY_KEY_SECRET client-side compromises security.
- **Mitigation:** Use NEXT*PUBLIC* prefix only for truly public keys. Audit environment variable usage. Never log secrets.

**Payment Security:**

- **Risk:** Missing webhook signature verification allows fake payment confirmations.
- **Mitigation:** Always verify Razorpay signatures using HMAC SHA256. Never trust client-side payment status.
- **Risk:** Replay attacks reusing valid payment webhooks to credit multiple times.
- **Mitigation:** Check order status before updating (idempotency). Log webhook IDs to detect duplicates.

**Database Security:**

- **Risk:** SQL injection through unsanitized inputs (mitigated by Prisma's parameterized queries).
- **Mitigation:** Always use Prisma methods, never raw SQL with user input. Validate all input with Zod.
- **Risk:** Exposing DATABASE_URL in client-side code exposes database credentials.
- **Mitigation:** Keep connection strings server-only. Use Supabase Row Level Security (RLS) as additional layer (requires setup).

### Performance Considerations

**Database Connection Pooling:**

- **Risk:** Connection exhaustion in serverless environment causes API failures.
- **Mitigation:** Use Prisma singleton pattern. Configure Supabase connection pooling (already done with DATABASE_URL). Monitor active connections in Supabase dashboard.

**Large Bundle Size:**

- **Risk:** Installing too many dependencies increases initial page load time.
- **Mitigation:** Use dynamic imports for heavy components. Analyze bundle with `npm run build`. Remove unused dependencies. Use next/dynamic for code splitting.

**API Route Cold Starts:**

- **Risk:** First request to serverless function has high latency.
- **Mitigation:** Use Vercel Edge Functions for critical paths (requires refactoring). Keep warm with health check pings (Vercel Pro). Accept cold starts for infrequent routes.

**Image Optimization:**

- **Risk:** Unoptimized images slow page loads.
- **Mitigation:** Use next/image for automatic optimization, lazy loading, and responsive images. Configure Vercel image optimization (included in all plans).

### Compatibility Considerations

**React 19 and Library Compatibility:**

- **Risk:** Some libraries may not support React 19 yet.
- **Mitigation:** Check library documentation for React 19 support. Use peerDependencies warnings as guide. Test thoroughly. Downgrade React if critical library incompatible.

**Tailwind v4 Adoption:**

- **Risk:** Tailwind v4 is relatively new; some plugins may not be updated.
- **Mitigation:** Check plugin compatibility before installation. Use v3.shadcn.com docs if needing v3. For new projects, v4 is recommended (already adopted by shadcn).

**Browser Support:**

- **Risk:** ES2020+ features may not work in older browsers.
- **Mitigation:** Define browserslist in package.json targeting modern browsers. Next.js handles transpilation. Test on minimum supported browser versions.

### Operational Risks

**Environment Variable Misconfiguration:**

- **Risk:** Missing or incorrect env vars cause runtime failures in production.
- **Mitigation:** Create detailed .env.example. Use Zod validation for env vars in lib/env.ts. Test production build locally with production-like env vars.

**Database Migration Failures:**

- **Risk:** Schema changes break production database.
- **Mitigation:** Test migrations on staging database first. Use Prisma shadow database for migration safety checks. Backup database before migrations. Use `prisma migrate deploy` in production (not migrate dev).

**Third-Party Service Downtime:**

- **Risk:** Clerk, Supabase, or Razorpay outages break application.
- **Mitigation:** Implement graceful degradation (show maintenance message). Monitor service status pages. Cache critical data client-side where possible. Have contact information for support.

**Webhook Delivery Failures:**

- **Risk:** Razorpay webhook fails to deliver, order status not updated.
- **Mitigation:** Implement webhook retry logic. Log all webhook attempts. Create admin interface to manually reconcile orders. Use Razorpay's payment verification API as fallback.

### Maintenance Considerations

**Dependency Updates:**

- **Risk:** Outdated dependencies introduce security vulnerabilities.
- **Mitigation:** Use `npm audit` regularly. Enable Dependabot in GitHub. Update dependencies monthly. Test thoroughly after major version updates.

**Database Schema Evolution:**

- **Risk:** Schema changes require careful migration planning.
- **Mitigation:** Never delete columns immediately (mark deprecated first). Add columns as nullable initially. Backfill data before making required. Test migrations on production database copy.

**Clerk Pricing Scaling:**

- **Risk:** Free tier limits (10k MAU) reached; unexpected costs.
- **Mitigation:** Monitor Clerk usage in dashboard. Budget for growth. Consider self-hosted auth alternative if scaling beyond Clerk pricing comfort.

**Supabase Pricing Scaling:**

- **Risk:** Free tier limits (500MB database, 2GB bandwidth) exceeded.
- **Mitigation:** Monitor database size and bandwidth in dashboard. Implement data retention policies. Upgrade to Pro plan when needed. Consider database optimization (indexes, archival).

**Technical Debt:**

- **Risk:** Rapid development leads to shortcuts and unmaintainable code.
- **Mitigation:** Enforce code reviews. Maintain test coverage above 80%. Refactor regularly. Document architectural decisions. Use ESLint and TypeScript strict mode to catch issues early.

### Scalability Considerations

**Database Query Performance:**

- **Risk:** N+1 queries cause performance degradation at scale.
- **Mitigation:** Use Prisma `include` and `select` to optimize queries. Add database indexes on foreign keys and frequently queried columns. Monitor slow queries in Supabase.

**Vercel Function Limits:**

- **Risk:** Hobby plan has 10-second function timeout; Pro has 60 seconds.
- **Mitigation:** Optimize slow API routes. Use background jobs (Vercel Cron, Inngest) for long-running tasks. Monitor function execution time in Vercel analytics.

**File Upload Handling:**

- **Risk:** Current boilerplate doesn't include file uploads; adding later requires storage solution.
- **Mitigation:** Plan for Supabase Storage, Vercel Blob, or Uploadthing. Design schema with file URLs. Implement signed URLs for secure access. Consider CDN for file delivery.

---

**End of Implementation Plan**

This comprehensive plan provides phase-based implementation guidance for building a production-ready full-stack boilerplate. Each phase is independent, testable, and builds upon previous phases. Follow the phases sequentially, marking items complete in the Progress Tracker. Refer to the Integration Details section for understanding how components interact. Consult the Risks & Considerations section proactively to avoid common pitfalls. The final deliverable is a secure, type-safe, scalable application ready for immediate use in production or as a foundation for feature development.
