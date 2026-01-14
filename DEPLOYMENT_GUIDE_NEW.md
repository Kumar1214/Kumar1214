# GauGyan Deployment Guide (cPanel)

This guide provides step-by-step instructions to deploy the GauGyan platform to cPanel.

## Prerequisites

- cPanel access
- "Setup Node.js App" feature in cPanel
- MySQL Database (optional, can use SQLite for simple start)

## 1. Backend Deployment

1. **Upload**: Upload `gaugyan-api.zip` to your home directory (e.g., `/home/username/`).
2. **Extract**: Extract it to a folder named `gaugyan-api`.
3. **Environment Setup**:
    - Editing `.env`: The zip includes a default `.env`.
    - If using **MySQL**:
        - Create a database and user in cPanel.
        - Edit `.env` in `gaugyan-api`:

            ```properties
            DB_DIALECT=mysql
            DB_HOST=localhost
            DB_USER=your_db_user
            DB_PASS=your_db_pass
            DB_NAME=your_db_name
            ```

    - If using **SQLite** (Default): No change needed.
4. **Node.js Setup**:
    - Go to "Setup Node.js App" in cPanel.
    - Click "Create Application".
    - **Node.js Version**: 18.x or 20.x
    - **Application Mode**: Production
    - **Application Root**: `gaugyan-api`
    - **Application URL**: `api.gaugyanworld.org` (Ensure this subdomain points to your server)
    - **Application Startup File**: `server.js`
    - Click "Create".
5. **Install Dependencies**:
    - In the Node.js App page, click "Run NPM Install".
6. **Seed Data** (Critical for "Demo Data" issue):
    - In the Node.js App page, valid "Run Script" might not show custom scripts like `seed`.
    - **Option A (Terminal)**:
        - Enter the virtual environment command shown at the top (e.g., `source /home/user/nodevenv/...`).
        - Run: `npm run seed`
        - You should see: `✅ Data Seeding Complete!`
    - **Option B (If Terminal not available)**:
        - You can temporarily change "Application Startup File" to `seeder.js`, restart the app, check logs for completion, then change back to `server.js`.
7. **Restart**: Click "Restart" in the Node.js App page.

## 2. Frontend Deployment

1. **Upload**: Upload `gaugyanworld.org.zip` to `public_html` (or the folder for your domain).
2. **Extract**: Extract the contents. Ensure the files (`index.html`, `assets/`, etc.) are directly in the domain's root folder, not a subfolder.
3. **Test**: Visit `https://gaugyanworld.org`.

## Troubleshooting

- **API Connection Failed**: Check Console (F12) for red errors.
  - If 404/Connection Refused: backend is not running.
  - If CORS error: backend is running but blocking origin. (Should be fixed in this release).
- **No Data**: Run the Seeder (Step 1.6).

## Notes

- References to MongoDB have been removed.
- The backend is configured to use Sequelize (MySQL/SQLite).
