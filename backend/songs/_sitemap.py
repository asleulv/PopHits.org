import os
import django
import sys
from datetime import datetime

# Add the root directory of your Django project to the Python path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

# Set the DJANGO_SETTINGS_MODULE environment variable
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from songs.models import Song
from blog.models import BlogPost

def generate_sitemap():
    # Define the output path - this should be in your static directory
    output_path = os.path.join(BASE_DIR, 'static_root', 'sitemap.xml')
    
    # Get current date for lastmod
    today = datetime.now().strftime('%Y-%m-%d')
    
    sitemap_urls = []
    
    # Add static pages
    static_pages = [
        {'url': 'https://pophits.org/', 'priority': '1.0', 'changefreq': 'daily'},
        {'url': 'https://pophits.org/songs', 'priority': '0.9', 'changefreq': 'daily'},
        {'url': 'https://pophits.org/blog', 'priority': '0.9', 'changefreq': 'daily'},
        {'url': 'https://pophits.org/current-hot100', 'priority': '0.9', 'changefreq': 'weekly'},
    ]
    
    for page in static_pages:
        sitemap_urls.append(page)
    
    # Add year pages
    current_year = datetime.now().year
    for year in range(1958, current_year + 1):
        sitemap_urls.append({
            'url': f'https://pophits.org/year/{year}',
            'priority': '0.8',
            'changefreq': 'monthly'
        })
    
    # Add song pages
    print(f"Adding songs to sitemap...")
    song_count = 0
    for song in Song.objects.all():
        sitemap_urls.append({
            'url': f'https://pophits.org/songs/{song.slug}',
            'priority': '0.7',
            'changefreq': 'monthly'
        })
        song_count += 1
        if song_count % 1000 == 0:
            print(f"Added {song_count} songs so far...")
    
    # Add blog posts
    print(f"Adding blog posts to sitemap...")
    blog_count = 0
    for post in BlogPost.objects.filter(is_published=True):
        # Use the actual last modified date for blog posts
        last_mod = post.updated_date.strftime('%Y-%m-%d') if post.updated_date else post.published_date.strftime('%Y-%m-%d')
        sitemap_urls.append({
            'url': f'https://pophits.org/blog/{post.slug}',
            'priority': '0.8',
            'changefreq': 'weekly',
            'lastmod': last_mod
        })
        blog_count += 1
    
    # Write URLs to sitemap file
    print(f"Writing sitemap to {output_path}...")
    with open(output_path, 'w') as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n')
        f.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
        
        for item in sitemap_urls:
            f.write('  <url>\n')
            f.write(f'    <loc>{item["url"]}</loc>\n')
            
            # Add lastmod if available
            if 'lastmod' in item:
                f.write(f'    <lastmod>{item["lastmod"]}</lastmod>\n')
            else:
                f.write(f'    <lastmod>{today}</lastmod>\n')
            
            # Add changefreq and priority
            f.write(f'    <changefreq>{item["changefreq"]}</changefreq>\n')
            f.write(f'    <priority>{item["priority"]}</priority>\n')
            
            f.write('  </url>\n')
        
        f.write('</urlset>')
    
    print(f"Sitemap generated with {len(sitemap_urls)} URLs ({song_count} songs, {blog_count} blog posts)")

if __name__ == "__main__":
    generate_sitemap()
