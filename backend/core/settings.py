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
    "blog",
    "rest_framework",
    "rest_framework.authtoken",
    "djoser",
    "corsheaders",
    "ckeditor",
    "tinymce",
]

# CKEditor configuration (keeping for backward compatibility)
CKEDITOR_CONFIGS = {
    'default': {
        'toolbar': 'full',
        'height': 300,
        'width': 800,
    },
}

# TinyMCE configuration
TINYMCE_DEFAULT_CONFIG = {
    'height': 360,
    'width': 800,
    'cleanup_on_startup': True,
    'custom_undo_redo_levels': 20,
    'selector': 'textarea',
    'theme': 'silver',
    'plugins': '''
        textcolor save link image media preview codesample contextmenu
        table code lists fullscreen insertdatetime nonbreaking
        contextmenu directionality searchreplace wordcount visualblocks
        visualchars code fullscreen autolink lists charmap print hr
        anchor pagebreak
    ''',
    'toolbar1': '''
        fullscreen preview bold italic underline | fontselect,
        fontsizeselect | forecolor backcolor | alignleft alignright |
        aligncenter alignjustify | indent outdent | bullist numlist table |
        | link image media | codesample |
    ''',
    'toolbar2': '''
        visualblocks visualchars |
        charmap hr pagebreak nonbreaking anchor | code |
    ''',
    'contextmenu': 'formats | link image',
    'menubar': True,
    'statusbar': True,
    'font_formats': 'Sansita=sansita,sans-serif;Open Sans=open sans,sans-serif;Andale Mono=andale mono,times;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Trebuchet MS=trebuchet ms,geneva;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings,zapf dingbats',
    'content_style': '''
        @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&family=Sansita:wght@400;700&display=swap');
        body { font-family: 'Open Sans', sans-serif; font-size: 16px; }
        h1, h2, h3, h4, h5, h6 { font-family: 'Sansita', sans-serif; }
    ''',
    'formats': {
        'h1': { 'block': 'h1', 'classes': 'font-sansita' },
        'h2': { 'block': 'h2', 'classes': 'font-sansita' },
        'h3': { 'block': 'h3', 'classes': 'font-sansita' },
        'h4': { 'block': 'h4', 'classes': 'font-sansita' },
        'h5': { 'block': 'h5', 'classes': 'font-sansita' },
        'h6': { 'block': 'h6', 'classes': 'font-sansita' },
        'p': { 'block': 'p', 'classes': 'font-opensans' },
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
    "http://localhost:3001",
    "https://pophits.org",
    "http://pophits.org",
    "http://188.245.244.69:3001",
]

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://pophits.org",
    "http://pophits.org",
    "http://188.245.244.69:3001",
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
            'OPTIONS': {
                'charset': 'utf8mb4',
                'use_unicode': True,
            },
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
            'OPTIONS': {
                'charset': 'utf8mb4',
                'use_unicode': True,
            },
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
