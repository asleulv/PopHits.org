from django.core.management.base import BaseCommand
from django.db.models import Count
from songs.models import Song, Artist

class Command(BaseCommand):
    help = 'Create Artist objects for all unique artists found in songs'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be created without actually creating'
        )
        parser.add_argument(
            '--verbose',
            action='store_true', 
            help='Show detailed progress'
        )

    def handle(self, *args, **options):
        self.stdout.write(
            self.style.SUCCESS('🎨 Creating Artist objects from song data...')
        )
        
        # Get all unique artists from songs
        unique_artists = Song.objects.values_list('artist', flat=True).distinct()
        
        # Filter out empty/null names
        valid_artists = [
            artist.strip() for artist in unique_artists 
            if artist and artist.strip()
        ]
        
        self.stdout.write(f'Found {len(valid_artists)} unique artist names in songs')
        
        # Check what already exists
        existing_artists = set(
            Artist.objects.values_list('name', flat=True)
        )
        
        artists_to_create = [
            name for name in valid_artists 
            if name not in existing_artists
        ]
        
        self.stdout.write(f'Already have Artist objects for: {len(existing_artists)} artists')
        self.stdout.write(f'Need to create: {len(artists_to_create)} new Artist objects')
        
        if not artists_to_create:
            self.stdout.write(
                self.style.SUCCESS('✅ All artists already have Artist objects!')
            )
            return
        
        if options['dry_run']:
            self.stdout.write('\n📋 DRY RUN - Would create these artists:')
            for i, artist_name in enumerate(artists_to_create[:20], 1):
                song_count = Song.objects.filter(artist=artist_name).count()
                self.stdout.write(f'  {i}. {artist_name} ({song_count} songs)')
            
            if len(artists_to_create) > 20:
                self.stdout.write(f'  ... and {len(artists_to_create) - 20} more')
            return
        
        # Create the Artist objects
        created_count = 0
        batch_size = 100
        
        for i, artist_name in enumerate(artists_to_create):
            try:
                artist, created = Artist.objects.get_or_create(
                    name=artist_name,
                    defaults={'artist_type': 'person'}  # Default, will be corrected by enrichment
                )
                
                if created:
                    created_count += 1
                    
                    if options['verbose'] or created_count % 50 == 0:
                        song_count = Song.objects.filter(artist=artist_name).count()
                        self.stdout.write(f'  ✅ Created: {artist_name} ({song_count} songs)')
                        
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'  ❌ Error creating {artist_name}: {e}')
                )
        
        # Summary with stats
        self.stdout.write('\n' + '='*60)
        self.stdout.write(
            self.style.SUCCESS(f'✅ Created {created_count} new Artist objects')
        )
        
        total_artists = Artist.objects.count()
        self.stdout.write(f'📊 Total Artist objects now: {total_artists}')
        
        # Show top artists by song count
        top_artists = Artist.objects.annotate(
            song_count=Count('songs')
        ).order_by('-song_count')[:10]
        
        self.stdout.write('\n🎵 Top 10 artists by song count:')
        for i, artist in enumerate(top_artists, 1):
            enriched = "✓" if artist.musicbrainz_id else "○"
            self.stdout.write(f'  {i:2d}. {artist.name} ({artist.song_count} songs) {enriched}')
        
        self.stdout.write(f'\n💡 Next: Run "python manage.py enrich_artists --limit 50" to add biographical data')
