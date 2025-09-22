import { useState, useEffect } from 'react';
import citiesData from './data/cities.json';
import museumsData from './data/museums.json';
import toursData from './data/tours.json';
import Header from './components/Header';
import Hero from './components/Hero';
import CitiesPage, { City } from './components/CitiesPage';
import MuseumsPage from './components/MuseumsPage';
import TourSelectionPage from './components/TourSelectionPage';
import TourPage from './components/TourPage';
import ArtPiecePage from './components/ArtPiecePage';
import CookieConsent from './components/CookieConsent';
import { useAnalytics } from './hooks/useAnalytics';
import { useHistoryNavigation } from './hooks/useHistoryNavigation';

export interface Museum {
  id: string;
  name: string;
  image: string;
  description: string;
  cityId: string;
}

export interface Tour {
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

export interface Stop {
  id: string;
  title: string;
  description: string;
  image: string;
  artworkAudioUrl: string;
  artistAudioUrl: string;
  artistName: string;
  roomNumber: string;
  artworkTranscript?: string;
  artistTranscript?: string;
}

const cities: City[] = citiesData;

const museums: Museum[] = museumsData;

const tours: Tour[] = toursData;

function App() {
  const [currentView, setCurrentView] = useState<'intro' | 'cities' | 'museums' | 'tours' | 'tour' | 'artpiece'>('intro');
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedMuseum, setSelectedMuseum] = useState<Museum | null>(null);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
  const [analyticsEnabled, setAnalyticsEnabled] = useState<boolean>(false);

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
  };

  const handleSelectCity = (city: City) => {
    setSelectedCity(city);
    setCurrentView('museums');
    pushHistoryState('museums', city);

    if (analyticsEnabled) {
      analytics.trackCitySelected(city);
    }
  };

  const handleSelectMuseum = (museum: Museum) => {
    setSelectedMuseum(museum);
    setCurrentView('tours');
    pushHistoryState('tours', selectedCity, museum);

    if (analyticsEnabled && selectedCity) {
      analytics.trackMuseumSelected(museum, selectedCity.id);
    }
  };

  const handleSelectTour = (tour: Tour) => {
    setSelectedTour(tour);
    setCurrentView('tour');
    pushHistoryState('tour', selectedCity, selectedMuseum, tour);

    if (analyticsEnabled && selectedMuseum) {
      analytics.trackTourSelected(tour, selectedMuseum.id);
    }
  };

  const handleSelectStop = (stop: Stop) => {
    setSelectedStop(stop);
    setCurrentView('artpiece');
    pushHistoryState('artpiece', selectedCity, selectedMuseum, selectedTour, stop);

    if (analyticsEnabled && selectedTour) {
      analytics.trackAudioPlay(selectedTour.id, stop.id, 'artwork');
    }
  };


  const getHeaderTitle = () => {
    switch (currentView) {
      case 'intro':
        return '1-Hour Museum Tours';
      case 'cities':
        return 'Cities';
      case 'museums':
        return selectedCity?.name || 'Museums';
      case 'tours':
        return selectedMuseum?.name || 'Tours';
      case 'tour':
        return selectedTour?.name || 'Museum Tour';
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

  // Filter tours by selected museum
  const getToursForSelectedMuseum = () => {
    if (!selectedMuseum) return tours;
    return tours.filter(tour => tour.museumId === selectedMuseum.id);
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
            {currentView === 'cities' ? (
              <CitiesPage cities={cities} onSelectCity={handleSelectCity} />
            ) : currentView === 'museums' ? (
              <MuseumsPage museums={getMuseumsForSelectedCity()} onSelectMuseum={handleSelectMuseum} />
            ) : currentView === 'tours' ? (
              <TourSelectionPage tours={getToursForSelectedMuseum()} onSelectTour={handleSelectTour} />
            ) : currentView === 'tour' ? (
              selectedTour && <TourPage
                tour={selectedTour}
                onBackToTours={() => window.history.back()}
                onSelectStop={handleSelectStop}
                analyticsEnabled={analyticsEnabled}
              />
            ) : (
              selectedStop && selectedTour && <ArtPiecePage
                stop={selectedStop}
                tour={selectedTour}
                onBackToTour={() => window.history.back()}
                analyticsEnabled={analyticsEnabled}
              />
            )}
          </main>
        </>
      )}

      {/* Cookie Consent */}
      <CookieConsent onConsentChange={setAnalyticsEnabled} />
    </div>
  );
}

export default App;