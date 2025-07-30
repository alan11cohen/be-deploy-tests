# Railway Deployment Guide

## Fixed Configuration Issues

**PROBLEM SOLVED**: The deployment was failing because of conflicting configuration files. The solution involved:

1. **Removed duplicate configs**: Deleted conflicting `railway.json` and `nixpacks.toml` files from the subdirectory
2. **Created root package.json**: Added a deployment wrapper that properly delegates to the NestJS app
3. **Simplified configuration**: Railway now detects this as a standard Node.js project

## Current Configuration

### Root Files
- `package.json` - Deployment wrapper with build scripts
- `railway.json` - Railway-specific configuration  
- `nixpacks.toml` - Nixpacks build configuration

### Build Process
1. **Setup**: Install Node.js 20 and npm
2. **Install**: Run `npm install` (automatically runs `postinstall` script)
3. **Build**: Run `npm run build` (delegates to `cd order-pay-backend && npm run build`)
4. **Start**: Run `npm run start:prod` (delegates to `cd order-pay-backend && npm run start:prod`)

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

1. The application is configured to use Nixpacks for building
2. The build process will:
   - Install dependencies in the `order-pay-backend` directory
   - Build the TypeScript application
   - Start the production server
3. Health check endpoint is available at `/health`
4. The application will automatically restart on failure (up to 10 times)

## Troubleshooting

If deployment fails:

1. Check that all required environment variables are set
2. Verify that the database is accessible from Railway
3. Check the build logs for any compilation errors
4. Ensure the database migrations have been run

## What Was Fixed

- ✅ Removed conflicting railway.json files
- ✅ Removed conflicting nixpacks.toml files  
- ✅ Created root package.json for proper detection
- ✅ Simplified build commands
- ✅ Tested build process locally
