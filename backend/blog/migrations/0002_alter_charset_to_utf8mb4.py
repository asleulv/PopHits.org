from django.db import migrations


class Migration(migrations.Migration):
    """
    Migration to alter the character set of blog tables to utf8mb4
    to support emoji characters.
    """

    dependencies = [
        ('blog', '0001_initial'),
    ]

    operations = [
        migrations.RunSQL(
            sql=[
                "ALTER TABLE blog_blogpost CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;",
                "ALTER TABLE blog_blogpost MODIFY content LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;",
                "ALTER TABLE blog_blogpost_related_songs CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;",
            ],
            reverse_sql=[
                "ALTER TABLE blog_blogpost CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;",
                "ALTER TABLE blog_blogpost MODIFY content LONGTEXT CHARACTER SET utf8 COLLATE utf8_general_ci;",
                "ALTER TABLE blog_blogpost_related_songs CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;",
            ]
        ),
    ]
