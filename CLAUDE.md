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
- **Audio System**: Dual audio players (artwork + artist) with transcript support
- **Analytics**: Comprehensive user behavior tracking with privacy controls
- **PWA Support**: Full Progressive Web App with service worker caching and offline support

### Key Data Models

```typescript
// Hierarchical data structure in src/App.tsx
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

interface Tour {
  id: string;
  name: string;
  theme: string;
  image: string;
  description: string;
  duration: string;
  introAudio: string;
  museumId: string;
  stops: Stop[];
}

interface Stop {
  id: string;
  title: string;
  description: string;
  image: string;
  artworkAudioUrl: string;
  artistAudioUrl: string;
  artistName: string;
  roomNumber: string;
  artworkTranscript?: string;  // Added for transcript feature
  artistTranscript?: string;   // Added for transcript feature
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
- **Dual Audio Completion**: Stops auto-complete when BOTH artwork and artist audios reach 80%
- **Manual Override**: Users can manually mark stops as complete with visual feedback
- **Session Management**: Progress resets on new sessions using sessionStorage validation
- **Persistent Storage**: localStorage with tour-specific keys and error handling
- **Real-time Callbacks**: Progress updates trigger UI changes and analytics events

### Audio System Architecture

- **Dual Audio Strategy**: Separate artwork narration and artist biography per stop
- **Transcript Feature**: Collapsible transcripts with preview/expand functionality
- **Progress Tracking**: Real-time progress callbacks for auto-completion logic
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

1. **Static JSON Loading**: Cities, museums, tours loaded from `src/data/` directory
2. **Hierarchical Filtering**: Data filtered by selected context (cityId → museumId)
3. **State-Driven Navigation**: 6-view system with context preservation and lazy loading
4. **Progress Persistence**: localStorage sync with session validation and error handling
5. **Analytics Pipeline**: Event-driven tracking with consent management

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
├── data/           # Static JSON data files
├── components/     # React components
├── hooks/         # Custom React hooks
└── lib/           # Utility libraries (analytics)
```

### Tour Data Structure

Tour data in `src/data/tours.json` follows this pattern:
- Each tour belongs to a specific museum (`museumId`)
- Tours contain multiple stops with dual audio URLs
- Transcripts are optional but enhance accessibility
- Audio files should be optimized for web delivery (MP3 recommended)

### PWA Configuration (vite.config.ts)

- **Service Worker**: Auto-update registration with comprehensive caching strategy
- **Audio Caching**: Specialized cache handling for large audio files (50MB limit)
- **Offline Support**: Strategic caching of assets, images, and audio content
- **Bundle Optimization**: Manual chunks for vendor libraries and audio functionality
- **Performance**: Terser minification with console removal in production