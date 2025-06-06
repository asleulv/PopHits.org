# Sitemap Generator Setup

This document explains how to set up the sitemap generator on your live server.

## Files

1. `backend/songs/_sitemap.py` - The main script that generates the sitemap
2. `backend/scripts/update_sitemap.sh` - A shell script to run the sitemap generator

## Setup Steps

### 1. Make the shell script executable

After pulling the changes to your live server, make the shell script executable:

```bash
chmod +x /path/to/your/project/backend/scripts/update_sitemap.sh
```

### 2. Test the script

Run the script manually to make sure it works:

```bash
cd /path/to/your/project
./backend/scripts/update_sitemap.sh
```

This should generate a sitemap.xml file in your `static` directory.

### 3. Set up a cron job

Add a cron job to run the script daily:

```bash
crontab -e
```

Add this line (adjust the path to match your server's directory structure):

```
0 3 * * * /path/to/your/project/backend/scripts/update_sitemap.sh >> /path/to/your/project/backend/logs/sitemap_cron.log 2>&1
```

This will run the script every day at 3 AM and log the output to a file.

### 4. Update your robots.txt

Make sure your robots.txt file includes a reference to your sitemap:

```
Sitemap: https://pophits.org/static/sitemap.xml
```

## Troubleshooting

- If the script fails, check the log file for errors
- Make sure the `static` directory is writable by the user running the cron job
- Verify that the sitemap.xml file is accessible at https://pophits.org/static/sitemap.xml

## Notes

- The sitemap will include all songs, blog posts, and other important pages
- New blog posts will be automatically included the next time the cron job runs
- The script includes progress output so you can see how many items are being processed
