from django.core.management.base import BaseCommand
from songs.models import Song, NumberOneSong

class Command(BaseCommand):
    help = 'Populates the NumberOneSong model with all songs that reached #1'

    def handle(self, *args, **options):
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
            if created_count % 100 == 0:  # Progress update every 100 songs
                self.stdout.write(f'Processed {created_count}/{total_songs} songs...')
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully populated NumberOneSong table with {created_count} songs'
            )
        )