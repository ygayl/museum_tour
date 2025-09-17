import { useState, useEffect } from 'react';
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
    image: '/images/museums/reina_sofia.jpg',
    description: 'Spain\'s national museum of 20th-century and contemporary art, home to Picasso\'s Guernica and works by Dalí and Miró.',
    cityId: 'madrid'
  },
  {
    id: 'prado',
    name: 'Museo del Prado',
    image: '/images/museums/prado.jpg',
    description: 'One of the world\'s finest art galleries, featuring masterpieces by Velázquez, Goya, and other Spanish masters.',
    cityId: 'madrid'
  }
];

const tours: Tour[] = [
  {
    id: 'reina-sofia-civil-war',
    name: 'Spanish Civil War in 60 Minutes',
    theme: 'Spanish Civil War in 60 Minutes',
    image: '/images/museums/reina_sofia.jpg',
    description: 'Explore the artistic response to one of Spain\'s most turbulent periods through masterpieces of modern art.',
    duration: '60 minutes',
    introAudio: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    museumId: 'reina-sofia',
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
    id: 'prado-highlights',
    name: 'Highlights in 60 Minutes',
    theme: 'Highlights in 60 Minutes',
    image: '/images/museums/prado.jpg',
    description: 'Discover the greatest masterpieces of Spanish art from Velázquez, Goya, and other masters.',
    duration: '60 minutes',
    introAudio: '/audio/museums/prado_intro.mp3',
    museumId: 'prado',
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
  },
  {
    id: 'reina-sofia-surrealism',
    name: 'Surrealism & Dreams',
    theme: 'Surrealism & Dreams',
    image: '/images/museums/reina_sofia.jpg',
    description: 'Dive into the world of dreams and the unconscious through masterpieces of Spanish surrealism.',
    duration: '60 minutes',
    introAudio: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    museumId: 'reina-sofia',
    stops: [
      {
        id: '1',
        title: 'The Persistence of Memory',
        description: 'Dalí\'s iconic melting clocks represent the fluidity of time and memory in dreams.',
        image: 'https://images.pexels.com/photos/1572386/pexels-photo-1572386.jpeg?auto=compress&cs=tinysrgb&w=600',
        artworkAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistName: 'Salvador Dalí',
        roomNumber: 'Room 301'
      },
      {
        id: '2',
        title: 'Woman and Bird by Moonlight',
        description: 'Miró\'s dreamlike composition blends reality and fantasy in vibrant colors.',
        image: 'https://images.pexels.com/photos/1572386/pexels-photo-1572386.jpeg?auto=compress&cs=tinysrgb&w=600',
        artworkAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistName: 'Joan Miró',
        roomNumber: 'Room 303'
      },
      {
        id: '3',
        title: 'Metamorphosis of Narcissus',
        description: 'A surrealist interpretation of the Greek myth exploring transformation and identity.',
        image: 'https://images.pexels.com/photos/1572386/pexels-photo-1572386.jpeg?auto=compress&cs=tinysrgb&w=600',
        artworkAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistName: 'Salvador Dalí',
        roomNumber: 'Room 305'
      },
      {
        id: '4',
        title: 'The Great Masturbator',
        description: 'Dalí\'s exploration of Freudian psychoanalysis and sexual symbolism.',
        image: 'https://images.pexels.com/photos/1572386/pexels-photo-1572386.jpeg?auto=compress&cs=tinysrgb&w=600',
        artworkAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistName: 'Salvador Dalí',
        roomNumber: 'Room 302'
      },
      {
        id: '5',
        title: 'Blue II',
        description: 'Miró\'s abstract masterpiece representing pure emotion through color and form.',
        image: 'https://images.pexels.com/photos/1572386/pexels-photo-1572386.jpeg?auto=compress&cs=tinysrgb&w=600',
        artworkAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistName: 'Joan Miró',
        roomNumber: 'Room 304'
      }
    ]
  },
  {
    id: 'reina-sofia-modern-masters',
    name: 'Modern Spanish Masters',
    theme: 'Modern Spanish Masters',
    image: '/images/museums/reina_sofia.jpg',
    description: 'Discover the revolutionary works of 20th-century Spanish artists who shaped modern art.',
    duration: '60 minutes',
    introAudio: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    museumId: 'reina-sofia',
    stops: [
      {
        id: '1',
        title: 'Les Demoiselles d\'Avignon',
        description: 'Picasso\'s revolutionary painting that launched the Cubist movement and changed art forever.',
        image: 'https://images.pexels.com/photos/1572386/pexels-photo-1572386.jpeg?auto=compress&cs=tinysrgb&w=600',
        artworkAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistName: 'Pablo Picasso',
        roomNumber: 'Room 401'
      },
      {
        id: '2',
        title: 'Woman in Blue',
        description: 'Picasso\'s exploration of form and color during his Blue Period masterpiece.',
        image: 'https://images.pexels.com/photos/1572386/pexels-photo-1572386.jpeg?auto=compress&cs=tinysrgb&w=600',
        artworkAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistName: 'Pablo Picasso',
        roomNumber: 'Room 403'
      },
      {
        id: '3',
        title: 'Painting (The Dog)',
        description: 'Miró\'s playful yet profound exploration of primitive art and symbolism.',
        image: 'https://images.pexels.com/photos/1572386/pexels-photo-1572386.jpeg?auto=compress&cs=tinysrgb&w=600',
        artworkAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistName: 'Joan Miró',
        roomNumber: 'Room 405'
      },
      {
        id: '4',
        title: 'Great Prophet',
        description: 'González\'s innovative iron sculpture showing the evolution from traditional to modern forms.',
        image: 'https://images.pexels.com/photos/1572386/pexels-photo-1572386.jpeg?auto=compress&cs=tinysrgb&w=600',
        artworkAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistName: 'Julio González',
        roomNumber: 'Room 402'
      }
    ]
  },
  {
    id: 'prado-royal-portraits',
    name: 'Royal Portraits Through the Ages',
    theme: 'Royal Portraits Through the Ages',
    image: '/images/museums/prado.jpg',
    description: 'Journey through Spanish royal history via masterful portraits from different dynasties.',
    duration: '60 minutes',
    introAudio: '/audio/museums/prado_intro.mp3',
    museumId: 'prado',
    stops: [
      {
        id: '1',
        title: 'Charles V at Mühlberg',
        description: 'Titian\'s powerful equestrian portrait of the Holy Roman Emperor in victory.',
        image: 'https://images.pexels.com/photos/1572386/pexels-photo-1572386.jpeg?auto=compress&cs=tinysrgb&w=600',
        artworkAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistName: 'Titian',
        roomNumber: 'Room 25'
      },
      {
        id: '2',
        title: 'Philip II',
        description: 'A formal portrait capturing the austere personality of Spain\'s most powerful king.',
        image: 'https://images.pexels.com/photos/1572386/pexels-photo-1572386.jpeg?auto=compress&cs=tinysrgb&w=600',
        artworkAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistName: 'Alonso Sánchez Coello',
        roomNumber: 'Room 28'
      },
      {
        id: '3',
        title: 'The Family of Charles IV',
        description: 'Goya\'s unflinchingly honest group portrait of the royal family.',
        image: 'https://images.pexels.com/photos/1572386/pexels-photo-1572386.jpeg?auto=compress&cs=tinysrgb&w=600',
        artworkAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistName: 'Francisco Goya',
        roomNumber: 'Room 32'
      },
      {
        id: '4',
        title: 'Queen Mariana of Austria',
        description: 'Velázquez\'s elegant portrait of Philip IV\'s second wife in royal splendor.',
        image: 'https://images.pexels.com/photos/1572386/pexels-photo-1572386.jpeg?auto=compress&cs=tinysrgb&w=600',
        artworkAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistName: 'Diego Velázquez',
        roomNumber: 'Room 15'
      },
      {
        id: '5',
        title: 'The Infanta Margarita Teresa',
        description: 'A tender portrait of the young princess in her elaborate court dress.',
        image: 'https://images.pexels.com/photos/1572386/pexels-photo-1572386.jpeg?auto=compress&cs=tinysrgb&w=600',
        artworkAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistName: 'Diego Velázquez',
        roomNumber: 'Room 16'
      }
    ]
  },
  {
    id: 'prado-dark-romanticism',
    name: 'Dark Romanticism & Goya\'s Black Paintings',
    theme: 'Dark Romanticism & Goya\'s Black Paintings',
    image: '/images/museums/prado.jpg',
    description: 'Explore Goya\'s darkest works and the romantic movement\'s fascination with the macabre.',
    duration: '60 minutes',
    introAudio: '/audio/museums/prado_intro.mp3',
    museumId: 'prado',
    stops: [
      {
        id: '1',
        title: 'Saturn Devouring His Son',
        description: 'The most haunting of Goya\'s Black Paintings, depicting mythological cannibalism.',
        image: 'https://images.pexels.com/photos/1572386/pexels-photo-1572386.jpeg?auto=compress&cs=tinysrgb&w=600',
        artworkAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistName: 'Francisco Goya',
        roomNumber: 'Room 67'
      },
      {
        id: '2',
        title: 'Witches\' Sabbath',
        description: 'A nightmarish scene of witchcraft and supernatural terror from Goya\'s dark period.',
        image: 'https://images.pexels.com/photos/1572386/pexels-photo-1572386.jpeg?auto=compress&cs=tinysrgb&w=600',
        artworkAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistName: 'Francisco Goya',
        roomNumber: 'Room 67'
      },
      {
        id: '3',
        title: 'The Dog',
        description: 'One of Goya\'s most mysterious Black Paintings, showing a dog\'s head emerging from void.',
        image: 'https://images.pexels.com/photos/1572386/pexels-photo-1572386.jpeg?auto=compress&cs=tinysrgb&w=600',
        artworkAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistName: 'Francisco Goya',
        roomNumber: 'Room 67'
      },
      {
        id: '4',
        title: 'Two Old Men Eating Soup',
        description: 'A disturbing depiction of aged decrepitude and human decay.',
        image: 'https://images.pexels.com/photos/1572386/pexels-photo-1572386.jpeg?auto=compress&cs=tinysrgb&w=600',
        artworkAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistName: 'Francisco Goya',
        roomNumber: 'Room 67'
      }
    ]
  }
];

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
              <TourSelectionPage tours={getToursForSelectedCity()} onSelectTour={handleSelectTour} />
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