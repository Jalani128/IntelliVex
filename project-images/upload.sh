#!/usr/bin/env bash
# Puts each banner in this folder on its live project as card + hero + the only gallery image
# (the old gallery image is deleted). File names are NN-id<ID>-<slug>.png.
# Usage:  bash upload.sh          -> tests project 19 only
#         bash upload.sh all      -> all 36
# Backups of the records before the change: ../backups/projects-before-image-update-2026-11-05*.json
cd "$(dirname "$0")"
API="https://154.57.211.187/intellivex/public/api/admin/projects"

files=(*-id*.png)
[ "$1" = "all" ] || files=(01-id19-*.png)

for f in "${files[@]}"; do
  id=$(echo "$f" | sed -E 's/^[0-9]+-id([0-9]+)-.*/\1/')
  title=$(curl -sk "$API/$id" | node -e "let s='';process.stdin.on('data',c=>s+=c).on('end',()=>process.stdout.write(JSON.parse(s).data.title))")
  code=$(curl -sk --max-time 60 -X POST "$API/$id" -H "Accept: application/json" -o /tmp/iv-upload.json -w "%{http_code}" \
    -F "_method=PUT" \
    -F "card_image=@$f;type=image/png" -F "card_image_alt=$title" \
    -F "hero_image=@$f;type=image/png" -F "hero_image_alt=$title" \
    -F "gallery[0][image]=@$f;type=image/png" -F "gallery[0][alt]=$title" -F "gallery[0][image_alt]=$title" -F "gallery[0][sort_order]=0")
  echo "$code  id=$id  $title"
  [ "$code" = "200" ] || head -c 300 /tmp/iv-upload.json
done
