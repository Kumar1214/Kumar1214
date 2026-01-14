# 🚨 CRITICAL: Fix Database Schema to Load Data

## The Problem

Your backend is running perfectly, but **data isn't loading** because the database is missing critical columns. The API returns **500 errors** like:

```
Unknown column 'Product.views' in 'SELECT'
Unknown column 'Course.completions' in 'SELECT'
Unknown column 'News.lastUpdated' in 'SELECT'
```

## The Solution

Run the database migration script to add the missing columns.

---

## Step-by-Step Fix

### 1. Upload New Backend Package

The new `cpanel_backend_deploy.zip` (1.7M) includes the migration script.

1. Stop your Node.js app in cPanel
2. Backup current backend:
   ```bash
   cd /home/gaugyanc
   mv gaugyan-api gaugyan-api-old-backup
   ```
3. Upload `cpanel_backend_deploy.zip` to `/home/gaugyanc/`
4. Extract it (creates `gaugyan-api` folder)

### 2. Run Database Migration

SSH into your server or use cPanel Terminal:

```bash
cd /home/gaugyanc/gaugyan-api
source /home/gaugyanc/nodevenv/gaugyan-api/20/bin/activate
node add_missing_columns.js
```

**Expected Output:**
```
🔧 Starting database migration...
Adding missing columns to tables...

📦 Updating Products table...
✅ Added views column to Products
✅ Added shares column to Products
✅ Added bookmarks column to Products

📚 Updating Courses table...
✅ Added views column to Courses
✅ Added shares column to Courses
✅ Added bookmarks column to Courses
✅ Added completions column to Courses

📰 Updating News table...
✅ Added views column to News
✅ Added shares column to News
✅ Added bookmarks column to News
✅ Added lastUpdated column to News

... (continues for all tables)

✅ Database migration completed successfully!
🎉 All missing columns have been added.
```

### 3. Restart Backend

In cPanel Node.js App interface:
- Click "Restart Application"

### 4. Verify Fix

**Test API Endpoints:**

1. Products: `https://api.gaugyanworld.org/api/products`
   - Should return product data (not 500 error)

2. Courses: `https://api.gaugyanworld.org/api/courses`
   - Should return course data

3. News: `https://api.gaugyanworld.org/api/news`
   - Should return news articles

**Test Frontend:**

1. Visit: `https://gaugyanworld.org`
   - Homepage carousel should load
   - Banners should display

2. Visit: `https://gaugyanworld.org/shop`
   - Products should display

3. Visit: `https://gaugyanworld.org/courses`
   - Courses should display

---

## What the Migration Script Does

Adds these columns to each table:

| Table | New Columns |
|-------|-------------|
| **Products** | `views`, `shares`, `bookmarks` |
| **Courses** | `views`, `shares`, `bookmarks`, `completions` |
| **News** | `views`, `shares`, `bookmarks`, `lastUpdated` |
| **Knowledgebase** | `views`, `shares`, `bookmarks`, `lastUpdated` |
| **Exams** | `views`, `shares`, `bookmarks` |
| **Quizzes** | `views`, `shares`, `bookmarks` |
| **Music** | `views`, `shares`, `bookmarks` |
| **Podcasts** | `views`, `shares`, `bookmarks` |
| **Meditations** | `views`, `shares`, `bookmarks` |

All columns default to `0` (for integers) or `NULL` (for dates), so existing data won't be affected.

---

## Troubleshooting

### If migration fails:

1. **Check database connection**: Make sure `.env` has correct MySQL credentials
2. **Check permissions**: Ensure the database user has `ALTER TABLE` permission
3. **Manual fix**: You can add columns manually in phpMyAdmin if needed

### If data still doesn't load:

1. Check server logs: `tail -f /home/gaugyanc/gaugyan-api/server_debug.log`
2. Check API responses in browser Network tab
3. Verify database has data: Check tables in phpMyAdmin

---

## Summary

✅ **Backend package updated** with migration script  
✅ **Migration script ready** to add missing columns  
✅ **Simple one-command fix**: `node add_missing_columns.js`  
✅ **Safe migration**: Won't affect existing data  

After running the migration, **all data will load correctly** on your website!

---

**Files in Package:**
- `add_missing_columns.js` - Database migration script (NEW)
- All backend code with module import fixes
- Production `.env` configuration
- All routes and controllers

**Package Size**: 1.7 MB  
**Location**: `/Users/mac/Downloads/gaugyan_macos_final/cpanel_backend_deploy.zip`
