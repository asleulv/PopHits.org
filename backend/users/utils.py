from django.core.mail import send_mail
from django.conf import settings


def send_registration_email(username, email):
    subject = 'Welcome to PopHits.org!'
    message = '''Welcome aboard! Now, let's hit the jukebox!

PopHits.org boasts a database of over 20.000 hits from what we define as the golden era (1958-2008. Let's find your favorites!

🤔 Unsure where to start? Well, let's hit you with a <a href="https://pophits.org/random-hit">random hit</a>.
🥵 Looking for something specific? Dive into our <a href="https://pophits.org/songs">extensive database</a>.
🫡 You can find your profile and rating history in <a href="https://pophits.org/profile">your profile</a>.

<b>Enjoy!</b>'''
    html_message = '''<html><body>
    <p style="font-size: 24px;"><b>Welcome aboard!</b> Now, let's hit the jukebox!</p>
    <p style="font-size: 20px;">PopHits.org boasts a database of over 20.000 hits from what we define as the golden era (1958-2008). Let's find your favorites!</p>
    <p>🤔 Unsure where to start? Well, let's hit you with a <a href="https://pophits.org/">random hit</a>.</p>
    <p>🥵 Looking for something specific? Dive into our <a href="https://pophits.org/songs">extensive database</a>.</p>
    <p>🫡 You can find your profile and rating history in <a href="https://pophits.org/profile">your profile</a>.</p>
    <p><b>Enjoy!</b></p>
    </body></html>'''
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [email]
    send_mail(subject, message, from_email, recipient_list, html_message=html_message)

