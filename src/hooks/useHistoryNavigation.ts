import { useEffect, useCallback } from 'react';
import { City } from '../components/CitiesPage';
import { Museum, Tour } from '../App';

export type ViewType = 'intro' | 'cities' | 'museums' | 'tours' | 'tour';

export interface HistoryState {
  view: ViewType;
  selectedCity?: City | null;
  selectedMuseum?: Museum | null;
  selectedTour?: Tour | null;
  timestamp: number;
}

export interface UseHistoryNavigationProps {
  currentView: ViewType;
  selectedCity: City | null;
  selectedMuseum: Museum | null;
  selectedTour: Tour | null;
  setCurrentView: (view: ViewType) => void;
  setSelectedCity: (city: City | null) => void;
  setSelectedMuseum: (museum: Museum | null) => void;
  setSelectedTour: (tour: Tour | null) => void;
}

export const useHistoryNavigation = ({
  currentView,
  selectedCity,
  selectedMuseum,
  selectedTour,
  setCurrentView,
  setSelectedCity,
  setSelectedMuseum,
  setSelectedTour,
}: UseHistoryNavigationProps) => {

  // Generate URL path based on current state
  const generatePath = useCallback((view: ViewType, city?: City | null, museum?: Museum | null, tour?: Tour | null): string => {
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
      default:
        return '/';
    }
  }, []);

  // Push a new history state
  const pushHistoryState = useCallback((
    view: ViewType,
    city?: City | null,
    museum?: Museum | null,
    tour?: Tour | null
  ) => {
    const state: HistoryState = {
      view,
      selectedCity: city,
      selectedMuseum: museum,
      selectedTour: tour,
      timestamp: Date.now(),
    };

    const path = generatePath(view, city, museum, tour);

    // Only push if this is a new navigation (not initial page load)
    if (window.history.state?.timestamp !== state.timestamp) {
      window.history.pushState(state, '', path);
    }
  }, [generatePath]);

  // Handle browser back/forward navigation
  const handlePopState = useCallback((event: PopStateEvent) => {
    const state = event.state as HistoryState | null;

    if (state) {
      // Restore the previous state
      setCurrentView(state.view);
      setSelectedCity(state.selectedCity || null);
      setSelectedMuseum(state.selectedMuseum || null);
      setSelectedTour(state.selectedTour || null);
    } else {
      // No state means we're at the initial page load
      setCurrentView('intro');
      setSelectedCity(null);
      setSelectedMuseum(null);
      setSelectedTour(null);
    }
  }, [setCurrentView, setSelectedCity, setSelectedMuseum, setSelectedTour]);

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
        timestamp: Date.now(),
      };
      window.history.replaceState(initialState, '', generatePath(currentView, selectedCity, selectedMuseum, selectedTour));
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [handlePopState, currentView, selectedCity, selectedMuseum, selectedTour, generatePath]);

  return {
    pushHistoryState,
    generatePath,
  };
};