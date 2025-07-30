# Railway Deployment Guide

## Fixed Configuration Issues

**PROBLEM SOLVED**: The deployment was failing due to Nixpacks package resolution issues. The solution was to switch to using the existing Dockerfile which is more reliable.

### Previous Issues:

1. **Conflicting configuration files**: Multiple railway.json and nixpacks.toml files
2. **Nixpacks npm package error**: `error: undefined variable 'npm'` in Nix configuration
3. **Package detection issues**: Railway couldn't properly detect the Node.js application

### Final Solution:

**Switched to Dockerfile**: Using the existing, tested Dockerfile instead of Nixpacks for more reliable builds.

## Current Configuration

### Root Files

- `railway.json` - Railway configuration using Dockerfile builder
- `order-pay-backend/Dockerfile` - Multi-stage Docker build for production

### Build Process

1. **Build Stage**:
   - Use Node.js 20 base image
   - Install dependencies and build TypeScript application
2. **Production Stage**:
   - Use Alpine Linux for smaller image size
   - Copy built application and production dependencies
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

1. **Builder**: Now uses Dockerfile instead of Nixpacks
2. **Dockerfile location**: `order-pay-backend/Dockerfile`
3. **Multi-stage build**: Optimized for production with smaller final image
4. **Health check**: Available at `/health` endpoint
5. **Auto-restart**: Up to 10 retries on failure

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
- ✅ Updated Dockerfile to expose port properly
- ✅ Tested build process locally

## Why Dockerfile Instead of Nixpacks?

Nixpacks was failing with `error: undefined variable 'npm'` due to package resolution issues in the Nix environment. The existing Dockerfile is:

- ✅ **Proven to work** - Already tested and functional
- ✅ **More reliable** - No dependency on Nix package resolution
- ✅ **Optimized** - Multi-stage build for smaller production images
- ✅ **Simpler** - Standard Docker approach that's widely supported
