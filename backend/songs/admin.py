from django.contrib import admin
from .models import Song, UserSongComment
from django.db import models
from ckeditor.widgets import CKEditorWidget
from django.contrib import messages


@admin.action(description='Copy image to all songs by this artist')
def copy_image_to_artist_songs(modeladmin, request, queryset):
    for song in queryset:
        if song.image_upload:
            songs_to_update = Song.objects.filter(
                artist_slug=song.artist_slug,
                image_upload__exact=''
            ).exclude(id=song.id)
            
            updated_count = songs_to_update.update(image_upload=song.image_upload)
            
            # Only show message if something was actually updated
            if updated_count > 0:
                messages.success(
                    request, 
                    f'Copied image reference to {updated_count} songs by {song.artist}'
                )
        else:
            messages.warning(
                request, 
                f'No image to copy for "{song.title}" by {song.artist}'
            )



class HasImageListFilter(admin.SimpleListFilter):
    title = 'Has Image'
    parameter_name = 'has_image'

    def lookups(self, request, model_admin):
        return (
            ('yes', 'Has Image'),
            ('no', 'No Image'),
        )

    def queryset(self, request, queryset):
        if self.value() == 'yes':
            return queryset.exclude(image_upload='')
        if self.value() == 'no':
            return queryset.filter(image_upload='')
        return queryset


class SongAdmin(admin.ModelAdmin):
    actions = [copy_image_to_artist_songs]
    list_display = ('title', 'artist', 'year', 'peak_rank', 'average_user_score', 'total_ratings', 'has_image')
    list_filter = ('artist', 'year', 'peak_rank', HasImageListFilter)
    search_fields = ('title', 'artist')
    readonly_fields = ('average_user_score', 'total_ratings', 'slug')
    formfield_overrides = {
        models.TextField: {'widget': CKEditorWidget},
    }
    
    def has_image(self, obj):
        return bool(obj.image_upload)
    has_image.boolean = True
    has_image.short_description = 'Has Image'


class CommentAdmin(admin.ModelAdmin):
    list_display = ('user', 'song', 'text', 'created_at')
    search_fields = ('user__username', 'song__title')


admin.site.register(Song, SongAdmin)
admin.site.register(UserSongComment, CommentAdmin)
