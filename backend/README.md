# GauGyan API - Backend

Production-ready backend API for gaugyanworld.org

## Deployment to cPanel

### Prerequisites
- Node.js 18+ installed on cPanel
- MySQL database created
- Environment variables configured

### Deployment Steps

1. **Upload Files**
   - Upload all files to `gaugyan-api` directory (outside public_html)

2. **Install Dependencies**
   ```bash
   npm install --production
   ```

3. **Configure Environment**
   - Copy `.env.example` to `.env`
   - Update database credentials
   - Set production URLs

4. **Database Setup**
   - Import `gaugyanc_gaugyanworld.sql` to your MySQL database
   - Verify all tables are created

5. **Start Application**
   ```bash
   node server.js
   # or use PM2
   pm2 start server.js --name gaugyan-api
   ```

## Environment Variables

```bash
PORT=5001
CLIENT_URL=https://www.gaugyanworld.org,https://gaugyanworld.org
DB_HOST=localhost
DB_USER=gaugyanc_gaugyanworld
DB_NAME=gaugyanc_gaugyanworld
DB_PASSWORD=your_password_here
DB_DIALECT=mysql
JWT_SECRET=your_jwt_secret_here
NODE_ENV=production
```

## API Endpoints

Base URL: `https://api.gaugyanworld.org/api`

See `API_DOCUMENTATION.md` for complete API reference.

## Support

For deployment issues, contact: support@gaugyanworld.org
