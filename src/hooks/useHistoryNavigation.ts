import { useEffect, useCallback } from 'react';
import { City } from '../components/CitiesPage';
import { Museum, Tour, Stop } from '../App';

export type ViewType = 'intro' | 'cities' | 'museums' | 'tours' | 'tour' | 'artpiece';

export interface HistoryState {
  view: ViewType;
  selectedCity?: City | null;
  selectedMuseum?: Museum | null;
  selectedTour?: Tour | null;
  selectedStop?: Stop | null;
  timestamp: number;
}

export interface UseHistoryNavigationProps {
  currentView: ViewType;
  selectedCity: City | null;
  selectedMuseum: Museum | null;
  selectedTour: Tour | null;
  selectedStop: Stop | null;
  setCurrentView: (view: ViewType) => void;
  setSelectedCity: (city: City | null) => void;
  setSelectedMuseum: (museum: Museum | null) => void;
  setSelectedTour: (tour: Tour | null) => void;
  setSelectedStop: (stop: Stop | null) => void;
}

export const useHistoryNavigation = ({
  currentView,
  selectedCity,
  selectedMuseum,
  selectedTour,
  selectedStop,
  setCurrentView,
  setSelectedCity,
  setSelectedMuseum,
  setSelectedTour,
  setSelectedStop,
}: UseHistoryNavigationProps) => {

  // Generate URL path based on current state
  const generatePath = useCallback((view: ViewType, city?: City | null, museum?: Museum | null, tour?: Tour | null, stop?: Stop | null): string => {
    switch (view) {
      case 'intro':
        return '/';
      case 'cities':
        return '/cities';
      case 'museums':
        return city ? `/cities/${encodeURIComponent(city.id)}/museums` : '/museums';
      case 'tours':
        return museum && city ?
          `/cities/${encodeURIComponent(city.id)}/museums/${encodeURIComponent(museum.id)}/tours` :
          '/tours';
      case 'tour':
        return tour && museum && city ?
          `/cities/${encodeURIComponent(city.id)}/museums/${encodeURIComponent(museum.id)}/tours/${encodeURIComponent(tour.id)}` :
          '/tour';
      case 'artpiece':
        return stop && tour && museum && city ?
          `/cities/${encodeURIComponent(city.id)}/museums/${encodeURIComponent(museum.id)}/tours/${encodeURIComponent(tour.id)}/artpiece/${encodeURIComponent(stop.id)}` :
          '/artpiece';
      default:
        return '/';
    }
  }, []);

  // Push a new history state
  const pushHistoryState = useCallback((
    view: ViewType,
    city?: City | null,
    museum?: Museum | null,
    tour?: Tour | null,
    stop?: Stop | null
  ) => {
    const state: HistoryState = {
      view,
      selectedCity: city,
      selectedMuseum: museum,
      selectedTour: tour,
      selectedStop: stop,
      timestamp: Date.now(),
    };

    const path = generatePath(view, city, museum, tour, stop);

    // Only push if this is a new navigation (not initial page load)
    if (window.history.state?.timestamp !== state.timestamp) {
      // When navigating between artpieces, replace the current state
      // But when navigating from tour page to artpiece, push a new state
      // This ensures back button always returns to the tour page
      if (view === 'artpiece' && window.history.state?.view === 'artpiece') {
        // Navigating from one artpiece to another - replace
        window.history.replaceState(state, '', path);
      } else {
        // All other navigations - push
        window.history.pushState(state, '', path);
      }
    }
  }, [generatePath]);

  // Handle browser back/forward navigation
  const handlePopState = useCallback((event: PopStateEvent) => {
    const state = event.state as HistoryState | null;

    if (state) {
      try {
        // Validate that referenced objects still exist before restoring state
        const isValidState = (() => {
          switch (state.view) {
            case 'intro':
            case 'cities':
              return true;
            case 'museums':
              return state.selectedCity !== null;
            case 'tours':
              return state.selectedCity !== null && state.selectedMuseum !== null;
            case 'tour':
              return state.selectedCity !== null && state.selectedMuseum !== null && state.selectedTour !== null;
            case 'artpiece':
              return state.selectedCity !== null && state.selectedMuseum !== null && state.selectedTour !== null && state.selectedStop !== null;
            default:
              return false;
          }
        })();

        if (isValidState) {
          // Restore the previous state
          setCurrentView(state.view);
          setSelectedCity(state.selectedCity || null);
          setSelectedMuseum(state.selectedMuseum || null);
          setSelectedTour(state.selectedTour || null);
          setSelectedStop(state.selectedStop || null);
        } else {
          // Invalid state, fallback to safe state
          console.warn('Invalid navigation state detected, falling back to cities view');
          setCurrentView('cities');
          setSelectedCity(null);
          setSelectedMuseum(null);
          setSelectedTour(null);
          setSelectedStop(null);
        }
      } catch (error) {
        // Error during state restoration, fallback to safe state
        console.error('Error restoring navigation state:', error);
        setCurrentView('cities');
        setSelectedCity(null);
        setSelectedMuseum(null);
        setSelectedTour(null);
        setSelectedStop(null);
      }
    } else {
      // No state means we're at the initial page load
      setCurrentView('intro');
      setSelectedCity(null);
      setSelectedMuseum(null);
      setSelectedTour(null);
      setSelectedStop(null);
    }
  }, [setCurrentView, setSelectedCity, setSelectedMuseum, setSelectedTour, setSelectedStop]);

  // Set up popstate listener
  useEffect(() => {
    window.addEventListener('popstate', handlePopState);

    // Set initial history state if none exists
    if (!window.history.state) {
      const initialState: HistoryState = {
        view: currentView,
        selectedCity,
        selectedMuseum,
        selectedTour,
        selectedStop,
        timestamp: Date.now(),
      };
      window.history.replaceState(initialState, '', generatePath(currentView, selectedCity, selectedMuseum, selectedTour, selectedStop));
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [handlePopState, currentView, selectedCity, selectedMuseum, selectedTour, selectedStop, generatePath]);

  return {
    pushHistoryState,
    generatePath,
  };
};