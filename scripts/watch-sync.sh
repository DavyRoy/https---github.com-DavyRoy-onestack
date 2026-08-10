#!/usr/bin/env bash
set -e

# === НАСТРОЙ ===
REMOTE="root@5.129.249.234"
REMOTE_DIR="/srv/onestack"

RSYNC_EXCLUDES=(
  "--exclude=.git"
  "--exclude=.DS_Store"
)

RSYNC_CMD=(rsync -avz --delete "${RSYNC_EXCLUDES[@]}" ./ "$REMOTE:$REMOTE_DIR/")

echo "Первичная синхронизация…"
"${RSYNC_CMD[@]}"

echo "Запущен watch. Нажми Ctrl+C для выхода."
fswatch -or \
  -e ".*\.git/.*" \
  . | while read -r _
do
  echo "Изменения обнаружены → синк…"
  "${RSYNC_CMD[@]}" || true

  # Если хочешь авто-ребилд контейнера на сервере — раскомментируй:
  # ssh "$REMOTE" "cd $REMOTE_DIR && docker compose up -d --build web && docker compose up -d caddy"
done