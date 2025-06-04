# PopHits.org Blog Module

This module adds a blog feature to PopHits.org with support for related songs.

## Features

- Blog posts with rich text content
- Featured images for posts
- SEO optimization with meta descriptions
- Related songs section that links to songs in the database
- Admin interface for managing blog posts

## Setup Instructions

### 1. Database Migration

Run the following commands to create the necessary database tables:

```bash
python manage.py makemigrations blog
python manage.py migrate blog
```

### 2. Emoji Support (MySQL Only)

We've implemented full emoji support for blog posts:

1. Updated Django settings to use utf8mb4 charset
2. Created a migration (0002_alter_charset_to_utf8mb4.py) that automatically converts the blog tables to utf8mb4

This ensures that you can use emoji characters (like 🎵, 🎤, 🎸) in your blog posts without any additional configuration.

If you encounter any character encoding issues, make sure you've run all migrations:

```bash
python manage.py migrate blog
```

### 3. Creating Blog Posts

1. Go to the Django admin panel: http://localhost:8000/admin/
2. Navigate to the Blog section
3. Click "Add Blog Post"
4. Fill in the following fields:
   - Title: The blog post title
   - Slug: URL-friendly version of the title (auto-generated if left blank)
   - Content: Rich text content for the blog post
   - Featured Image: Upload an image to be displayed with the blog post
   - Meta Description: Brief description for SEO (max 160 characters)
   - Is Published: Check to make the post visible on the site
   - Related Songs: Select songs from the database to display in the "Related Hits" section

### 4. Accessing the Blog

- Blog listing: https://pophits.org/blog
- Individual posts: https://pophits.org/blog/[slug]

## Frontend Components

- `frontend2/src/app/blog/page.js`: Blog listing page
- `frontend2/src/app/blog/[slug]/page.js`: Blog post detail page
- `frontend2/src/components/Blog/SongPreview.js`: Component for displaying related songs

## API Endpoints

- `GET /api/blog/`: List all published blog posts
- `GET /api/blog/{slug}/`: Get a specific blog post by slug

## SEO Features

- Server-side rendering for better SEO
- OpenGraph and Twitter card metadata for social sharing
- Structured data for rich search results
- Sitemap integration
- Breadcrumb navigation
