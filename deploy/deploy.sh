#!/usr/bin/env bash
# Ship the committed code (HEAD) to the VPS: build it beside the live copy, then switch over and
# restart. A failed build leaves the live site untouched. Keeps the last 3 builds for rollback
# (point /srv/motorhome/current at an older one and `systemctl restart motorhome`).
# Usage (from the repo, Git Bash): deploy/deploy.sh
set -euo pipefail
HOST="${DEPLOY_HOST:-root@187.126.126.115}"
KEY="${DEPLOY_KEY:-$HOME/.ssh/motorhome_vps}"
SHA="$(git rev-parse --short HEAD)"
REL="/srv/motorhome/releases/$SHA"
ssh_() { ssh -i "$KEY" -o BatchMode=yes "$HOST" "$@"; }

echo "→ uploading $SHA"
ssh_ "rm -rf $REL && mkdir -p $REL"
git archive --format=tar HEAD | ssh_ "tar -x -C $REL && chown -R app:app /srv/motorhome/releases"

echo "→ building on the server (a few minutes)"
ssh_ "bash -s" <<REMOTE
set -euo pipefail
cd $REL
sed -i 's/\r\$//' /srv/motorhome/.env  # a .env written from Windows has CRLFs -> values end in \r (broke SERVER_URL once)
ln -sfn /srv/motorhome/.env .env
sudo -u app npm ci --no-audit --no-fund --loglevel=error
sudo -u app bash -c 'set -a; . /srv/motorhome/.env; set +a; NODE_OPTIONS="--no-deprecation --max-old-space-size=3072" node node_modules/next/dist/bin/next build' | tail -5
# Resized photos (next/image) are kept across deploys, so visitors don't wait for them again.
install -d -o app -g app /srv/motorhome/image-cache
rm -rf .next/cache/images && ln -s /srv/motorhome/image-cache .next/cache/images
install -m 644 deploy/motorhome.service /etc/systemd/system/motorhome.service
install -m 644 deploy/Caddyfile /etc/caddy/Caddyfile
systemctl daemon-reload
ln -sfn $REL /srv/motorhome/current
systemctl enable --now motorhome >/dev/null 2>&1 || true
systemctl restart motorhome
caddy validate --config /etc/caddy/Caddyfile >/dev/null && systemctl reload caddy
for i in \$(seq 1 30); do curl -sf -o /dev/null http://127.0.0.1:3000/ && break; sleep 2; done
curl -sf -o /dev/null http://127.0.0.1:3000/ && echo "✓ live: $SHA" || { echo "✗ site not answering"; journalctl -u motorhome -n 30 --no-pager; exit 1; }
ls -1dt /srv/motorhome/releases/* | tail -n +4 | xargs -r rm -rf
REMOTE
