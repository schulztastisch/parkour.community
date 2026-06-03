#!/bin/bash
BACKUP_DIR="$(cd "$(dirname "$0")" && pwd)"
THEME_DIR="$BACKUP_DIR/../.."
WP_ROOT="$THEME_DIR/../../.."

echo "Restoring files from $BACKUP_DIR..."

cp "$BACKUP_DIR/parkour-animation.js"  "$THEME_DIR/js/parkour-animation.js"
cp "$BACKUP_DIR/parkour-animation.css" "$THEME_DIR/css/parkour-animation.css"
cp "$BACKUP_DIR/functions.php"         "$THEME_DIR/functions.php"

echo "Restoring post 17..."
wp post update 17 \
  --post_content="$(cat "$BACKUP_DIR/post17.html")" \
  --url=https://eure.parkour.community \
  --allow-root \
  --path="$WP_ROOT"

echo "Flushing cache..."
wp cache flush --url=https://eure.parkour.community --allow-root --path="$WP_ROOT"
wp transient delete --all --url=https://eure.parkour.community --allow-root --path="$WP_ROOT"

echo "Done! Backup from $(basename $BACKUP_DIR) restored."
