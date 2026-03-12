#!/bin/bash

set -e

echo "Cloudflare Pages required env variables:"
echo
echo "  NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-<not-set>}"
echo
echo "Ensure this points at your public Django API, e.g.:"
echo "  https://api.yourdomain.com/api/v1"

