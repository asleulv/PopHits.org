from django.core.management.base import BaseCommand
from django.db.models import Count
from songs.models import Song, Artist


class Command(BaseCommand):
    help = 'Link songs to their corresponding Artist objects via artist_fk'


    def add_arguments(self, parser):
        parser.add_argument(
            '--batch-size', 
            type=int, 
            default=1000,
            help='Number of songs to process at once'
        )
        parser.add_argument(
            '--create-missing',
            action='store_true',
            help='Automatically create Artist objects for songs with no match'
        )


    def handle(self, *args, **options):
        self.stdout.write(
            self.style.SUCCESS('🔗 Linking songs to Artist objects...')
        )
        
        # Count unlinked songs
        total_unlinked = Song.objects.filter(artist_fk__isnull=True).count()
        
        self.stdout.write(f'Songs needing artist links: {total_unlinked}')
        
        if total_unlinked == 0:
            self.stdout.write(self.style.SUCCESS('✅ All songs already linked!'))
            return
        
        # PRE-LOAD all artists into memory for O(1) lookup
        self.stdout.write('📚 Loading artists into memory...')
        artist_lookup = {artist.name: artist for artist in Artist.objects.all()}
        self.stdout.write(f'Loaded {len(artist_lookup)} artists')
        
        linked_count = 0
        created_count = 0
        no_match_artists = set()  # Track unique unmatched artists
        
        # Get all unlinked songs grouped by artist for efficiency
        unlinked_by_artist = Song.objects.filter(
            artist_fk__isnull=True
        ).values('artist').annotate(count=Count('id'))
        
        for artist_data in unlinked_by_artist:
            artist_name = artist_data['artist']
            song_count = artist_data['count']
            
            # Try to find artist
            artist_obj = artist_lookup.get(artist_name)
            
            # If not found and --create-missing flag is set, create it
            if not artist_obj and options['create_missing']:
                artist_obj, created = Artist.objects.get_or_create(
                    name=artist_name,
                    defaults={'artist_type': 'person'}
                )
                if created:
                    artist_lookup[artist_name] = artist_obj  # Add to lookup
                    created_count += 1
                    self.stdout.write(f'  ➕ Created Artist: {artist_name}')
            
            # Link songs if we have an artist
            if artist_obj:
                updated = Song.objects.filter(
                    artist=artist_name,
                    artist_fk__isnull=True
                ).update(artist_fk=artist_obj)
                
                linked_count += updated
                
                if linked_count % 1000 == 0:
                    self.stdout.write(f'  Linked {linked_count} songs...')
            else:
                no_match_artists.add(artist_name)
        
        # Summary
        self.stdout.write('\n' + '='*50)
        self.stdout.write(
            self.style.SUCCESS(f'✅ Linked {linked_count} songs to artists')
        )
        
        if created_count > 0:
            self.stdout.write(
                self.style.SUCCESS(f'➕ Created {created_count} new Artist objects')
            )
        
        if no_match_artists:
            self.stdout.write(
                self.style.WARNING(f'⚠️  {len(no_match_artists)} artists had no match')
            )
            self.stdout.write('\nUnmatched artists:')
            for artist_name in sorted(no_match_artists)[:10]:
                self.stdout.write(f'  • {artist_name}')
            
            if len(no_match_artists) > 10:
                self.stdout.write(f'  ... and {len(no_match_artists) - 10} more')
            
            self.stdout.write(f'\n💡 Tip: Run with --create-missing to auto-create these artists')
        
        # Final verification
        remaining = Song.objects.filter(artist_fk__isnull=True).count()
        if remaining == 0:
            self.stdout.write('\n' + self.style.SUCCESS('🎉 All songs now linked!'))
        else:
            self.stdout.write(f'\n📊 Remaining unlinked: {remaining} songs')
