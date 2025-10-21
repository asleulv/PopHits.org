# PopHits.org Artist Database Setup Guide

Complete guide for populating the artist database with biographical data, relationships, genres, and images.

---

## Prerequisites

### Install Required Packages
```bash
pip install musicbrainzngs requests
```

### Configuration
The `enrich_artists.py` script is pre-configured with:
- **Email:** pophitsdotorg@gmail.com
- **Delay:** 3 seconds (safe for MusicBrainz API)

---

## Quick Start (Production Deployment)

### Step 1: Backup Database
**PostgreSQL**
```bash
pg_dump pophits_db > /backups/pophits_backup_$(date +%Y%m%d).sql
```

**SQLite**
```bash
cp db.sqlite3 db.sqlite3.backup_$(date +%Y%m%d)
```

### Step 2: Start Screen Session
```bash
ssh your-server
cd /path/to/pophits
source venv/bin/activate
screen -S artist_enrich
```

### Step 3: Run Setup Commands (Fast - 15 minutes)
```bash
python manage.py create_artist_objects
python manage.py link_songs_to_artists --create-missing
python manage.py migrate_artist_images
```

### Step 4: Enrich with Biographical Data (Slow - 10-12 hours)
```bash
python manage.py enrich_artists --limit 10000
```
Detach from screen: `Ctrl+A` then `D`

### Step 5: Monitor Progress
```bash
screen -r artist_enrich
python manage.py shell
```
```python
from songs.models import Artist
total = Artist.objects.count()
enriched = Artist.objects.exclude(musicbrainz_id__isnull=True).count()
print(f"{enriched}/{total} enriched ({enriched/total*100:.1f}%)")
```

---

## Management Commands Reference

### 1. create_artist_objects
Creates Artist records for every unique artist in the song database.

```bash
python manage.py create_artist_objects --dry-run
python manage.py create_artist_objects
python manage.py create_artist_objects --verbose
```

**What it does:**
- Scans all songs for unique artist names
- Creates an Artist object for each unique name
- Skips artists that already exist
- Shows stats on songs per artist

**Time:** ~2 minutes for 7,754 artists

---

### 2. link_songs_to_artists
Connects each song to its Artist object via the `artist_fk` foreign key.

```bash
python manage.py link_songs_to_artists --create-missing
python manage.py link_songs_to_artists --batch-size 500 --create-missing
```

**What it does:**
- Links songs to their Artist objects
- Uses in-memory lookup for speed
- Can auto-create missing artists with `--create-missing` flag

**Time:** ~5 minutes for 30,000+ songs

---

### 3. enrich_artists
Adds biographical data from MusicBrainz (nationality, dates, bio, genres).

```bash
python manage.py enrich_artists --limit 50
python manage.py enrich_artists --artist "Madonna"
python manage.py enrich_artists --limit 10000
python manage.py enrich_artists --limit 10000 --delay 5
python manage.py enrich_artists --limit 50 --lastfm-key YOUR_API_KEY
```

**What it does:**
- Searches MusicBrainz for exact name matches
- Adds: nationality, birth/death dates, bio, artist type
- Detects collaborations and links to main artists
- Adds genre/style tags
- Creates relationships (band members, side projects)
- Smart updates for existing artists

**Time:** 
- `--delay 3`: ~10-12 hrs  
- `--delay 5`: ~15 hrs

---

### 4. migrate_artist_images
Copies images from song records to artist records.

```bash
python manage.py migrate_artist_images --dry-run
python manage.py migrate_artist_images
python manage.py migrate_artist_images --verbose
```

**What it does:**
- Finds artists without images
- Looks for song images to copy
- Renames and moves images
- Adds credits
- **Time:** ~10 minutes for 1,000+ images

---

## Recommended Workflows

### Option A: Batch Processing (Safest)
```bash
python manage.py create_artist_objects
python manage.py link_songs_to_artists --create-missing
python manage.py migrate_artist_images
python manage.py enrich_artists --limit 1000
```

Repeat daily with `--limit 1000` for 7-8 days.

**Block risk:** <5%  
**Total time:** ~7-8 days

---

### Option B: Full Overnight Run (Moderate Risk)
```bash
screen -S enrich
python manage.py create_artist_objects
python manage.py link_songs_to_artists --create-missing
python manage.py migrate_artist_images
python manage.py enrich_artists --limit 10000
```

**Block risk:** 5–10%  
**Total time:** 10–12 hrs

---

### Option C: Ultra-Safe Marathon (Minimal Risk)
```bash
screen -S enrich
python manage.py create_artist_objects
python manage.py link_songs_to_artists --create-missing
python manage.py migrate_artist_images
python manage.py enrich_artists --limit 10000 --delay 5
```

**Block risk:** <2%  
**Total time:** ~15 hrs

---

## Automation Script
Create `scripts/enrich_all.sh`:

```bash
#!/bin/bash
set -e
LOGFILE="/var/log/pophits/artist_enrich_$(date +%Y%m%d_%H%M%S).log"
echo "🚀 Starting artist enrichment at $(date)" | tee -a "$LOGFILE"
echo "📦 Creating artists and linking songs..." | tee -a "$LOGFILE"
python manage.py create_artist_objects 2>&1 | tee -a "$LOGFILE"
python manage.py link_songs_to_artists --create-missing 2>&1 | tee -a "$LOGFILE"
echo "🎵 Enriching with biographical data..." | tee -a "$LOGFILE"
python manage.py enrich_artists --limit 10000 2>&1 | tee -a "$LOGFILE"
echo "🖼️ Migrating images..." | tee -a "$LOGFILE"
python manage.py migrate_artist_images 2>&1 | tee -a "$LOGFILE"
echo "✅ Complete at $(date)" | tee -a "$LOGFILE"
python manage.py shell << EOF
from songs.models import Artist
total = Artist.objects.count()
enriched = Artist.objects.exclude(musicbrainz_id__isnull=True).count()
with_images = Artist.objects.exclude(image='').count()
print(f"Total: {total} | Enriched: {enriched} | Images: {with_images}")
EOF
```

**Usage:**
```bash
chmod +x scripts/enrich_all.sh
screen -S enrich
./scripts/enrich_all.sh
Ctrl+A then D
```

---

## Monitoring & Troubleshooting

### Check Progress (Django Shell)
```python
from songs.models import Artist, ArtistTagRelation
from django.db.models import Count

total = Artist.objects.count()
enriched = Artist.objects.exclude(musicbrainz_id__isnull=True).count()
with_images = Artist.objects.exclude(image='').count()
with_tags = Artist.objects.filter(artisttagrelation__isnull=False).distinct().count()

print(f"Total: {total}")
print(f"Enriched: {enriched} ({enriched/total*100:.1f}%)")
print(f"With images: {with_images}")
print(f"With tags: {with_tags}")
```

---

### If Script Crashes
```bash
python manage.py enrich_artists --limit 10000
```

### If Rate Limited / Blocked
```bash
python manage.py enrich_artists --limit 10000 --delay 5
```

### Emergency Stop
```bash
ps aux | grep enrich_artists
kill <process_id>
```

---

## MusicBrainz Rate Limit Guidelines

| Delay | Strategy | Block Risk | Time |
|-------|-----------|-------------|------|
| 3s | Batch (1000) | <5% | 10–12 hrs |
| 3s | Full | 5–10% | 10–12 hrs |
| 5s | Batch | <2% | 15 hrs |
| 5s | Full | <3% | 15 hrs |

---

## Time Estimates

| Phase | Duration | Description |
|--------|-----------|-------------|
| Setup | 15–20 min | Artist creation, linking, images |
| Enrichment | 10–15 hrs | MusicBrainz enrichment |

---

## Post-Deployment Verification
```python
from songs.models import Artist
from django.db.models import Count

stats = {
'total': Artist.objects.count(),
'enriched': Artist.objects.exclude(musicbrainz_id__isnull=True).count(),
'with_images': Artist.objects.exclude(image='').count(),
'with_bio': Artist.objects.exclude(bio='').count(),
'with_nationality': Artist.objects.exclude(nationality__isnull=True).count(),
'with_tags': Artist.objects.filter(artisttagrelation__isnull=False).distinct().count()
}

for key, val in stats.items():
    pct = f"({val/stats['total']*100:.1f}%)" if stats['total'] else ""
    print(f"{key}: {val} {pct}")
```

---

## Support

- **MusicBrainz Docs:** [MusicBrainz_API](https://musicbrainz.org/doc/MusicBrainz_API)
- **Rate Limiting:** [API Limits](https://musicbrainz.org/doc/MusicBrainz_API/Rate_Limiting)
- **Contact:** [About/Contact_Us](https://musicbrainz.org/doc/About/Contact_Us)
- **Last.fm API Key:** [Create Key](https://www.last.fm/api/account/create)

---

**Last Updated:** October 21, 2025  
**Author:** PopHits.org Development Team  
**Email:** pophitsdotorg@gmail.com
