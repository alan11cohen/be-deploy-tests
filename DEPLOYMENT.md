# Railway Deployment Guide

## Fixed Configuration Issues

**PROBLEM SOLVED**: The deployment was failing due to Railway not finding the Dockerfile. The final solution places the Dockerfile in the root directory.

### Previous Issues:
1. **Conflicting configuration files**: Multiple railway.json and nixpacks.toml files
2. **Nixpacks npm package error**: `error: undefined variable 'npm'` in Nix configuration
3. **Package detection issues**: Railway couldn't properly detect the Node.js application
4. **Dockerfile path issue**: Railway couldn't find `order-pay-backend/Dockerfile`

### Final Solution:

**Dockerfile in Root**: Moved Dockerfile to root directory and configured it to build from the `order-pay-backend` subdirectory.

## Current Configuration

### Root Files

- `railway.json` - Railway configuration using root Dockerfile
- `Dockerfile` - Multi-stage Docker build that builds the NestJS app from subdirectory
- `.dockerignore` - Excludes unnecessary files from build context

### Build Process

1. **Build Stage**:
   - Use Node.js 20 base image
   - Copy `order-pay-backend/package*.json` to `/app`
   - Install dependencies
   - Copy entire `order-pay-backend/` directory to `/app`
   - Build TypeScript application

2. **Production Stage**:
   - Use Alpine Linux for smaller image size
   - Copy built application and package.json from build stage
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
- ✅ Updated Dockerfile to build from subdirectory
- ✅ Added .dockerignore for optimized builds
- ✅ Tested file structure and paths

## Why Root Dockerfile?

Railway had issues finding the Dockerfile at `order-pay-backend/Dockerfile`. Moving it to the root and configuring it to build from the subdirectory resolved the path detection issue:

- ✅ **Railway can find it**: No path resolution issues
- ✅ **Builds correctly**: Properly copies from subdirectory
- ✅ **Optimized**: Uses .dockerignore for faster builds
- ✅ **Production ready**: Multi-stage build for smaller images
