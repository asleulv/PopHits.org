import json
import requests
import os
import openai
from datetime import datetime
from django.core.management.base import BaseCommand
from django.db import transaction
from songs.models import Song, SongTimeline
from fuzzywuzzy import fuzz
from dotenv import load_dotenv


class Command(BaseCommand):
    help = 'Import Billboard Hot 100 data from 2009 onwards'
    
    def add_arguments(self, parser):
        parser.add_argument('--dry-run', action='store_true', help='Preview data without importing')
        parser.add_argument('--import', action='store_true', help='Import data to database')
        parser.add_argument('--limit', type=int, help='Limit number of weeks to process (for testing)')
        parser.add_argument('--start-year', type=int, default=2009, help='Start year for importing data (default: 2009)')
        parser.add_argument('--spotify', action='store_true', help='Add Spotify URLs for imported songs')
        parser.add_argument('--openai', action='store_true', help='Generate song and artist descriptions using OpenAI')
        parser.add_argument('--force-update', action='store_true', help='Force update of descriptions for songs that already have them')
    
    def handle(self, *args, **options):
        dry_run = options['dry_run']
        do_import = options['import']
        limit = options.get('limit')
        start_year = options.get('start_year', 2009)
        add_spotify = options.get('spotify', False)
        add_openai = options.get('openai', False)
        force_update = options.get('force_update', False)
        
        if not (dry_run or do_import):
            self.stdout.write(self.style.ERROR('Please specify either --dry-run or --import'))
            return
        
        self.stdout.write(self.style.SUCCESS(f"{'Preview' if dry_run else 'Import'} mode activated"))
        self.stdout.write(f"Processing data from {start_year} onwards")
        
        if add_spotify:
            self.stdout.write(self.style.SUCCESS("Spotify integration enabled - will search for Spotify URLs"))
        
        if add_openai:
            self.stdout.write(self.style.SUCCESS("OpenAI integration enabled - will generate song and artist descriptions"))
            # Initialize OpenAI API
            load_dotenv()
            openai.api_key = os.environ.get('OPENAI_KEY')
            if not openai.api_key:
                self.stdout.write(self.style.ERROR("OpenAI API key not found in environment variables. Disabling OpenAI integration."))
                add_openai = False
        
        # URL for the Billboard Hot 100 data
        url = "https://raw.githubusercontent.com/mhollingshead/billboard-hot-100/main/all.json"
        
        try:
            self.stdout.write("Fetching data from GitHub...")
            response = requests.get(url, stream=True)
            response.raise_for_status()  # Raise an exception for HTTP errors
            
            # Process the data
            self.process_data(response, dry_run, do_import, limit, start_year, add_spotify, add_openai, force_update)
            
        except requests.exceptions.RequestException as e:
            self.stdout.write(self.style.ERROR(f"Error fetching data: {e}"))
    
    def process_data(self, response, dry_run, do_import, limit, start_year, add_spotify, add_openai, force_update):
        """Process the Billboard Hot 100 data."""
        self.stdout.write("Processing data...")
        
        # Dictionary to track unique songs
        unique_songs = {}
        
        # Dictionary to store timeline data for each song
        song_timeline_data = {}
        
        # Load and parse the JSON data
        try:
            # Read the response content in chunks to avoid memory issues
            chunks = []
            for chunk in response.iter_content(chunk_size=1024*1024):  # 1MB chunks
                if chunk:
                    chunks.append(chunk)
            
            data_str = b''.join(chunks).decode('utf-8')
            all_weeks = json.loads(data_str)
            
            self.stdout.write(f"Successfully loaded JSON data. Processing {len(all_weeks)} weeks...")
            
            # Filter weeks by year before applying limit
            filtered_weeks = []
            for week_data in all_weeks:
                date_str = week_data.get('date')
                if not date_str:
                    continue
                
                try:
                    date = datetime.strptime(date_str, '%Y-%m-%d')
                    if date.year >= start_year:
                        filtered_weeks.append(week_data)
                except ValueError:
                    self.stdout.write(self.style.WARNING(f"Invalid date format: {date_str}"))
            
            self.stdout.write(f"Filtered to {len(filtered_weeks)} weeks from {start_year} onwards")
            
            # Apply limit if specified
            if limit:
                filtered_weeks = filtered_weeks[:limit]
                self.stdout.write(f"Limited to {limit} weeks for testing")
            
            # Process each week
            weeks_processed = 0
            songs_found = 0
            
            for week_data in filtered_weeks:
                # Parse the date and process this week's chart
                date_str = week_data.get('date')
                date = datetime.strptime(date_str, '%Y-%m-%d')
                
                # Process this week's chart
                chart_data = week_data.get('data', [])
                for entry in chart_data:
                    songs_found += 1
                    
                    # Extract song data
                    title = entry.get('song', '')
                    artist = entry.get('artist', '')
                    this_week = entry.get('this_week')
                    peak_position = entry.get('peak_position')
                    weeks_on_chart = entry.get('weeks_on_chart')
                    
                    # Skip if missing essential data
                    if not title or not artist or peak_position is None:
                        continue
                    
                    # Create a unique key for this song
                    song_key = f"{title.lower()}|{artist.lower()}"
                    
                    # Update or create entry in our tracking dictionary
                    if song_key in unique_songs:
                        # Update peak position (lower is better)
                        if peak_position < unique_songs[song_key]['peak_position']:
                            unique_songs[song_key]['peak_position'] = peak_position
                        
                        # Update weeks on chart (higher is better)
                        if weeks_on_chart > unique_songs[song_key]['weeks_on_chart']:
                            unique_songs[song_key]['weeks_on_chart'] = weeks_on_chart
                    else:
                        # Add new song to our tracking
                        unique_songs[song_key] = {
                            'title': title,
                            'artist': artist,
                            'year': date.year,
                            'peak_position': peak_position,
                            'weeks_on_chart': weeks_on_chart
                        }
                    
                    # Store timeline entry for this song
                    if song_key not in song_timeline_data:
                        song_timeline_data[song_key] = []
                    
                    song_timeline_data[song_key].append({
                        'chart_date': date,
                        'rank': this_week if this_week else peak_position,
                        'peak_rank': peak_position,
                        'weeks_on_chart': weeks_on_chart
                    })
                
                weeks_processed += 1
                if weeks_processed % 50 == 0:
                    self.stdout.write(f"Processed {weeks_processed} weeks, found {len(unique_songs)} unique songs...")
            
            self.stdout.write(self.style.SUCCESS(
                f"Finished processing {weeks_processed} weeks. "
                f"Found {songs_found} total entries and {len(unique_songs)} unique songs."
            ))
            
            # Display preview or import the data
            if dry_run:
                self.preview_data(unique_songs)
            elif do_import:
                self.import_data(unique_songs, song_timeline_data, add_spotify, add_openai, force_update)
        
        except json.JSONDecodeError as e:
            self.stdout.write(self.style.ERROR(f"Error parsing JSON: {e}"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Unexpected error: {e}"))
    
    def preview_data(self, unique_songs):
        """Display a preview of the data that would be imported."""
        self.stdout.write("\n=== DATA PREVIEW ===\n")
        
        # Count songs by year
        songs_by_year = {}
        for song_data in unique_songs.values():
            year = song_data['year']
            songs_by_year[year] = songs_by_year.get(year, 0) + 1
        
        self.stdout.write("Songs by Year:")
        for year in sorted(songs_by_year.keys()):
            self.stdout.write(f"  {year}: {songs_by_year[year]} songs")
        
        # Count songs by peak position range
        position_ranges = {
            '1': 0,
            '2-10': 0,
            '11-50': 0,
            '51-100': 0
        }
        
        for song_data in unique_songs.values():
            peak = song_data['peak_position']
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
        self.stdout.write("\nSample of Songs to Import (first 10):")
        for i, song_data in enumerate(list(unique_songs.values())[:10]):
            self.stdout.write(
                f"  {i+1}. {song_data['title']} by {song_data['artist']} "
                f"(Year: {song_data['year']}, Peak: #{song_data['peak_position']}, "
                f"Weeks: {song_data['weeks_on_chart']})"
            )
        
        self.stdout.write(self.style.SUCCESS(
            f"\nTotal: {len(unique_songs)} unique songs would be imported."
        ))
        self.stdout.write(self.style.SUCCESS(
            "Run with --import to add these songs to the database."
        ))
    
    def get_spotify_access_token(self):
        """Get Spotify API access token using client credentials."""
        # Get Spotify credentials from environment variables
        client_id = os.environ.get('SPOTIFY_CLIENT_ID')
        client_secret = os.environ.get('SPOTIFY_CLIENT_SECRET')
        
        if not client_id or not client_secret:
            self.stdout.write(self.style.WARNING(
                "Spotify credentials not found in environment variables. "
                "Using default credentials from .env file."
            ))
            # Use default credentials from .env file
            load_dotenv()
            client_id = os.environ.get('SPOTIFY_CLIENT_ID')
            client_secret = os.environ.get('SPOTIFY_CLIENT_SECRET')
        
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
    
    def import_data(self, unique_songs, song_timeline_data, add_spotify=False, add_openai=False, force_update=False):
        """Import the processed data into the database."""
        self.stdout.write("\n=== IMPORTING DATA ===\n")
        
        # Count existing songs
        existing_count = Song.objects.count()
        self.stdout.write(f"Current song count in database: {existing_count}")
        
        # Get Spotify access token if needed
        spotify_access_token = None
        if add_spotify:
            self.stdout.write("Getting Spotify access token...")
            spotify_access_token = self.get_spotify_access_token()
            if spotify_access_token:
                self.stdout.write(self.style.SUCCESS("Successfully obtained Spotify access token"))
            else:
                self.stdout.write(self.style.ERROR("Failed to get Spotify access token. Continuing without Spotify integration."))
                add_spotify = False
        
        # Import songs one by one to ensure save() method is called for slug generation
        songs_created = 0
        songs_skipped = 0
        songs_updated = 0
        spotify_urls_added = 0
        descriptions_added = 0
        timeline_entries_created = 0
        timeline_entries_updated = 0
        
        for song_key, song_data in unique_songs.items():
            # Generate the slug manually
            from django.utils.text import slugify
            slug = slugify(f"{song_data['artist']} {song_data['title']}")
            artist_slug = slugify(song_data['artist'])
            
            # Check if a song with this slug already exists
            existing_song = Song.objects.filter(slug=slug).first()
            
            if existing_song:
                # If the song exists, check if we need to update its peak position or weeks on chart
                updated = False
                
                # Update peak position if the new one is better (lower)
                self.stdout.write(f"Checking '{song_data['title']}' by {song_data['artist']}: New peak: {song_data['peak_position']}, Existing peak: {existing_song.peak_rank}")
                if song_data['peak_position'] < existing_song.peak_rank:
                    old_rank = existing_song.peak_rank
                    existing_song.peak_rank = song_data['peak_position']
                    updated = True
                    self.stdout.write(self.style.SUCCESS(f"Updating peak rank for '{song_data['title']}' by {song_data['artist']} from {old_rank} to {song_data['peak_position']}"))
                
                # Update weeks on chart if the new one is better (higher)
                if song_data['weeks_on_chart'] > existing_song.weeks_on_chart:
                    existing_song.weeks_on_chart = song_data['weeks_on_chart']
                    updated = True
                
                # Add Spotify URL if enabled and not already set
                if add_spotify and (not existing_song.spotify_url or existing_song.spotify_url == ""):
                    spotify_url = self.search_spotify(song_data['title'], song_data['artist'], spotify_access_token)
                    if spotify_url:
                        existing_song.spotify_url = spotify_url
                        updated = True
                        spotify_urls_added += 1
                        self.stdout.write(self.style.SUCCESS(f"Added Spotify URL for '{song_data['title']}' by {song_data['artist']}: {spotify_url}"))
                
                # Add description if enabled and (not already set or force update is enabled)
                if add_openai and (not existing_song.review or existing_song.review == "" or force_update):
                    self.stdout.write(f"Generating description for '{song_data['title']}' by {song_data['artist']}...")
                    
                    # Use the better (lower) peak position between the database and the new data
                    effective_peak = min(song_data['peak_position'], existing_song.peak_rank)
                    self.stdout.write(f"Using effective peak position: #{effective_peak} for description generation")
                    
                    description = self.generate_song_description(
                        song_data['title'],
                        song_data['artist'],
                        song_data['year'],
                        effective_peak
                    )
                    if description:
                        # Debug output to check the description format
                        self.stdout.write(f"Generated description for '{song_data['title']}' by {song_data['artist']} (Peak: #{song_data['peak_position']}):")
                        self.stdout.write(description)
                        
                        existing_song.review = description
                        updated = True
                        descriptions_added += 1
                        self.stdout.write(self.style.SUCCESS(f"Added description for '{song_data['title']}' by {song_data['artist']}"))
                
                if updated:
                    with transaction.atomic():
                        existing_song.save()
                        songs_updated += 1
                        self.stdout.write(f"Updated existing song: '{song_data['title']}' by {song_data['artist']}")
                
                # Update or create timeline entries for existing song
                if song_key in song_timeline_data:
                    for timeline_entry in song_timeline_data[song_key]:
                        timeline_obj, created = SongTimeline.objects.get_or_create(
                            song=existing_song,
                            chart_date=timeline_entry['chart_date'],
                            defaults={
                                'rank': timeline_entry['rank'],
                                'peak_rank': timeline_entry['peak_rank'],
                                'weeks_on_chart': timeline_entry['weeks_on_chart']
                            }
                        )
                        if created:
                            timeline_entries_created += 1
                        else:
                            # Update if rank changed
                            entry_updated = False
                            if timeline_obj.rank != timeline_entry['rank']:
                                timeline_obj.rank = timeline_entry['rank']
                                entry_updated = True
                            if timeline_obj.weeks_on_chart != timeline_entry['weeks_on_chart']:
                                timeline_obj.weeks_on_chart = timeline_entry['weeks_on_chart']
                                entry_updated = True
                            if entry_updated:
                                timeline_obj.save()
                                timeline_entries_updated += 1
                
                songs_skipped += 1
                if songs_skipped % 100 == 0:
                    self.stdout.write(f"Processed {songs_skipped} existing songs...")
                continue
            
            # Create the song
            try:
                # Check if we should add a Spotify URL
                spotify_url = None
                if add_spotify:
                    spotify_url = self.search_spotify(song_data['title'], song_data['artist'], spotify_access_token)
                    if spotify_url:
                        spotify_urls_added += 1
                        self.stdout.write(self.style.SUCCESS(f"Added Spotify URL for new song '{song_data['title']}' by {song_data['artist']}: {spotify_url}"))
                
                # Generate description if enabled
                description = ""
                if add_openai:
                    self.stdout.write(f"Generating description for new song '{song_data['title']}' by {song_data['artist']}...")
                    description = self.generate_song_description(
                        song_data['title'],
                        song_data['artist'],
                        song_data['year'],
                        song_data['peak_position']
                    )
                    if description:
                        descriptions_added += 1
                        self.stdout.write(self.style.SUCCESS(f"Generated description for new song '{song_data['title']}' by {song_data['artist']}"))
                
                # Create the song
                with transaction.atomic():
                    new_song = Song.objects.create(
                        title=song_data['title'],
                        artist=song_data['artist'],
                        year=song_data['year'],
                        peak_rank=song_data['peak_position'],
                        weeks_on_chart=song_data['weeks_on_chart'],
                        slug=slug,
                        artist_slug=artist_slug,
                        spotify_url=spotify_url or "",
                        review=description
                    )
                    songs_created += 1
                    
                    # Create timeline entries for new song
                    if song_key in song_timeline_data:
                        for timeline_entry in song_timeline_data[song_key]:
                            SongTimeline.objects.create(
                                song=new_song,
                                chart_date=timeline_entry['chart_date'],
                                rank=timeline_entry['rank'],
                                peak_rank=timeline_entry['peak_rank'],
                                weeks_on_chart=timeline_entry['weeks_on_chart']
                            )
                            timeline_entries_created += 1
                
                if songs_created % 100 == 0:
                    self.stdout.write(f"Created {songs_created} new songs...")
            except Exception as e:
                self.stdout.write(self.style.WARNING(f"Error creating song: {e}"))
        
        # Report final counts
        new_count = Song.objects.count()
        imported_count = new_count - existing_count
        
        self.stdout.write(self.style.SUCCESS(
            f"Successfully imported {songs_created} new songs. "
            f"Updated {songs_updated} existing songs. "
            f"Skipped {songs_skipped - songs_updated} unchanged songs. "
            f"New total: {new_count} songs."
        ))
        
        self.stdout.write(self.style.SUCCESS(
            f"Created {timeline_entries_created} timeline entries. "
            f"Updated {timeline_entries_updated} existing timeline entries."
        ))
        
        if add_spotify:
            self.stdout.write(self.style.SUCCESS(
                f"Added {spotify_urls_added} Spotify URLs."
            ))
        
        if add_openai:
            self.stdout.write(self.style.SUCCESS(
                f"Added {descriptions_added} song/artist descriptions."
            ))
        
        self.stdout.write(self.style.SUCCESS(
            "Don't forget to run 'python manage.py populate_number_one_songs' "
            "to update the NumberOneSong model with any new #1 hits."
        ))
