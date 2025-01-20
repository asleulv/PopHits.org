from pathlib import Path
import os
from dotenv import load_dotenv

load_dotenv()

# Get the environment (default to 'development' if not set)
DJANGO_ENV = os.getenv('DJANGO_ENV', 'development')

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'

REACT_BUILD_DIR = BASE_DIR / 'frontend/build'

STATIC_ROOT = os.path.join(BASE_DIR, 'static')
STATIC_URL = '/static/'

# Include only the React build directory in STATICFILES_DIRS
STATICFILES_DIRS = [
    str(REACT_BUILD_DIR),
]


# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('SECRET_KEY')
DEBUG = os.getenv('DEBUG_MODE')
ALLOWED_HOSTS = ['localhost', '127.0.0.1', 'pophits.org','188.245.244.69']
SESSION_COOKIE_AGE = 3600

# REGISTRATION EMAIL
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_USE_SSL = False
EMAIL_HOST_USER = 'pophitsdotorg@gmail.com'  # Your Gmail address
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')
PASSWORD_RESET_TEMPLATE = 'users/email/password_reset.html'

# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "songs",
    "users",
    "rest_framework",
    "rest_framework.authtoken",
    "djoser",
    "corsheaders",
    "ckeditor",
]

CKEDITOR_CONFIGS = {
    'default': {
        'toolbar': 'full',
        'height': 300,
        'width': 800,
    },
}

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    'core.middleware.PermissionPolicyMiddleware',
    "core.middleware.RequestLoggingMiddleware"

]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://pophits.org",
    "http://pophits.org",
]

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000",
    "https://pophits.org",
    "http://pophits.org",
]

CORS_ALLOW_CREDENTIALS = True

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],
}

AUTHENTICATION_BACKENDS = [
    'users.backends.EmailBackend',
    'django.contrib.auth.backends.ModelBackend',  # default backend
]

ROOT_URLCONF = "core.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        'DIRS': [os.path.join(REACT_BUILD_DIR)],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "core.wsgi.application"


# Database

if DJANGO_ENV == 'production':
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': os.getenv('DB_NAME'),  # Production database name
            'USER': os.getenv('DB_USER'),  # Production database user
            'PASSWORD': os.getenv('DB_PASSWORD'),  # Production database password
            'HOST': os.getenv('DB_HOST', 'localhost'),  # Production host
            'PORT': os.getenv('DB_PORT', '3306'),  # Production port
        }
    }
else:  # Development
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': os.getenv('DB_NAME', 'pophits_org'),  # Development database name
            'USER': os.getenv('DB_USER', 'hairmetalclub'),  # Development database user
            'PASSWORD': os.getenv('DB_PASSWORD'),  # Development database password
            'HOST': os.getenv('DB_HOST', 'localhost'),  # Development host
            'PORT': os.getenv('DB_PORT', '3306'),  # Development port
        }
    }

# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
