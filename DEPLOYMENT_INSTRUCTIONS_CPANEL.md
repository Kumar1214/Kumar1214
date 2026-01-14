# cPanel Deployment Instructions

This guide explains how to deploy the generated zip files to your cPanel hosting.

## Files Created
1. `cpanel_frontend_deploy.zip` - Contains the React frontend build.
2. `cpanel_backend_deploy.zip` - Contains the Node.js backend API.

## 1. Database Setup
Ensure your MySQL database matches the configuration in the backend `.env`:
- **Database Name**: `gaugyanc_gaugyanworld`
- **Username**: `gaugyanc_gaugyanworld`
- **Password**: `Password@2025_GG_SK` (as found in your .env.production)

If these credentials are correct, you don't need to change anything.

## 2. Backend Deployment
The user requested the backend to be **outside the home directory** (interpreted as outside `public_html` in the root home folder).

1. **Upload**: Upload `cpanel_backend_deploy.zip` to your home directory (`/home/yourusername/`).
2. **Extract**: Extract the zip. It will create a folder named `gaugyan-api`.
3. **Setup Node.js App** (in cPanel):
   - Go to **Software** -> **Setup Node.js App**.
   - Click **Create Application**.
   - **Node.js Version**: Select **18.x** or **20.x**.
   - **Application Mode**: **Production**.
   - **Application Root**: `gaugyan-api`.
   - **Application URL**: Select `api.gaugyanworld.org` (or the domain you want for the API).
   - **Application Startup File**: `server.js`.
   - Click **Create**.
4. **Install Dependencies**:
   - Once created, click the **Run NPM Install** button in the Node.js App interface.
5. **Restart**:
   - Click **Restart Application**.

**Note**: The `.env` file is included in the zip. The application uses `dotenv` to read it.

## 3. Frontend Deployment
The user requested the frontend folder `gaugyanworld.org` to be **outside public_html**.

1. **Upload**: Upload `cpanel_frontend_deploy.zip` to your home directory (`/home/yourusername/`).
2. **Extract**: Extract the zip. It will create a folder named `gaugyanworld.org`.
3. **Serve the Content**:
   - **Option A (Symlink/Document Root Change)**: 
     - If you can change the **Document Root** for your domain (`gaugyanworld.org`) in cPanel (Domains -> Manage), point it to `/home/yourusername/gaugyanworld.org`.
   - **Option B (Copy to public_html)**:
     - If you cannot change the document root (e.g., for the main shared hosting domain), you must copy the **contents** of the `gaugyanworld.org` folder into `public_html`.
     - *Note*: Ensure you delete any existing `index.html` or old files in `public_html` first.

## 4. Verification
1. **Backend**: Visit `https://api.gaugyanworld.org/health` (or `/api/health`). You should see `{"status":"ok"}`.
2. **Frontend**: Visit `https://gaugyanworld.org`. You should see the website.

## Changes Made for Production
- **Backend fallback URL**: Removed `localhost:5173` from the allowed CORS origins in `server.js` to ensure security.
- **Environment**: Used production credentials from `.env.production`.
