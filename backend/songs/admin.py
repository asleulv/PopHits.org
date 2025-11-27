from django import forms
from django.contrib import admin
from django.db import models
from django.utils.html import format_html
from ckeditor.widgets import CKEditorWidget
from django.contrib import messages
from .models import (
    Song, UserSongComment, Artist, ArtistRelationship,
    ArtistTag, ArtistTagRelation, SongTag, SongTagRelation
)


# ========== SONG ACTIONS & FILTERS ==========


@admin.action(description='Copy image to all songs by this artist')
def copy_image_to_artist_songs(modeladmin, request, queryset):
    for song in queryset:
        if song.image_upload:
            songs_to_update = Song.objects.filter(
                artist_slug=song.artist_slug,
                image_upload__exact=''
            ).exclude(id=song.id)

            updated_count = songs_to_update.update(image_upload=song.image_upload)

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


# ========== SONG TAG INLINE ==========


class SongTagInline(admin.TabularInline):
    model = SongTagRelation
    extra = 1
    autocomplete_fields = ['tag']
    verbose_name = 'Tag'
    verbose_name_plural = 'Tags'
    fields = ['tag', 'source']


# ========== SONG ADMIN ==========


class SongAdmin(admin.ModelAdmin):
    list_display = ('title', 'artist', 'year', 'peak_rank', 'average_user_score', 'total_ratings', 'has_image')
    list_filter = ('artist', 'year', 'peak_rank', HasImageListFilter)
    search_fields = ('title', 'artist')
    readonly_fields = ('average_user_score', 'total_ratings', 'slug')
    formfield_overrides = {
        models.TextField: {'widget': CKEditorWidget},
    }
    inlines = [SongTagInline]

    def has_image(self, obj):
        return bool(obj.image_upload)
    has_image.boolean = True
    has_image.short_description = 'Has Image'

    def get_actions(self, request):
        actions = super().get_actions(request)

        # Ensure the copy image action is present
        actions['copy_image_to_artist_songs'] = (
            copy_image_to_artist_songs,
            'copy_image_to_artist_songs',
            copy_image_to_artist_songs.short_description,
        )

        # Dynamically add actions for tags with show_in_actions = True
        for tag in SongTag.objects.filter(show_in_actions=True).order_by('display_order', 'name'):
            def make_action(t):
                def action(modeladmin, req, queryset):
                    tagged_count = 0
                    already_tagged = 0

                    for song in queryset:
                        if SongTagRelation.objects.filter(song=song, tag=t).exists():
                            already_tagged += 1
                            continue

                        SongTagRelation.objects.create(
                            song=song,
                            tag=t,
                            source='manual'
                        )
                        tagged_count += 1

                    t.update_song_count()

                    if tagged_count > 0:
                        modeladmin.message_user(
                            req,
                            f'Successfully tagged {tagged_count} songs with "{t.name}"',
                            level=messages.SUCCESS
                        )
                    if already_tagged > 0:
                        modeladmin.message_user(
                            req,
                            f'{already_tagged} songs were already tagged with "{t.name}"',
                            level=messages.INFO
                        )
                action.__name__ = f'add_tag_{t.slug}'
                action.short_description = f'Add "{t.name}" tag'
                return action

            action = make_action(tag)
            actions[action.__name__] = (action, action.__name__, action.short_description)

        return actions


# ========== COMMENT ADMIN ==========


class CommentAdmin(admin.ModelAdmin):
    list_display = ('user', 'song', 'text', 'created_at')
    search_fields = ('user__username', 'song__title')


# ========== SONG TAG ADMIN ==========


@admin.register(SongTag)
class SongTagAdmin(admin.ModelAdmin):
    list_display = ['name', 'display_color', 'display_icon', 'category',
                    'song_count', 'is_featured', 'show_in_actions', 'display_order']
    list_editable = ['is_featured', 'show_in_actions', 'display_order']
    list_filter = ['category', 'is_featured', 'show_in_actions']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}

    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'category', 'description')
        }),
        ('Visual Design', {
            'fields': ('color', 'lucide_icon'),
            'description': 'Choose color and icon for tag display'
        }),
        ('Display Options', {
            'fields': ('is_featured', 'show_in_actions', 'display_order')
        }),
        ('Statistics', {
            'fields': ('song_count',),
            'classes': ('collapse',)
        }),
    )

    readonly_fields = ['song_count']

    def display_color(self, obj):
        return format_html(
            '<span style="background-color: {}; padding: 5px 15px; color: white; border-radius: 3px;">{}</span>',
            obj.color,
            obj.color
        )
    display_color.short_description = 'Color Preview'

    def display_icon(self, obj):
        if obj.lucide_icon:
            return format_html('de>{}</code>', obj.lucide_icon)
        return '—'
    display_icon.short_description = 'Icon'


# ========== ARTIST ADMIN ==========


class ArtistRelationshipInline(admin.TabularInline):
    """Inline for managing artist relationships (members, bands, etc.)"""
    model = ArtistRelationship
    fk_name = 'from_artist'
    extra = 1
    fields = ['to_artist', 'relationship_type']
    autocomplete_fields = ['to_artist']


class ArtistTagRelationInline(admin.TabularInline):
    """Inline for managing artist genre tags"""
    model = ArtistTagRelation
    extra = 1
    fields = ['tag', 'confidence']
    autocomplete_fields = ['tag']


@admin.register(Artist)
class ArtistAdmin(admin.ModelAdmin):
    list_display = [
        'name',
        'artist_type',
        'nationality',
        'birth_year',
        'has_image',
        'is_enriched',
        'total_songs',
        'view_on_site'
    ]
    list_filter = ['artist_type', 'nationality']
    search_fields = ['name', 'musicbrainz_id']
    readonly_fields = ['slug', 'created_at', 'updated_at', 'image_preview']

    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'artist_type', 'nationality')
        }),
        ('Dates', {
            'fields': ('birth_date', 'death_date')
        }),
        ('Biography', {
            'fields': ('bio',),
            'classes': ('collapse',)
        }),
        ('Image', {
            'fields': ('image', 'image_preview', 'image_credit')
        }),
        ('External Data', {
            'fields': ('musicbrainz_id',),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    inlines = [ArtistRelationshipInline, ArtistTagRelationInline]

    def birth_year(self, obj):
        if obj.birth_date:
            return obj.birth_date.year
        return '-'
    birth_year.short_description = 'Born'
    birth_year.admin_order_field = 'birth_date'

    def has_image(self, obj):
        return bool(obj.image)
    has_image.boolean = True
    has_image.short_description = 'Image'

    def is_enriched(self, obj):
        return bool(obj.musicbrainz_id)
    is_enriched.boolean = True
    is_enriched.short_description = 'Enriched'

    def total_songs(self, obj):
        count = Song.objects.filter(artist_fk=obj).count()
        return count
    total_songs.short_description = 'Songs'

    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="max-height: 200px; max-width: 300px; border-radius: 8px;" />',
                obj.image.url
            )
        return "No image uploaded"
    image_preview.short_description = 'Preview'

    def view_on_site(self, obj):
        if obj.slug:
            return format_html(
                '<a href="/artist/{}" target="_blank">View Page →</a>',
                obj.slug
            )
        return '-'
    view_on_site.short_description = 'Site'


# ========== ARTIST TAG ADMIN ==========


@admin.register(ArtistTag)
class ArtistTagAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'artist_count']
    search_fields = ['name']
    list_filter = ['category']

    def artist_count(self, obj):
        return obj.artists.count()
    artist_count.short_description = 'Artists'


# ========== ARTIST RELATIONSHIP ADMIN ==========


@admin.register(ArtistRelationship)
class ArtistRelationshipAdmin(admin.ModelAdmin):
    list_display = ['from_artist', 'relationship_type', 'to_artist']
    list_filter = ['relationship_type']
    search_fields = ['from_artist__name', 'to_artist__name']
    autocomplete_fields = ['from_artist', 'to_artist']


# ========== REGISTER MODELS ==========


admin.site.register(Song, SongAdmin)
admin.site.register(UserSongComment, CommentAdmin)
