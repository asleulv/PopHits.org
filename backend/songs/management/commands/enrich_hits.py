import csv
import re
from collections import defaultdict
from datetime import datetime
from django.core.management.base import BaseCommand
from songs.models import Song, SongTimeline
import os


class Command(BaseCommand):
    help = 'Create chart timeline for songs from Hot 100 CSV data with exact normalized matching and optional dry-run mode'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Run the command without making changes (dry run)',
        )
        parser.add_argument(
            '--limit',
            type=int,
            default=None,
            help='Process only this number of songs (default None to process all)',
        )

    def normalize(self, text):
        if not text:
            return ''
        text = text.lower().strip()
        text = re.sub(r'\(.*?\)', '', text)  # Remove anything in parentheses
        text = re.sub(r'\b(feat\.?|ft\.?|featuring|&|and)\b', '', text)  # Remove common collaboration markers
        text = re.sub(r'[^\w\s]', '', text)  # Remove punctuation
        text = re.sub(r'\s+', ' ', text)     # Collapse multiple spaces
        return text.strip()

    def handle(self, *args, **options):
        dry_run = options['dry_run']
        limit = options['limit']

        if dry_run:
            self.stdout.write('Running in dry-run mode, no changes will be saved.')
        if limit:
            self.stdout.write(f'Processing up to {limit} songs.')
        else:
            self.stdout.write('Processing all songs.')

        base_dir = os.path.dirname(os.path.abspath(__file__))
        csv_path = os.path.join(base_dir, 'full_combined_hot100.csv')

        chart_data = defaultdict(list)
        with open(csv_path, newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                date_obj = datetime.strptime(row['date'], '%Y-%m-%d').date()

                song_norm = self.normalize(row['song'])
                artist_norm = self.normalize(row['artist'])
                key = (song_norm, artist_norm)
                chart_data[key].append({
                    'date': date_obj,
                    'rank': int(row['rank']),
                    'peak_rank': int(row['peak-rank']),
                    'weeks_on_board': int(row['weeks-on-board']),
                })

        self.stdout.write(f'Total CSV rows loaded: {sum(len(v) for v in chart_data.values())}')

        songs = Song.objects.all()
        if limit:
            songs = songs[:limit]

        total_songs = songs.count()
        processed_count = 0
        missing_count = 0

        for idx, song in enumerate(songs, start=1):
            key = (self.normalize(song.title), self.normalize(song.artist))
            if key not in chart_data:
                missing_count += 1
                if missing_count <= 20:
                    self.stdout.write(f'No chart data found for: {song.artist} - {song.title}')
                elif missing_count == 21:
                    self.stdout.write("... (more songs with no data omitted) ...")
                continue

            entries = sorted(chart_data[key], key=lambda e: e['date'])

            if idx % 100 == 0 or idx == total_songs:
                self.stdout.write(f'Processing song {idx}/{total_songs}: {song.artist} - {song.title} ({len(entries)} timeline entries)')

            if not dry_run:
                for entry in entries:
                    SongTimeline.objects.update_or_create(
                        song=song,
                        chart_date=entry['date'],
                        defaults={
                            'rank': entry['rank'],
                            'peak_rank': entry['peak_rank'],
                            'weeks_on_chart': entry['weeks_on_board'],
                        }
                    )
            processed_count += 1

        self.stdout.write(self.style.SUCCESS(f'Finished processing {processed_count} songs (skipped {missing_count} without chart data).'))
