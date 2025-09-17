import { useState, useEffect } from 'react';
import citiesData from './data/cities.json';
import museumsData from './data/museums.json';
import toursData from './data/tours.json';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import CitiesPage, { City } from './components/CitiesPage';
import TourSelectionPage from './components/TourSelectionPage';
import TourPage from './components/TourPage';

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
  const [currentView, setCurrentView] = useState<'intro' | 'cities' | 'tours' | 'tour'>('intro');
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  const handleExploreCities = () => {
    setCurrentView('cities');
  };

  const handleSelectCity = (city: City) => {
    setSelectedCity(city);
    setCurrentView('tours');
  };

  const handleSelectTour = (tour: Tour) => {
    setSelectedTour(tour);
    setCurrentView('tour');
  };

  const handleBackToTours = () => {
    setCurrentView('tours');
    setSelectedTour(null);
  };

  const handleBackToCities = () => {
    setCurrentView('cities');
    setSelectedCity(null);
    setSelectedTour(null);
  };

  const handleBackToIntro = () => {
    setCurrentView('intro');
    setSelectedCity(null);
    setSelectedTour(null);
  };

  const getHeaderTitle = () => {
    switch (currentView) {
      case 'intro':
        return '1-Hour Museum Tours';
      case 'cities':
        return 'Cities';
      case 'tours':
        return selectedCity?.name || 'Tours';
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
      case 'tours':
        return handleBackToCities;
      case 'tour':
        return handleBackToTours;
      default:
        return undefined;
    }
  };

  // Filter tours by selected city
  const getToursForSelectedCity = () => {
    if (!selectedCity) return tours;
    const cityMuseums = museums.filter(museum => museum.cityId === selectedCity.id);
    const museumIds = cityMuseums.map(museum => museum.id);
    return tours.filter(tour => museumIds.includes(tour.museumId));
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
            ) : currentView === 'tours' ? (
              <TourSelectionPage tours={getToursForSelectedCity()} museums={getMuseumsForSelectedCity()} onSelectTour={handleSelectTour} />
            ) : (
              selectedTour && <TourPage tour={selectedTour} onBackToTours={handleBackToTours} />
            )}
          </main>
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;