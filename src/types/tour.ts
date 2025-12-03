/**
 * Unified Tour data type definitions
 * This schema is used consistently across JSON files and components
 */

/**
 * Main Tour interface - used throughout the application
 */
export interface Tour {
  id: string;              // Unique tour identifier
  name: string;            // Tour display name
  museumId: string;        // Parent museum identifier
  description: string;     // Tour description
  duration: string;        // e.g., "60 minutes"
  theme: string;           // Tour theme/category
  image: string;           // Tour cover image URL
  introAudio: string;      // Introduction audio URL
  introNarration?: string; // Introduction narration text (optional)
  outroAudio?: string;     // Outro audio URL (optional)
  outroNarration?: string; // Outro narration text (optional)
  artworks: Stop[];        // Array of artworks in the tour
  status?: 'active' | 'coming_soon'; // Tour availability status (defaults to 'active')
}

/**
 * Stop interface - represents a single artwork in the tour
 * Note: "Stop" name maintained for backward compatibility
 */
export interface Stop {
  id: string;              // Unique artwork identifier
  order: number;           // Artwork sequence number
  title: string;           // Artwork title
  artist: string;          // Artist name
  image: string;           // Artwork image URL
  audio: string;           // Narration audio URL
  narration: string;       // Audio transcript/narration text
  room: string;            // Museum room number
  floor?: number;          // Museum floor number (optional)
  building?: string;       // Museum building/wing name (optional)
}

/**
 * Detailed metadata interfaces - preserved for future use
 * These are included in the JSON but not required for basic tour functionality
 */

export interface NarrationMetadata {
  generated_at: string;
  model: string;
  provider: string;
  canonical_source: string;
  word_count: number;
  tour_position: 'opening' | 'middle' | 'closing';
  is_adapted: boolean;
  notes?: string;
  transition_validation?: {
    validated_at: string;
    rule_check: {
      passed: boolean;
      quality: string;
      good_indicators: string[];
      issues: string[];
      first_paragraph: string;
    };
    ai_check: {
      quality: string;
      explanation: string;
      suggestions: string[] | null;
    };
  };
}

export interface StopMetadata {
  covered_artworks: string[];
  covered_artists: string[];
  themes_discussed: string[];
  style_transitions: string[];
  key_insights: string[];
}

/**
 * Extended Stop interface with full metadata - for future enhancements
 */
export interface StopWithMetadata extends Stop {
  floor: number;
  approx_duration_min: number;
  narration_metadata: NarrationMetadata;
  metadata: StopMetadata;
}
