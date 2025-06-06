from django.contrib import admin
from .models import BlogPost

class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'is_published', 'published_date', 'updated_date')
    list_filter = ('is_published',)
    search_fields = ('title', 'content')
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ('published_date', 'updated_date')
    autocomplete_fields = ['related_songs']  # Much more efficient than filter_horizontal for large datasets
    
    fieldsets = (
        (None, {
            'fields': ('title', 'slug', 'meta_description', 'is_published')
        }),
        ('Content', {
            'fields': ('content', 'featured_image')
        }),
        ('Related Songs', {
            'fields': ('related_songs',),
            'description': 'Select songs that are related to this blog post. These will be displayed as "Related Hits" on the blog post page.'
        }),
        ('Timestamps', {
            'fields': ('published_date', 'updated_date'),
            'classes': ('collapse',)
        }),
    )

admin.site.register(BlogPost, BlogPostAdmin)
