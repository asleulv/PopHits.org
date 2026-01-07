#!/bin/bash

# 1. SETUP
DATE=$(date +%d/%b/%Y)
LOG="/var/log/nginx/pophits_access.log"
OUT="/var/www/pophits/public/stats/human_stats.csv"
# This file will act as a permanent database of every human IP we've ever seen
SEEN_DB="/var/www/pophits/backend/scripts/seen_ips.txt"
SERVER_IP="2a01:4f8:c014:8887::1"

# Create a fast temp snapshot for today to avoid reading the huge main log repeatedly
grep "$DATE" $LOG > /tmp/today_traffic.log

# 2. HEADER
if [ ! -f $OUT ]; then
    echo "date,unique_humans,returning_fans,super_fans,top_referrer,avg_hits,top_interest,mobile_pct" > $OUT
fi

touch "$SEEN_DB"

# 3. FIND THE HUMANS
# We filter out the Indian IP from STATS here, but they can still access the site.
HUMAN_IPS=$(grep ".css" /tmp/today_traffic.log | grep -vEi "bot|spider|crawler|91.98.154.162|$SERVER_IP" | awk '{print $1}' | sort -u)
COUNT=$(echo "$HUMAN_IPS" | wc -w)

if [ "$COUNT" -gt 0 ]; then
    RETURNING=0; SUPER_FANS=0; TOTAL_HITS=0; MOBILE_COUNT=0;

    for ip in $HUMAN_IPS; do
        # --- Returning Fans ---
        # If IP is in our DB, they are returning. If not, add them for tomorrow.
        if grep -qF "$ip" "$SEEN_DB"; then
            ((RETURNING++))
        else
            echo "$ip" >> "$SEEN_DB"
        fi

        # Get all logs for THIS specific IP from our temp file
        IP_DATA=$(grep "$ip" /tmp/today_traffic.log)

        # --- Super Fans (10m+) ---
        times=$(echo "$IP_DATA" | awk '{print $4}' | cut -d: -f2,3,4 | sed 's/\[//')
        start_sec=$(date -d "$(echo "$times" | head -n 1)" +%s 2>/dev/null)
        end_sec=$(date -d "$(echo "$times" | tail -n 1)" +%s 2>/dev/null)

        if [[ -n "$start_sec" && -n "$end_sec" ]]; then
            diff=$((end_sec - start_sec))
            [ $diff -gt 600 ] && ((SUPER_FANS++))
        fi

        # --- Mobile Users ---
        echo "$IP_DATA" | grep -Ei "iPhone|Android|Mobile" > /dev/null && ((MOBILE_COUNT++))

        # --- Engagement ---
        hits=$(echo "$IP_DATA" | wc -l)
        TOTAL_HITS=$((TOTAL_HITS + hits))
    done

    # 4. CALCULATE DATA
    AVG_HITS=$((TOTAL_HITS / COUNT))
    MOBILE_PCT=$(( (MOBILE_COUNT * 100) / COUNT ))

    TOP_INTEREST=$(grep -Ei "/(songs|artists|tags)/" /tmp/today_traffic.log | grep -vEi "bot|spider|91.98.154.162|$SERVER_IP" | awk '{print $7}' | cut -d? -f1 | grep -E "^/(songs|artists|tags)/.+" | sort | uniq -c | sort -nr | head -n 1 | awk '{print $2}' | sed -E 's:^/(songs|artists|tags)/::')

    TOP_REF=$(grep -vEi "bot|spider|pophits.org|91.98.154.162|$SERVER_IP" /tmp/today_traffic.log | awk -F\" '{print $4}' | grep -v -E "^-$|https://pophits.org" | sort | uniq -c | sort -nr | head -n 1 | awk '{print $2}')

    # 5. SAVE
    echo "$DATE,$COUNT,$RETURNING,$SUPER_FANS,${TOP_REF:-Direct},$AVG_HITS,${TOP_INTEREST:-None},$MOBILE_PCT" >> $OUT
fi

# Cleanup temp file
rm /tmp/today_traffic.log