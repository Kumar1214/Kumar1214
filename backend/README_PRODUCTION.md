# Gaugyan Backend API - Production Package

This package contains the production-ready backend API for the Gaugyan platform.

## Contents

- `.env` - Production environment variables (Database credentials, JWT secrets, etc.)
- `.htaccess` - Apache configuration for Node.js proxy and security
- `package.json` - Node.js dependencies
- `server.js` - Main application entry point
- `src/` - All source code modules

## Quick Start

1. **Upload to cPanel**
   - Upload all files to `/home/username/gaugyan-api/` folder

2. **Setup Node.js App in cPanel**
   - Application root: `gaugyan-api`
   - Application startup file: `server.js`
   - Node.js version: 18.x or higher
   - Application mode: Production

3. **Install Dependencies**

   ```bash
   npm install --production
   ```

4. **Start Application**
   - Click "Start" in cPanel Node.js App interface

5. **Verify**
   - Test: <https://gaugyanworld.org/api/health>
   - Should return: `{"status":"ok","message":"API is running"}`

## Environment Variables

All environment variables are configured in the `.env` file:

- Database connection (MySQL/SQLite)
- JWT authentication secrets
- CORS settings
- File upload limits

## Security

- `.env` file is protected by `.htaccess`
- Security headers are configured
- Rate limiting is enabled
- Data sanitization is active

## Support

See DEPLOYMENT_GUIDE.md for detailed instructions and troubleshooting.
