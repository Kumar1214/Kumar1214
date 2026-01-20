# 🔱 GauGyanWorld.org: Project Context & Memory
**Last Updated:** 2026-01-19
**Current Mission:** Final Production Launch (PostgreSQL & cPanel)

## 🏗️ 1. Project Categorization
### Frontend Pages
- **Landing:** `/` (Main marketing, news scroll, donation CTAs)
- **Shared:** `/auth` (Login/Signup), `/notifications`

### Personalised User Dashboards (The 8 Pillars)
1. **Admin:** Master controls, log management, platform-wide analytics.
2. **Instructor:** Course creation, video management, student tracking.
3. **Author:** E-book publishing, senior author permissions.
4. **Artist:** Art/Music marketplace, portfolio management.
5. **Vendor:** Product inventory, order fulfillment, payout tracking.
6. **Gaushala Owner:** Cow profiles, adoption status, donation logs.
7. **Astrologer:** Appointment schedules, consultation chat.
8. **Learner:** Course access, library, personal history.

## 🛠️ 2. Executed Tasks (Historical Memory)
- [2026-01-17] **Database Shift:** Migrated SQLite -> PostgreSQL. Dialect locked in `database.js`.
- [2026-01-18] **Finance Refactor:** Implemented Atomic Transactions in `finance.controller.js`.
- [2026-01-19] **Infrastructure Fix:** Corrected terminal "Exit code 1" and added Winston log rotation.
- [2026-01-19] **Current Blocker:** Blank Screen on cPanel deployment (MIME/Path issues).

## 🚫 3. Prohibited Actions (Stop Hallucinations)
- **DO NOT** use SQLite or create `database.sqlite`.
- **DO NOT** assume relative paths work in cPanel without `./` prefix.
- **DO NOT** provide "variants." Provide one verified fix based on current logs.
