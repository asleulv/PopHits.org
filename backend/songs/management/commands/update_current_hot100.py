import requests
import os
import re
import subprocess
from bs4 import BeautifulSoup
from datetime import datetime
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils.text import slugify
from django.core.management import call_command
from songs.models import Song, NumberOneSong
from fuzzywuzzy import fuzz

class Command(BaseCommand):
    help = 'Fetches the latest Billboard Hot 100 chart and updates the database'
    
    def add_arguments(self, parser):
        parser.add_argument('--dry-run', action='store_true', help='Preview data without importing')
        parser.add_argument('--force', action='store_true', help='Force update even if already up to date')
        parser.add_argument('--test-scrape', action='store_true', help='Test the scraping functionality only')
        parser.add_argument('--test-enhancement', action='store_true', help='Test the enhancement process by clearing and re-adding Spotify URLs and descriptions')
    
    def handle(self, *args, **options):
        dry_run = options['dry_run']
        force_update = options['force']
        test_scrape = options['test_scrape']
        test_enhancement = options['test_enhancement']
        
        if test_scrape:
            self.stdout.write(self.style.SUCCESS("Starting Billboard Hot 100 scrape test"))
            self.test_scraping()
            return
        
        if test_enhancement:
            self.stdout.write(self.style.SUCCESS("Starting Billboard Hot 100 enhancement test"))
            self.test_enhancement()
            return
        
        self.stdout.write(self.style.SUCCESS(f"Starting Billboard Hot 100 update - {'Preview' if dry_run else 'Import'} mode"))
        
        # Fetch the latest Hot 100 chart
        try:
            self.stdout.write("Fetching the latest Billboard Hot 100 chart...")
            chart_data = self.fetch_hot100_chart()
            
            if not chart_data:
                self.stdout.write(self.style.ERROR("Failed to fetch chart data"))
                return
            
            # Check if we already have the latest chart
            chart_date = chart_data['chart_date']
            self.stdout.write(f"Chart date: {chart_date}")
            
            # Check if we need to update
            if not force_update and self.is_chart_up_to_date(chart_date):
                self.stdout.write(self.style.SUCCESS(f"Database already has data for chart dated {chart_date}. Use --force to update anyway."))
                return
            
            # Process the chart data
            if dry_run:
                self.preview_data(chart_data)
            else:
                self.update_database(chart_data)
                
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error updating Hot 100 chart: {e}"))
    
    def test_scraping(self):
        """Test the scraping functionality without affecting the database."""
        self.stdout.write("\n=== TESTING BILLBOARD HOT 100 SCRAPING ===\n")
        
        try:
            # Fetch the Billboard Hot 100 chart
            self.stdout.write("Fetching the Billboard Hot 100 chart...")
            
            # Make the request
            url = "https://www.billboard.com/charts/hot-100/"
            self.stdout.write(f"Requesting URL: {url}")
            
            response = requests.get(url)
            self.stdout.write(f"Response status code: {response.status_code}")
            
            if response.status_code != 200:
                self.stdout.write(self.style.ERROR(f"Failed to fetch the Billboard Hot 100 chart. Status code: {response.status_code}"))
                return
            
            # Parse the HTML
            self.stdout.write("Parsing HTML...")
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Save the HTML to a file for inspection
            with open('billboard_hot100.html', 'w', encoding='utf-8') as f:
                f.write(response.text)
            self.stdout.write(self.style.SUCCESS("Saved HTML to billboard_hot100.html for inspection"))
            
            # Try to extract the chart date
            self.stdout.write("\nTrying to extract chart date...")
            
            # First check for chart-date-picker div
            date_picker = soup.select_one('div#chart-date-picker')
            if date_picker and date_picker.has_attr('data-date'):
                self.stdout.write(self.style.SUCCESS(f"Found date in chart-date-picker: {date_picker['data-date']}"))
            else:
                self.stdout.write("No date found in chart-date-picker div")
            
            # Then check other selectors
            date_selectors = [
                'button.date-selector__button',
                'span.c-label.u-font-size-14',
                'p.c-tagline',
                'span.date-selector__button'
            ]
            
            for selector in date_selectors:
                date_element = soup.select_one(selector)
                if date_element:
                    self.stdout.write(self.style.SUCCESS(f"Found date element with selector: {selector}"))
                    self.stdout.write(f"Date text: {date_element.text.strip()}")
                else:
                    self.stdout.write(f"No date element found with selector: {selector}")
            
            # Try to extract chart items
            self.stdout.write("\nTrying to extract chart items...")
            chart_item_selectors = [
                'div.o-chart-results-list-row-container',
                'li.chart-list__element',
                'div.chart-list-item',
                'article.chart-row'
            ]
            
            for selector in chart_item_selectors:
                chart_items = soup.select(selector)
                if chart_items:
                    self.stdout.write(self.style.SUCCESS(f"Found {len(chart_items)} chart items with selector: {selector}"))
                    
                    # Try to extract title and artist from the first few items
                    self.stdout.write("\nSample chart items:")
                    for i, item in enumerate(chart_items[:5]):
                        self.stdout.write(f"\nItem {i+1}:")
                        self.stdout.write(f"HTML: {item.prettify()[:500]}...")
                        
                        # Try different title selectors
                        title_selectors = [
                            'h3#title-of-a-story',
                            'span.chart-element__information__song',
                            'h3.c-title',
                            '.chart-row__song'
                        ]
                        
                        for title_selector in title_selectors:
                            title_element = item.select_one(title_selector)
                            if title_element:
                                self.stdout.write(self.style.SUCCESS(f"Found title with selector: {title_selector}"))
                                self.stdout.write(f"Title: {title_element.text.strip()}")
                                break
                        
                        # Try different artist selectors
                        artist_selectors = [
                            'span.c-label.a-font-primary-s',
                            'span.chart-element__information__artist',
                            'span.c-label',
                            '.chart-row__artist'
                        ]
                        
                        for artist_selector in artist_selectors:
                            artist_element = item.select_one(artist_selector)
                            if artist_element:
                                self.stdout.write(self.style.SUCCESS(f"Found artist with selector: {artist_selector}"))
                                self.stdout.write(f"Artist: {artist_element.text.strip()}")
                                break
                    
                    break
                else:
                    self.stdout.write(f"No chart items found with selector: {selector}")
            
            self.stdout.write("\n=== SCRAPING TEST COMPLETED ===\n")
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error testing scraping: {e}"))
    
    def fetch_hot100_chart(self):
        """Fetch the latest Billboard Hot 100 chart from the website."""
        url = "https://www.billboard.com/charts/hot-100/"
        
        try:
            response = requests.get(url)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Try to extract date from the chart-date-picker div first (most reliable)
            chart_date = None
            date_picker = soup.select_one('div#chart-date-picker')
            
            if date_picker and date_picker.has_attr('data-date'):
                chart_date = date_picker['data-date']
                self.stdout.write(self.style.SUCCESS(f"Found date in chart-date-picker: {chart_date}"))
            
            # If we couldn't extract date from chart-date-picker, try page title
            if not chart_date:
                title_element = soup.select_one('title')
                
                if title_element:
                    title_text = title_element.text.strip()
                    self.stdout.write(f"Found page title: {title_text}")
                    
                    # Look for date pattern like "Billboard Hot 100 Top 10 Countdown For May 24, 2025"
                    date_match = re.search(r'For\s+([A-Za-z]+\s+\d{1,2},\s+\d{4})', title_text)
                    if date_match:
                        date_text = date_match.group(1)
                        self.stdout.write(f"Found date in title: {date_text}")
                        try:
                            chart_date = datetime.strptime(date_text, '%B %d, %Y').strftime('%Y-%m-%d')
                            self.stdout.write(f"Successfully parsed date from title: {chart_date}")
                        except ValueError:
                            self.stdout.write(f"Could not parse date from title: {date_text}")
            
            # If we still couldn't extract date, try other selectors
            if not chart_date:
                # Try different selectors for the date element
                date_element = None
                selectors = [
                    'button.date-selector__button',
                    'span.c-label.u-font-size-14',
                    'p.c-tagline',
                    'span.date-selector__button',
                    'h2.c-title.a-font-primary-l'
                ]
                
                for selector in selectors:
                    date_element = soup.select_one(selector)
                    if date_element:
                        self.stdout.write(f"Found date element with selector: {selector}")
                        date_text = date_element.text.strip()
                        self.stdout.write(f"Found date text: {date_text}")
                        
                        # Try to extract date from text
                        date_match = re.search(r'([A-Za-z]+\s+\d{1,2},\s+\d{4})', date_text)
                        if date_match:
                            date_text = date_match.group(1)
                            self.stdout.write(f"Extracted date from text: {date_text}")
                            try:
                                chart_date = datetime.strptime(date_text, '%B %d, %Y').strftime('%Y-%m-%d')
                                self.stdout.write(f"Successfully parsed date: {chart_date}")
                                break
                            except ValueError:
                                pass
            
            # If we still couldn't find the date, use the current date
            if not chart_date:
                # If we still can't find the date, print the HTML for debugging
                self.stdout.write(self.style.WARNING("Could not find chart date with any method"))
                
                # As a fallback, use the current date
                self.stdout.write(self.style.WARNING("Using current date as fallback"))
                chart_date = datetime.now().strftime('%Y-%m-%d')
            
            # Extract song data
            songs = []
            
            # Try different selectors for chart items
            chart_item_selectors = [
                'div.o-chart-results-list-row-container',
                'li.chart-list__element',
                'div.chart-list-item',
                'article.chart-row'
            ]
            
            chart_items = []
            for selector in chart_item_selectors:
                chart_items = soup.select(selector)
                if chart_items:
                    self.stdout.write(f"Found chart items with selector: {selector}")
                    break
            
            if not chart_items:
                self.stdout.write(self.style.WARNING("Could not find any chart items"))
                # Print a sample of the HTML for debugging
                self.stdout.write("HTML snippet of the page:")
                self.stdout.write(str(soup.select('main')[:1000]) if soup.select('main') else "No main content found")
                return {
                    'chart_date': chart_date,
                    'songs': []
                }
            
            self.stdout.write(f"Found {len(chart_items)} chart items")
            
            # Title and artist selectors to try
            title_selectors = [
                'h3#title-of-a-story',
                'span.chart-element__information__song',
                'h3.c-title',
                '.chart-row__song'
            ]
            
            artist_selectors = [
                'span.c-label.a-font-primary-s',
                'span.chart-element__information__artist',
                'span.c-label',
                '.chart-row__artist'
            ]
            
            for idx, item in enumerate(chart_items):
                try:
                    # Current rank is idx + 1
                    rank = idx + 1
                    
                    # Extract title
                    title = None
                    for selector in title_selectors:
                        title_element = item.select_one(selector)
                        if title_element:
                            title = title_element.text.strip()
                            break
                    
                    if not title:
                        self.stdout.write(f"Could not find title for item {idx + 1}")
                        continue
                    
                    # Extract artist
                    artist = None
                    for selector in artist_selectors:
                        artist_element = item.select_one(selector)
                        if artist_element:
                            artist = artist_element.text.strip()
                            break
                    
                    if not artist:
                        self.stdout.write(f"Could not find artist for item {idx + 1}")
                        continue
                    
                    # Extract last week's rank, peak rank, and weeks on chart
                    # These might be in different positions depending on the page structure
                    stats_selectors = [
                        '.o-chart-results-list__item span',
                        '.chart-element__meta',
                        '.chart-row__value'
                    ]
                    
                    stats_elements = []
                    for selector in stats_selectors:
                        elements = item.select(selector)
                        if elements:
                            stats_elements = elements
                            break
                    
                    last_week_rank = None
                    peak_rank = None
                    weeks_on_chart = None
                    
                    # Try to extract stats based on position or labels
                    if stats_elements:
                        # If we have at least 3 elements, assume they are last week, peak, and weeks
                        if len(stats_elements) >= 3:
                            # Last week's rank
                            last_week_text = stats_elements[0].text.strip()
                            if last_week_text != '-' and last_week_text.isdigit():
                                last_week_rank = int(last_week_text)
                            
                            # Peak rank
                            peak_text = stats_elements[1].text.strip()
                            if peak_text.isdigit():
                                peak_rank = int(peak_text)
                            
                            # Weeks on chart
                            weeks_text = stats_elements[2].text.strip()
                            if weeks_text.isdigit():
                                weeks_on_chart = int(weeks_text)
                    
                    # Extract image URL
                    image_url = None
                    image_selectors = ['img.c-lazy-image__img', 'img.chart-element__image', 'img']
                    for selector in image_selectors:
                        image_element = item.select_one(selector)
                        if image_element:
                            # Try different attributes for the image URL
                            for attr in ['data-lazy-src', 'src', 'data-src']:
                                if image_element.get(attr):
                                    image_url = image_element.get(attr)
                                    break
                            if image_url:
                                break
                    
                    # Add song to list
                    songs.append({
                        'title': title,
                        'artist': artist,
                        'rank': rank,
                        'last_week_rank': last_week_rank,
                        'peak_rank': peak_rank or rank,  # Use current rank if peak not available
                        'weeks_on_chart': weeks_on_chart or 1,  # Default to 1 if not available
                        'image_url': image_url
                    })
                    
                    # Print the first few songs for debugging
                    if idx < 5:
                        self.stdout.write(f"Extracted song {idx + 1}: {title} by {artist}")
                    
                except Exception as e:
                    self.stdout.write(self.style.WARNING(f"Error processing chart item {idx + 1}: {e}"))
            
            return {
                'chart_date': chart_date,
                'songs': songs
            }
            
        except requests.exceptions.RequestException as e:
            self.stdout.write(self.style.ERROR(f"Error fetching Billboard Hot 100 chart: {e}"))
            return None
    
    def is_chart_up_to_date(self, chart_date):
        """Check if we already have data for this chart date."""
        # Get the most recent song in the database
        latest_song = Song.objects.order_by('-year').first()
        
        if not latest_song:
            return False
        
        # Parse chart date
        chart_year = int(chart_date.split('-')[0])
        
        # If the chart year is newer than our latest song, we need to update
        if chart_year > latest_song.year:
            return False
        
        # If it's the same year, we'll assume we're up to date if we have songs from this year
        # This is a simplification - in a real system, you might want to store the exact chart date
        return True
    
    def preview_data(self, chart_data):
        """Display a preview of the data that would be imported."""
        self.stdout.write("\n=== DATA PREVIEW ===\n")
        
        songs = chart_data['songs']
        chart_date = chart_data['chart_date']
        
        self.stdout.write(f"Chart Date: {chart_date}")
        self.stdout.write(f"Total Songs: {len(songs)}")
        
        # Count songs by peak position range
        position_ranges = {
            '1': 0,
            '2-10': 0,
            '11-50': 0,
            '51-100': 0
        }
        
        for song in songs:
            peak = song['peak_rank']
            if peak == 1:
                position_ranges['1'] += 1
            elif 2 <= peak <= 10:
                position_ranges['2-10'] += 1
            elif 11 <= peak <= 50:
                position_ranges['11-50'] += 1
            else:
                position_ranges['51-100'] += 1
        
        self.stdout.write("\nSongs by Peak Position:")
        self.stdout.write(f"  #1 Hits: {position_ranges['1']} songs")
        self.stdout.write(f"  #2-10: {position_ranges['2-10']} songs")
        self.stdout.write(f"  #11-50: {position_ranges['11-50']} songs")
        self.stdout.write(f"  #51-100: {position_ranges['51-100']} songs")
        
        # Show sample of songs
        self.stdout.write("\nSample of Songs (first 10):")
        for i, song in enumerate(songs[:10]):
            self.stdout.write(
                f"  {i+1}. {song['title']} by {song['artist']} "
                f"(Current: #{song['rank']}, Peak: #{song['peak_rank']}, "
                f"Weeks: {song['weeks_on_chart']})"
            )
        
        self.stdout.write(self.style.SUCCESS(
            f"\nTotal: {len(songs)} songs would be processed."
        ))
        self.stdout.write(self.style.SUCCESS(
            "Run without --dry-run to update the database."
        ))
    
    def test_enhancement(self):
        """Test the enhancement process by clearing and re-adding Spotify URLs and descriptions."""
        self.stdout.write("\n=== TESTING ENHANCEMENT PROCESS ===\n")
        
        # Get the most recent songs in the database (limit to 10 for testing)
        recent_songs = Song.objects.order_by('-id')[:10]
        
        if not recent_songs:
            self.stdout.write(self.style.ERROR("No songs found in the database. Please add songs first."))
            return
        
        self.stdout.write(f"Found {recent_songs.count()} recent songs to test")
        
        # Clear Spotify URLs and descriptions for these songs
        songs_cleared = 0
        song_ids = []
        
        for song in recent_songs:
            song.spotify_url = ''
            song.review = ''
            song.save()
            songs_cleared += 1
            song_ids.append(song.id)
        
        self.stdout.write(self.style.SUCCESS(f"Cleared Spotify URLs and descriptions for {songs_cleared} songs"))
        
        # Get the chart date from the most recent song
        chart_date = f"{recent_songs[0].year}-01-01"  # Use January 1st of the year as a placeholder
        
        # Run the enhancement process with specific song IDs
        self.run_additional_scripts(chart_date, song_ids)
        
        self.stdout.write("\n=== ENHANCEMENT TEST COMPLETED ===\n")
    
    def update_database(self, chart_data):
        """Update the database with the chart data."""
        self.stdout.write("\n=== UPDATING DATABASE ===\n")
        
        songs = chart_data['songs']
        chart_date = chart_data['chart_date']
        chart_year = int(chart_date.split('-')[0])
        
        self.stdout.write(f"Processing {len(songs)} songs from chart dated {chart_date}")
        
        songs_created = 0
        songs_updated = 0
        songs_skipped = 0
        updated_song_ids = []  # Track IDs of created/updated songs
        
        for song_data in songs:
            # Generate the slug
            slug = slugify(f"{song_data['artist']} {song_data['title']}")
            artist_slug = slugify(song_data['artist'])
            
            # Check if a song with this slug already exists
            existing_song = Song.objects.filter(slug=slug).first()
            
            # Also try checking by title and artist directly
            if not existing_song:
                existing_song = Song.objects.filter(title=song_data['title'], artist=song_data['artist']).first()
            
            if existing_song:
                # If the song exists, check if we need to update its peak position or weeks on chart
                updated = False
                
                # Update peak position if the new one is better (lower)
                if song_data['peak_rank'] < existing_song.peak_rank:
                    existing_song.peak_rank = song_data['peak_rank']
                    updated = True
                
                # Update weeks on chart if the new one is better (higher)
                if song_data['weeks_on_chart'] > existing_song.weeks_on_chart:
                    existing_song.weeks_on_chart = song_data['weeks_on_chart']
                    updated = True
                
                if updated:
                    with transaction.atomic():
                        existing_song.save()
                        songs_updated += 1
                        updated_song_ids.append(existing_song.id)  # Add to list of updated songs
                        self.stdout.write(f"Updated existing song: '{song_data['title']}' by {song_data['artist']}")
                else:
                    songs_skipped += 1
                    # Add debug info for skipped songs
                    if songs_skipped <= 5:  # Only show first 5 to avoid flooding the output
                        self.stdout.write(f"Skipped existing song: '{song_data['title']}' by {song_data['artist']} (slug: {slug})")
            else:
                # Create the song
                try:
                    # Double-check that the song doesn't exist
                    count = Song.objects.filter(
                        title__iexact=song_data['title'],
                        artist__iexact=song_data['artist']
                    ).count()
                    
                    if count > 0:
                        self.stdout.write(self.style.WARNING(
                            f"Found {count} songs with title='{song_data['title']}', artist='{song_data['artist']}' "
                            f"but slug '{slug}' not found. Skipping to avoid duplicates."
                        ))
                        songs_skipped += 1
                    else:
                        with transaction.atomic():
                            new_song = Song.objects.create(
                                title=song_data['title'],
                                artist=song_data['artist'],
                                year=chart_year,
                                peak_rank=song_data['peak_rank'],
                                weeks_on_chart=song_data['weeks_on_chart'],
                                slug=slug,
                                artist_slug=artist_slug
                            )
                            songs_created += 1
                            updated_song_ids.append(new_song.id)  # Add to list of created songs
                            self.stdout.write(f"Created new song: '{song_data['title']}' by {song_data['artist']}")
                except Exception as e:
                    self.stdout.write(self.style.WARNING(f"Error creating song: {e}"))
        
        self.stdout.write(self.style.SUCCESS(
            f"Successfully processed {len(songs)} songs. "
            f"Created {songs_created} new songs. "
            f"Updated {songs_updated} existing songs. "
            f"Skipped {songs_skipped} unchanged songs."
        ))
        
        # If we created or updated any songs, run the additional scripts
        if songs_created > 0 or songs_updated > 0:
            self.run_additional_scripts(chart_date, updated_song_ids)
        
        # Update NumberOneSong model if there are any #1 hits
        if any(song['peak_rank'] == 1 for song in songs):
            self.stdout.write("Updating NumberOneSong model...")
            self.update_number_one_songs()
    
    def run_additional_scripts(self, chart_date, updated_song_ids=None):
        """Enhance newly added or updated songs with Spotify URLs and descriptions."""
        self.stdout.write("\n=== ENHANCING UPDATED SONGS ===\n")
        
        # If we have specific song IDs, use those
        if updated_song_ids and len(updated_song_ids) > 0:
            songs_to_enhance = Song.objects.filter(id__in=updated_song_ids)
            self.stdout.write(f"Enhancing {len(updated_song_ids)} songs that were just created or updated")
        else:
            # Otherwise, use songs from the chart date
            chart_year = int(chart_date.split('-')[0])
            self.stdout.write(f"No specific songs to enhance, using all songs from {chart_year}")
            songs_to_enhance = Song.objects.filter(year=chart_year)
        
        songs_without_spotify = songs_to_enhance.filter(spotify_url__isnull=True) | songs_to_enhance.filter(spotify_url='')
        songs_without_description = songs_to_enhance.filter(review='')
        
        self.stdout.write(f"Found {songs_to_enhance.count()} songs to enhance")
        self.stdout.write(f"Songs without Spotify URLs: {songs_without_spotify.count()}")
        self.stdout.write(f"Songs without descriptions: {songs_without_description.count()}")
        
        # Add Spotify URLs
        if songs_without_spotify.count() > 0:
            self.stdout.write("\nAdding Spotify URLs...")
            spotify_access_token = self.get_spotify_access_token()
            
            if spotify_access_token:
                spotify_urls_added = 0
                
                for song in songs_without_spotify:
                    spotify_url = self.search_spotify(song.title, song.artist, spotify_access_token)
                    if spotify_url:
                        song.spotify_url = spotify_url
                        song.save()
                        spotify_urls_added += 1
                        self.stdout.write(f"Added Spotify URL for '{song.title}' by {song.artist}: {spotify_url}")
                
                self.stdout.write(self.style.SUCCESS(f"Added {spotify_urls_added} Spotify URLs"))
            else:
                self.stdout.write(self.style.ERROR("Failed to get Spotify access token"))
        
        # Add descriptions using OpenAI
        if songs_without_description.count() > 0:
            self.stdout.write("\nAdding descriptions...")
            
            try:
                # Check if OpenAI API key is available
                import os
                import openai
                from dotenv import load_dotenv
                
                load_dotenv()
                openai.api_key = os.environ.get('OPENAI_KEY')
                
                if not openai.api_key:
                    self.stdout.write(self.style.ERROR("OpenAI API key not found in environment variables"))
                else:
                    descriptions_added = 0
                    
                    for song in songs_without_description:
                        try:
                            description = self.generate_song_description(
                                song.title,
                                song.artist,
                                song.year,
                                song.peak_rank
                            )
                            
                            if description:
                                song.review = description
                                song.save()
                                descriptions_added += 1
                                self.stdout.write(f"Added description for '{song.title}' by {song.artist}")
                        except Exception as e:
                            self.stdout.write(self.style.WARNING(f"Error generating description for '{song.title}' by {song.artist}: {e}"))
                    
                    self.stdout.write(self.style.SUCCESS(f"Added {descriptions_added} descriptions"))
            except ImportError:
                self.stdout.write(self.style.ERROR("OpenAI package not installed. Install with: pip install openai"))
    
    def get_spotify_access_token(self):
        """Get Spotify API access token using client credentials."""
        import os
        import requests
        from dotenv import load_dotenv
        
        # Get Spotify credentials from environment variables
        load_dotenv()
        client_id = os.environ.get('SPOTIFY_CLIENT_ID')
        client_secret = os.environ.get('SPOTIFY_CLIENT_SECRET')
        
        if not client_id or not client_secret:
            self.stdout.write(self.style.WARNING("Spotify credentials not found in environment variables"))
            return None
        
        # Spotify Accounts service endpoint for obtaining access tokens
        token_url = 'https://accounts.spotify.com/api/token'
        
        # Request body parameters for authentication
        auth_params = {
            'grant_type': 'client_credentials',
            'client_id': client_id,
            'client_secret': client_secret
        }
        
        # Make a POST request to the token endpoint to authenticate the application
        response = requests.post(token_url, data=auth_params)
        
        # Check if the request was successful
        if response.status_code == 200:
            # Parse the JSON response to extract the access token
            access_token = response.json()['access_token']
            return access_token
        else:
            self.stdout.write(self.style.ERROR(f"Error getting Spotify access token: {response.status_code}, {response.text}"))
            return None
    
    def search_spotify(self, title, artist, access_token):
        """Search for a song on Spotify and return the URL if found."""
        import requests
        from fuzzywuzzy import fuzz
        
        if not access_token:
            return None
        
        # Construct the search string
        search_string = f'{title} {artist}'
        
        # Make a request to the Spotify API to search for the song
        headers = {'Authorization': f'Bearer {access_token}'}
        search_params = {'q': search_string, 'type': 'track', 'market': 'US'}
        
        search_response = requests.get('https://api.spotify.com/v1/search', headers=headers, params=search_params)
        
        # Check if the request was successful
        if search_response.status_code == 200:
            # Parse the JSON response to extract the Spotify URL
            search_data = search_response.json()
            if 'tracks' in search_data and search_data['tracks']['items']:
                # Assuming the first item is the most relevant
                first_track = search_data['tracks']['items'][0]
                if first_track is not None:
                    # Calculate similarity scores for title and artist
                    title_similarity = fuzz.partial_ratio(title.lower(), first_track['name'].lower())
                    artist_similarity = fuzz.partial_ratio(artist.lower(), first_track['artists'][0]['name'].lower())
                    
                    # Check if similarity scores are above a certain threshold
                    if title_similarity >= 85 and artist_similarity >= 85:
                        spotify_url = first_track['external_urls']['spotify']
                        return spotify_url
                    else:
                        self.stdout.write(f"Match not strong enough for: {title} - {artist}. "
                                         f"Title similarity: {title_similarity}, Artist similarity: {artist_similarity}")
                        return ""
            
            self.stdout.write(f"No Spotify track found for: {title} - {artist}")
            return ""
        else:
            self.stdout.write(self.style.ERROR(
                f"Error searching for song: {search_response.status_code}, {search_response.text}"
            ))
            return None
    
    def generate_song_description(self, title, artist, year, peak_rank):
        """Generate a description for a song using OpenAI."""
        import openai
        
        try:
            # For top 10 hits, generate both song info and artist bio
            if peak_rank <= 10:
                prompt = f"""Write about the song "{title}" by {artist} from {year} that reached #{peak_rank} on the Billboard Hot 100 chart.
                
                First section should be about the song itself, labeled "Song Info:" in bold and should include details about the song's release, chart performance, and cultural impact.
                
                Second section should be about the artist, labeled "Artist Bio:" in bold and should include a biography of the artist in a single paragraph.
                
                Format exactly as shown below with proper HTML formatting:
                
                <strong>Song Info:</strong><br>
                <p>[One paragraph about the song, 4-6 sentences]</p>
                <br>
                <strong>Artist Bio:</strong><br>
                <p>[One paragraph about the artist, 6-8 sentences]</p>"""
            else:
                # For non-top 10 hits, generate only artist bio with two paragraphs
                prompt = f"""Write about the artist {artist} who had a song "{title}" that reached #{peak_rank} on the Billboard Hot 100 chart in {year}.
                
                The section should be labeled "Artist Bio:" in bold and should include a biography of the artist split into two paragraphs.
                
                Format exactly as shown below with proper HTML formatting:
                
                <strong>Artist Bio:</strong><br>
                <p>[First paragraph about the artist, 3-4 sentences]</p>
                
                <p>[Second paragraph about the artist, 3-4 sentences]</p>"""
            
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a music historian who writes concise, informative paragraphs about songs and artists."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=500,
                temperature=0.7
            )
            
            description = response.choices[0].message['content'].strip()
            return description
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error generating description with OpenAI: {e}"))
            # Return a default description
            if peak_rank <= 10:
                return f"""<strong>Song Info:</strong><br>
<p>Information about "{title}" by {artist} is currently unavailable.</p>
<br>
<strong>Artist Bio:</strong><br>
<p>Information about {artist} is currently unavailable.</p>"""
            else:
                return f"""<strong>Artist Bio:</strong><br>
<p>Information about {artist} is currently unavailable.</p>"""
    
    def update_number_one_songs(self):
        """Update the NumberOneSong model with any new #1 hits."""
        # Clear existing entries
        self.stdout.write('Clearing existing NumberOneSong entries...')
        NumberOneSong.objects.all().delete()
        
        # Fetch all songs that reached #1
        number_one_songs = Song.objects.filter(peak_rank=1).order_by('-year')
        total_songs = number_one_songs.count()
        
        self.stdout.write(f'Found {total_songs} number one songs to process...')
        
        # Create new NumberOneSong entries
        created_count = 0
        for song in number_one_songs:
            try:
                with transaction.atomic():
                    NumberOneSong.objects.create(
                        title=song.title,
                        artist=song.artist,
                        year=song.year,
                        peak_rank=song.peak_rank,
                        weeks_on_chart=song.weeks_on_chart,
                        average_user_score=song.average_user_score,
                        total_ratings=song.total_ratings,
                        spotify_url=song.spotify_url,
                        youtube_url=song.youtube_url,
                        slug=song.slug,
                        artist_slug=song.artist_slug
                    )
                    created_count += 1
            except Exception as e:
                self.stdout.write(self.style.WARNING(f"Error creating NumberOneSong for '{song.title}' by {song.artist}: {e}"))
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully populated NumberOneSong table with {created_count} songs'
            )
        )
