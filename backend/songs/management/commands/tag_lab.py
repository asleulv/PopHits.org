from django.core.management.base import BaseCommand
from songs.models import Song, SongTag, SongTagRelation
from lib.ai_logic import get_regex_from_ai
import time

class Command(BaseCommand):
    help = 'Interactive AI Tagging Laboratory'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("\n--- 🧪 Welcome to the Tagging Lab ---"))
        
        # 1. Inputs
        idea = input("What are we looking for? (e.g. 'Cities in USA'): ")
        tag_name = input("Display Name for Tag: ")
        tag_slug = input("Tag Slug: ")

        # 2. Get Regex
        self.stdout.write("Consulting AI for the perfect pattern...")
        pattern = get_regex_from_ai(idea)
        
        if not pattern:
            return

        self.stdout.write(self.style.WARNING(f"Pattern generated: {pattern}\n"))

        # 3. Preview
        # We use __iregex for case-insensitive regex matching in the DB
        all_matches = Song.objects.filter(title__iregex=pattern)
        match_count = all_matches.count()

        if match_count == 0:
            self.stdout.write(self.style.ERROR("Zero songs matched. Try a broader prompt."))
            return

        self.stdout.write(self.style.SUCCESS(f"Found {match_count} matches! Here are 10 random examples:"))
        preview_songs = all_matches.order_by('?')[:10] # order_by('?') gets random samples
        for s in preview_songs:
            print(f" - {s.title} (by {s.artist})")

        # 4. Confirmation
        confirm = input(f"\nApply '{tag_name}' to all {match_count} songs? (yes/no): ")

        if confirm.lower() == 'yes':
            tag, _ = SongTag.objects.get_or_create(
                slug=tag_slug, 
                defaults={'name': tag_name, 'category': 'theme'}
            )

            self.stdout.write("Tagging songs... (this may take a moment)")
            
            # Efficient bulk creation
            new_relations = []
            for song in all_matches:
                # We use get_or_create to avoid duplicates
                SongTagRelation.objects.get_or_create(
                    song=song, 
                    tag=tag, 
                    defaults={'source': 'ai_lab'}
                )
            
            # Update the count on the tag model if you have that method
            if hasattr(tag, 'update_song_count'):
                tag.update_song_count()

            self.stdout.write(self.style.SUCCESS(f"Done! {match_count} songs are now tagged."))
        else:
            self.stdout.write("Aborted. No changes made.")