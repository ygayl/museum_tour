import { useState, useEffect } from 'react';
import citiesData from './data/cities.json';
import museumsData from './data/museums.json';
import toursData from './data/tours.json';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import CitiesPage, { City } from './components/CitiesPage';
import MuseumsPage from './components/MuseumsPage';
import TourSelectionPage from './components/TourSelectionPage';
import TourPage from './components/TourPage';
import CookieConsent from './components/CookieConsent';
import { useAnalytics } from './hooks/useAnalytics';

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
}

const cities: City[] = citiesData;

const museums: Museum[] = museumsData;

const tours: Tour[] = toursData;

function App() {
  const [currentView, setCurrentView] = useState<'intro' | 'cities' | 'museums' | 'tours' | 'tour'>('intro');
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedMuseum, setSelectedMuseum] = useState<Museum | null>(null);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [analyticsEnabled, setAnalyticsEnabled] = useState<boolean>(false);

  const analytics = useAnalytics();

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
  };

  const handleSelectCity = (city: City) => {
    setSelectedCity(city);
    setCurrentView('museums');

    if (analyticsEnabled) {
      analytics.trackCitySelected(city);
    }
  };

  const handleSelectMuseum = (museum: Museum) => {
    setSelectedMuseum(museum);
    setCurrentView('tours');

    if (analyticsEnabled && selectedCity) {
      analytics.trackMuseumSelected(museum, selectedCity.id);
    }
  };

  const handleSelectTour = (tour: Tour) => {
    setSelectedTour(tour);
    setCurrentView('tour');

    if (analyticsEnabled && selectedMuseum) {
      analytics.trackTourSelected(tour, selectedMuseum.id);
    }
  };

  const handleBackToTours = () => {
    if (analyticsEnabled) {
      analytics.trackBackNavigation('tour', 'tours');
    }
    setCurrentView('tours');
    setSelectedTour(null);
  };

  const handleBackToMuseums = () => {
    if (analyticsEnabled) {
      analytics.trackBackNavigation('tours', 'museums');
    }
    setCurrentView('museums');
    setSelectedMuseum(null);
    setSelectedTour(null);
  };

  const handleBackToCities = () => {
    if (analyticsEnabled) {
      analytics.trackBackNavigation('museums', 'cities');
    }
    setCurrentView('cities');
    setSelectedCity(null);
    setSelectedMuseum(null);
    setSelectedTour(null);
  };

  const handleBackToIntro = () => {
    if (analyticsEnabled) {
      analytics.trackBackNavigation('cities', 'intro');
    }
    setCurrentView('intro');
    setSelectedCity(null);
    setSelectedMuseum(null);
    setSelectedTour(null);
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
      default:
        return '1-Hour Museum Tours';
    }
  };

  const getBackHandler = () => {
    switch (currentView) {
      case 'cities':
        return handleBackToIntro;
      case 'museums':
        return handleBackToCities;
      case 'tours':
        return handleBackToMuseums;
      case 'tour':
        return handleBackToTours;
      default:
        return undefined;
    }
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50/50 to-orange-50/30">
      {currentView === 'intro' ? (
        <Hero onStartTour={handleExploreCities} />
      ) : (
        <>
          <Header
            onBackClick={getBackHandler()}
            title={getHeaderTitle()}
          />
          <main className="pt-16 pb-20">
            {currentView === 'cities' ? (
              <CitiesPage cities={cities} onSelectCity={handleSelectCity} />
            ) : currentView === 'museums' ? (
              <MuseumsPage museums={getMuseumsForSelectedCity()} onSelectMuseum={handleSelectMuseum} />
            ) : currentView === 'tours' ? (
              <TourSelectionPage tours={getToursForSelectedMuseum()} onSelectTour={handleSelectTour} />
            ) : (
              selectedTour && <TourPage
                tour={selectedTour}
                onBackToTours={handleBackToTours}
                analyticsEnabled={analyticsEnabled}
              />
            )}
          </main>
          <Footer />
        </>
      )}

      {/* Cookie Consent */}
      <CookieConsent onConsentChange={setAnalyticsEnabled} />
    </div>
  );
}

export default App;