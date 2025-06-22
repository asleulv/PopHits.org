from django.core.mail import send_mail
from django.conf import settings


def send_registration_email(username, email):
    subject = 'Welcome to PopHits.org – Your Pop Adventure Starts Here!'
    message = '''Welcome aboard, pop lover! 🎉

You've just joined a community of music fans exploring over 30,000 chart hits—from the birth of the Billboard Hot 100 in 1958 all the way up to today's top tracks.

🎲 Not sure where to start? Try a <a href="https://pophits.org/random">random hit</a>!
🔎 Want to explore on your own? Our <a href="https://pophits.org/songs">huge database</a> has you covered.
🧠 Think you know your stuff? Test yourself with our <a href="https://pophits.org/quiz-generator">Hit Quiz</a>.
📈 Curious about what’s hot right now? See the <a href="https://pophits.org/current-hot100">current Billboard Hot 100</a>.
📚 Learn more about the project and the chart’s history on our <a href="https://pophits.org/about">About page</a>.
👤 You can always view your profile and rating history in <a href="https://pophits.org/profile">your profile</a>.

We’re so glad you’re here. PopHits.org is more than just a music archive—it's a living, growing celebration of pop culture, powered by people like you.

Let’s dive in and discover some gems! 💿

– The PopHits.org Team
'''

    html_message = '''<html><body style="font-family: Arial, sans-serif; color: #333;">
    <p style="font-size: 24px;"><b>Welcome aboard, pop lover! 🎉</b></p>
    
    <p style="font-size: 18px;">You've just joined a community of music fans exploring over <b>30,000 chart hits</b>—from the birth of the Billboard Hot 100 in 1958 all the way up to today's top tracks, updated every Wednesday.</p>

    <ul style="font-size: 16px; line-height: 1.6;">
      <li>🎲 Not sure where to start? Try a <a href="https://pophits.org/random">random hit</a>.</li>
      <li>🔎 Want to explore on your own? Our <a href="https://pophits.org/songs">huge database</a> has you covered.</li>
      <li>🧠 Think you know your stuff? Test yourself with our <a href="https://pophits.org/quiz-generator">Hit Quiz</a>.</li>
      <li>📈 Curious about what’s hot right now? See the <a href="https://pophits.org/current-hot100">current Billboard Hot 100</a>.</li>
      <li>📚 Learn more about the project and the chart’s history on our <a href="https://pophits.org/about">About page</a>.</li>
      <li>👤 View your ratings and favorites anytime in <a href="https://pophits.org/profile">your profile</a>.</li>
    </ul>

    <p style="font-size: 16px;">PopHits.org isn’t just a site—it’s a <b>community of pop lovers</b> celebrating decades of chart-topping (and obscure!) gems together. We’re thrilled to have you join the party.</p>

    <p style="font-size: 16px;"><b>Let’s dive in and discover some gems! 💿</b></p>

    <p style="font-size: 14px; color: #999;">– The PopHits.org Team</p>
    </body></html>'''

    from_email = settings.EMAIL_HOST_USER
    recipient_list = [email]
    send_mail(subject, message, from_email, recipient_list, html_message=html_message)


def send_password_reset_email(user, uid, token):
    subject = 'Reset Your PopHits.org Password'
    reset_url = f'https://pophits.org/confirm-reset-password/{uid}/{token}'
    message = f'''Hi {user.username},

You requested a password reset for your PopHits.org account.

Click the link below to reset your password:
{reset_url}

If you did not request this, you can safely ignore this email.

– The PopHits.org Team
'''

    html_message = f'''
    <html><body style="font-family: Arial, sans-serif; color: #333;">
      <p style="font-size: 20px;"><b>Password Reset Request</b></p>
      <p style="font-size: 16px;">Hi {user.username},</p>
      <p style="font-size: 16px;">
        You requested a password reset for your PopHits.org account.<br>
        Click the button below to reset your password:
      </p>
      <p>
        <a href="{reset_url}" style="display: inline-block; padding: 12px 24px; background: #007bff; color: #fff; text-decoration: none; border-radius: 4px; font-size: 16px;">
          Reset Password
        </a>
      </p>
      <p style="font-size: 14px; color: #999;">
        If you did not request this, you can safely ignore this email.
      </p>
      <p style="font-size: 14px; color: #999;">– The PopHits.org Team</p>
    </body></html>
    '''

    from django.conf import settings
    from django.core.mail import send_mail
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [user.email]
    send_mail(subject, message, from_email, recipient_list, html_message=html_message)
