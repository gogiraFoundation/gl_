#!/bin/bash

set -e

echo "Cloudflare Pages required env variables:"
echo
echo "  NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-<not-set>}"
echo
echo "For www.gogirlabs.uk set:"
echo "  NEXT_PUBLIC_API_URL=https://api.gogirlabs.uk/api/v1"

