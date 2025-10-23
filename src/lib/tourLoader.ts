/**
 * Dynamic tour loader using Vite's import.meta.glob
 * Loads tours from src/data/tours/{museumId}/{tourId}/tour.json
 */

import { Tour } from '../types/tour';

// Use Vite's import.meta.glob to get all tour.json files
// This will be processed at build time by Vite
const tourModules = import.meta.glob<{ default: Tour }>('/src/data/tours/**/tour.json');

/**
 * Cache for loaded tours to avoid re-importing
 */
const tourCache = new Map<string, Tour>();

/**
 * Get all available tour IDs grouped by museum
 */
export function getAvailableTours(): Record<string, string[]> {
  const toursByMuseum: Record<string, string[]> = {};

  for (const path of Object.keys(tourModules)) {
    // Path format: /src/data/tours/{museumId}/{tourId}/tour.json
    const match = path.match(/\/tours\/([^/]+)\/([^/]+)\/tour\.json$/);
    if (match) {
      const [, museumId, tourId] = match;
      if (!toursByMuseum[museumId]) {
        toursByMuseum[museumId] = [];
      }
      toursByMuseum[museumId].push(tourId);
    }
  }

  return toursByMuseum;
}

/**
 * Load a specific tour by museumId and tourId
 */
export async function loadTour(museumId: string, tourId: string): Promise<Tour | null> {
  const cacheKey = `${museumId}/${tourId}`;

  // Check cache first
  if (tourCache.has(cacheKey)) {
    return tourCache.get(cacheKey)!;
  }

  // Build the path to the tour file
  const tourPath = `/src/data/tours/${museumId}/${tourId}/tour.json`;

  // Check if the module exists
  const moduleLoader = tourModules[tourPath];
  if (!moduleLoader) {
    console.warn(`Tour not found: ${tourPath}`);
    return null;
  }

  try {
    // Dynamically import the tour
    const module = await moduleLoader();
    const tour = module.default;

    // Cache the loaded tour
    tourCache.set(cacheKey, tour);

    return tour;
  } catch (error) {
    console.error(`Failed to load tour ${cacheKey}:`, error);
    return null;
  }
}

/**
 * Load all tours for a specific museum
 */
export async function loadToursForMuseum(museumId: string): Promise<Tour[]> {
  const availableTours = getAvailableTours();
  const tourIds = availableTours[museumId] || [];

  const loadPromises = tourIds.map(tourId => loadTour(museumId, tourId));
  const tours = await Promise.all(loadPromises);

  // Filter out null values (failed loads)
  return tours.filter((tour): tour is Tour => tour !== null);
}

/**
 * Load all tours in the application
 */
export async function loadAllTours(): Promise<Tour[]> {
  const availableTours = getAvailableTours();
  const allLoadPromises: Promise<Tour | null>[] = [];

  for (const [museumId, tourIds] of Object.entries(availableTours)) {
    for (const tourId of tourIds) {
      allLoadPromises.push(loadTour(museumId, tourId));
    }
  }

  const tours = await Promise.all(allLoadPromises);

  // Filter out null values (failed loads)
  return tours.filter((tour): tour is Tour => tour !== null);
}

/**
 * Get museum IDs that have tours
 */
export function getMuseumsWithTours(): string[] {
  return Object.keys(getAvailableTours());
}

/**
 * Check if a museum has tours
 */
export function museumHasTours(museumId: string): boolean {
  const availableTours = getAvailableTours();
  return museumId in availableTours && availableTours[museumId].length > 0;
}

/**
 * Clear the tour cache (useful for testing or hot reload)
 */
export function clearTourCache(): void {
  tourCache.clear();
}
