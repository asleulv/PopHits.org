#!/bin/bash

# 1. Navigate to the project root
cd /var/www/pophits/backend

# 2. Run the script using the absolute path to the venv python
# We redirect output (stdout and stderr) to a log file for debugging
/var/www/pophits/backend/venv/bin/python /var/www/pophits/backend/songs/_sitemap.py >> /var/www/pophits/backend/logs/sitemap_cron.log 2>&1

# 3. Print a timestamped message to the console
echo "Sitemap update process finished at $(date)"