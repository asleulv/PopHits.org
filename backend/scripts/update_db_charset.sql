-- Script to update database charset to utf8mb4 for emoji support

-- Update database character set
ALTER DATABASE pophits_org CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Update blog_blogpost table
ALTER TABLE blog_blogpost CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE blog_blogpost MODIFY content LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Update blog_blogpost_related_songs table
ALTER TABLE blog_blogpost_related_songs CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- If you have other tables that need to store emojis, add them here
-- For example:
-- ALTER TABLE songs_song CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- ALTER TABLE songs_song MODIFY review LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
