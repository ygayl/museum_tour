import { useState, useEffect, lazy, Suspense } from 'react';
import citiesData from './data/cities.json';
import museumsData from './data/museums.json';
import Header from './components/Header';
import Hero from './components/Hero';
import CookieConsent from './components/CookieConsent';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import IOSInstallBanner from './components/IOSInstallBanner';
// import PWADebugger from './components/PWADebugger';
import { useAnalytics } from './hooks/useAnalytics';
import { useHistoryNavigation } from './hooks/useHistoryNavigation';
import { loadTour, loadToursForMuseum } from './lib/tourLoader';
import { Tour, Stop } from './types/tour';

// Import CitiesPage and TourPage directly for better LCP performance
import CitiesPage, { type City } from './components/CitiesPage';
import TourPage from './components/TourPage';

// Lazy load heavy components that are not needed for initial render
const MuseumsPage = lazy(() => import('./components/MuseumsPage'));
const TourSelectionPage = lazy(() => import('./components/TourSelectionPage'));
const ArtPiecePage = lazy(() => import('./components/ArtPiecePage'));

// Loading component for Suspense fallback
const PageLoading = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="animate-pulse flex space-x-4">
      <div className="rounded-full bg-museum-neutral-300 h-3 w-3"></div>
      <div className="rounded-full bg-museum-neutral-300 h-3 w-3"></div>
      <div className="rounded-full bg-museum-neutral-300 h-3 w-3"></div>
    </div>
  </div>
);

export interface Museum {
  id: string;
  name: string;
  image: string;
  description: string;
  cityId: string;
}

// Export unified Tour and Stop types for use by other components
export type { Tour, Stop };

const cities: City[] = citiesData;

const museums: Museum[] = museumsData;

// Parse URL to determine initial view (sync parsing, async tour loading happens later)
const parseInitialUrl = (): {
  view: 'intro' | 'cities' | 'museums' | 'tours' | 'tour' | 'artpiece',
  city: City | null,
  museum: Museum | null,
  tourId: string | null,
  museumId: string | null,
  stopId: string | null
} => {
  const path = window.location.pathname;

  if (path === '/' || path === '') {
    return { view: 'intro', city: null, museum: null, tourId: null, museumId: null, stopId: null };
  }

  if (path === '/cities') {
    return { view: 'cities', city: null, museum: null, tourId: null, museumId: null, stopId: null };
  }

  // Parse deep links: /cities/:cityId/museums/:museumId/tours/:tourId/artpiece/:stopId
  const segments = path.split('/').filter(s => s);

  // Handle /cities/:cityId/museums
  if (segments.length >= 3 && segments[0] === 'cities' && segments[2] === 'museums') {
    const cityId = segments[1];
    const city = cities.find(c => c.id === cityId) || null;

    // Handle /cities/:cityId/museums/:museumId/tours
    if (segments.length >= 5 && segments[4] === 'tours') {
      const museumId = segments[3];
      const museum = museums.find(m => m.id === museumId && m.cityId === cityId) || null;

      // Handle /cities/:cityId/museums/:museumId/tours/:tourId
      if (segments.length >= 6) {
        const tourId = segments[5];

        // Handle /cities/:cityId/museums/:museumId/tours/:tourId/artpiece/:stopId
        if (segments.length >= 8 && segments[6] === 'artpiece') {
          const stopId = segments[7];
          return { view: 'artpiece', city, museum, tourId, museumId, stopId };
        }

        return { view: 'tour', city, museum, tourId, museumId, stopId: null };
      }

      return { view: 'tours', city, museum, tourId: null, museumId, stopId: null };
    }

    // Handle /cities/:cityId/museums/:museumId (specific museum)
    if (segments.length === 4) {
      const museumId = segments[3];
      const museum = museums.find(m => m.id === museumId && m.cityId === cityId) || null;
      return { view: 'tours', city, museum, tourId: null, museumId, stopId: null };
    }

    return { view: 'museums', city, museum: null, tourId: null, museumId: null, stopId: null };
  }

  // Default fallback
  return { view: 'cities', city: null, museum: null, tourId: null, museumId: null, stopId: null };
};

function App() {
  const initialState = parseInitialUrl();
  const [currentView, setCurrentView] = useState<'intro' | 'cities' | 'museums' | 'tours' | 'tour' | 'artpiece'>(initialState.view);
  const [selectedCity, setSelectedCity] = useState<City | null>(initialState.city);
  const [selectedMuseum, setSelectedMuseum] = useState<Museum | null>(initialState.museum);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
  const [analyticsEnabled, setAnalyticsEnabled] = useState<boolean>(false);
  const [toursForMuseum, setToursForMuseum] = useState<Tour[]>([]);
  const [loadingTours, setLoadingTours] = useState<boolean>(false);

  const analytics = useAnalytics();

  // History navigation integration
  const { pushHistoryState } = useHistoryNavigation({
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
  });

  // Load tours when museum is selected
  useEffect(() => {
    if (selectedMuseum) {
      setLoadingTours(true);
      loadToursForMuseum(selectedMuseum.id)
        .then((tours) => {
          // Add museum image to each tour for display
          const toursWithImage = tours.map(tour => ({
            ...tour,
            image: tour.image || selectedMuseum.image
          }));
          setToursForMuseum(toursWithImage);
        })
        .catch((error) => {
          console.error('Failed to load tours:', error);
          setToursForMuseum([]);
        })
        .finally(() => {
          setLoadingTours(false);
        });
    } else {
      setToursForMuseum([]);
    }
  }, [selectedMuseum]);

  // Load tour from URL on initial load
  useEffect(() => {
    if (initialState.tourId && initialState.museumId && selectedMuseum) {
      loadTour(initialState.museumId, initialState.tourId)
        .then((tour) => {
          if (tour) {
            // Add museum image if not present
            const tourWithImage = {
              ...tour,
              image: tour.image || selectedMuseum.image
            };
            setSelectedTour(tourWithImage);

            // If there's a stop ID, find and set it
            if (initialState.stopId) {
              // Check if it's an introduction stop
              if (initialState.stopId.startsWith('intro-')) {
                // Create the introduction stop dynamically
                const introStop: Stop = {
                  id: initialState.stopId,
                  title: "Introduction",
                  image: tourWithImage.image,
                  audio: tourWithImage.introAudio,
                  artist: "",
                  room: "",
                  narration: (tourWithImage as Tour & { introNarration?: string }).introNarration || "",
                  order: 0
                };
                setSelectedStop(introStop);
              } else {
                // Regular artwork
                const stop = tour.artworks.find(s => s.id === initialState.stopId);
                setSelectedStop(stop || null);
              }
            }
          }
        })
        .catch((error) => {
          console.error('Failed to load initial tour:', error);
        });
    }
  }, [initialState.tourId, initialState.museumId, initialState.stopId, selectedMuseum]);

  // Scroll to top when view changes and track page views
  useEffect(() => {
    window.scrollTo(0, 0);

    if (analyticsEnabled) {
      const context = {
        cityName: selectedCity?.name,
        museumName: selectedMuseum?.name,
        tourName: selectedTour?.name,
      };
      analytics.trackPageView(currentView, context);
    }
  }, [currentView, analyticsEnabled, selectedCity?.name, selectedMuseum?.name, selectedTour?.name, analytics]);

  const handleExploreCities = () => {
    setCurrentView('cities');
    pushHistoryState('cities');

    if (analyticsEnabled) {
      analytics.trackFunnelStep('intro', 1);
    }
  };

  const handleSelectCity = (city: City) => {
    setSelectedCity(city);
    setCurrentView('museums');
    pushHistoryState('museums', city);

    if (analyticsEnabled) {
      analytics.trackCitySelected(city);
      analytics.trackContentEngagement('city', city.id, city.name, 'select');
      analytics.trackFunnelStep('cities', 2, { city_name: city.name });
    }
  };

  const handleSelectMuseum = (museum: Museum) => {
    setSelectedMuseum(museum);
    setCurrentView('tours');
    pushHistoryState('tours', selectedCity, museum);

    if (analyticsEnabled && selectedCity) {
      analytics.trackMuseumSelected(museum, selectedCity.id);
      analytics.trackContentEngagement('museum', museum.id, museum.name, 'select');
      analytics.trackFunnelStep('museums', 3, {
        city_name: selectedCity.name,
        museum_name: museum.name
      });
    }
  };

  const handleSelectTour = (tour: Tour) => {
    setSelectedTour(tour);
    setCurrentView('tour');
    pushHistoryState('tour', selectedCity, selectedMuseum, tour);

    if (analyticsEnabled && selectedMuseum && selectedCity) {
      analytics.trackTourSelected(tour, selectedMuseum.id);
      analytics.trackContentEngagement('tour', tour.id, tour.name, 'select');
      analytics.trackFunnelStep('tours', 4, {
        city_name: selectedCity.name,
        museum_name: selectedMuseum.name,
        tour_name: tour.name
      });
    }
  };

  const handleSelectStop = (stop: Stop) => {
    setSelectedStop(stop);
    setCurrentView('artpiece');
    pushHistoryState('artpiece', selectedCity, selectedMuseum, selectedTour, stop);

    if (analyticsEnabled && selectedTour) {
      analytics.trackAudioPlay(selectedTour.id, stop.id, 'single');
    }
  };


  const getHeaderTitle = () => {
    switch (currentView) {
      case 'intro':
        return '1-Hour Museum Tours';
      case 'cities':
        return '';
      case 'museums':
        return '';
      case 'tours':
        return '';
      case 'tour':
        return '';
      case 'artpiece':
        return '';
      default:
        return '1-Hour Museum Tours';
    }
  };

  const getBackHandler = () => {
    // Use browser history navigation for consistent behavior
    if (currentView !== 'intro') {
      return () => {
        window.history.back();
      };
    }
    return undefined;
  };

  // Filter museums by selected city
  const getMuseumsForSelectedCity = () => {
    if (!selectedCity) return museums;
    return museums.filter(museum => museum.cityId === selectedCity.id);
  };

  return (
    <div className="min-h-screen bg-museum-gradient font-sans">
      {currentView === 'intro' ? (
        <Hero onStartTour={handleExploreCities} />
      ) : (
        <>
          <Header
            onBackClick={getBackHandler()}
            title={getHeaderTitle()}
          />
          <main className={currentView === 'artpiece' ? 'pt-16' : 'pt-16 pb-8'}>
            <Suspense fallback={<PageLoading />}>
              {currentView === 'cities' ? (
                <CitiesPage cities={cities} onSelectCity={handleSelectCity} />
              ) : currentView === 'museums' ? (
                <MuseumsPage museums={getMuseumsForSelectedCity()} onSelectMuseum={handleSelectMuseum} />
              ) : currentView === 'tours' ? (
                loadingTours ? (
                  <PageLoading />
                ) : (
                  <TourSelectionPage tours={toursForMuseum} onSelectTour={handleSelectTour} />
                )
              ) : currentView === 'tour' ? (
                selectedTour ? <TourPage
                  tour={selectedTour}
                  onBackToTours={() => window.history.back()}
                  onSelectStop={handleSelectStop}
                  analyticsEnabled={analyticsEnabled}
                /> : (
                  <div className="flex items-center justify-center min-h-[50vh]">
                    <div className="text-center">
                      <p className="text-lg text-gray-600 mb-4">Tour not found</p>
                      <button
                        onClick={() => setCurrentView('cities')}
                        className="bg-museum-gold-500 text-museum-primary-900 px-6 py-2 font-normal hover:bg-museum-gold-400 transition-colors"
                      >
                        Return to Cities
                      </button>
                    </div>
                  </div>
                )
              ) : (
                selectedStop && selectedTour ? <ArtPiecePage
                  stop={selectedStop}
                  tour={selectedTour}
                  analyticsEnabled={analyticsEnabled}
                  onNextStop={handleSelectStop}
                  onCompleteTour={() => {
                    setCurrentView('tour');
                    setSelectedStop(null);
                    pushHistoryState('tour', selectedCity, selectedMuseum, selectedTour, null);
                  }}
                /> : (
                <div className="flex items-center justify-center min-h-[50vh]">
                  <div className="text-center">
                    <p className="text-lg text-gray-600 mb-4">Artwork not found</p>
                    <button
                      onClick={() => setCurrentView('cities')}
                      className="bg-museum-gold-500 text-museum-primary-900 px-6 py-2 font-normal hover:bg-museum-gold-400 transition-colors"
                    >
                      Return to Cities
                    </button>
                  </div>
                </div>
              )
            )}
            </Suspense>
          </main>
        </>
      )}

      {/* Cookie Consent */}
      <CookieConsent onConsentChange={setAnalyticsEnabled} />

      {/* iOS Install Banner */}
      <IOSInstallBanner />

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />

      {/* PWA Debugger (production only) */}
      {/* <PWADebugger /> */}
    </div>
  );
}

export default App;