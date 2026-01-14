# Deployment Guide for GauGyan Platform

This guide covers the deployment of the GauGyan platform, consisting of a Node.js/Express backend and a React/Vite frontend.

## Prerequisites

- **Node.js**: v18 or higher
- **Database**: MySQL (Recommended) or SQLite (Local/Dev)
- **Web Server**: Nginx or Apache (for reverse proxying)
- **Process Manager**: PM2 (Recommended for Node.js production)

---

## 1. Environment Configuration

### Backend (`backend/.env`)

Create a `.env` file in the `backend/` directory:

```ini
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-domain.com

# Database (MySQL)
DB_DIALECT=mysql
DB_HOST=localhost
DB_USER=your_db_user
DB_PASS=your_db_password
DB_NAME=gaugyan_db

# Security & Secrets
JWT_SECRET=your_super_secret_jwt_key
```

### Frontend (`.env`)

Create a `.env` file in the root directory (where `package.json` is):

```ini
VITE_API_URL=https://api.your-domain.com
```

> **Note:** The `VITE_API_URL` must point to your production backend URL.

---

## 2. Build & Install

### Backend Setup

1. Navigate to the backend directory:

    ```bash
    cd backend
    ```

2. Install dependencies:

    ```bash
    npm install --production
    ```

3. (Optional) Run Database Migrations/Seeding if required:

    ```bash
    npm run seed
    ```

### Frontend Build

1. Navigate to the root directory:

    ```bash
    cd ..
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Build the project:

    ```bash
    npm run build
    ```

4. The build artifacts will be in the `dist/` directory.

---

## 3. Running with PM2 (Recommended)

Install PM2 globally if not installed:

```bash
npm install -g pm2
```

Start the backend:

```bash
cd backend
pm2 start server.js --name "gaugyan-api"
```

---

## 4. Serving Frontend (Nginx Example)

Configure Nginx to serve the `dist/` folder and proxy API requests.

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /path/to/gaugyan/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}

server {
    listen 80;
    server_name api.your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 5. Docker Deployment

A `docker-compose.yml` file is provided for containerized deployment.

1. Ensure Docker and Docker Compose are installed.
2. Run:

    ```bash
    docker-compose up -d --build
    ```
