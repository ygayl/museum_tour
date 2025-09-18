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
- **Single-Page App**: State-based view switching with 5 main views
- **Audio System**: Dual audio players (artwork + artist) with transcript support
- **Analytics**: Comprehensive user behavior tracking with privacy controls

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

- **App.tsx**: Main application with 5-view state management
- **Hero.tsx**: Landing page component
- **CitiesPage.tsx**: City selection grid
- **MuseumsPage.tsx**: Museum selection grid (filtered by city)
- **TourSelectionPage.tsx**: Tour selection grid (filtered by museum)
- **TourPage.tsx**: Individual tour experience with accordion stops
- **AudioPlayer.tsx**: Custom audio player with transcript support
- **ProgressBar.tsx**: Clickable progress visualization
- **CompletionCelebration.tsx**: Tour completion experience

### Tour Progress System

The `useTourProgress` hook (src/hooks/useTourProgress.ts) manages sophisticated progress logic:
- **Dual Audio Completion**: Stops auto-complete when BOTH artwork and artist audios reach 80%
- **Manual Override**: Users can manually mark stops as complete with visual feedback
- **Persistent Storage**: localStorage with tour-specific keys and error handling
- **Real-time Callbacks**: Progress updates trigger UI changes and analytics events

### Audio System Architecture

- **Dual Audio Strategy**: Separate artwork narration and artist biography per stop
- **Transcript Feature**: Collapsible transcripts with preview/expand functionality
- **Progress Tracking**: Real-time progress callbacks for auto-completion logic
- **Media Session API**: Enhanced mobile audio controls and notifications
- **Custom Controls**: Play/pause, seek bar, time display with museum-themed styling

### Tour Experience (TourPage.tsx)

- **Accordion Interface**: Single-stop expansion with URL hash synchronization
- **Deep Linking**: Direct access to specific stops via URL fragments
- **Responsive Design**: Mobile (full-width cards) vs Desktop (compact thumbnails)
- **Keyboard Navigation**: Arrow keys, Enter, Space for accessibility
- **Completion States**: Visual feedback with checkmarks and opacity changes

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
3. **State-Driven Navigation**: 5-view system with context preservation
4. **Progress Persistence**: localStorage sync with error handling and cleanup
5. **Analytics Pipeline**: Event-driven tracking with consent management

### URL Management

- **Hash Routing**: Deep linking to specific tour stops (`#stop-id`)
- **State Synchronization**: URL updates on accordion open/close
- **Clean URLs**: Hash removal when returning to collapsed state
- **Navigation History**: Proper browser back/forward support

### Key Architectural Patterns

- **Container/Presentational**: App.tsx as smart container, pages as presentational components
- **Custom Hooks**: `useTourProgress` and `useAnalytics` for complex state logic
- **Render Props Pattern**: Progress callbacks and analytics event handlers
- **Progressive Enhancement**: Core functionality works without JavaScript, enhanced with React
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