# FTP Deployment Bug Fix - Nested Directory Issue

## Problem Identified
The original `deploy_ftp.js` script created nested directory structures:
- **Backend**: `/home/gaugyanc/gaugyan-api/home/gaugyanc/gaugyan-api` ❌
- **Frontend**: `/home/gaugyanc/gaugyanworld.org/home/gaugyanc/gaugyanworld.org` ❌

## Root Cause
The `basic-ftp` library's `uploadFromDir(localPath, remotePath)` function was uploading the **absolute path structure** instead of just the directory contents.

## Solution Applied

### 1. Immediate Fix (via cPanel Terminal)
Moved files from nested structure to correct location:
```bash
# Backend fix
cd /home/gaugyanc/gaugyan-api
cp -a home/gaugyanc/gaugyan-api/. .
rm -rf home

# Frontend fix  
cd /home/gaugyanc/gaugyanworld.org
cp -a home/gaugyanc/gaugyanworld.org/. .
rm -rf home
```

### 2. Permanent Fix (Updated Script)
Created `deploy_ftp_fixed.js` with the following approach:

```javascript
// Change to source directory before upload
process.chdir(config.localDir);

// Upload from current directory (.) to prevent absolute path nesting
await client.uploadFromDir('.');
```

**Key Changes**:
- Use `process.chdir()` to change to source directory
- Upload from `.` (current directory) instead of absolute path
- Wrap in try/finally to restore original working directory

## Verification
✅ Both frontend and backend files now correctly located at:
- `/home/gaugyanc/gaugyan-api`
- `/home/gaugyanc/gaugyanworld.org`

## Next Steps
Use `deploy_ftp_fixed.js` for all future deployments to prevent this issue.
