# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview
```

## Project Architecture

This is a React + TypeScript museum tour application built with Vite, using Tailwind CSS for styling. The app provides immersive 1-hour audio-guided tours across multiple cities and museums with comprehensive progress tracking and analytics.

### Core Application Structure

- **Hierarchical Navigation**: Cities → Museums → Tours → Individual Tour Experience
- **State Management**: React hooks with localStorage persistence for tour progress
- **Single-Page App**: State-based view switching with 6 main views (intro, cities, museums, tours, tour, artpiece)
- **Audio System**: Single audio player with transcript support
- **Analytics**: Comprehensive user behavior tracking with privacy controls
- **PWA Support**: Full Progressive Web App with service worker caching and offline support

### Key Data Models

```typescript
// Unified data structure used throughout the application (src/types/tour.ts)
interface City {
  id: string;
  name: string;
  image: string;
  description: string;
}

interface Museum {
  id: string;
  name: string;
  image: string;
  description: string;
  cityId: string;
}

// Unified Tour Schema - used in JSON and components
interface Tour {
  id: string;              // Unique tour identifier
  name: string;            // Tour display name
  museumId: string;        // Parent museum identifier
  description: string;     // Tour description
  duration: string;        // e.g., "60 minutes"
  theme: string;           // Tour theme/category
  image: string;           // Tour cover image URL
  introAudio: string;      // Introduction audio URL
  artworks: Stop[];        // Array of artworks in the tour
}

// Stop - represents a single artwork in the tour
interface Stop {
  id: string;              // Unique artwork identifier
  order: number;           // Artwork sequence number
  title: string;           // Artwork title
  artist: string;          // Artist name
  image: string;           // Artwork image URL
  audio: string;           // Narration audio URL
  narration: string;       // Audio transcript/narration text
  room: string;            // Museum room number
}
```

### Component Hierarchy

- **App.tsx**: Main application with 6-view state management and lazy loading
- **Hero.tsx**: Landing page component
- **CitiesPage.tsx**: City selection grid
- **MuseumsPage.tsx**: Museum selection grid (filtered by city)
- **TourSelectionPage.tsx**: Tour selection grid (filtered by museum)
- **TourPage.tsx**: Individual tour experience with search functionality
- **CompactAudioPlayer.tsx**: Custom audio player with progress callbacks
- **ResponsiveImage.tsx**: Optimized image component with priority loading
- **CompletionCelebration.tsx**: Tour completion experience

### Tour Progress System

The `useTourProgress` hook (src/hooks/useTourProgress.ts) manages sophisticated progress logic:
- **Audio Completion**: Stops auto-complete when audio reaches 80%
- **Manual Override**: Users can manually mark stops as complete with visual feedback
- **Session Management**: Progress resets on new sessions using sessionStorage validation
- **Persistent Storage**: localStorage with tour-specific keys and error handling
- **Real-time Callbacks**: Progress updates trigger UI changes and analytics events

### Audio System Architecture

- **Single Audio Strategy**: One narration per stop combining artwork description and artist information
- **Transcript Feature**: Full narration displayed with collapsible sections
- **Progress Tracking**: Real-time progress callbacks with auto-completion at 80%
- **Media Session API**: Enhanced mobile audio controls and notifications
- **Custom Controls**: Play/pause, seek bar, time display with museum-themed styling

### Tour Experience (TourPage.tsx)

- **Search Functionality**: Real-time filtering of tour stops with analytics tracking
- **Completion Tracking**: Visual progress indicators with checkmarks and opacity changes
- **Responsive Design**: Mobile-optimized list interface with thumbnails and metadata
- **Deep Linking**: Direct access to specific stops via URL fragments
- **Session-Based Progress**: Automatic progress reset on new sessions

### Analytics Integration

The analytics system (`src/hooks/useAnalytics.ts`, `src/lib/analytics.ts`) tracks:
- **Navigation Flow**: City → Museum → Tour selection paths
- **Tour Engagement**: Start, completion, abandonment rates
- **Audio Interactions**: Play events, completion rates by audio type
- **User Behavior**: Time spent, manual vs auto-completion patterns
- **Privacy-First**: Consent-based activation, IP anonymization, secure cookies

### Design System

- **Color Palette**: Deep navy primary (`text-museum-primary-900`), warm gold secondary (`text-museum-gold-600`), neutral grays
- **Typography**: Playfair Display serif for headings (`font-serif`), Inter sans-serif for body, light weights (`font-light`)
- **Layout Pattern**: Consistent 4/3 aspect ratio cards with hover effects across all selection pages
- **Responsive Grid**: `grid gap-6 sm:grid-cols-2 lg:grid-cols-3` pattern
- **Museum Aesthetic**: Sophisticated, accessible design suitable for cultural institutions

### Data Flow Architecture

1. **Static JSON Loading**: Cities and museums loaded from `src/data/` directory
2. **Dynamic Tour Loading**: Tours loaded on-demand via `import.meta.glob()` from hierarchical structure
3. **Hierarchical Filtering**: Data filtered by selected context (cityId → museumId)
4. **State-Driven Navigation**: 6-view system with context preservation and lazy loading
5. **Progress Persistence**: localStorage sync with session validation and error handling
6. **Analytics Pipeline**: Event-driven tracking with consent management

### URL Management

- **History Navigation Hook**: `useHistoryNavigation` manages browser history and URL generation
- **Deep Linking**: SEO-friendly URLs with hierarchical structure (e.g., `/city/museum/tour`)
- **State Synchronization**: URL updates reflect current navigation state
- **Browser Integration**: Proper back/forward support with state restoration

### Key Architectural Patterns

- **Container/Presentational**: App.tsx as smart container, pages as presentational components
- **Custom Hooks**: `useTourProgress`, `useAnalytics`, and `useHistoryNavigation` for complex state logic
- **Render Props Pattern**: Progress callbacks and analytics event handlers
- **Concurrent Rendering**: React 18's `startTransition` for non-blocking renders
- **Dynamic Imports**: Tours loaded on-demand via `import.meta.glob()` for optimal bundle splitting
- **Unified Schema**: Single tour data schema used throughout JSON files and components
- **Progressive Web App**: Service worker with strategic caching for offline support
- **Mobile-First**: Responsive design optimized for mobile museum visitors

### Asset Organization

```
public/
├── images/
│   ├── museums/     # Museum cover images
│   └── artworks/    # Individual artwork images
└── audio/           # Audio files (referenced in tour data)

src/
├── data/
│   ├── cities.json          # City metadata
│   ├── museums.json         # Museum metadata
│   └── tours/               # Hierarchical tour data
│       ├── {museumId}/      # Museum-specific tours
│       │   └── {tourId}/    # Individual tour directory
│       │       └── tour.json # Tour data with artworks
├── components/              # React components
├── hooks/                   # Custom React hooks
├── lib/                     # Utility libraries
│   ├── analytics.ts         # Analytics implementation
│   └── tourLoader.ts        # Dynamic tour loading
└── types/
    └── tour.ts              # TypeScript tour type definitions
```

### Tour Data Structure

Tour data is organized hierarchically in `src/data/tours/{museumId}/{tourId}/tour.json`:
- **Dynamic Loading**: Tours are loaded on-demand using Vite's `import.meta.glob()`
- **Hierarchical Structure**: Each museum has its own directory containing tour subdirectories
- **Unified Schema**: Tours use component-friendly field names (id, name, artworks, etc.) throughout
- **Component-Friendly**: Direct property access without conversion layers
- **Artworks Array**: Tours contain `artworks` array with essential artwork information
- **Extended Metadata**: Optional rich metadata preserved for future enhancements
- **Audio References**: Single audio file per artwork referenced via `audio` field
- **Migration Script**: Use `scripts/migrate-tours.js` to convert legacy tour data

### PWA Configuration (vite.config.ts)

- **Service Worker**: Auto-update registration with comprehensive caching strategy
- **Audio Caching**: Specialized cache handling for large audio files (50MB limit)
- **Offline Support**: Strategic caching of assets, images, and audio content
- **Bundle Optimization**: Manual chunks for vendor libraries and audio functionality
- **Performance**: Terser minification with console removal in production