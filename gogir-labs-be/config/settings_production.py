"""
Production-specific Django settings.
Imported from settings.py when DEBUG=False to apply overrides.
"""

import os

from decouple import config

# Security settings for production
SECURE_SSL_REDIRECT = config("SECURE_SSL_REDIRECT", default=True, cast=bool)
SESSION_COOKIE_SECURE = config("SESSION_COOKIE_SECURE", default=True, cast=bool)
CSRF_COOKIE_SECURE = config("CSRF_COOKIE_SECURE", default=True, cast=bool)
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = "DENY"

# HSTS settings
SECURE_HSTS_SECONDS = 31536000  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# Static files (served by nginx in production)
STATIC_ROOT = "/app/staticfiles"
MEDIA_ROOT = "/app/media"

# Logging configuration for production
LOGS_DIR = os.environ.get("DJANGO_LOG_DIR", "/app/logs")

# Only use file handler if log directory exists or can be created (e.g. skip in CI)
try:
    os.makedirs(LOGS_DIR, exist_ok=True)
    _log_handlers = ["console", "file"]
except OSError:
    _log_handlers = ["console"]

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "{levelname} {asctime} {module} {process:d} {thread:d} {message}",
            "style": "{",
        },
    },
    "handlers": {
        "console": {
            "level": "INFO",
            "class": "logging.StreamHandler",
            "formatter": "verbose",
        },
    },
    "root": {
        "handlers": _log_handlers,
        "level": "INFO",
    },
    "loggers": {
        "django": {
            "handlers": _log_handlers,
            "level": "INFO",
            "propagate": False,
        },
        "apps": {
            "handlers": _log_handlers,
            "level": "INFO",
            "propagate": False,
        },
    },
}

if "file" in _log_handlers:
    LOGGING["handlers"]["file"] = {
        "level": "INFO",
        "class": "logging.handlers.RotatingFileHandler",
        "filename": os.path.join(LOGS_DIR, "django.log"),
        "maxBytes": 1024 * 1024 * 10,  # 10 MB
        "backupCount": 5,
        "formatter": "verbose",
    }

# Email backend (use SMTP in production)
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"

# Cache configuration (use Redis in production if available)
REDIS_URL = config("REDIS_URL", default=None)
if REDIS_URL:
    try:
        CACHES = {
            "default": {
                "BACKEND": "django.core.cache.backends.redis.RedisCache",
                "LOCATION": REDIS_URL,
            }
        }
        # Session configuration with Redis
        SESSION_ENGINE = "django.contrib.sessions.backends.cache"
        SESSION_CACHE_ALIAS = "default"
    except ImportError:
        # Fallback if django-redis not installed
        pass

# Performance optimizations
CONN_MAX_AGE = 600
