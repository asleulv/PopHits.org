from django.core.management.base import BaseCommand
from songs.models import Song, Artist
from django.core.files.base import ContentFile
import os


class Command(BaseCommand):
    help = 'Copy images from songs to their artist objects'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be migrated without actually doing it'
        )
        parser.add_argument(
            '--verbose',
            action='store_true',
            help='Show all details including skipped artists'
        )

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('🖼️  Migrating artist images from songs...\n'))
        
        # Get all artists without images
        artists = Artist.objects.filter(image='')
        
        migrated_count = 0
        no_image_count = 0
        
        for artist in artists:
            # Find a song by this artist that has an image
            song_with_image = Song.objects.filter(
                artist_fk=artist,
                image_upload__isnull=False
            ).exclude(image_upload='').first()
            
            if not song_with_image:
                no_image_count += 1
                continue
            
            # Found an image!
            if options['dry_run']:
                self.stdout.write(
                    f'  🔍 Would copy: {artist.name} ← {song_with_image.title}'
                )
                migrated_count += 1
                continue
            
            # Copy the image file
            try:
                # Get the source file path
                source_path = song_with_image.image_upload.path
                
                # Generate new filename for artist
                file_extension = os.path.splitext(source_path)[1]
                new_filename = f'{artist.slug}{file_extension}'
                
                # Copy file to artist_images directory
                with open(source_path, 'rb') as source_file:
                    artist.image.save(
                        new_filename,
                        ContentFile(source_file.read()),
                        save=False
                    )
                
                # Set image credit if available
                if not artist.image_credit:
                    artist.image_credit = 'Wikimedia Commons'
                
                artist.save()
                
                self.stdout.write(
                    self.style.SUCCESS(f'  ✅ {artist.name} ← {song_with_image.title}')
                )
                migrated_count += 1
                
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'  ❌ Error copying {artist.name}: {e}')
                )
        
        # Summary
        self.stdout.write('\n' + '='*60)
        self.stdout.write(self.style.SUCCESS(f'✅ Successfully migrated: {migrated_count} artists'))
        
        if options['verbose']:
            self.stdout.write(f'❌ No image available: {no_image_count} artists')
        
        self.stdout.write('='*60)
        
        if options['dry_run']:
            self.stdout.write('\n💡 This was a dry run. Run without --dry-run to actually migrate.')
