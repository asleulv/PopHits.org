import os
import django
import sys
from datetime import datetime
import logging
import requests

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Add the root directory of your Django project to the Python path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

# Set the DJANGO_SETTINGS_MODULE environment variable
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from songs.models import Song, Artist
from blog.models import BlogPost
from songs.models import SongTimeline  # Adjust based on your model name

def generate_sitemap():
    try:
        # Define the output path
        output_path = os.path.join(BASE_DIR, 'static', 'sitemap.xml')
        
        # Ensure directory exists
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        today = datetime.now().strftime('%Y-%m-%d')
        sitemap_urls = []
        
        logger.info("Starting sitemap generation...")
        
        # Add static pages
        static_pages = [
            {'url': 'https://pophits.org/', 'priority': '1.0', 'changefreq': 'daily'},
            {'url': 'https://pophits.org/songs', 'priority': '0.9', 'changefreq': 'daily'},
            {'url': 'https://pophits.org/blog', 'priority': '0.9', 'changefreq': 'daily'},
            {'url': 'https://pophits.org/current-hot100', 'priority': '0.9', 'changefreq': 'weekly'},
        ]
        
        sitemap_urls.extend(static_pages)
        logger.info(f"Added {len(static_pages)} static pages")
        
        # Add year pages
        current_year = datetime.now().year
        year_range = list(range(1958, current_year + 1))
        for year in year_range:
            sitemap_urls.append({
                'url': f'https://pophits.org/year/{year}',
                'priority': '0.8',
                'changefreq': 'monthly'
            })
        logger.info(f"Added {len(year_range)} year pages")
        
        # Add ALL historic chart pages from database
        logger.info("Adding ALL historic chart pages to sitemap...")
        chart_count = 0
        
        # Get all unique chart dates directly from database
        chart_dates = SongTimeline.objects.values_list(
            'chart_date', flat=True
        ).distinct().order_by('chart_date')
        
        for chart_date in chart_dates:
            chart_date_str = chart_date.strftime('%Y-%m-%d')
            sitemap_urls.append({
                'url': f'https://pophits.org/charts/hot-100/{chart_date_str}',
                'priority': '0.7',
                'changefreq': 'never',
                'lastmod': chart_date_str
            })
            chart_count += 1
            if chart_count % 1000 == 0:
                logger.info(f"Added {chart_count} chart pages so far...")
        
        logger.info(f"Total chart pages added: {chart_count}")
        
        # Add song pages
        logger.info("Adding songs to sitemap...")
        song_count = 0
        for song in Song.objects.all():
            sitemap_urls.append({
                'url': f'https://pophits.org/songs/{song.slug}',
                'priority': '0.7',
                'changefreq': 'monthly'
            })
            song_count += 1
            if song_count % 1000 == 0:
                logger.info(f"Added {song_count} songs so far...")
        logger.info(f"Total songs added: {song_count}")
        
        # Add artist pages
        logger.info("Adding artists to sitemap...")
        artist_count = 0
        for artist in Artist.objects.all():
            sitemap_urls.append({
                'url': f'https://pophits.org/artist/{artist.slug}',
                'priority': '0.7',
                'changefreq': 'monthly'
            })
            artist_count += 1
            if artist_count % 500 == 0:
                logger.info(f"Added {artist_count} artists so far...")
        logger.info(f"Total artists added: {artist_count}")
        
        # Add blog posts
        logger.info("Adding blog posts to sitemap...")
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
        logger.info(f"Total blog posts added: {blog_count}")
        
        # Write sitemap to file
        logger.info(f"Writing sitemap to {output_path}...")
        with open(output_path, 'w') as f:
            f.write('<?xml version="1.0" encoding="UTF-8"?>\n')
            f.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
            
            for item in sitemap_urls:
                f.write('  <url>\n')
                f.write(f'    <loc>{item["url"]}</loc>\n')
                
                if 'lastmod' in item:
                    f.write(f'    <lastmod>{item["lastmod"]}</lastmod>\n')
                else:
                    f.write(f'    <lastmod>{today}</lastmod>\n')
                
                f.write(f'    <changefreq>{item["changefreq"]}</changefreq>\n')
                f.write(f'    <priority>{item["priority"]}</priority>\n')
                f.write('  </url>\n')
            
            f.write('</urlset>')
        
        total_urls = len(sitemap_urls)
        logger.info(f"✓ Sitemap successfully generated with {total_urls} URLs")
        logger.info(f"  - {len(static_pages)} static pages")
        logger.info(f"  - {len(year_range)} year pages")
        logger.info(f"  - {chart_count} chart pages (ALL historic dates)")
        logger.info(f"  - {song_count} songs")
        logger.info(f"  - {artist_count} artists")
        logger.info(f"  - {blog_count} blog posts")
        
    except Exception as e:
        logger.error(f"✗ Error generating sitemap: {str(e)}", exc_info=True)
        sys.exit(1)

if __name__ == "__main__":
    generate_sitemap()
