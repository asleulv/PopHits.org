from django.core.management.base import BaseCommand
from songs.models import Song, Composition
import musicbrainzngs
import requests
import time
import re
from difflib import SequenceMatcher


class Command(BaseCommand):
    help = 'Get songwriter credits using MusicBrainz + Wikipedia, with fallback heuristics'

    def add_arguments(self, parser):
        parser.add_argument('--artist', type=str, help='Process specific artist')
        parser.add_argument('--limit', type=int, default=100, help='Number of songs to process')
        parser.add_argument('--delay', type=float, default=5.0, help='Delay between requests')
        parser.add_argument('--dry-run', action='store_true', help='Show what would be created')
        parser.add_argument('--shs-api-key', type=str, help='SecondHandSongs API key (optional)')

    def handle(self, *args, **options):
        musicbrainzngs.set_useragent("pophits.org", "1.0", "your-email@domain.com")
        self.delay = options['delay']
        self.dry_run = options['dry_run']
        self.shs_api_key = options.get('shs_api_key')

        self.stdout.write(self.style.SUCCESS('Starting cover detection and songwriter credit lookup...\n'))

        songs_query = Song.objects.filter(composition__isnull=True)
        if options['artist']:
            songs_query = songs_query.filter(artist__icontains=options['artist'])
        songs = songs_query.order_by('-peak_rank')[:options['limit']]

        stats = {
            'compositions_created': 0,
            'covers_detected': 0,
            'originals_found': 0,
            'shs_success': 0,
            'heuristic_used': 0,
        }

        for i, song in enumerate(songs, 1):
            self.stdout.write(f'\n{"="*80}')
            self.stdout.write(f'[{i}/{len(songs)}] Processing: {song.artist} - "{song.title}" ({song.year})')
            self.stdout.write(f'{"="*80}')
            
            try:
                # 1️⃣ Try SHS to check if it's a cover
                shs_info = self.get_secondhandsongs_info(song)
                if shs_info:
                    stats['shs_success'] += 1

                # 2️⃣ Use Wikipedia to get original artist for display
                wp_info = self.get_wikipedia_info(song)

                # 3️⃣ Get writers from MusicBrainz
                mb_info = self.get_musicbrainz_writers(song, wp_info)

                # 4️⃣ Create composition with public-facing info
                if mb_info or wp_info:
                    result = self.create_composition(song, mb_info, wp_info, shs_info, stats)
                    if result:
                        stats['compositions_created'] += 1
                        if result['is_cover']:
                            stats['covers_detected'] += 1
                        else:
                            stats['originals_found'] += 1

            except Exception as e:
                self.stdout.write(self.style.ERROR(f'ERROR: {e}'))

            if i < len(songs):
                time.sleep(self.delay)

        # Summary
        self.stdout.write(f'\n{"="*80}')
        self.stdout.write(self.style.SUCCESS('SUMMARY'))
        self.stdout.write(f'{"="*80}')
        self.stdout.write(f'Compositions created: {stats["compositions_created"]}')
        self.stdout.write(f'Covers detected: {stats["covers_detected"]}')
        self.stdout.write(f'Originals found: {stats["originals_found"]}')
        self.stdout.write(f'SHS successful: {stats["shs_success"]}')
        self.stdout.write(f'Heuristic used: {stats["heuristic_used"]}')

    # ----------------------------
    # SecondHandSongs cover check
    # ----------------------------
    def get_secondhandsongs_info(self, song):
        """Check if song is a cover via SHS"""
        try:
            time.sleep(3)  # Rate limiting: max 20/minute
            
            url = 'https://api.secondhandsongs.com/search/performance'
            params = {'title': song.title, 'performer': song.artist, 'pageSize': 3}
            headers = {
                'Accept': 'application/json',
                'User-Agent': 'pophits.org/1.0 (contact@pophits.org)'
            }
            if self.shs_api_key:
                headers['X-API-Key'] = self.shs_api_key
            
            response = requests.get(url, params=params, headers=headers, timeout=10)
            
            if response.status_code == 403:
                self.stdout.write('[SHS] Rate limited - using fallback heuristic')
                return None
            
            if response.status_code != 200:
                return None

            results = response.json().get('resultPage', [])
            
            for result in results:
                perf_uri = result.get('uri')
                if not perf_uri:
                    continue
                
                result_performer = result.get('performer', {}).get('name', '')
                if not self.artists_similar(result_performer, song.artist):
                    continue
                
                time.sleep(3)  # Rate limiting
                resp = requests.get(perf_uri, headers=headers, timeout=10)
                if resp.status_code != 200:
                    continue
                    
                perf_data = resp.json()
                is_original = perf_data.get('isOriginal', True)
                
                if not is_original:
                    originals = perf_data.get('originals', [])
                    if originals:
                        original_perf = originals[0].get('original', {})
                        original_artist = original_perf.get('performer', {}).get('name', '')
                        
                        if original_artist and not self.artists_similar(original_artist, song.artist):
                            self.stdout.write('[SHS] Cover detected')
                            return {'is_cover': True, 'source': 'SHS', 'original_artist': original_artist}
                        else:
                            return {'is_cover': False, 'source': 'SHS'}
                        
            return {'is_cover': False, 'source': 'SHS'}
        except Exception:
            return None

    # ----------------------------
    # Wikipedia for original artist
    # ----------------------------
    def get_wikipedia_info(self, song):
        """Get original artist and year from Wikipedia"""
        search_terms = [f"{song.title} song", song.title]
        for term in search_terms:
            try:
                url = "https://en.wikipedia.org/w/rest.php/v1/search/page"
                params = {'q': term, 'limit': 3}
                headers = {'User-Agent': 'pophits.org/1.0'}
                response = requests.get(url, params=params, headers=headers, timeout=10)
                if response.status_code != 200:
                    continue
                pages = response.json().get('pages', [])
                for page in pages:
                    info = self.analyze_wikipedia_page(page.get('key', ''), song)
                    if info:
                        return info
            except Exception:
                continue
        return None

    def analyze_wikipedia_page(self, page_key, song):
        """Analyze Wikipedia page for original artist info"""
        try:
            url = f"https://en.wikipedia.org/w/rest.php/v1/page/{page_key}"
            response = requests.get(url, headers={'User-Agent': 'pophits.org/1.0'}, timeout=10)

            if response.status_code != 200:
                return None

            data = response.json()
            content = (data.get('source') or '').lower()
            title = (data.get('title') or '').lower()
            song_title_lower = song.title.lower()

            if song_title_lower not in title and song_title_lower not in content:
                return None

            generic_pages = ['christmas music', 'list of', 'music genre', 'discography', 'album)', 'compilation']
            if any(generic in title for generic in generic_pages):
                return None

            # Extract original performer and year
            patterns = [
                r'originally recorded by ([^,.()]+?) in (\d{4})',
                r'first recorded by ([^,.()]+?) in (\d{4})',
                r'popularized by ([^,.()]+?) in (\d{4})',
                r'originally performed by ([^,.()]+?) in (\d{4})',
            ]

            for pattern in patterns:
                matches = re.findall(pattern, content, re.IGNORECASE)
                for match in matches:
                    if not match or len(match) != 2:
                        continue

                    original_artist, year = match

                    try:
                        original_year = int(year)
                        if 1900 <= original_year <= song.year and not self.artists_similar(original_artist, song.artist):
                            return {
                                'is_cover': True,
                                'original_artist': original_artist.strip(),
                                'original_year': original_year,
                            }
                    except ValueError:
                        continue

            return None

        except Exception:
            return None

    # ----------------------------
    # MusicBrainz writers
    # ----------------------------
    def get_musicbrainz_writers(self, song, wp_info):
        try:
            search_queries = [{'recording': song.title, 'artist': song.artist}, {'recording': song.title}]
            for q in search_queries:
                recordings = musicbrainzngs.search_recordings(limit=5, **q)
                for rec in recordings.get('recording-list', []):
                    try:
                        detail = musicbrainzngs.get_recording_by_id(rec['id'], includes=['work-rels'])
                        if 'work-relation-list' in detail['recording']:
                            work_rel = detail['recording']['work-relation-list'][0]
                            work_detail = musicbrainzngs.get_work_by_id(work_rel['work']['id'], includes=['artist-rels'])
                            writers = self.extract_writers(work_detail['work'])
                            if writers != 'Unknown':
                                return {
                                    'writers': writers,
                                    'work_id': work_rel['work']['id'],
                                }
                    except Exception:
                        continue
            return None
        except Exception:
            return None

    # ----------------------------
    # Create composition
    # ----------------------------
    def create_composition(self, song, mb_info, wp_info, shs_info, stats):
        """Create composition and show clear database preview"""
        
        # Determine writers
        writers = mb_info.get('writers') if mb_info else 'Unknown'
        
        # Determine if cover
        is_cover = shs_info.get('is_cover') if shs_info else False
        detection_method = 'SHS' if shs_info else None
        
        # Get SHS original artist if available
        shs_original_artist = shs_info.get('original_artist') if shs_info else None
        
        # FALLBACK HEURISTIC: If SHS unavailable, check writer-artist mismatch
        if not shs_info and writers != 'Unknown':
            writer_names = [w.strip().lower() for w in writers.split(',')]
            artist_lower = song.artist.lower()
            
            has_overlap = False
            for name in writer_names:
                name_parts = name.split()
                if name in artist_lower or any(part in artist_lower for part in name_parts if len(part) > 3):
                    has_overlap = True
                    break
            
            if not has_overlap and len(writer_names) <= 2:
                is_cover = True
                detection_method = 'Heuristic'
                stats['heuristic_used'] += 1
        
        # Get original artist info (prefer SHS, fallback to Wikipedia)
        if is_cover:
            if shs_original_artist:
                original_artist = shs_original_artist
                original_year = None  # SHS doesn't always provide year
            elif wp_info:
                original_artist = wp_info.get('original_artist')
                original_year = wp_info.get('original_year')
            else:
                original_artist = None
                original_year = None
        else:
            original_artist = None
            original_year = None

        # ============================================================
        # SHOW WHAT WILL BE SAVED TO DATABASE
        # ============================================================
        self.stdout.write(f'\n{"-"*80}')
        self.stdout.write(self.style.SUCCESS('DATABASE ENTRY:'))
        self.stdout.write(f'{"-"*80}')
        
        # Artist & Song
        self.stdout.write(f'Artist:           {song.artist}')
        self.stdout.write(f'Song:             {song.title} ({song.year})')
        
        # Cover status
        status = "COVER" if is_cover else "ORIGINAL"
        status_color = self.style.WARNING if is_cover else self.style.SUCCESS
        self.stdout.write(f'Status:           {status_color(status)}' + (f' (detected via {detection_method})' if detection_method else ''))
        
        # Original artist (if cover)
        if is_cover:
            if original_artist:
                self.stdout.write(f'Original Artist:  {original_artist}' + (f' ({original_year})' if original_year else ''))
            else:
                self.stdout.write(f'Original Artist:  {self.style.WARNING("(Not found)")}')
        
        # Writers
        if writers != 'Unknown':
            self.stdout.write(f'Writer(s):        {writers}')
        else:
            self.stdout.write(f'Writer(s):        {self.style.ERROR("Unknown")}')
        
        self.stdout.write(f'{"-"*80}')

        # Save to database
        if not self.dry_run:
            composition = Composition.objects.create(
                title=song.title,
                original_writer=writers,
                original_artist=original_artist or (song.artist if not is_cover else None),
                original_year=original_year or song.year,
                musicbrainz_work_id=mb_info.get('work_id') if mb_info else None,
                verified_source='Wikipedia+MusicBrainz',
                is_traditional=(writers.lower() == 'traditional')
            )
            song.composition = composition
            song.is_original_recording = not is_cover
            song.save()
            composition.update_statistics()
            self.stdout.write(self.style.SUCCESS('SAVED TO DATABASE\n'))
        else:
            self.stdout.write(self.style.WARNING('DRY RUN - NOT SAVED\n'))

        return {
            'is_cover': is_cover,
            'writers_found': writers != 'Unknown',
        }

    # ----------------------------
    # Helpers
    # ----------------------------
    def extract_writers(self, work_data):
        writers = []
        seen = set()
        for rel in work_data.get('artist-relation-list', []):
            if rel.get('type') in ['composer', 'lyricist', 'writer']:
                name = rel['artist']['name']
                if name not in seen:
                    writers.append(name)
                    seen.add(name)
        return ', '.join(writers) if writers else 'Unknown'

    def artists_similar(self, artist1, artist2):
        """Check if two artist names are similar"""
        clean = lambda a: re.sub(r'[^\w\s]', '', a.lower()).replace('the ', '').strip()
        a1, a2 = clean(artist1), clean(artist2)
        return SequenceMatcher(None, a1, a2).ratio() > 0.85
