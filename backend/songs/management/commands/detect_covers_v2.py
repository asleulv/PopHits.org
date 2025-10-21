# detect_covers_multisource_v2.py
from django.core.management.base import BaseCommand
from songs.models import Song, Composition
import musicbrainzngs
import time
from difflib import SequenceMatcher
import os
import openai
import json
import requests

class Command(BaseCommand):
    help = 'Detect covers & get songwriter info using MusicBrainz + Discogs + GPT fallback'

    def add_arguments(self, parser):
        parser.add_argument('--artist', type=str, help='Process specific artist')
        parser.add_argument('--limit', type=int, default=100, help='Number of songs to process')
        parser.add_argument('--delay', type=float, default=1.0, help='Delay between requests')
        parser.add_argument('--dry-run', action='store_true', help='Show what would be created')
        parser.add_argument('--use-gpt', action='store_true', help='Fallback to GPT if no data found')

    def handle(self, *args, **options):
        musicbrainzngs.set_useragent("pophits.org", "1.0", "your-email@domain.com")
        self.delay = options['delay']
        self.dry_run = options['dry_run']
        self.use_gpt = options['use_gpt']
        self.openai_key = os.environ.get('OPENAI_KEY')
        self.discogs_token = os.environ.get('DISCOGS_TOKEN')

        if self.use_gpt and not self.openai_key:
            self.stdout.write(self.style.ERROR("OPENAI_KEY not found in environment!"))
            return
        if not self.discogs_token:
            self.stdout.write(self.style.WARNING("DISCOGS_TOKEN not set. Discogs fallback will be skipped."))

        songs_query = Song.objects.filter(composition__isnull=True)
        if options['artist']:
            songs_query = songs_query.filter(artist__icontains=options['artist'])
        songs = songs_query.order_by('-peak_rank')[:options['limit']]

        stats = {'compositions_created': 0, 'covers_detected': 0, 'originals_found': 0, 'gpt_used': 0}

        for i, song in enumerate(songs, 1):
            self.stdout.write(f'\n{"="*80}')
            self.stdout.write(f'[{i}/{len(songs)}] Processing: {song.artist} - "{song.title}" ({song.year})')
            self.stdout.write(f'{"="*80}')

            try:
                mb_info_list = self.query_all_musicbrainz(song)
                discogs_info = self.query_discogs(song) if self.discogs_token else {}
                writers, original_artist, confidence = self.integrate_sources(song, mb_info_list, discogs_info)

                # GPT fallback if still ambiguous
                if self.use_gpt and (not writers or not original_artist or confidence < 0.5):
                    gpt_writers, gpt_artist = self.query_gpt_fallback(song)
                    if gpt_writers:
                        writers = gpt_writers
                        stats['gpt_used'] += 1
                    if gpt_artist and (not original_artist or confidence < 0.5):
                        original_artist = gpt_artist
                        stats['gpt_used'] += 1
                    confidence = max(confidence, 0.6)
                    time.sleep(self.delay)

                is_cover = confidence >= 0.7

                self.log_dry_run(song, writers, original_artist, is_cover, confidence)

                if not self.dry_run:
                    composition_obj = self.create_composition(song, writers, original_artist, is_cover)
                    stats['compositions_created'] += 1
                    if is_cover:
                        stats['covers_detected'] += 1
                    else:
                        stats['originals_found'] += 1

            except Exception as e:
                self.stdout.write(self.style.ERROR(f'ERROR: {e}'))

            time.sleep(self.delay)

        # Summary
        self.stdout.write(f'\n{"="*80}')
        self.stdout.write(self.style.SUCCESS('SUMMARY'))
        self.stdout.write(f'{"="*80}')
        self.stdout.write(f'Compositions created: {stats["compositions_created"]}')
        self.stdout.write(f'Covers detected: {stats["covers_detected"]}')
        self.stdout.write(f'Originals found: {stats["originals_found"]}')
        self.stdout.write(f'GPT fallback used: {stats["gpt_used"]}')

    # ----------------------------
    # Query all MB recordings for a song
    # ----------------------------
    def query_all_musicbrainz(self, song):
        try:
            results = musicbrainzngs.search_recordings(recording=song.title, limit=50)
            recordings = []
            for rec in results.get('recording-list', []):
                if self.similar_text(song.title, rec.get('title','')) < 0.8:
                    continue
                rec_artist = rec.get('artist-credit-phrase', 'Unknown')
                if self.similar_text(song.artist, rec_artist) < 0.4:
                    continue
                for release in rec.get('release-list', []):
                    date_str = release.get('date')
                    if date_str and len(date_str) >= 4:
                        try:
                            year = int(date_str[:4])
                            work_id = rec.get('work-relation-list', [{}])[0].get('work', {}).get('id')
                            recordings.append({'artist': rec_artist, 'year': year, 'work_id': work_id})
                        except ValueError:
                            continue
            return sorted(recordings, key=lambda x: x['year'])
        except Exception:
            return []

    # ----------------------------
    # Discogs query
    # ----------------------------
    def query_discogs(self, song):
        headers = {'Authorization': f'Discogs token={self.discogs_token}'}
        try:
            resp = requests.get(
                'https://api.discogs.com/database/search',
                headers=headers,
                params={'artist': song.artist, 'track': song.title, 'type': 'release', 'per_page': 5}
            )
            data = resp.json()
            if 'results' not in data or len(data['results']) == 0:
                return {}
            result = data['results'][0]
            return {'artist': result.get('title'), 'year': result.get('year'), 'label': result.get('label')}
        except Exception:
            return {}

    # ----------------------------
    # Integrate MB + Discogs
    # ----------------------------
    def integrate_sources(self, song, mb_info_list, discogs_info):
        original_artist = None
        writers = None
        confidence = 0.0

        # Pick earliest MB recording not the cover artist
        for rec in mb_info_list:
            if rec['artist'].lower() != song.artist.lower():
                original_artist = rec['artist']
                if rec['work_id']:
                    writers = self.get_writers_from_mb(rec['work_id'])
                confidence = 1.0
                break

        # If no cover detected, assume original
        if not original_artist and mb_info_list:
            rec = mb_info_list[0]
            original_artist = rec['artist']
            if rec['work_id']:
                writers = self.get_writers_from_mb(rec['work_id'])
            confidence = 0.0

        # Discogs override if gives different artist
        if discogs_info.get('artist') and discogs_info['artist'] != song.artist:
            original_artist = discogs_info['artist']
            confidence = max(confidence, 0.9)

        return writers, original_artist, confidence

    def get_writers_from_mb(self, work_id):
        try:
            work_data = musicbrainzngs.get_work_by_id(work_id, includes=['artist-rels'])
            writers = set()
            for rel in work_data['work'].get('artist-relation-list', []):
                if rel.get('type') in ['composer','lyricist','writer'] and 'artist' in rel:
                    writers.add(rel['artist']['name'])
            return list(writers) if writers else None
        except Exception:
            return None

    # ----------------------------
    # GPT fallback
    # ----------------------------
    def query_gpt_fallback(self, song):
        if not self.openai_key:
            return None, None
        openai.api_key = self.openai_key
        prompt = f"""
        Provide original songwriter(s) and original artist for '{song.title}' by '{song.artist}'.
        Return JSON: {{"writers":["name1"],"original_artist":"Artist Name"}}.
        """
        try:
            resp = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[{"role":"user","content":prompt}],
                temperature=0
            )
            data = json.loads(resp.choices[0].message.content.strip())
            writers = data.get('writers', None)
            original_artist = data.get('original_artist', None)
            if writers:
                writers = [w.strip() for w in writers if w.strip()]
            return writers, original_artist
        except Exception:
            return None, None

    # ----------------------------
    # Dry-run logging
    # ----------------------------
    def log_dry_run(self, song, writers, original_artist, is_cover, confidence):
        final_writers = ', '.join(writers) if writers else 'Unknown'
        status = "COVER" if is_cover else "ORIGINAL"
        self.stdout.write(f"\n{'-'*80}")
        self.stdout.write("DATABASE ENTRY (dry-run):")
        self.stdout.write(f"{'-'*80}")
        self.stdout.write(f"Artist:           {song.artist}")
        self.stdout.write(f"Song:             {song.title} ({song.year})")
        self.stdout.write(f"Status:           {status} (confidence={confidence:.2f})")
        if is_cover:
            self.stdout.write(f"Original Artist:  {original_artist}")
        self.stdout.write(f"Writer(s):        {final_writers}")
        self.stdout.write(f"{'-'*80}")

    # ----------------------------
    # Save to DB
    # ----------------------------
    def create_composition(self, song, writers, original_artist, is_cover):
        final_writers = ', '.join(writers) if writers else 'Unknown'
        composition = Composition.objects.create(
            title=song.title,
            original_writer=final_writers,
            original_artist=original_artist or song.artist,
            original_year=song.year,
            verified_source='MB+Discogs',
            is_traditional=('traditional' in final_writers.lower())
        )
        song.composition = composition
        song.is_original_recording = not is_cover
        song.save()
        composition.update_statistics()
        return composition

    # ----------------------------
    # Text similarity
    # ----------------------------
    def similar_text(self, a, b):
        return SequenceMatcher(None, a.lower(), b.lower()).ratio()
