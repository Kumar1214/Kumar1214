# Project Specification & Production Map

## 1. Environment & Credentials

### Database (PostgreSQL)
- **Host:** localhost (Internal cPanel access)
- **Port:** 5432
- **User:** gaugyanc_gaugyanw
- **Database Name:** gaugyanc_gaugyanworld
- **Password:** Password@2026_GG_

### Authentication (API Tokens)
- **cPanel UAPI Token:** 7NJOXAN8GHFTBWL4NBT7E91D06H6NO3Q
- **Sonar Token:** [REDACTED_REVOKE_IMMEDIATELY]

### API Keys
- **Google Maps:** AIzaSyBfdb4fxvQPnkAbr_qEnOE2TgGKEjYHTI4
- **Firebase API Key:** AIzaSyDJDiERqq6bzMT2TFJjq6gHarNDQr391Dk
- **Facebook App ID:** 1014311170752989
- **Facebook Secret:** 57171f54e04d20c1744ec332b585d56f

## 2. Production Paths (cPanel)
- **Backend Root:** /home/gaugyanc/gaugyan-api
- **Frontend Root:** /home/gaugyanc/gaugyanworld.org
- **Node.js Virtual Env:** /home/gaugyanc/nodevenv/gaugyan-api/20/bin/activate
- **Startup File:** server.js

## 3. Local Test Configuration
- **Frontend URL:** http://localhost:5173
- **Backend API URL:** http://localhost:5000
- **Local DB:** Connect to production PostgreSQL via SSH Tunnel or local instance mirroring gaugyanc_gaugyanworld.

## 4. Demo Accounts (Password: Password@123)

| Role | Email | Dashboard Focus |
| :--- | :--- | :--- |
| **Super Admin** | admin@gaugyan.com | Full System Access, Analytics, User Management |
| **Learner** | user@gaugyan.com | My Courses, Wishlist, Purchase History |
| **Instructor** | instructor@gaugyan.com | Course Management, Student Progress |
| **Author** | author@gaugyan.com | Book/E-book Management |
| **Editor** | editor@gaugyan.com | Blog/News Editing Tools |
| **Vendor** | vendor@gaugyan.com | Product Listings, Orders, Shipping |
| **Artist** | artist@gaugyan.com | Art/Music Listings, Portfolio |
| **Gaushala Owner** | owner@gaugyan.com | Cow Adoption, Donation Tracking |
| **Astrologer** | astrologer@gaugyan.com | Appointments, Chat Console |

## 5. Firebase Config
```json
{
  "apiKey": "AIzaSyDJDiERqq6bzMT2TFJjq6gHarNDQr391Dk",
  "authDomain": "gaugyan-2f059.firebaseapp.com",
  "projectId": "gaugyan-2f059",
  "storageBucket": "gaugyan-2f059.firebasestorage.app",
  "messagingSenderId": "784847571076",
  "appId": "1:784847571076:web:742bd5747b3ed6bdc4dad1",
  "measurementId": "G-4W9YE36X3H"
}
```
