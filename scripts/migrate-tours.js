#!/usr/bin/env node

/**
 * Migration script to transform tours.json into new hierarchical structure
 * From: src/data/tours.json
 * To: src/data/tours/{museumId}/{tourId}/tour.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OLD_TOURS_PATH = path.join(__dirname, '../src/data/tours.json');
const NEW_TOURS_BASE = path.join(__dirname, '../src/data/tours');

// Read the old tours.json file
console.log('Reading tours from:', OLD_TOURS_PATH);
const oldTours = JSON.parse(fs.readFileSync(OLD_TOURS_PATH, 'utf-8'));
console.log(`Found ${oldTours.length} tours to migrate\n`);

// Helper function to convert duration string to minutes
function parseDuration(durationStr) {
  const match = durationStr.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 60;
}

// Helper function to convert title to kebab-case ID
function toKebabCase(str) {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// Transform old tour format to new unified format with component-friendly field names
function transformTour(oldTour) {
  const newTour = {
    id: oldTour.id,
    name: oldTour.name,
    museumId: oldTour.museumId,
    description: oldTour.description,
    duration: oldTour.duration,  // Already in "X minutes" format
    theme: oldTour.theme || "general",
    image: oldTour.image || "",
    introAudio: oldTour.introAudio || "",
    stops: oldTour.stops.map((stop, index) => ({
      id: stop.id || toKebabCase(stop.title),
      order: index + 1,
      title: stop.title,
      artistName: stop.artistName || "",
      description: stop.description || "",
      image: stop.image || "",
      audioUrl: stop.audioUrl || stop.artworkAudioUrl || "",  // Support both old and new format
      transcript: stop.transcript || stop.artworkTranscript || "",  // Support both old and new format
      roomNumber: stop.roomNumber || "000",
      // Extended metadata fields (optional)
      floor: 0,
      approx_duration_min: Math.ceil((parseDuration(oldTour.duration) / oldTour.stops.length)),
      narration_metadata: {
        generated_at: new Date().toISOString(),
        model: "migration",
        provider: "legacy",
        canonical_source: stop.audioUrl || stop.artworkAudioUrl || "",
        word_count: (stop.transcript || stop.artworkTranscript || "").split(/\s+/).length,
        tour_position: index === 0 ? "opening" : index === oldTour.stops.length - 1 ? "closing" : "middle",
        is_adapted: false,
        notes: "Migrated from old format - single audio per stop"
      },
      metadata: {
        covered_artworks: [stop.title],
        covered_artists: [stop.artistName || ""],
        themes_discussed: [],
        style_transitions: [],
        key_insights: []
      }
    }))
  };

  return newTour;
}

// Create directory structure and write files
function migrateTours() {
  // Create base tours directory if it doesn't exist
  if (!fs.existsSync(NEW_TOURS_BASE)) {
    fs.mkdirSync(NEW_TOURS_BASE, { recursive: true });
  }

  let successCount = 0;
  let errorCount = 0;

  oldTours.forEach((oldTour) => {
    try {
      const museumId = oldTour.museumId;
      const tourId = oldTour.id;

      // Create museum directory
      const museumDir = path.join(NEW_TOURS_BASE, museumId);
      if (!fs.existsSync(museumDir)) {
        fs.mkdirSync(museumDir, { recursive: true });
      }

      // Create tour directory
      const tourDir = path.join(museumDir, tourId);
      if (!fs.existsSync(tourDir)) {
        fs.mkdirSync(tourDir, { recursive: true });
      }

      // Transform and write tour.json
      const newTour = transformTour(oldTour);
      const tourFilePath = path.join(tourDir, 'tour.json');
      fs.writeFileSync(tourFilePath, JSON.stringify(newTour, null, 2), 'utf-8');

      console.log(`✓ Migrated: ${museumId}/${tourId}`);
      successCount++;
    } catch (error) {
      console.error(`✗ Failed: ${oldTour.museumId}/${oldTour.id}`, error.message);
      errorCount++;
    }
  });

  console.log(`\n${'='.repeat(50)}`);
  console.log(`Migration complete!`);
  console.log(`Success: ${successCount}`);
  console.log(`Errors: ${errorCount}`);
  console.log(`${'='.repeat(50)}\n`);
  console.log(`New tours location: ${NEW_TOURS_BASE}`);
}

// Run migration
try {
  migrateTours();
} catch (error) {
  console.error('Migration failed:', error);
  process.exit(1);
}
