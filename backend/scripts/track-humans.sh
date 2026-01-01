#!/bin/bash

# Configuration
DATE=$(date -d "yesterday" +%d/%b/%Y)
# Use the rotated log to ensure we have the full previous day
LOG="/var/log/nginx/pophits_access.log.1" 
OUT="/var/www/pophits/public/stats/human_stats.csv"
YESTERDAY_IPS_FILE="/tmp/pophits_yesterday_ips.txt"

mkdir -p /var/www/pophits/public/stats

# 1. Header setup
if [ ! -f $OUT ]; then
    echo "date,unique_humans,returning_fans,super_fans,top_referrer,avg_hits" > $OUT
fi

# 2. Identify the "Human Truth" IPs (CSS Loaders)
# We exclude all known bots/scrapers to get the pure human list
HUMAN_IPS=$(grep "$DATE" $LOG | grep ".css" | grep -vEi "bot|spider|crawler|semrush|ahrefs|slurp|headless|scraper" | awk '{print $1}' | sort -u)
COUNT=$(echo "$HUMAN_IPS" | wc -w)

if [ "$COUNT" -gt 0 ]; then
    RETURNING=0
    SUPER_FANS=0
    TOTAL_HITS=0

    for ip in $HUMAN_IPS; do
        # --- Track Returning Fans ---
        # Check if this IP appeared in any older logs (log.2.gz and beyond)
        is_returning=$(sudo zgrep -h "$ip" /var/log/nginx/pophits_access.log.*.gz | grep -v "$DATE" | head -n 1)
        if [ -n "$is_returning" ]; then
            ((RETURNING++))
        fi

        # --- Track Super Fans (Session > 10 mins) ---
        # Find first and last hit time for this IP today
        times=$(grep "$DATE" $LOG | grep "$ip" | awk '{print $4}' | cut -d: -f2,3,4 | sed 's/\[//')
        first=$(echo "$times" | head -n 1)
        last=$(echo "$times" | tail -n 1)
        
        # Convert to seconds for math
        start_sec=$(date -d "$first" +%s 2>/dev/null)
        end_sec=$(date -d "$last" +%s 2>/dev/null)
        duration=$((end_sec - start_sec))
        
        if [ "$duration" -gt 600 ]; then # 600 seconds = 10 minutes
            ((SUPER_FANS++))
        fi

        # --- Track Engagement ---
        hits=$(grep "$DATE" $LOG | grep "$ip" | wc -l)
        TOTAL_HITS=$((TOTAL_HITS + hits))
    done

    AVG_HITS=$((TOTAL_HITS / COUNT))
    TOP_REF=$(grep "$DATE" $LOG | grep -vEi "bot|spider|crawler" | awk -F\" '{print $4}' | grep -v "pophits.org" | grep -v "-" | sort | uniq -c | sort -nr | head -n 1 | awk '{print $2}')

    # Append to CSV
    echo "$DATE,$COUNT,$RETURNING,$SUPER_FANS,${TOP_REF:-Direct},$AVG_HITS" >> $OUT
fi