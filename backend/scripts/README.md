# Billboard Hot 100 Automatic Update System

This directory contains scripts to automatically update the PopHits.org database with the latest Billboard Hot 100 chart data every Tuesday.

## Components

1. **update_current_hot100.py** - A Django management command that fetches the latest Billboard Hot 100 chart and updates the database.
2. **setup_hot100_cron.sh** - A bash script to set up a cron job for automatic weekly updates (for Unix-based systems).

## Setup Instructions

### For Unix-based Systems (Linux, macOS)

1. Make the setup script executable:
   ```bash
   chmod +x backend/scripts/setup_hot100_cron.sh
   ```

2. Run the setup script:
   ```bash
   ./backend/scripts/setup_hot100_cron.sh
   ```

   This will create a cron job that runs every Tuesday at 12:00 PM to update the database with the latest Hot 100 chart.

### For Windows Systems

1. Open Task Scheduler (search for "Task Scheduler" in the Start menu)

2. Click "Create Basic Task..."

3. Enter a name (e.g., "Billboard Hot 100 Update") and description, then click "Next"

4. Select "Weekly" and click "Next"

5. Select Tuesday as the day to run the task, and click "Next"

6. Select "Start a program" and click "Next"

7. In the "Program/script" field, enter the path to your Python executable (e.g., `C:\path\to\venv\Scripts\python.exe`)

8. In the "Add arguments" field, enter:
   ```
   manage.py update_current_hot100
   ```

9. In the "Start in" field, enter the path to your Django project directory (e.g., `C:\Users\47924\Documents\Programmering\Django\PopHits.org\backend`)

10. Click "Next" and then "Finish"

## Manual Usage

You can also run the update command manually:

```bash
# From the backend directory
python manage.py update_current_hot100
```

### Command Options

- `--dry-run`: Preview the data that would be imported without making any changes to the database
- `--force`: Force update even if the database is already up to date
- `--test-scrape`: Test only the scraping functionality without affecting the database
- `--test-enhancement`: Test the enhancement process by clearing and re-adding Spotify URLs and descriptions for existing songs

Example:
```bash
python manage.py update_current_hot100 --dry-run
```

### Testing the Scraping Functionality

If you're having issues with the scraping functionality, you can use the `--test-scrape` flag to test just the scraping part:

```bash
python manage.py update_current_hot100 --test-scrape
```

This will:
1. Fetch the Billboard Hot 100 chart
2. Save the HTML to a file (`billboard_hot100.html`) for inspection
3. Try different CSS selectors to extract the chart date and song information
4. Print detailed debugging information about what was found

This is particularly useful if the Billboard website structure changes and you need to update the selectors in the script.

## Testing the Update System

We've provided a test script that allows you to test the Billboard Hot 100 update system without affecting your production database. The script is located at `backend/scripts/test_hot100_update.py`.

### Test Script Options

- `--test-db`: Use a test database instead of the production database (creates a copy of your current database)
- `--dry-run`: Preview data without importing (same as the management command option)
- `--force`: Force update even if already up to date (same as the management command option)

### Running Tests

1. **Dry Run Test** - This will show what would be imported without making any changes:
   ```bash
   python backend/scripts/test_hot100_update.py --dry-run
   ```

2. **Test with Test Database** - This will create a copy of your database and run the update on the copy:
   ```bash
   python backend/scripts/test_hot100_update.py --test-db
   ```

3. **Force Update Test** - This will force an update even if the database is already up to date:
   ```bash
   python backend/scripts/test_hot100_update.py --force
   ```

4. **Complete Test** - This will create a test database and force an update:
   ```bash
   python backend/scripts/test_hot100_update.py --test-db --force
   ```

The test script will provide detailed output of the update process and a summary of the changes made to the test database.

## How It Works

1. The script fetches the latest Billboard Hot 100 chart from the Billboard website.
2. It extracts song information including title, artist, current rank, peak rank, and weeks on chart.
3. For each song, it either creates a new entry in the database or updates an existing one.
4. For any newly added or updated songs, it directly enhances them with:
   - Spotify URLs by searching the Spotify API for each song
   - Song and artist descriptions using OpenAI's API
5. If there are any #1 hits, it also updates the NumberOneSong model.

## Logs

When running via cron job or Task Scheduler, logs are written to:
- Unix: `backend/logs/hot100_update.log`
- Windows: You can specify a log file in the Task Scheduler arguments, e.g., `manage.py update_current_hot100 > C:\path\to\logs\hot100_update.log 2>&1`
