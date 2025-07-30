# Railway Deployment Guide

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
