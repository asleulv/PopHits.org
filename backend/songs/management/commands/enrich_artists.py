from django.core.management.base import BaseCommand
from django.db import models
from songs.models import Artist, ArtistTag, ArtistTagRelation, ArtistRelationship
import musicbrainzngs
import time
import requests
from datetime import datetime


class Command(BaseCommand):
    help = 'Enrich artist data using MusicBrainz and Last.fm APIs with smart update detection'

    def add_arguments(self, parser):
        parser.add_argument(
            '--limit',
            type=int,
            default=10,
            help='Number of artists to process (default: 10)'
        )
        parser.add_argument(
            '--artist',
            type=str,
            help='Process specific artist by name'
        )
        parser.add_argument(
            '--lastfm-key',
            type=str,
            help='Last.fm API key for tag enrichment'
        )
        parser.add_argument(
            '--delay',
            type=float,
            default=3.0,
            help='Delay between requests in seconds (default: 3.0)'
        )

    def handle(self, *args, **options):
        # Set up MusicBrainz
        musicbrainzngs.set_useragent(
            "pophits.org",
            "1.0",
            "pophitsdotorg@gmail.com"  # Replace with your email
        )
        
        self.request_delay = options['delay']
        
        self.stdout.write(
            self.style.SUCCESS(f'🎵 Starting smart artist enrichment (delay: {self.request_delay}s)...')
        )
        
        # Get artists to process
        if options['artist']:
            artists = Artist.objects.filter(name__icontains=options['artist'])
            needs_enrichment = artists.filter(musicbrainz_id__isnull=True).count()
            already_enriched = artists.filter(musicbrainz_id__isnull=False).count()
        else:
            # Process ALL artists, prioritizing by song count
            # Calculate stats BEFORE slicing
            all_artists = Artist.objects.annotate(
                song_count=models.Count('songs')
            ).order_by('-song_count')
            
            needs_enrichment = all_artists.filter(musicbrainz_id__isnull=True).count()
            already_enriched = all_artists.filter(musicbrainz_id__isnull=False).count()
            
            # NOW apply the limit (slice at the end)
            artists = all_artists[:options['limit']]

        if not artists.exists():
            self.stdout.write(
                self.style.WARNING('No artists found to enrich')
            )
            return

        # Show stats
        self.stdout.write(f'Processing {len(list(artists))} artists:')
        self.stdout.write(f'  - {needs_enrichment} need initial enrichment')
        self.stdout.write(f'  - {already_enriched} already enriched (checking for updates)')
        self.stdout.write('')

        success_count = 0
        updated_count = 0
        skipped_count = 0
        error_count = 0

        
        for i, artist in enumerate(artists, 1):
            self.stdout.write(f'[{i}/{artists.count()}] Processing: {artist.name}')
            
            # Show status if already enriched
            if artist.musicbrainz_id:
                self.stdout.write(f'  ℹ️  Already enriched - checking for updates...')
            
            try:
                # Handle collaborations vs main artists
                if self.is_collaboration_artist(artist.name):
                    if self.enrich_collaboration_artist(artist):
                        success_count += 1
                else:
                    # Process main artists (both new and existing)
                    result = self.enrich_main_artist(artist)
                    
                    if result == 'updated':
                        updated_count += 1
                    elif result == 'success':
                        success_count += 1
                    elif result == 'no_changes':
                        skipped_count += 1
                    else:
                        error_count += 1
                    
                    # Always try to get relationships and tags for enriched artists
                    if artist.musicbrainz_id:
                        self.get_artist_relationships(artist)
                        
                        # Add Last.fm tags if API key provided
                        if options['lastfm_key']:
                            self.add_lastfm_tags(artist, options['lastfm_key'])
                    
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'  ❌ Unexpected error: {e}')
                )
                error_count += 1
            
            # Be respectful - wait between requests
            if i < artists.count():
                time.sleep(self.request_delay)
        
        # Summary
        self.stdout.write('\n' + '='*60)
        self.stdout.write(
            self.style.SUCCESS(f'✅ Newly enriched: {success_count} artists')
        )
        self.stdout.write(
            self.style.SUCCESS(f'🔄 Updated: {updated_count} artists')
        )
        self.stdout.write(
            self.style.WARNING(f'⏭️  No changes needed: {skipped_count} artists')
        )
        if error_count > 0:
            self.stdout.write(
                self.style.ERROR(f'❌ Failed: {error_count} artists')
            )
        self.stdout.write('='*60)

    def safe_musicbrainz_request(self, request_func, *args, max_retries=3, **kwargs):
        """Make MusicBrainz request with retry logic and exponential backoff"""
        for attempt in range(max_retries):
            try:
                return request_func(*args, **kwargs)
            except Exception as e:
                if attempt < max_retries - 1:
                    wait_time = (attempt + 1) * 3  # 3, 6, 9 seconds
                    self.stdout.write(f'    ⚠️  Request failed: {str(e)[:100]}...')
                    self.stdout.write(f'    ⏳ Retrying in {wait_time}s... (attempt {attempt + 1}/{max_retries})')
                    time.sleep(wait_time)
                else:
                    self.stdout.write(f'    ❌ All retries failed: {str(e)[:100]}...')
                    raise e

    def is_collaboration_artist(self, artist_name):
        """Check MusicBrainz type - if it's Group/Person, it's a real artist, not a collaboration"""
        try:
            result = self.safe_musicbrainz_request(
                musicbrainzngs.search_artists,
                artist=artist_name,
                limit=1
            )
            
            if result['artist-list']:
                mb_artist = result['artist-list'][0]
                artist_type = mb_artist.get('type', '').lower()
                
                # Real artists (registered entities)
                if artist_type in ['person', 'group', 'duo', 'orchestra', 'choir', 'collective']:
                    return False  # NOT a collaboration - it's a real artist
                
        except Exception as e:
            # If MusicBrainz lookup fails, fall back to name-based detection
            self.stdout.write(f'    ⚠️  MB lookup failed: {str(e)[:50]}..., using name parsing')
        
        # Fall back to name-based detection if MusicBrainz has no data
        collaboration_indicators = [
            ' featuring ', ' ft. ', ' ft ', ' & ', ' and ', ' with ',
            ' vs ', ' vs. ', '/', ' duet with ', ' feat. ', ' feat '
        ]
        return any(indicator in artist_name.lower() for indicator in collaboration_indicators)


    def extract_all_artists_from_collaboration(self, collab_name):
        """Extract all artist names from a collaboration string"""
        separators = [
            ' featuring ', ' feat. ', ' ft. ', ' ft ', ' with ', ' & ', 
            ' and ', ' vs. ', ' vs ', ' duet with ', '/',
        ]
        
        normalized = collab_name
        for sep in separators:
            normalized = normalized.replace(sep, '|')
            normalized = normalized.replace(sep.title(), '|')
            normalized = normalized.replace(sep.upper(), '|')
        
        artists = [a.strip() for a in normalized.split('|') if a.strip()]
        
        if len(artists) > 1:
            self.stdout.write(f'  📋 Extracted: {", ".join(artists)}')
        
        return artists

    def link_collaboration_to_main_artist(self, collaboration_artist):
        """Link collaboration artist to ALL main artists involved"""
        participating_artists = self.extract_all_artists_from_collaboration(collaboration_artist.name)
        
        if not participating_artists or len(participating_artists) < 2:
            self.stdout.write(f'  ⚠️  Could not extract multiple artists from: {collaboration_artist.name}')
            return False
        
        self.stdout.write(f'  🔍 Found {len(participating_artists)} participating artists')
        
        relationships_created = 0
        
        for artist_name in participating_artists:
            try:
                main_artist = Artist.objects.get(name=artist_name)
                
                if not main_artist.musicbrainz_id:
                    self.stdout.write(f'  ⚠️  Not enriched yet: {artist_name}')
                    continue
                
                relationship, created = ArtistRelationship.objects.get_or_create(
                    from_artist=collaboration_artist,
                    to_artist=main_artist,
                    relationship_type='collaboration',
                    defaults={'confidence': 1.0}
                )
                
                if created:
                    relationships_created += 1
                    self.stdout.write(f'  🤝 Linked: {collaboration_artist.name} → {artist_name}')
                else:
                    self.stdout.write(f'  ℹ️  Already linked: {collaboration_artist.name} → {artist_name}')
                    
            except Artist.DoesNotExist:
                self.stdout.write(f'  ⚠️  Not in database: {artist_name}')
                continue
            except Artist.MultipleObjectsReturned:
                self.stdout.write(f'  ⚠️  Multiple artists found: {artist_name}')
                continue
        
        return relationships_created > 0

    def enrich_collaboration_artist(self, artist):
        """Handle collaboration artists - DON'T enrich them, just link to main artists"""
        self.stdout.write(f'  🤝 Collaboration detected: {artist.name}')
        
        if self.link_collaboration_to_main_artist(artist):
            return True
        else:
            self.stdout.write(f'  ⚠️  Could not link collaboration')
            return False

    def enrich_main_artist(self, artist):
        """Handle main artists - check for updates if already enriched"""
        try:
            # If artist already has MusicBrainz ID, check for updates
            if artist.musicbrainz_id:
                return self.update_existing_artist(artist)
            
            # Otherwise, search for new enrichment
            result = self.safe_musicbrainz_request(
                musicbrainzngs.search_artists,
                artist=artist.name,
                limit=10
            )
            
            if not result['artist-list']:
                self.stdout.write(f'  ⚠️  No MusicBrainz match found')
                return 'no_match'
            
            # ONLY accept exact matches (case-insensitive)
            exact_match = None
            
            for mb_artist in result['artist-list']:
                if mb_artist['name'].lower() == artist.name.lower():
                    if self.validate_artist_for_billboard(mb_artist):
                        exact_match = mb_artist
                        self.stdout.write(f'  ✅ Found exact match: {mb_artist["name"]}')
                        break
            
            if not exact_match:
                self.stdout.write(f'  ❌ No exact match found')
                return 'no_match'
            
            return self.process_new_artist(artist, exact_match)
            
        except Exception as e:
            self.stdout.write(f'  ❌ Failed to enrich: {e}')
            return 'error'

    def process_new_artist(self, artist, best_match):
        """Process a NEW artist (no MusicBrainz ID yet)"""
        try:
            detailed = self.safe_musicbrainz_request(
                musicbrainzngs.get_artist_by_id,
                best_match['id'],
                includes=['area-rels', 'tags', 'annotation', 'artist-rels']  # ← 'genres' removed
            )
            
            artist_info = detailed['artist']
            updated_fields = []
            
            if not self.validate_artist_for_billboard(artist_info):
                return 'invalid'
            
            # Extract all data
            updated_fields = self.extract_artist_data(artist, artist_info)
            
            # Save artist
            artist.save()
            
            # Add tags
            self.add_musicbrainz_tags(artist, artist_info)
            
            if updated_fields:
                self.stdout.write(f'  ✅ Enriched: {", ".join(updated_fields)}')
            
            return 'success'
            
        except Exception as e:
            self.stdout.write(f'  ❌ Failed to process: {e}')
            return 'error'

    def update_existing_artist(self, artist):
        """Check for updates to an already-enriched artist"""
        try:
            detailed = self.safe_musicbrainz_request(
                musicbrainzngs.get_artist_by_id,
                artist.musicbrainz_id,
                includes=['area-rels', 'tags', 'annotation', 'artist-rels']
            )
            
            artist_info = detailed['artist']
            updated_fields = []
            
            # Check for missing or updated
            
            # Nationality
            if not artist.nationality and 'area' in artist_info:
                area_data = artist_info.get('area', {})
                if isinstance(area_data, dict) and 'name' in area_data:
                    artist.nationality = area_data['name']
                    updated_fields.append('nationality')
            
            # Death date (might have died since last enrichment)
            if not artist.death_date and 'life-span' in artist_info:
                life_span = artist_info['life-span']
                if 'end' in life_span and life_span['end']:
                    try:
                        date_str = life_span['end']
                        if len(date_str) == 10:
                            artist.death_date = datetime.strptime(date_str, "%Y-%m-%d").date()
                            updated_fields.append('death_date')
                            self.stdout.write(f'    💀 Death date added: {date_str}')
                        elif len(date_str) >= 4:
                            year = date_str[:4]
                            if year.isdigit():
                                artist.death_date = f"{year}-01-01"
                                updated_fields.append('death_date (year)')
                    except:
                        pass
            
            # Birth date
            if not artist.birth_date and 'life-span' in artist_info:
                life_span = artist_info['life-span']
                if 'begin' in life_span and life_span['begin']:
                    try:
                        date_str = life_span['begin']
                        if len(date_str) == 10:
                            artist.birth_date = datetime.strptime(date_str, "%Y-%m-%d").date()
                            updated_fields.append('birth_date')
                        elif len(date_str) >= 4:
                            year = date_str[:4]
                            if year.isdigit():
                                artist.birth_date = f"{year}-01-01"
                                updated_fields.append('birth_date (year)')
                    except:
                        pass
            
            # Bio
            if not artist.bio and 'annotation' in artist_info:
                annotation = artist_info.get('annotation', '')
                if annotation and isinstance(annotation, str):
                    artist.bio = annotation[:500]
                    updated_fields.append('bio')
            
            # Artist type
            if not artist.artist_type and 'type' in artist_info:
                mb_type = artist_info.get('type', '').lower()
                type_mapping = {
                    'person': 'person',
                    'group': 'group',
                    'duo': 'duo',
                    'collective': 'collective'
                }
                if mb_type in type_mapping:
                    artist.artist_type = type_mapping[mb_type]
                    updated_fields.append('artist_type')
            
            if updated_fields:
                artist.save()
                self.stdout.write(f'  🔄 Updated: {", ".join(updated_fields)}')
            
            # ALWAYS check for new tags - THIS IS THE KEY FIX
            tags_added = self.add_musicbrainz_tags(artist, artist_info)
            
            # Return 'updated' if EITHER fields updated OR tags added  ← FIXED
            if updated_fields or tags_added > 0:  # ← Changed from "or tags_added"
                return 'updated'
            else:
                self.stdout.write(f'  ℹ️  No updates needed')
                return 'no_changes'
                
        except Exception as e:
            self.stdout.write(f'  ❌ Update check failed: {e}')
            return 'error'


    def extract_artist_data(self, artist, artist_info):
        """Extract data from MusicBrainz artist info"""
        updated_fields = []
        
        # Nationality
        try:
            if 'area' in artist_info and not artist.nationality:
                area_data = artist_info['area']
                if isinstance(area_data, dict) and 'name' in area_data:
                    artist.nationality = area_data['name']
                    updated_fields.append('nationality')
        except:
            pass
        
        # Dates
        try:
            if 'life-span' in artist_info:
                life_span = artist_info['life-span']
                
                if 'begin' in life_span and not artist.birth_date:
                    date_str = life_span['begin']
                    if isinstance(date_str, str) and date_str:
                        if len(date_str) == 10:
                            artist.birth_date = datetime.strptime(date_str, "%Y-%m-%d").date()
                            updated_fields.append('birth_date')
                        elif len(date_str) >= 4:
                            year = date_str[:4]
                            if year.isdigit():
                                artist.birth_date = f"{year}-01-01"
                                updated_fields.append('birth_date')
                
                if 'end' in life_span and not artist.death_date:
                    date_str = life_span['end']
                    if isinstance(date_str, str) and date_str:
                        if len(date_str) == 10:
                            artist.death_date = datetime.strptime(date_str, "%Y-%m-%d").date()
                            updated_fields.append('death_date')
                        elif len(date_str) >= 4:
                            year = date_str[:4]
                            if year.isdigit():
                                artist.death_date = f"{year}-01-01"
                                updated_fields.append('death_date')
        except:
            pass
        
        # Artist type
        try:
            if 'type' in artist_info:
                mb_type = artist_info['type']
                if isinstance(mb_type, str):
                    mb_type = mb_type.lower()
                    type_mapping = {
                        'person': 'person',
                        'group': 'group',
                        'duo': 'duo',
                        'collective': 'collective'
                    }
                    if mb_type in type_mapping:
                        artist.artist_type = type_mapping[mb_type]
                        updated_fields.append('artist_type')
        except:
            pass
        
        # Bio
        try:
            if 'annotation' in artist_info and not artist.bio:
                annotation = artist_info['annotation']
                if isinstance(annotation, str) and annotation:
                    artist.bio = annotation[:500]
                    updated_fields.append('bio')
        except:
            pass
        
        # MusicBrainz ID
        if not artist.musicbrainz_id:
            artist.musicbrainz_id = artist_info['id']
            updated_fields.append('musicbrainz_id')
        
        return updated_fields

    def validate_artist_for_billboard(self, artist_info):
        """Validate that this artist makes sense for a Billboard database"""
        if 'life-span' in artist_info and 'begin' in artist_info['life-span']:
            begin_date = artist_info['life-span']['begin']
            if isinstance(begin_date, str) and len(begin_date) >= 4:
                try:
                    year = int(begin_date[:4])
                    if year < 1900:
                        self.stdout.write(f'    ❌ Rejecting pre-1900 artist: {year}')
                        return False
                except ValueError:
                    pass
        return True

    def add_musicbrainz_tags(self, artist, artist_info):
        """Extract and save genre tags - returns count of new tags added"""
        try:
            genre_tags = []
            
            # Get genres (if available - might not be in all responses)
            if 'genre-list' in artist_info and isinstance(artist_info['genre-list'], list):
                for genre in artist_info['genre-list']:
                    if isinstance(genre, dict) and 'name' in genre:
                        count = int(genre.get('count', 100))  # Convert to int
                        genre_tags.append((genre['name'], count))
            
            # Get tags - KEY CHANGE: 'tags' → 'tag-list'
            if 'tag-list' in artist_info and isinstance(artist_info['tag-list'], list):
                for tag in artist_info['tag-list']:
                    if isinstance(tag, dict) and 'name' in tag:
                        count = int(tag.get('count', 0))  # Convert to int
                        if count > 0:
                            genre_tags.append((tag['name'], count))
            
            genre_tags = sorted(genre_tags, key=lambda x: x[1], reverse=True)[:5]
            
            if not genre_tags:
                return 0
            
            tags_added = 0
            skip_tags = ['seen live', 'favorites', 'favourite', 'albums i own', 'favorite artists']
            
            for tag_name, count in genre_tags:
                if tag_name.lower() in skip_tags:
                    continue
                
                tag, tag_created = ArtistTag.objects.get_or_create(
                    name=tag_name.lower(),
                    defaults={'category': 'genre'}
                )
                
                confidence = min(count / 100, 1.0)
                relation, rel_created = ArtistTagRelation.objects.update_or_create(
                    artist=artist,
                    tag=tag,
                    defaults={
                        'confidence': confidence,
                        'source': 'musicbrainz'
                    }
                )
                
                if rel_created:
                    tags_added += 1
            
            if tags_added > 0:
                tag_names = ', '.join([t[0] for t in genre_tags[:3]])
                more = f" (+{len(genre_tags)-3} more)" if len(genre_tags) > 3 else ""
                self.stdout.write(f'  🏷️  Added {tags_added} tags: {tag_names}{more}')
            
            return tags_added
                
        except Exception as e:
            self.stdout.write(f'  ⚠️  Tag error: {e}')
            return 0


    def get_artist_relationships(self, artist):
        """Get verified relationships"""
        if not artist.musicbrainz_id:
            return
            
        try:
            detailed = self.safe_musicbrainz_request(
                musicbrainzngs.get_artist_by_id,
                artist.musicbrainz_id,
                includes=['artist-rels']
            )
            
            if 'artist-relation-list' not in detailed['artist']:
                return
                
            relationships_found = 0
            relationship_mapping = {
                'member of band': 'member_of',
                'collaboration': 'collaboration',
                'solo career of': 'solo_from',
                'side project of': 'side_project'
            }
            
            for rel in detailed['artist']['artist-relation-list']:
                try:
                    if not isinstance(rel, dict):
                        continue
                        
                    rel_type = rel.get('type')
                    if not rel_type or rel_type not in relationship_mapping:
                        continue
                    
                    artist_data = rel.get('artist')
                    if not isinstance(artist_data, dict):
                        continue
                        
                    target_mbid = artist_data.get('id')
                    if not target_mbid:
                        continue
                    
                    target_artist = Artist.objects.filter(musicbrainz_id=target_mbid).first()
                    if not target_artist:
                        continue
                    
                    from_artist = artist
                    to_artist = target_artist
                    relationship_type = relationship_mapping[rel_type]
                    
                    if rel.get('direction') == 'backward':
                        from_artist, to_artist = to_artist, from_artist
                    
                    relationship, created = ArtistRelationship.objects.get_or_create(
                        from_artist=from_artist,
                        to_artist=to_artist,
                        relationship_type=relationship_type,
                        defaults={'confidence': 1.0}
                    )
                    
                    if created:
                        relationships_found += 1
                        self.stdout.write(f'    🤝 Linked: {from_artist.name} → {to_artist.name}')
                        
                except Exception:
                    continue
            
            if relationships_found > 0:
                self.stdout.write(f'  ✅ Created {relationships_found} new relationships')
                
        except Exception as e:
            self.stdout.write(f'  ⚠️  Relationships error: {e}')

    def add_lastfm_tags(self, artist, api_key):
        """Add genre tags from Last.fm"""
        try:
            url = "http://ws.audioscrobbler.com/2.0/"
            params = {
                'method': 'artist.getTopTags',
                'artist': artist.name,
                'api_key': api_key,
                'format': 'json'
            }
            
            response = requests.get(url, params=params, timeout=15)
            if response.status_code != 200:
                return
                
            data = response.json()
            if 'toptags' not in data or 'tag' not in data['toptags']:
                return
            
            tags_added = 0
            for tag_data in data['toptags']['tag'][:5]:
                tag_name = tag_data['name'].lower()
                
                if tag_name in ['seen live', 'favorites', 'favourite']:
                    continue
                
                tag, created = ArtistTag.objects.get_or_create(
                    name=tag_name,
                    defaults={'category': 'genre'}
                )
                
                ArtistTagRelation.objects.get_or_create(
                    artist=artist,
                    tag=tag,
                    defaults={
                        'confidence': 1.0,
                        'source': 'lastfm'
                    }
                )
                
                if created:
                    tags_added += 1
            
            if tags_added > 0:
                self.stdout.write(f'  🏷️  Added {tags_added} Last.fm tags')
                
        except Exception as e:
            self.stdout.write(f'  ⚠️  Last.fm error: {e}')
