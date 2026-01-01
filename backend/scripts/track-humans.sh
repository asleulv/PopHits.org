#!/bin/bash

# 1. SETUP
DATE=$(date -d "yesterday" +%d/%b/%Y)
LOG="/var/log/nginx/pophits_access.log.1" 
OUT="/var/www/pophits/public/stats/human_stats.csv"

# 2. HEADER (Properly Named)
if [ ! -f $OUT ]; then
    echo "date,unique_humans,returning_fans,super_fans,top_referrer,avg_hits,top_interest,mobile_pct" > $OUT
fi

# 3. FIND THE HUMANS
HUMAN_IPS=$(grep "$DATE" $LOG | grep ".css" | grep -vEi "bot|spider|crawler|semrush|ahrefs|slurp|headless|scraper" | awk '{print $1}' | sort -u)
COUNT=$(echo "$HUMAN_IPS" | wc -w)

if [ "$COUNT" -gt 0 ]; then
    RETURNING=0; SUPER_FANS=0; TOTAL_HITS=0; MOBILE_COUNT=0;

    for ip in $HUMAN_IPS; do
        # --- Returning Fans ---
        is_returning=$(sudo zgrep -h "$ip" /var/log/nginx/pophits_access.log.*.gz | grep -v "$DATE" | head -n 1)
        [ -n "$is_returning" ] && ((RETURNING++))

        # --- Super Fans (10m+) ---
        times=$(grep "$DATE" $LOG | grep "$ip" | awk '{print $4}' | cut -d: -f2,3,4 | sed 's/\[//')
        start_sec=$(date -d "$(echo "$times" | head -n 1)" +%s 2>/dev/null)
        end_sec=$(date -d "$(echo "$times" | tail -n 1)" +%s 2>/dev/null)
        [ $((end_sec - start_sec)) -gt 600 ] && ((SUPER_FANS++))

        # --- Mobile Users ---
        grep "$DATE" $LOG | grep "$ip" | grep -Ei "iPhone|Android|Mobile" > /dev/null && ((MOBILE_COUNT++))

        # --- Engagement ---
        hits=$(grep "$DATE" $LOG | grep "$ip" | wc -l)
        TOTAL_HITS=$((TOTAL_HITS + hits))
    done

    # 4. CALCULATE DATA
    AVG_HITS=$((TOTAL_HITS / COUNT))
    MOBILE_PCT=$(( (MOBILE_COUNT * 100) / COUNT ))
    
    # --- Top Interest (Songs, Artists, or Tags) ---
    TOP_INTEREST=$(grep "$DATE" $LOG | grep -Ei "/songs/./|/artists/./|/tags/./" | grep -vEi "bot|spider|proxy|api" | awk '{print $7}' | cut -d? -f1 | sort | uniq -c | sort -nr | head -n 1 | awk '{print $2}' | sed -E 's:^/(songs|artists|tags)/::')

    # --- Top Referrer ---
    TOP_REF=$(grep "$DATE" $LOG | grep -vEi "bot|spider|pophits.org" | awk -F\" '{print $4}' | grep -v "-" | sort | uniq -c | sort -nr | head -n 1 | awk '{print $2}')

    # 5. SAVE EVERYTHING (Using the new variable name)
    echo "$DATE,$COUNT,$RETURNING,$SUPER_FANS,${TOP_REF:-Direct},$AVG_HITS,${TOP_INTEREST:-None},$MOBILE_PCT" >> $OUT
fi