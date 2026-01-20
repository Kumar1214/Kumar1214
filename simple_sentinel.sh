#!/bin/bash
# Simple Sentinel Monitor - Paste this entire block into cPanel terminal

cd "/home/gaugyanc/Shunya Sentinel"

cat > monitor.sh << 'EOF'
#!/bin/bash
LOG_FILE="sentinel_activity.log"

# Check API
API=$(curl -s -o /dev/null -w "%{http_code}" https://api.gaugyanworld.org/health)
echo "[$(date '+%Y-%m-%d %H:%M:%S')] API: $API" >> "$LOG_FILE"

# Check Frontend
FRONT=$(curl -s -o /dev/null -w "%{http_code}" https://gaugyanworld.org)
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Frontend: $FRONT" >> "$LOG_FILE"

# Check DB
DB=$(curl -s https://api.gaugyanworld.org/api/courses | grep -q "success" && echo "OK" || echo "FAIL")
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Database: $DB" >> "$LOG_FILE"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] ---" >> "$LOG_FILE"
EOF

chmod +x monitor.sh
./monitor.sh
echo "✅ Sentinel created and tested"
tail -5 sentinel_activity.log
