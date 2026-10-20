#!/usr/bin/env bash
# Switch motorhome.co.in on, once GoDaddy's A record points at the server. Refuses to run before
# that (Caddy can't get the HTTPS certificate until the domain resolves here). Safe to re-run.
# Usage (from the repo, Git Bash): deploy/go-live.sh
set -euo pipefail
HOST="${DEPLOY_HOST:-root@187.126.126.115}"
KEY="${DEPLOY_KEY:-$HOME/.ssh/motorhome_vps}"
IP="${HOST#*@}"
ssh_() { ssh -i "$KEY" -o BatchMode=yes "$HOST" "$@"; }

echo "→ checking DNS (Google + Cloudflare resolvers)"
ok=1
for r in 8.8.8.8 1.1.1.1; do
  for name in motorhome.co.in www.motorhome.co.in; do
    got=$(ssh_ "dig +short @$r $name A | tail -1" 2>/dev/null || true)
    printf "   %-22s via %-8s → %s\n" "$name" "$r" "${got:-?}"
    [ "$got" = "$IP" ] || ok=0
  done
done
[ "$ok" = 1 ] || { echo "✗ not pointing at $IP yet — change GoDaddy's A record (@) to $IP, wait a few minutes, re-run."; exit 1; }

echo "→ installing the live web-server config"
scp -q -i "$KEY" deploy/Caddyfile "$HOST:/etc/caddy/Caddyfile.new"
ssh_ "bash -s" <<'REMOTE'
set -euo pipefail
caddy validate --config /etc/caddy/Caddyfile.new >/dev/null
mv /etc/caddy/Caddyfile.new /etc/caddy/Caddyfile
touch /srv/motorhome/LIVE
systemctl reload caddy
for i in $(seq 1 40); do curl -sf -o /dev/null https://motorhome.co.in/ && break; sleep 3; done
curl -sf -o /dev/null https://motorhome.co.in/ && echo "✓ https://motorhome.co.in is live" || { echo "✗ HTTPS not up yet — Caddy log:"; journalctl -u caddy -n 20 --no-pager -o cat; exit 1; }
curl -s -o /dev/null -w "   www → %{http_code} %{redirect_url}\n" https://www.motorhome.co.in/
echo | openssl s_client -connect motorhome.co.in:443 -servername motorhome.co.in 2>/dev/null | openssl x509 -noout -issuer -enddate | sed 's/^/   /'
REMOTE
