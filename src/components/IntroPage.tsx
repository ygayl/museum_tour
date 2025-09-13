import React from 'react';
import { Headphones, Clock, MapPin, Star } from 'lucide-react';

interface IntroPageProps {
  onExploreMuseums: () => void;
}

const IntroPage: React.FC<IntroPageProps> = ({ onExploreMuseums }) => {
  return (
    <div className="px-4 py-8 bg-gradient-to-br from-amber-50/30 to-orange-50/20 min-h-screen">
      {/* Hero Section */}
      <div className="text-center mb-10 relative">
        {/* Artistic Background */}
        <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-amber-200 to-orange-200 rounded-3xl transform rotate-1"></div>
        <div className="absolute inset-0 opacity-3 bg-gradient-to-tl from-yellow-200 to-amber-100 rounded-3xl transform -rotate-1"></div>
        
        <div className="mb-6">
          <div className="relative w-24 h-24 mx-auto mb-6">
            {/* Artistic background circle */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full opacity-90"></div>
            <div className="absolute inset-2 bg-gradient-to-tl from-yellow-300 to-amber-400 rounded-full flex items-center justify-center">
              <Headphones className="w-10 h-10 text-amber-900" />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full opacity-80"></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-orange-400 rounded-full opacity-70"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <span className="text-2xl">🎧</span>
              <h1 className="text-3xl font-bold text-gray-800">
                One Hour, All the Highlights
              </h1>
            </div>
            <p className="text-xl text-gray-700 leading-relaxed max-w-lg mx-auto font-medium">
              See the Prado and Reina Sofía like never before — hand-picked tours that guide you straight to the masterpieces
            </p>
          </div>
        </div>
      </div>

      {/* Warm Subtitle */}
      <div className="text-center mb-10">
        <p className="text-gray-600 max-w-md mx-auto">
          Skip the overwhelm of massive collections — we guide you to the art worth seeing
        </p>
      </div>

      {/* Features */}
      <div className="space-y-6 mb-10 max-w-sm mx-auto">
        <div className="flex items-start space-x-4 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-amber-100">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center flex-shrink-0 border border-amber-200">
            <Clock className="w-6 h-6 text-amber-700" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">Perfect Duration</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Each tour is carefully curated to fit into one hour — perfect for busy travelers and lunch breaks
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-4 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-amber-100">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0 border border-blue-200">
            <MapPin className="w-6 h-6 text-blue-700" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">Easy Navigation</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Clear room numbers and directions help you find each artwork quickly — no wandering required
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-4 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-amber-100">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center flex-shrink-0 border border-orange-200">
            <Star className="w-6 h-6 text-orange-700" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">Expert Curation</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Focus on the most important pieces with insights about both the artwork and the artists who created them
            </p>
          </div>
        </div>
      </div>

      {/* Social Proof */}
      <div className="text-center mb-8">
        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 max-w-sm mx-auto border border-amber-100">
          <div className="flex items-center justify-center space-x-1 mb-2">
            <span className="text-amber-400">★★★★★</span>
          </div>
          <p className="text-sm text-gray-700 italic">
            Experience world-class museums like never before — hand-picked tours that guide you straight to the masterpieces
          </p>
          <p className="text-xs text-gray-500 mt-1">— Anna, Paris</p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <button
          onClick={onExploreMuseums}
          className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-lg w-full max-w-sm transform hover:scale-105 border border-amber-400"
        >
          🖼️ Explore Museums
        </button>
        <p className="text-gray-600 text-sm mt-4 font-medium">
          Your shortcut to the world's greatest art
        </p>
      </div>
    </div>
  );
};

export default IntroPage;