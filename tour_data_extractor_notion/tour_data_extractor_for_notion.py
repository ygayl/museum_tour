import json
import requests
from datetime import datetime

# ---- CONFIG ----
RAW_BASE = "https://raw.githubusercontent.com/ygayl/museum_tour/main"
tour_name = "reina_sofia/reina_sofia_highlights"

RAW_JSON_URL = f"{RAW_BASE}/src/data/tours/{tour_name}/tour.json"
OUTPUT_FILE = "output.md"

SECTION_ICON = "🎨"
INTRO_ICON = "🚪"
OUTRO_ICON = "🏁"
HEADER_ICON = "🏛️"

STATUS_STRING = "✅ Validated / 🔧 Needs Update"

# Auto date: “Update Dec 2 2025”
today_str = datetime.now().strftime("%b %d %Y")
UPDATE_TAG = f"🗓️ Update {today_str}"
# --------------------------------------------


def audio_raw(url: str) -> str:
    return f"{RAW_BASE}/public{url}"


def clean(text: str) -> str:
    return text.replace("\\n\\n", "\n\n").replace("\\n", "\n")


# ---- FETCH JSON ----
response = requests.get(RAW_JSON_URL)
response.raise_for_status()
data = json.loads(response.text)


# ---- BUILD MARKDOWN ----
md = []

# Title + Update
title = data.get("name", "Tour")
md.append(f"# {HEADER_ICON} {title}")
md.append(f"**{UPDATE_TAG}**")
md.append("")

# Intro
md.append(f"## {INTRO_ICON} Intro — {STATUS_STRING}")
md.append("")
md.append(clean(data.get("introNarration", "")))
md.append("")

if "introAudio" in data:
    md.append(audio_raw(data["introAudio"]))
    md.append("")

md.append("---")
md.append("")


# Artworks
for art in data.get("artworks", []):
    md.append(f"## {SECTION_ICON} {art['title']} — {STATUS_STRING}")
    md.append("")
    md.append(clean(art["narration"]))
    md.append("")
    md.append(audio_raw(art["audio"]))
    md.append("")
    md.append("---")
    md.append("")


# Outro
if "outroNarration" in data:
    md.append(f"## {OUTRO_ICON} Outro — {STATUS_STRING}")
    md.append("")
    md.append(clean(data["outroNarration"]))
    md.append("")

if "outroAudio" in data:
    md.append(audio_raw(data["outroAudio"]))
    md.append("")

md.append("---")
md.append("")


# ---- WRITE FILE (Notion-safe) ----
with open(OUTPUT_FILE, "w", encoding="utf-8", newline="\n") as f:
    safe = "\n".join(line.rstrip() for line in md) + "\n"
    f.write(safe)

print(f"Done! Notion-compatible Markdown exported to {OUTPUT_FILE}")