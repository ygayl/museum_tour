#!/bin/bash
set -euo pipefail

# Quality presets
jpg_q=72
webp_q=72

convert_image() {
  local f="$1"
  local out_dir="$2"
  local base="$(basename "${f%.*}")"
  echo ">> $base"

  for w in 360 720 1080; do
    # Resize once to JPG (smaller fallback)
    magick "$f" -strip -resize "${w}" -quality "$jpg_q" "$out_dir/${base}_${w}.jpg"
    # Convert the resized JPG to WebP (saves time vs re-decoding original)
    cwebp -q "$webp_q" "$out_dir/${base}_${w}.jpg" -o "$out_dir/${base}_${w}.webp" >/dev/null 2>&1 || true
  done
}

# Check if first argument is a file or directory
input="${1:-.}"
out_dir="${2:-}"

if [[ -f "$input" ]]; then
  # Single file mode - output to same directory as input if not specified
  out_dir="${out_dir:-$(dirname "$input")}"
  mkdir -p "$out_dir"
  convert_image "$input" "$out_dir"
else
  # Directory mode - process all jpg/jpeg files
  in_dir="$input"
  out_dir="${out_dir:-out}"
  mkdir -p "$out_dir"

  shopt -s nullglob
  for f in "$in_dir"/*.jpg "$in_dir"/*.jpeg; do
    convert_image "$f" "$out_dir"
  done
fi

echo "✅ Done: $out_dir (files: *_360|720|1080.{jpg,webp})"
