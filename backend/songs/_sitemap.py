import os
import django
import sys

# Add the root directory of your Django project to the Python path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

# Set the DJANGO_SETTINGS_MODULE environment variable
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from songs.models import Song

def generate_sitemap():
    sitemap_urls = []

    # Iterate over Song objects
    for song in Song.objects.all():
        # Construct URL using the slug
        url = f'https://pophits.org/songs/{song.slug}'
        sitemap_urls.append(url)

    # Write URLs to sitemap file
    with open('sitemap.xml', 'w') as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n')
        f.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
        for url in sitemap_urls:
            f.write(f'  <url>\n    <loc>{url}</loc>\n  </url>\n')
        f.write('</urlset>')

generate_sitemap()
