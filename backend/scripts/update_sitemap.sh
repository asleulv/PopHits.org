#!/bin/bash

# Navigate to the project directory
cd "$(dirname "$0")/.."

# Activate virtual environment if you're using one
# source /path/to/your/virtualenv/bin/activate

# Run the sitemap generator script
python songs/_sitemap.py

# Output completion message
echo "Sitemap update completed at $(date)"
