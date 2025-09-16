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

This is a React + TypeScript museum tour application built with Vite, using Tailwind CSS for styling. The app provides immersive audio-guided tours for different museums.

### Core Application Structure

- **State Management**: React hooks with localStorage persistence for tour progress
- **Routing**: Single-page app with state-based view switching (intro → museums → tour)
- **Audio System**: Custom audio player components with progress tracking
- **Tour Progress**: Persistent tracking system using `useTourProgress` hook

### Key Data Models

```typescript
// Core interfaces in src/App.tsx:30-28
interface Museum {
  id: string;
  name: string;
  theme: string;
  image: string;
  description: string;
  duration: string;
  introAudio: string;
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
}
```

### Component Hierarchy

- **App.tsx**: Main application with view state management
- **Hero.tsx**: Landing page component
- **MuseumSelectionPage.tsx**: Museum selection grid
- **TourPage.tsx**: Individual museum tour experience
- **AudioPlayer.tsx**: Reusable audio playback component
- **ProgressBar.tsx**: Tour progress visualization
- **CompletionCelebration.tsx**: Tour completion experience

### Tour Progress System

The `useTourProgress` hook (src/hooks/useTourProgress.ts) manages:
- Persistent progress tracking in localStorage
- Automatic completion when both artwork and artist audios reach 80%
- Manual completion toggling with visual feedback
- Progress percentage calculations

### Asset Organization

Images are organized in `public/images/`:
- `museums/`: Museum cover images
- `artworks/`: Individual artwork images

Audio files referenced from `/audio/` (structure defined in App.tsx data)

### Styling

- **Framework**: Tailwind CSS
- **Theme**: Warm museum aesthetic (amber/orange gradient backgrounds)
- **Responsive**: Mobile-first design
- **Typography**: Tailored for readability in museum context

### State Flow

1. **Intro View**: Hero landing page
2. **Museums View**: Grid of available museums
3. **Tour View**: Step-by-step audio tour with progress tracking

Navigation is handled through view state in App.tsx with proper scroll-to-top behavior.