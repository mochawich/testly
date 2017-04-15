"""
Django settings for testly project.
"""

import os
import sys
from distutils.util import strtobool as _strtobool

from config import load_env


def strtobool(val):
    """
    Converts a string representation of truth to True or False. Returns False if 'val' is None.
    """
    return False if val is None else bool(_strtobool(val))


TY_ENV = os.environ.get('TY_ENV', 'local')
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

print('TY_ENV:', TY_ENV)

# Load environment variables
load_env(env_name=TY_ENV)

# Security settings

ALLOWED_HOSTS = ['local.testly', 'localhost']
CORS_ORIGIN_ALLOW_ALL = True
DEBUG = strtobool(os.environ.get('TY_DEBUG'))
SECRET_KEY = 'g4&zs6a2zb7hx623=k)%c+3bpig#t084o91)n%@z-x$8dms92n'

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'django_rq',
    'rest_framework',
    'testly',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'testly.urls'
APPEND_SLASH = False

# API

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.LimitOffsetPagination',
    'PAGE_SIZE': 100,
}

# Testly

TESTS_DIR = os.path.join(BASE_DIR, 'tests')
PY_TEST_BIN = os.path.join(sys.prefix, 'bin', 'py.test')
PY_TEST_OPS = ['--reuse-db', '--no-migrations']

WSGI_APPLICATION = 'testly.wsgi.application'

# Database

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('TY_DB_NAME', 'testly'),
        'USER': os.environ.get('TY_DB_USER', 'testly_client'),
        'PASSWORD': os.environ.get('TY_DB_PASS', 'testly'),
        'HOST': os.environ.get('TY_DB_HOST', 'localhost'),
        'PORT': os.environ.get('TY_DB_PORT', '5432'),
    }
}

# Cache

REDIS_PORT = os.environ.get('REDIS_PORT', 'tcp://localhost:6379').replace('tcp', 'redis')


def gen_redis_conf(db=0):
    return {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': '{redis_port}/{db}'.format(redis_port=REDIS_PORT, db=db),
        'TIMEOUT': 300,
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        },
        'KEY_PREFIX': 'testly-{}'.format(TY_ENV),
    }


DEFAULT_CACHE_ALIAS = 'default'
SESSION_CACHE_ALIAS = 'session'
WORKER_CACHE_ALIAS = 'worker_default'

CACHES = {
    DEFAULT_CACHE_ALIAS: gen_redis_conf(1),
    SESSION_CACHE_ALIAS: gen_redis_conf(2),
    WORKER_CACHE_ALIAS: gen_redis_conf(3),
}
SESSION_ENGINE = 'django.contrib.sessions.backends.cache'

# Queues

FORCE_SYNC_RQ = strtobool(os.environ.get('TY_FORCE_SYNC_RQ'))
RQ_QUEUE_DEFAULT = 'testly-default'
RQ_QUEUES = {
    RQ_QUEUE_DEFAULT: {
        'USE_REDIS_CACHE': WORKER_CACHE_ALIAS,
        'DEFAULT_TIMEOUT': 60,
    },
}

if FORCE_SYNC_RQ:
    for queue_config in RQ_QUEUES.values():
        queue_config['ASYNC'] = False


# Internationalization

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)

STATIC_URL = '/static/'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]
