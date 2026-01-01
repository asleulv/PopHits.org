import os
import django
import sys
from datetime import datetime
import logging

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

# Added Tag to imports
from songs.models import Song, Artist, SongTag
from blog.models import BlogPost

def generate_sitemap():
    try:
        output_path = os.path.join(BASE_DIR, 'static', 'sitemap.xml')
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        today = datetime.now().strftime('%Y-%m-%d')
        sitemap_urls = []
        
        logger.info("Starting sitemap generation...")
        
        # 1. STATIC PAGES (Removed current-hot100)
        static_pages = [
            {'url': 'https://pophits.org/', 'priority': '1.0', 'changefreq': 'daily'},
            {'url': 'https://pophits.org/songs', 'priority': '0.9', 'changefreq': 'daily'},
            {'url': 'https://pophits.org/blog', 'priority': '0.9', 'changefreq': 'daily'},
            {'url': 'https://pophits.org/tags', 'priority': '0.9', 'changefreq': 'weekly'},
        ]
        sitemap_urls.extend(static_pages)
        
        # 2. YEAR PAGES
        current_year = datetime.now().year
        year_range = list(range(1958, current_year + 1))
        for year in year_range:
            sitemap_urls.append({
                'url': f'https://pophits.org/year/{year}',
                'priority': '0.8',
                'changefreq': 'monthly'
            })

        # 3. TAG THEMES (NEW REPLACEMENT FOR CHARTS)
        logger.info("Adding Tag Themes to sitemap...")
        tag_count = 0
        for tag in SongTag.objects.all():
            sitemap_urls.append({
                'url': f'https://pophits.org/tags/{tag.slug}',
                'priority': '0.8',
                'changefreq': 'weekly'
            })
            tag_count += 1
        logger.info(f"Total tags added: {tag_count}")
        
        # 4. SONG PAGES
        song_count = 0
        for song in Song.objects.all():
            sitemap_urls.append({
                'url': f'https://pophits.org/songs/{song.slug}',
                'priority': '0.7',
                'changefreq': 'monthly'
            })
            song_count += 1
        
        # 5. ARTIST PAGES
        artist_count = 0
        for artist in Artist.objects.all():
            sitemap_urls.append({
                'url': f'https://pophits.org/artist/{artist.slug}',
                'priority': '0.7',
                'changefreq': 'monthly'
            })
            artist_count += 1
        
        # 6. BLOG POSTS
        blog_count = 0
        for post in BlogPost.objects.filter(is_published=True):
            last_mod = post.updated_date.strftime('%Y-%m-%d') if post.updated_date else post.published_date.strftime('%Y-%m-%d')
            sitemap_urls.append({
                'url': f'https://pophits.org/blog/{post.slug}',
                'priority': '0.8',
                'changefreq': 'weekly',
                'lastmod': last_mod
            })
            blog_count += 1

        # WRITE TO FILE
        with open(output_path, 'w') as f:
            f.write('<?xml version="1.0" encoding="UTF-8"?>\n')
            f.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
            for item in sitemap_urls:
                f.write('  <url>\n')
                f.write(f'    <loc>{item["url"]}</loc>\n')
                f.write(f'    <lastmod>{item.get("lastmod", today)}</lastmod>\n')
                f.write(f'    <changefreq>{item["changefreq"]}</changefreq>\n')
                f.write(f'    <priority>{item["priority"]}</priority>\n')
                f.write('  </url>\n')
            f.write('</urlset>')
        
        logger.info(f"✓ Success! Total URLs: {len(sitemap_urls)}")
        
    except Exception as e:
        logger.error(f"✗ Error: {str(e)}", exc_info=True)
        sys.exit(1)

if __name__ == "__main__":
    generate_sitemap()