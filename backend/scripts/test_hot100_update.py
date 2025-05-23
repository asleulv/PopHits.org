#!/usr/bin/env python
"""
Test script for the Billboard Hot 100 update system.
This script allows you to test the update_current_hot100 management command
without affecting your production database.
"""

import os
import sys
import argparse
import subprocess
import django
from datetime import datetime

# Set up Django environment
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.core.management import call_command
from django.db import connection
from songs.models import Song, NumberOneSong

def create_test_database():
    """Create a test database for testing the update system."""
    print("Creating test database...")
    
    # Get the current database name
    db_name = connection.settings_dict['NAME']
    test_db_name = f"{db_name}_test"
    
    # Create a new test database
    with connection.cursor() as cursor:
        # Check if test database exists and drop it if it does
        cursor.execute(f"SELECT 1 FROM pg_database WHERE datname = '{test_db_name}'")
        if cursor.fetchone():
            cursor.execute(f"DROP DATABASE {test_db_name}")
        
        # Create the test database
        cursor.execute(f"CREATE DATABASE {test_db_name} TEMPLATE {db_name}")
    
    print(f"Test database '{test_db_name}' created successfully.")
    return test_db_name

def run_test(use_test_db=False, dry_run=False, force=False):
    """Run the update_current_hot100 command for testing."""
    print("\n=== TESTING BILLBOARD HOT 100 UPDATE SYSTEM ===\n")
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Dry run: {dry_run}")
    print(f"Force update: {force}")
    print(f"Using test database: {use_test_db}")
    
    # Build the command
    cmd = ["python", "manage.py", "update_current_hot100"]
    
    if dry_run:
        cmd.append("--dry-run")
    
    if force:
        cmd.append("--force")
    
    # Set environment variables for test database if needed
    env = os.environ.copy()
    if use_test_db:
        test_db_name = create_test_database()
        env["DATABASE_NAME"] = test_db_name
    
    # Run the command
    print("\nRunning update_current_hot100 command...")
    process = subprocess.Popen(
        cmd,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        universal_newlines=True,
        cwd=os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
        env=env
    )
    
    # Print output in real-time
    for line in process.stdout:
        print(line, end='')
    
    # Wait for the process to complete
    process.wait()
    
    # Print any errors
    if process.returncode != 0:
        print("\nError running update_current_hot100 command:")
        for line in process.stderr:
            print(line, end='')
    
    # Print summary
    if not dry_run and use_test_db:
        # Connect to the test database
        old_db_name = connection.settings_dict['NAME']
        connection.settings_dict['NAME'] = test_db_name
        connection.close()
        connection.connect()
        
        # Get counts
        song_count = Song.objects.count()
        number_one_count = NumberOneSong.objects.count()
        
        print("\n=== TEST DATABASE SUMMARY ===")
        print(f"Total songs: {song_count}")
        print(f"Number one songs: {number_one_count}")
        
        # Restore original database connection
        connection.settings_dict['NAME'] = old_db_name
        connection.close()
        connection.connect()
    
    print("\n=== TEST COMPLETED ===\n")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Test the Billboard Hot 100 update system.")
    parser.add_argument("--test-db", action="store_true", help="Use a test database instead of the production database")
    parser.add_argument("--dry-run", action="store_true", help="Preview data without importing")
    parser.add_argument("--force", action="store_true", help="Force update even if already up to date")
    
    args = parser.parse_args()
    
    run_test(use_test_db=args.test_db, dry_run=args.dry_run, force=args.force)
