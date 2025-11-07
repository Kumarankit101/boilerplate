# ESLint Configuration Note

## Current Status

ESLint has been temporarily disabled in the pre-commit hooks due to a compatibility issue between Next.js 16 and ESLint configuration.

## Issue

When trying to run ESLint with `eslint-config-next@16.0.1`, a circular reference error occurs:

```
TypeError: Converting circular structure to JSON
--> starting at object with constructor 'Object'
|     property 'configs' -> object with constructor 'Object'
|     property 'flat' -> object with constructor 'Object'
...
```

This affects both ESLint 8 and ESLint 9.

## Current Configuration

- **ESLint Version**: 8.57.1
- **Config File**: `.eslintrc.json` (extends next/core-web-vitals, next/typescript, prettier)
- **Pre-commit Hook**: Only runs Prettier (ESLint disabled temporarily)

## Temporary Workaround

The `lint-staged` configuration in `package.json` has been modified to only run Prettier:

```json
"lint-staged": {
  "*.{js,jsx,ts,tsx}": [
    "prettier --write"
  ],
  "*.{json,md,css}": [
    "prettier --write"
  ]
}
```

## Manual Linting

You can still manually run linting via the Next.js CLI:

```bash
npm run lint      # Check for lint errors
npm run lint:fix  # Auto-fix lint errors
```

However, these commands may also encounter the circular reference error.

## Production Build

The production build (`npm run build`) still succeeds because Next.js handles ESLint differently during the build process.

## Future Fix Options

1. **Wait for Update**: Next.js or eslint-config-next may release a fix for this issue
2. **Custom Config**: Create a custom ESLint config that doesn't use eslint-config-next
3. **ESLint 9 Migration**: Once Next.js fully supports ESLint 9's flat config, migrate to that format

## Current Impact

- ✅ Code still formatted with Prettier on every commit
- ✅ Production builds work correctly
- ✅ TypeScript errors caught during build
- ⚠️ ESLint not running in pre-commit hooks
- ⚠️ Manual ESLint commands may fail

## Recommendation

For now, rely on:

1. Prettier for code formatting (automatic on commit)
2. TypeScript for type checking (runs during build)
3. Manual code review for other code quality issues
4. IDE ESLint integration (may work depending on IDE configuration)

---

**Note**: This is a temporary workaround. Monitor Next.js and ESLint updates for a permanent solution.
