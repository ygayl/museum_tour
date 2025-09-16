import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import CitiesPage, { City } from './components/CitiesPage';
import MuseumSelectionPage from './components/MuseumSelectionPage';
import TourPage from './components/TourPage';

export interface Museum {
  id: string;
  name: string;
  theme: string;
  image: string;
  description: string;
  duration: string;
  introAudio: string;
  cityId: string;
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

const cities: City[] = [
  {
    id: 'amsterdam',
    name: 'Amsterdam',
    image: '/images/cities/amsterdam.jpg',
    description: 'Dive into Dutch masters and European heritage'
  },
  {
    id: 'london',
    name: 'London',
    image: '/images/cities/london.jpg',
    description: 'Uncover centuries of art and culture in Britain\'s capital'
  },    
  {
    id: 'madrid',
    name: 'Madrid',
    image: '/images/cities/madrid.jpg',
    description: 'Discover the artistic treasures of Spain\'s capital'
  },
  {
    id: 'new-york',
    name: 'New York',
    image: '/images/cities/new-york.jpg',
    description: 'Experience the cultural melting pot of the Big Apple'
  },
  {
    id: 'paris',
    name: 'Paris',
    image: '/images/cities/paris.jpg',
    description: 'Explore the City of Light and its world-famous museums'
  },
  {
    id: 'san-francisco',
    name: 'San Francisco',
    image: '/images/cities/san-francisco.jpg',
    description: 'Discover contemporary and classic art by the Bay'
  }
];

const museums: Museum[] = [
  {
    id: 'reina-sofia',
    name: 'Museo Reina Sofía',
    theme: 'Spanish Civil War in 60 Minutes',
    image: '/images/museums/reina_sofia.jpg',
    description: 'Explore the artistic response to one of Spain\'s most turbulent periods through masterpieces of modern art.',
    duration: '60 minutes',
    introAudio: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    cityId: 'madrid',
    stops: [
      {
        id: '1',
        title: 'Guernica',
        description: 'The most famous anti-war painting in history, depicting the horrors of the bombing of Guernica.',
        image: 'https://images.pexels.com/photos/1572386/pexels-photo-1572386.jpeg?auto=compress&cs=tinysrgb&w=600',
        artworkAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistName: 'Pablo Picasso',
        roomNumber: 'Room 206'
      },
      {
        id: '2',
        title: 'The Spanish Republic',
        description: 'A powerful abstract representation of Republican ideals during the Spanish Civil War.',
        image: 'https://images.pexels.com/photos/1572386/pexels-photo-1572386.jpeg?auto=compress&cs=tinysrgb&w=600',
        artworkAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistName: 'Joan Miró',
        roomNumber: 'Room 210'
      },
      {
        id: '3',
        title: 'Spanish Peasant',
        description: 'A sculpture representing the common people who suffered during the conflict.',
        image: 'https://images.pexels.com/photos/1572386/pexels-photo-1572386.jpeg?auto=compress&cs=tinysrgb&w=600',
        artworkAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistName: 'Alberto Sánchez',
        roomNumber: 'Room 104'
      },
      {
        id: '4',
        title: 'War Series',
        description: 'A collection of paintings documenting the daily reality of wartime Spain.',
        image: 'https://images.pexels.com/photos/1572386/pexels-photo-1572386.jpeg?auto=compress&cs=tinysrgb&w=600',
        artworkAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistName: 'Horacio Ferrer',
        roomNumber: 'Room 205'
      },
      {
        id: '5',
        title: 'Maternal',
        description: 'A moving sculpture depicting motherhood during times of conflict and loss.',
        image: 'https://images.pexels.com/photos/1572386/pexels-photo-1572386.jpeg?auto=compress&cs=tinysrgb&w=600',
        artworkAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistName: 'Julio González',
        roomNumber: 'Room 102'
      },
      {
        id: '6',
        title: 'Memory of the Civil War',
        description: 'A contemporary reflection on the lasting impact of the Spanish Civil War.',
        image: 'https://images.pexels.com/photos/1572386/pexels-photo-1572386.jpeg?auto=compress&cs=tinysrgb&w=600',
        artworkAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistName: 'Antoni Tàpies',
        roomNumber: 'Room 419'
      }
    ]
  },
  {
    id: 'prado',
    name: 'Museo del Prado',
    theme: 'Highlights in 60 Minutes',
    image: '/images/museums/prado.jpg',
    description: 'Discover the greatest masterpieces of Spanish art from Velázquez, Goya, and other masters.',
    duration: '60 minutes',
    introAudio: '/audio/museums/prado_intro.mp3',
    cityId: 'madrid',
    stops: [
      {
        id: '1',
        title: 'Las Meninas',
        description: 'The most famous painting in the Prado, a masterpiece of perspective and royal portraiture.',
        image: '/images/artworks/las_meninas.jpg',
        artworkAudioUrl: '/audio/artworks/las_meninas_geographic_channel_style.mp3',
        artistAudioUrl: '/audio/artists/velazquez.mp3',
        artistName: 'Diego Velázquez',
        roomNumber: 'Room 12'
      },
      {
        id: '2',
        title: 'The Third of May 1808',
        description: 'A powerful depiction of the Spanish resistance against Napoleon\'s invasion.',
        image: 'https://images.pexels.com/photos/1572386/pexels-photo-1572386.jpeg?auto=compress&cs=tinysrgb&w=600',
        artworkAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistName: 'Francisco Goya',
        roomNumber: 'Room 64'
      },
      {
        id: '3',
        title: 'The Garden of Earthly Delights',
        description: 'A fantastical triptych exploring themes of paradise, temptation, and hell.',
        image: 'https://images.pexels.com/photos/1572386/pexels-photo-1572386.jpeg?auto=compress&cs=tinysrgb&w=600',
        artworkAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistName: 'Hieronymus Bosch',
        roomNumber: 'Room 56A'
      },
      {
        id: '4',
        title: 'The Naked Maja',
        description: 'One of the first nude paintings in Western art, controversial and revolutionary for its time.',
        image: 'https://images.pexels.com/photos/1572386/pexels-photo-1572386.jpeg?auto=compress&cs=tinysrgb&w=600',
        artworkAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistName: 'Francisco Goya',
        roomNumber: 'Room 36'
      },
      {
        id: '5',
        title: 'The Surrender of Breda',
        description: 'A monumental history painting showcasing Velázquez\'s mastery of composition and diplomacy.',
        image: 'https://images.pexels.com/photos/1572386/pexels-photo-1572386.jpeg?auto=compress&cs=tinysrgb&w=600',
        artworkAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistName: 'Diego Velázquez',
        roomNumber: 'Room 9'
      }
    ]
  }
];

function App() {
  const [currentView, setCurrentView] = useState<'intro' | 'cities' | 'museums' | 'tour'>('intro');
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedMuseum, setSelectedMuseum] = useState<Museum | null>(null);

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  const handleExploreCities = () => {
    setCurrentView('cities');
  };

  const handleSelectCity = (city: City) => {
    setSelectedCity(city);
    setCurrentView('museums');
  };

  const handleSelectMuseum = (museum: Museum) => {
    setSelectedMuseum(museum);
    setCurrentView('tour');
  };

  const handleBackToMuseums = () => {
    setCurrentView('museums');
    setSelectedMuseum(null);
  };

  const handleBackToCities = () => {
    setCurrentView('cities');
    setSelectedCity(null);
    setSelectedMuseum(null);
  };

  const handleBackToIntro = () => {
    setCurrentView('intro');
    setSelectedCity(null);
    setSelectedMuseum(null);
  };

  const getHeaderTitle = () => {
    switch (currentView) {
      case 'intro':
        return '1-Hour Museum Tours';
      case 'cities':
        return 'Cities';
      case 'museums':
        return selectedCity?.name || 'Museums';
      case 'tour':
        return selectedMuseum?.name || 'Museum Tour';
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
      case 'tour':
        return handleBackToMuseums;
      default:
        return undefined;
    }
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
              <MuseumSelectionPage museums={getMuseumsForSelectedCity()} onSelectMuseum={handleSelectMuseum} />
            ) : (
              selectedMuseum && <TourPage museum={selectedMuseum} onBackToMuseums={handleBackToMuseums} />
            )}
          </main>
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;