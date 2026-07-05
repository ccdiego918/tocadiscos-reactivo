#!/usr/bin/env bash
set -e

URL_FILE="/tmp/tunnel_url.txt"

cloudflared tunnel --url http://localhost:8000 2>&1 | while IFS= read -r line; do
  echo "$line"
  if [[ "$line" =~ https://[a-zA-Z0-9.-]+\.trycloudflare\.com ]]; then
    url="${BASH_REMATCH[0]}"
    echo "$url" > "$URL_FILE"
    echo "[tunnel.sh] URL capturada: $url"
  fi
done
