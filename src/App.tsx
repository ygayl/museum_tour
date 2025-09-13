import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import IntroPage from './components/IntroPage';
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

const museums: Museum[] = [
  {
    id: 'reina-sofia',
    name: 'Museo Reina Sofía',
    theme: 'Spanish Civil War in 60 Minutes',
    image: '/images/museums/reina_sofia.jpg',
    description: 'Explore the artistic response to one of Spain\'s most turbulent periods through masterpieces of modern art.',
    duration: '60 minutes',
    introAudio: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    stops: [
      {
        id: '1',
        title: 'Guernica by Pablo Picasso',
        description: 'The most famous anti-war painting in history, depicting the horrors of the bombing of Guernica.',
        image: 'https://images.pexels.com/photos/1572386/pexels-photo-1572386.jpeg?auto=compress&cs=tinysrgb&w=600',
        artworkAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistName: 'Pablo Picasso',
        roomNumber: 'Room 206'
      },
      {
        id: '2',
        title: 'The Spanish Republic by Joan Miró',
        description: 'A powerful abstract representation of Republican ideals during the Spanish Civil War.',
        image: 'https://images.pexels.com/photos/1572386/pexels-photo-1572386.jpeg?auto=compress&cs=tinysrgb&w=600',
        artworkAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistName: 'Joan Miró',
        roomNumber: 'Room 210'
      },
      {
        id: '3',
        title: 'Spanish Peasant by Alberto Sánchez',
        description: 'A sculpture representing the common people who suffered during the conflict.',
        image: 'https://images.pexels.com/photos/1572386/pexels-photo-1572386.jpeg?auto=compress&cs=tinysrgb&w=600',
        artworkAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistName: 'Alberto Sánchez',
        roomNumber: 'Room 104'
      },
      {
        id: '4',
        title: 'War Series by Horacio Ferrer',
        description: 'A collection of paintings documenting the daily reality of wartime Spain.',
        image: 'https://images.pexels.com/photos/1572386/pexels-photo-1572386.jpeg?auto=compress&cs=tinysrgb&w=600',
        artworkAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistName: 'Horacio Ferrer',
        roomNumber: 'Room 205'
      },
      {
        id: '5',
        title: 'Maternal by Julio González',
        description: 'A moving sculpture depicting motherhood during times of conflict and loss.',
        image: 'https://images.pexels.com/photos/1572386/pexels-photo-1572386.jpeg?auto=compress&cs=tinysrgb&w=600',
        artworkAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistName: 'Julio González',
        roomNumber: 'Room 102'
      },
      {
        id: '6',
        title: 'Memory of the Civil War by Antoni Tàpies',
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
    introAudio: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    stops: [
      {
        id: '1',
        title: 'Las Meninas by Diego Velázquez',
        description: 'The most famous painting in the Prado, a masterpiece of perspective and royal portraiture.',
        image: '/images/artworks/las_meninas.jpg',
        artworkAudioUrl: '/audio/artworks/las_meninas_geographic_channel_style.mp3',
        artistAudioUrl: '/audio/artists/velazquez.mp3',
        artistName: 'Diego Velázquez',
        roomNumber: 'Room 12'
      },
      {
        id: '2',
        title: 'The Third of May 1808 by Francisco Goya',
        description: 'A powerful depiction of the Spanish resistance against Napoleon\'s invasion.',
        image: 'https://images.pexels.com/photos/1572386/pexels-photo-1572386.jpeg?auto=compress&cs=tinysrgb&w=600',
        artworkAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistName: 'Francisco Goya',
        roomNumber: 'Room 64'
      },
      {
        id: '3',
        title: 'The Garden of Earthly Delights by Hieronymus Bosch',
        description: 'A fantastical triptych exploring themes of paradise, temptation, and hell.',
        image: 'https://images.pexels.com/photos/1572386/pexels-photo-1572386.jpeg?auto=compress&cs=tinysrgb&w=600',
        artworkAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistName: 'Hieronymus Bosch',
        roomNumber: 'Room 56A'
      },
      {
        id: '4',
        title: 'The Naked Maja by Francisco Goya',
        description: 'One of the first nude paintings in Western art, controversial and revolutionary for its time.',
        image: 'https://images.pexels.com/photos/1572386/pexels-photo-1572386.jpeg?auto=compress&cs=tinysrgb&w=600',
        artworkAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistAudioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        artistName: 'Francisco Goya',
        roomNumber: 'Room 36'
      },
      {
        id: '5',
        title: 'The Surrender of Breda by Diego Velázquez',
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
  const [currentView, setCurrentView] = useState<'intro' | 'museums' | 'tour'>('intro');
  const [selectedMuseum, setSelectedMuseum] = useState<Museum | null>(null);

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  const handleExploreMuseums = () => {
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

  const handleBackToIntro = () => {
    setCurrentView('intro');
    setSelectedMuseum(null);
  };

  const getHeaderTitle = () => {
    switch (currentView) {
      case 'intro':
        return '1-Hour Museum Tours';
      case 'museums':
        return 'Museums';
      case 'tour':
        return selectedMuseum?.name || 'Museum Tour';
      default:
        return '1-Hour Museum Tours';
    }
  };

  const getBackHandler = () => {
    switch (currentView) {
      case 'museums':
        return handleBackToIntro;
      case 'tour':
        return handleBackToMuseums;
      default:
        return undefined;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/50 to-orange-50/30">
      <Header 
        onBackClick={getBackHandler()}
        title={getHeaderTitle()}
      />
      
      <main className="pt-16 pb-20">
        {currentView === 'intro' ? (
          <IntroPage onExploreMuseums={handleExploreMuseums} />
        ) : currentView === 'museums' ? (
          <MuseumSelectionPage museums={museums} onSelectMuseum={handleSelectMuseum} />
        ) : (
          selectedMuseum && <TourPage museum={selectedMuseum} onBackToMuseums={handleBackToMuseums} />
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default App;