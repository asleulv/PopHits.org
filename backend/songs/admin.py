from django.contrib import admin
from .models import Song, UserSongComment
from django.db import models
from ckeditor.widgets import CKEditorWidget

class SongAdmin(admin.ModelAdmin):
    list_display = ('title', 'artist', 'year', 'peak_rank', 'average_user_score', 'total_ratings')
    list_filter = ('artist', 'year', 'peak_rank')
    search_fields = ('title', 'artist')  # Use double underscores to traverse ForeignKey relationships
    readonly_fields = ('average_user_score', 'total_ratings', 'slug')
    formfield_overrides = {
        models.TextField: {'widget': CKEditorWidget},
    }

class CommentAdmin(admin.ModelAdmin):
    list_display = ('user', 'song', 'text', 'created_at')
    search_fields = ('user__username', 'song__title')  # Use double underscores to traverse ForeignKey relationships

admin.site.register(Song, SongAdmin)
admin.site.register(UserSongComment, CommentAdmin)
