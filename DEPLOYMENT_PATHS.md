# cPanel Deployment Guide for GauGyan World

## 1. Domain & Folder Structure

Based on your requirements, here is the mapping:

* **Frontend Domain**: `gaugyanworld.org`
* **Frontend Folder**: `/gaugyanworld.org` (Root directory, outside public_html)
* **Backend API Folder**: `/gaugyab-api` (Root directory, outside public_html)

## 2. Frontend Deployment

1. **Upload**: Upload `cpanel_frontend.zip` to the `/gaugyanworld.org` folder.
2. **Extract**: Extract the contents. Ensure `index.html` is directly inside `/gaugyanworld.org` (not inside a subfolder like `dist`).
3. **Document Root**: Go to **cPanel > Domains** and ensure the Document Root for `gaugyanworld.org` is set to `/gaugyanworld.org`.
4. **Verify**: Accessing `https://gaugyanworld.org` should load the content.

## 3. Backend Deployment

1. **Upload**: Upload `cpanel_backend_clean.zip` to the `/gaugyab-api` folder.
2. **Extract**: Extract the contents. You should see `server.js`, `package.json`, etc.
3. **Install Dependencies**:
    * Go to **cPanel > Terminal**.
    * Run: `cd gaugyab-api`
    * Run: `npm install --production`
4. **Setup Node.js App**:
    * Go to **cPanel > Setup Node.js App**.
    * **Create Application**:
        * **Node.js Version**: 18.x or 20.x
        * **Application Mode**: Production
        * **Application Root**: `gaugyab-api`
        * **Application URL**: `gaugyanworld.org/api` (or a subdomain like `api.gaugyanworld.org` if you prefer). *Note: If using `gaugyanworld.org/api`, you might need to add this route specific config to the main domain's configuration or creating a distinct subdomain is often easier.*
        * **Startup File**: `server.js`
    * Click **Create**.
5. **Environment Variables**:
    * In the Node.js App settings, click **Environment Variables**.
    * Add key `PORT` with value (leave empty, cPanel handles this) OR relies on your code `process.env.PORT`.
    * **Crucial**: Your `server.js` MUST use `process.env.PORT`.

## 4. Troubleshooting

* **404 on Refresh**: If refreshing a page gives 404, you need an `.htaccess` in `/gaugyanworld.org`:

    ```apache
    <IfModule mod_rewrite.c>
      RewriteEngine On
      RewriteBase /
      RewriteRule ^index\.html$ - [L]
      RewriteCond %{REQUEST_FILENAME} !-f
      RewriteCond %{REQUEST_FILENAME} !-d
      RewriteRule . /index.html [L]
    </IfModule>
    ```

* **API Connection**: Ensure your frontend was built with `VITE_API_URL=https://gaugyanworld.org/api` (We did this).
