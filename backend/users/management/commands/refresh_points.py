# users/management/commands/refresh_points.py
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from users.signals import update_user_points

class Command(BaseCommand):
    help = 'Recalculates points to keep the 31-day window accurate'

    def handle(self, *args, **options):
        for user in User.objects.all():
            update_user_points(user)
        self.stdout.write("All points refreshed.")