# Railway Deployment Guide

## Fixed Configuration Issues

**PROBLEM SOLVED**: The deployment was failing due to Docker build context issues with individual file copying. The final solution uses a simplified approach that copies the entire application directory.

### Previous Issues:

1. **Conflicting configuration files**: Multiple railway.json and nixpacks.toml files
2. **Nixpacks npm package error**: `error: undefined variable 'npm'` in Nix configuration
3. **Package detection issues**: Railway couldn't properly detect the Node.js application
4. **Dockerfile path issue**: Railway couldn't find `order-pay-backend/Dockerfile`
5. **Package.json copy issue**: Individual file copying was causing build context issues
6. **Build context errors**: Files not found during individual COPY operations

### Final Solution:

**Simplified Dockerfile**: Copy the entire `order-pay-backend` directory first, then build from within it. This avoids file path issues and build context problems.

## Current Configuration

### Root Files

- `railway.json` - Railway configuration using root Dockerfile
- `Dockerfile` - Simplified multi-stage Docker build
- `.dockerignore` - Excludes unnecessary files from build context

### Build Process

1. **Build Stage**:

   - Use Node.js 20 base image
   - Copy entire `order-pay-backend/` directory to `/app/`
   - Set working directory to `/app`
   - Install dependencies with npm (uses existing package-lock.json)
   - Build TypeScript application

2. **Production Stage**:
   - Use Alpine Linux for smaller image size
   - Copy built application (`dist/`) from build stage
   - Copy `package.json` from build stage
   - Install only production dependencies
   - Expose port 3000
   - Start with `node dist/main`

## Environment Variables Required

Make sure to set these environment variables in your Railway project:

### Database Configuration

- `DB_HOST` - MySQL database host
- `DB_PORT` - MySQL database port (default: 3306)
- `DB_USER` - MySQL database username
- `DB_PASSWORD` - MySQL database password
- `DB_NAME` - MySQL database name

### JWT Configuration

- `JWT_SECRET` - Secret key for JWT token generation

### CORS Configuration

- `CORS_ORIGINS` - Comma-separated list of allowed origins (e.g., "https://yourfrontend.com,https://anotherdomain.com")

### Firebase Configuration (if using Firebase)

- `FIREBASE_PROJECT_ID` - Firebase project ID
- `FIREBASE_PRIVATE_KEY` - Firebase private key
- `FIREBASE_CLIENT_EMAIL` - Firebase client email

### Application Configuration

- `NODE_ENV` - Set to "production"
- `PORT` - Port number (Railway will set this automatically)

## Deployment Notes

1. **Builder**: Uses Dockerfile in root directory
2. **Dockerfile location**: `./Dockerfile` (root level)
3. **Multi-stage build**: Optimized for production with smaller final image
4. **Health check**: Available at `/health` endpoint
5. **Auto-restart**: Up to 10 retries on failure
6. **Simple approach**: Copies entire directory to avoid file path issues

## Troubleshooting

If deployment fails:

1. Check that all required environment variables are set
2. Verify that the database is accessible from Railway
3. Check the Docker build logs for any compilation errors
4. Ensure the database migrations have been run

## What Was Fixed

- ✅ Removed conflicting railway.json files
- ✅ Removed conflicting nixpacks.toml files
- ✅ Created root package.json for proper detection
- ✅ **Switched to Dockerfile** to avoid Nixpacks npm package issues
- ✅ **Moved Dockerfile to root** to resolve path issues
- ✅ **Simplified file copying** to avoid build context issues
- ✅ **Copy entire directory approach** for reliability
- ✅ Added .dockerignore for optimized builds
- ✅ Tested and verified approach

## Why Simplified Directory Copying?

Individual file copying was causing build context issues where Docker couldn't find specific files. The simplified approach:

- ✅ **More reliable**: Copies everything at once, no missing files
- ✅ **Build context friendly**: Avoids individual file path issues
- ✅ **Simpler maintenance**: Fewer COPY commands to manage
- ✅ **Proven approach**: Standard Docker pattern for Node.js apps
- ✅ **Works with all lock files**: npm, yarn, pnpm - all supported automatically
