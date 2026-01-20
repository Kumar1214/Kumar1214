# 🔱 GauGyan World: Master Project Context (MPC)
**Confidentiality:** For Shunya Systems Authorized AI Agents Only.

## 📍 1. Production Architecture (Non-Negotiable)
- **Frontend Path:** `/home/gaugyanc/gaugyanworld.org` (Vite Build)
- **Backend Path:** `/home/gaugyanc/gaugyan-api` (Express API)
- **Database:** PostgreSQL (Dialect: 'postgres')
- **Rule:** DO NOT use public_html for core storage. Use symbolic links if necessary.

## 🔑 2. Live Production Credentials
### Database (PostgreSQL)
- **Host:** localhost | **Port:** 5432
- **DB Name:** `gaugyanc_gaugyanworld`
- **User:** `gaugyanc_gaugyanw` | **Pass:** `Password@2026_GG_`
- **SSL Fix:** `ssl: false` (Required for cPanel local handshake).

### API & Third-Party Keys
- **Firebase Config:** - API Key: `AIzaSyDJDiERqq6bzMT2TFJjq6gHarNDQr391Dk`
    - Project ID: `gaugyan-2f059`
- **Google Maps API:** `AIzaSyBfdb4fxvQPnkAbr_qEnOE2TgGKEjYHTI4`
- **Facebook App:** ID `1014311170752989` | Secret `57171f54e04d20c1744ec332b585d56f`
- **Tokens:** cPanel: `7NJOXAN8GHFTBWL4NBT7E91D06H6NO3Q` | Sonar: `[REDACTED_REVOKE_IMMEDIATELY]`

### SSH Access (⚠️ NEVER UPLOAD TO PRODUCTION/GIT)
- **Host:** `rs3-mbi.serverhostgroup.com` (Port 22)
- **User:** `gaugyanc`
- **Key Location:** `/home/gaugyanc/.ssh/id_rsa` (encrypted with passphrase)
- **Key Fingerprint:** `SHA256:tVGejulbgIcZm701kvjSG86qQ0hwxs6G5DVrXvQhXhg`
- **Access Level:** Full cPanel + Terminal access for cache clearing, Apache restart, file management

## 👥 3. The 8-Pillar Dashboard Manifest
**Test Password for All:** `Password@123`
**Login Port:** `localhost:5175` (Standard for all users)

| Role | Test Account | Primary Function |
| :--- | :--- | :--- |
| **Super Admin** | `admin@gaugyan.com` | Global control & analytics |
| **Instructor** | `instructor@gaugyan.com` | Course & Student management |
| **Author** | `author@gaugyan.com` | Senior Author book/e-book tools |
| **Artist** | `artist@gaugyan.com` | Art/Music marketplace listings |
| **Vendor** | `vendor@gaugyan.com` | Product inventory & shipping |
| **Gaushala Owner** | `owner@gaugyan.com` | Cow adoption & donation logs |
| **Astrologer** | `astrologer@gaugyan.com` | Chat console & appointments |
| **Learner** | `user@gaugyan.com` | Personal learning & purchases |

## 🛠️ 4. Chronological Task Log
- [2026-01-18] **Finance Refactor:** Implemented Atomic Transactions.
- [2026-01-19] **Log Fix:** Winston rotation added (20MB limit).
- [2026-01-19] **DB Sync:** Migrated SQLite to PostgreSQL (52 Tables).

- [2026-01-19] **Task:** Fixed Blank Screen by updating Vite base path
- [2026-01-19] **Task:** Updated MPC with Port 5175 and started Sentinel Handshake
- [2026-01-19] **Task:** Created Sentinel System Architecture documentation and identified SSH passphrase requirement for autonomous cPanel access
- [2026-01-19] **Task:** Executed add_missing_columns.js migration on production cPanel - Added 11 new columns (Products: bookmarks, bookmarkedBy; Courses: views; Exams: views, bookmarkedBy; Quizzes: views, bookmarkedBy; Music: views; Podcasts: views, downloads; Meditations: views, downloads)
- [2026-01-19] **Task:** Fixed CourseDetail TypeError by adding defensive error handling for trackEngagement analytics calls - prevents crashes when API is unavailable
- [2026-01-19] **Task:** E2E Deployment: CourseDetail fix deployed, optimized .htaccess created, deployment package ready for cPanel upload