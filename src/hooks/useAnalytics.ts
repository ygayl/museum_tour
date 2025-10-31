import { useEffect, useRef, useMemo } from 'react';
import { MuseumAnalytics, trackPageView, initGA } from '../lib/analytics';
import { City } from '../components/CitiesPage';
import { Museum, Tour } from '../App';

// Session management
let sessionStartTime: number | null = null;
let hasInitialized = false;

export const useAnalytics = () => {
  const previousView = useRef<string | null>(null);

  // Initialize analytics on first use
  useEffect(() => {
    if (!hasInitialized) {
      initGA();
      MuseumAnalytics.trackSessionStart();
      sessionStartTime = Date.now();
      hasInitialized = true;

      // Track session end on page unload
      const handleBeforeUnload = () => {
        if (sessionStartTime) {
          const sessionDuration = Date.now() - sessionStartTime;
          MuseumAnalytics.trackSessionEnd(sessionDuration);
        }
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, []);

  // Memoize analytics tracking functions to prevent infinite render loops
  // These functions are stable and don't depend on component state
  const analytics = useMemo(() => ({
    // Page view tracking
    trackPageView: (view: string, context?: Record<string, any>) => {
      const pageTitle = getPageTitle(view, context);
      trackPageView(pageTitle);
      previousView.current = view;
    },

    // Navigation tracking
    trackCitySelected: (city: City) => {
      MuseumAnalytics.trackCitySelected(city.id, city.name);
    },

    trackMuseumSelected: (museum: Museum, cityId: string) => {
      MuseumAnalytics.trackMuseumSelected(museum.id, museum.name, cityId);
    },

    trackTourSelected: (tour: Tour, museumId: string) => {
      MuseumAnalytics.trackTourSelected(tour.id, tour.name, museumId);
    },

    // Tour engagement
    trackTourStarted: (tour: Tour) => {
      MuseumAnalytics.trackTourStarted(tour.id, tour.name);
    },

    trackTourCompleted: (tour: Tour, completionTime: number) => {
      MuseumAnalytics.trackTourCompleted(tour.id, tour.name, completionTime);
    },

    trackTourAbandoned: (tour: Tour, stopsCompleted: number, totalStops: number) => {
      MuseumAnalytics.trackTourAbandoned(tour.id, tour.name, stopsCompleted, totalStops);
    },

    // Audio interaction tracking
    trackAudioPlay: (tourId: string, stopId: string) => {
      MuseumAnalytics.trackAudioPlay(tourId, stopId);
    },

    trackAudioComplete: (tourId: string, stopId: string) => {
      MuseumAnalytics.trackAudioComplete(tourId, stopId);
    },

    // Enhanced audio tracking
    trackAudioProgress: (tourId: string, stopId: string, progressPercent: number, duration: number) => {
      MuseumAnalytics.trackAudioProgress(tourId, stopId, progressPercent, duration);
    },

    trackAudioSeek: (tourId: string, stopId: string, fromTime: number, toTime: number) => {
      MuseumAnalytics.trackAudioSeek(tourId, stopId, fromTime, toTime);
    },

    trackTranscriptInteraction: (tourId: string, stopId: string, action: 'open' | 'close') => {
      MuseumAnalytics.trackTranscriptInteraction(tourId, stopId, action);
    },

    // Content engagement tracking
    trackContentEngagement: (contentType: 'city' | 'museum' | 'tour' | 'stop', contentId: string, contentName: string, engagementType: 'view' | 'select' | 'complete') => {
      MuseumAnalytics.trackContentEngagement(contentType, contentId, contentName, engagementType);
    },

    // User journey tracking
    trackFunnelStep: (step: 'intro' | 'cities' | 'museums' | 'tours' | 'tour_started', stepNumber: number, context?: Record<string, any>) => {
      MuseumAnalytics.trackFunnelStep(step, stepNumber, context);
    },

    trackSearch: (query: string, resultsCount: number, context: 'tour_stops') => {
      MuseumAnalytics.trackSearch(query, resultsCount, context);
    },

    trackPageDuration: (page: string, durationMs: number, context?: Record<string, any>) => {
      MuseumAnalytics.trackPageDuration(page, durationMs, context);
    },

    // Progress tracking
    trackStopCompleted: (tourId: string, stopId: string, completionType: 'auto' | 'manual') => {
      MuseumAnalytics.trackStopCompleted(tourId, stopId, completionType);
    },

    // Back navigation tracking
    trackBackNavigation: (fromView: string, toView: string) => {
      MuseumAnalytics.trackEvent('back_navigation', 'navigation', `${fromView}_to_${toView}`);
    },

    // Generic event tracking
    trackEvent: (action: string, category: string, label?: string, value?: number, customParameters?: Record<string, any>) => {
      MuseumAnalytics.trackEvent(action, category, label, value, customParameters);
    },
  }), []); // Empty deps - these functions are stable

  return analytics;
};

// Helper function to generate page titles
const getPageTitle = (view: string, context?: Record<string, any>): string => {
  switch (view) {
    case 'intro':
      return 'Museum Tours - Home';
    case 'cities':
      return 'Museum Tours - Select City';
    case 'museums':
      return `Museum Tours - ${context?.cityName || 'City'} Museums`;
    case 'tours':
      return `Museum Tours - ${context?.museumName || 'Museum'} Tours`;
    case 'tour':
      return `Museum Tours - ${context?.tourName || 'Tour'} Experience`;
    default:
      return 'Museum Tours';
  }
};

// Hook for tracking user engagement patterns
export const useEngagementTracking = (tourId: string, tourName: string) => {
  const startTime = useRef<number | null>(null);
  const hasTrackedStart = useRef<boolean>(false);
  const analytics = useAnalytics();

  useEffect(() => {
    // Only track tour start once per component lifecycle
    if (!hasTrackedStart.current) {
      startTime.current = Date.now();
      hasTrackedStart.current = true;
      analytics.trackTourStarted({ id: tourId, name: tourName } as Tour);
    }

    return () => {
      // Track tour abandonment if not completed
      if (startTime.current) {
        const timeSpent = Date.now() - startTime.current;
        // This will be called when component unmounts
        // Note: Tour completion should be tracked separately when tour is actually completed
      }
    };
  }, [tourId, tourName, analytics]);

  const trackTourCompletion = (stopsCompleted: number, totalStops: number) => {
    if (startTime.current) {
      const completionTime = Date.now() - startTime.current;
      if (stopsCompleted === totalStops) {
        analytics.trackTourCompleted({ id: tourId, name: tourName } as Tour, completionTime);
      } else {
        analytics.trackTourAbandoned({ id: tourId, name: tourName } as Tour, stopsCompleted, totalStops);
      }
    }
  };

  return { trackTourCompletion };
};