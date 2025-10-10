from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Song

@receiver(post_save, sender=Song)
def copy_image_to_artist_songs(sender, instance, created, **kwargs):
    """
    Automatically copy image to all songs by same artist when image is uploaded
    """
    # Only run if the song has an image
    if instance.image_upload:
        # Find all other songs by the same artist without images
        songs_to_update = Song.objects.filter(
            artist_slug=instance.artist_slug,
            image_upload__exact=''  # Empty string images
        ).exclude(id=instance.id)
        
        # Copy the image to all other songs by this artist
        updated_count = songs_to_update.update(image_upload=instance.image_upload)
        
        # Optional: Print to console for debugging
        if updated_count > 0:
            print(f'Auto-copied image to {updated_count} songs by {instance.artist}')
