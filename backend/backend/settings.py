"""
Django settings for backend project - LOCAL DEVELOPMENT VERSION.
"""

from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv
import os
# from decouple import config, Csv  # Commented out for local simplicity
# import dj_database_url            # Commented out for local simplicity

# Load environment variables from .env file (Optional for local, but good practice)
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

# =================================================
# SECURITY SETTINGS (LOCAL)
# =================================================

# We can use a simple key for localhost
SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-local-dev-key-12345')

# ALWAYS True for localhost development
DEBUG = True

# Allow localhost and 127.0.0.1
ALLOWED_HOSTS = ["*"]


# =================================================
# APPLICATION DEFINITION
# =================================================

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third-party apps
    'rest_framework',
    'corsheaders',
    'rest_framework_simplejwt',
    
    # Local apps
    'api',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # CORS must be at the top
    'django.middleware.security.SecurityMiddleware',
    # 'whitenoise.middleware.WhiteNoiseMiddleware', # NOT NEEDED LOCALLY
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'


# =================================================
# DATABASE (SQLite for Localhost)
# =================================================

# Using SQLite for local development is faster and requires no setup
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# --- PRODUCTION DB CONFIG (Saved for reference, commented out) ---
# DATABASES = {
#     'default': dj_database_url.parse(
#         config('DATABASE_URL', default='sqlite:///' + str(BASE_DIR / 'db.sqlite3')),
#         conn_max_age=600,
#         conn_health_checks=True,
#     )
# }


# =================================================
# AUTHENTICATION & PASSWORDS
# =================================================

AUTH_PASSWORD_VALIDATORS = [
    { 'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator', },
    { 'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator', },
    { 'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator', },
    { 'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator', },
]

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY, 
    'AUTH_HEADER_TYPES': ('Bearer',), 
}

# =================================================
# CORS (CROSS-ORIGIN RESOURCE SHARING)
# =================================================

# FOR LOCALHOST: Allow everything. This makes React connection easy.
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOWS_CREDENTIALS = True

# --- PRODUCTION CORS (Commented out) ---
# CSRF_TRUSTED_ORIGINS = config('CSRF_TRUSTED_ORIGINS', cast=Csv())
# CORS_ALLOWED_ORIGINS = config('CORS_ALLOWED_ORIGINS', cast=Csv())


# =================================================
# INTERNATIONALIZATION
# =================================================

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True


# =================================================
# STATIC & MEDIA FILES
# =================================================

STATIC_ROOT = BASE_DIR / "staticfiles"
STATIC_URL = "/static/"

# USE DEFAULT STORAGE LOCALLY (Whitenoise is for production)
# STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# =================================================
# THIRD PARTY KEYS
# =================================================

#GOOGLE_CLIENT_ID = os.getenv(
    #'GOOGLE_CLIENT_ID', 
   # "60255886290-9ujod65phbm7mrhb435gu4kj3qssb9ra.apps.googleusercontent.com"
#)

GOOGLE_CLIENT_ID = "60255886290-9ujod65phbm7mrhb435gu4kj3qssb9ra.apps.googleusercontent.com"