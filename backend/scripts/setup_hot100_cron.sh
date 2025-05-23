#!/bin/bash

# This script sets up a cron job to update the Billboard Hot 100 data every Tuesday

# Get the absolute path to the Django project
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PYTHON_PATH=$(which python3)
VIRTUAL_ENV_PATH=$(dirname $(dirname $PYTHON_PATH))

# Create a temporary cron file
TEMP_CRON_FILE=$(mktemp)

# Export the current crontab
crontab -l > $TEMP_CRON_FILE 2>/dev/null || echo "# New crontab" > $TEMP_CRON_FILE

# Check if the cron job already exists
if grep -q "update_current_hot100" $TEMP_CRON_FILE; then
    echo "Cron job for Billboard Hot 100 update already exists."
else
    # Add the new cron job to run every Tuesday at 12:00 PM
    echo "# Billboard Hot 100 update - runs every Tuesday at 12:00 PM" >> $TEMP_CRON_FILE
    echo "0 12 * * 2 cd $PROJECT_DIR && $PYTHON_PATH manage.py update_current_hot100 >> $PROJECT_DIR/logs/hot100_update.log 2>&1" >> $TEMP_CRON_FILE
    
    # Install the new crontab
    crontab $TEMP_CRON_FILE
    echo "Cron job for Billboard Hot 100 update has been added."
    echo "It will run every Tuesday at 12:00 PM."
    echo "Logs will be written to $PROJECT_DIR/logs/hot100_update.log"
    
    # Create logs directory if it doesn't exist
    mkdir -p "$PROJECT_DIR/logs"
fi

# Clean up
rm $TEMP_CRON_FILE

echo "You can manually run the update with the following command:"
echo "cd $PROJECT_DIR && $PYTHON_PATH manage.py update_current_hot100"
echo ""
echo "To test the script without making changes to the database, use:"
echo "cd $PROJECT_DIR && $PYTHON_PATH manage.py update_current_hot100 --dry-run"
