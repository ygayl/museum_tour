#!/bin/bash
set -euo pipefail

in_dir="${1:-.}"
out_dir="${2:-out}"
mkdir -p "$out_dir"

# Quality presets
jpg_q=72
webp_q=72

shopt -s nullglob
for f in "$in_dir"/*.jpg "$in_dir"/*.jpeg; do
  base="$(basename "${f%.*}")"
  echo ">> $base"

  for w in 360 720 1080; do
    # Resize once to JPG (smaller fallback)
    magick "$f" -strip -resize "${w}" -quality "$jpg_q" "$out_dir/${base}_${w}.jpg"
    # Convert the resized JPG to WebP (saves time vs re-decoding original)
    cwebp -q "$webp_q" "$out_dir/${base}_${w}.jpg" -o "$out_dir/${base}_${w}.webp" >/dev/null 2>&1 || true
  done
done

echo "✅ Done: $out_dir (files: *_360|720|1080.{jpg,webp})"
