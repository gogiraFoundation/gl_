#!/bin/bash

set -e

echo "Checking critical production env vars for backend..."
echo

REQUIRED_VARS=(
  "SECRET_KEY"
  "ALLOWED_HOSTS"
  "CORS_ALLOWED_ORIGINS"
  "CSRF_TRUSTED_ORIGINS"
  "FRONTEND_URL"
)

MISSING=0

for var in "${REQUIRED_VARS[@]}"; do
  value="${!var}"
  if [ -z "$value" ]; then
    echo "  [MISSING] $var"
    MISSING=1
  else
    echo "  [OK]      $var"
  fi
done

echo
echo "DEBUG=${DEBUG:-<not-set>}"
echo "CORS_ALLOW_ALL_ORIGINS=${CORS_ALLOW_ALL_ORIGINS:-<not-set>}"

if [ "$DEBUG" != "False" ] && [ "$DEBUG" != "false" ]; then
  echo "WARNING: DEBUG is not explicitly set to False."
fi

if [ "$CORS_ALLOW_ALL_ORIGINS" = "True" ] || [ "$CORS_ALLOW_ALL_ORIGINS" = "true" ]; then
  echo "WARNING: CORS_ALLOW_ALL_ORIGINS is enabled. This should be disabled in production."
fi

exit $MISSING

