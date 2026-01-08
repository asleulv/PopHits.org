
# Create a dry-run script for fetching original release dates from MusicBrainz
# SCRIPT NOT READY/TESTED
from django.core.management.base import BaseCommand
from songs.models import Song
import musicbrainzngs
import time
from datetime import datetime


class Command(BaseCommand):
    help = 'Fetch original release dates for songs using MusicBrainz (with dry-run mode)'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--limit',
            type=int,
            default=15,
            help='Number of songs to process (default: 15)'
        )
        parser.add_argument(
            '--delay',
            type=float,
            default=1.5,
            help='Delay between requests in seconds (default: 1.5)'
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be updated without saving to database'
        )
        parser.add_argument(
            '--song',
            type=str,
            help='Process specific song by title (partial match)'
        )
    
    def handle(self, *args, **options):
        musicbrainzngs.set_useragent(
            "pophits.org",
            "1.0",
            "pophitsdotorg@gmail.com"
        )
        
        dry_run = options['dry_run']
        
        if dry_run:
            self.stdout.write(
                self.style.WARNING('🔍 DRY RUN MODE - No database changes will be made')
            )
        
        self.stdout.write(
            self.style.SUCCESS(f'\\n🎵 Starting release date enrichment (delay: {options["delay"]}s)...')
        )
        
        # Get songs to process
        if options['song']:
            songs = Song.objects.filter(title__icontains=options['song']).select_related('artist')[:options['limit']]
        else:
            # Get songs without original_release_date field OR just get any songs for testing
            # If the field doesn't exist yet, this will work on all songs
            songs = Song.objects.all().select_related('artist')[:options['limit']]
        
        if not songs.exists():
            self.stdout.write(self.style.WARNING('No songs found'))
            return
        
        self.stdout.write(f'Processing {songs.count()} songs...\\n')
        
        success_count = 0
        no_match_count = 0
        error_count = 0
        results = []
        
        for i, song in enumerate(songs, 1):
            self.stdout.write(f'[{i}/{songs.count()}] {song.artist.name} - {song.title}')
            
            # Show chart year if available
            chart_year = getattr(song, 'year', None)
            if chart_year:
                self.stdout.write(f'  📊 Chart year: {chart_year}')
            
            try:
                result = self.get_original_release_date(song)
                
                if result['found']:
                    earliest_date = result['date']
                    match_info = result['match_info']
                    
                    self.stdout.write(
                        self.style.SUCCESS(f'  ✅ Original release: {earliest_date}')
                    )
                    self.stdout.write(f'     Recording: {match_info["recording_title"]}')
                    self.stdout.write(f'     Artist: {match_info["recording_artist"]}')
                    self.stdout.write(f'     MBID: {match_info["mbid"][:8]}...')
                    self.stdout.write(f'     Found in {match_info["release_count"]} releases')
                    
                    # Show comparison if chart year available
                    if chart_year:
                        year_diff = chart_year - earliest_date.year
                        if year_diff > 0:
                            self.stdout.write(f'     ⏱️  Charted {year_diff} year(s) after release')
                        elif year_diff < 0:
                            self.stdout.write(
                                self.style.WARNING(f'     ⚠️  Chart year ({chart_year}) is BEFORE release date!')
                            )
                        else:
                            self.stdout.write(f'     ✓ Same year as chart entry')
                    
                    if not dry_run:
                        # Only save if not in dry-run mode
                        # song.original_release_date = earliest_date
                        # song.save()
                        self.stdout.write('     💾 Would save to database (disabled in current version)')
                    
                    success_count += 1
                    results.append({
                        'song': f'{song.artist.name} - {song.title}',
                        'date': str(earliest_date),
                        'chart_year': chart_year,
                        'match': match_info
                    })
                else:
                    self.stdout.write(
                        self.style.WARNING(f'  ⚠️  {result["reason"]}')
                    )
                    no_match_count += 1
                    
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'  ❌ Error: {str(e)[:100]}')
                )
                error_count += 1
            
            self.stdout.write('')  # Blank line between songs
            
            # Rate limiting
            if i < songs.count():
                time.sleep(options['delay'])
        
        # Summary
        self.stdout.write('\\n' + '='*70)
        self.stdout.write(self.style.SUCCESS(f'✅ Found release dates: {success_count}'))
        self.stdout.write(self.style.WARNING(f'⚠️  No match found: {no_match_count}'))
        if error_count > 0:
            self.stdout.write(self.style.ERROR(f'❌ Errors: {error_count}'))
        self.stdout.write('='*70)
        
        if dry_run and success_count > 0:
            self.stdout.write('\\n💡 Run without --dry-run to save changes to database')
    
    def get_original_release_date(self, song):
        """Get earliest release date for a song"""
        try:
            # Search for recording
            result = musicbrainzngs.search_recordings(
                artist=song.artist.name,
                recording=song.title,
                limit=20
            )
            
            if not result.get('recording-list'):
                return {'found': False, 'reason': 'No recordings found in MusicBrainz'}
            
            # Find best match (exact title + artist match)
            best_match = None
            for recording in result['recording-list']:
                # Check title match (case-insensitive)
                if recording['title'].lower() != song.title.lower():
                    continue
                
                # Check artist match
                artist_credits = recording.get('artist-credit', [])
                for credit in artist_credits:
                    if isinstance(credit, dict):
                        artist_name = credit.get('artist', {}).get('name', '')
                        if artist_name.lower() == song.artist.name.lower():
                            best_match = recording
                            break
                
                if best_match:
                    break
            
            if not best_match:
                # Show what we found for debugging
                found_titles = [r['title'] for r in result['recording-list'][:3]]
                return {
                    'found': False,
                    'reason': f'No exact match (found: {", ".join(found_titles)})'
                }
            
            # Get all releases for this recording
            recording_detail = musicbrainzngs.get_recording_by_id(
                best_match['id'],
                includes=['releases']
            )
            
            releases = recording_detail.get('recording', {}).get('release-list', [])
            
            if not releases:
                return {'found': False, 'reason': 'Recording found but no releases'}
            
            # Find earliest date
            earliest_date = None
            valid_dates = 0
            
            for release in releases:
                date_str = release.get('date', '')
                if date_str:
                    try:
                        date_obj = self.parse_date(date_str)
                        if date_obj:
                            valid_dates += 1
                            if not earliest_date or date_obj < earliest_date:
                                earliest_date = date_obj
                    except Exception:
                        continue
            
            if not earliest_date:
                return {
                    'found': False,
                    'reason': f'No valid dates in {len(releases)} releases'
                }
            
            # Get artist name from match
            recording_artist = 'Unknown'
            if best_match.get('artist-credit'):
                for credit in best_match['artist-credit']:
                    if isinstance(credit, dict) and 'artist' in credit:
                        recording_artist = credit['artist'].get('name', 'Unknown')
                        break
            
            return {
                'found': True,
                'date': earliest_date,
                'match_info': {
                    'recording_title': best_match['title'],
                    'recording_artist': recording_artist,
                    'mbid': best_match['id'],
                    'release_count': len(releases),
                    'valid_date_count': valid_dates
                }
            }
            
        except Exception as e:
            raise e
    
    def parse_date(self, date_str):
        """Parse MusicBrainz date formats (YYYY, YYYY-MM, YYYY-MM-DD)"""
        try:
            if len(date_str) == 10:  # YYYY-MM-DD
                return datetime.strptime(date_str, "%Y-%m-%d").date()
            elif len(date_str) == 7:  # YYYY-MM
                return datetime.strptime(date_str + "-01", "%Y-%m-%d").date()
            elif len(date_str) == 4:  # YYYY
                return datetime.strptime(date_str + "-01-01", "%Y-%m-%d").date()
        except Exception:
            return None
        return None
