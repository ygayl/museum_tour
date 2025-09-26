import React from 'react';
import { Trophy, ArrowRight } from 'lucide-react';
import PWAInstallButton from './PWAInstallButton';

interface CompletionCelebrationProps {
  museumName: string;
  onStartNewTour?: () => void;
  onGiveFeedback?: () => void;
}

const CompletionCelebration: React.FC<CompletionCelebrationProps> = ({
  museumName,
  onStartNewTour,
  onGiveFeedback
}) => {
  return (
    <div className="bg-white border border-gray-200 p-6 text-center">
      <div className="mb-6">
        <div className="w-16 h-16 bg-museum-gold-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-8 h-8 text-museum-primary-900" />
        </div>
        <div className="text-2xl mb-2">🎉</div>
        <h3 className="text-2xl font-light text-museum-primary-900 font-serif mb-2">
          Tour Complete!
        </h3>
        <p className="text-museum-neutral-600 font-light leading-relaxed">
          Congratulations! You've completed your journey through {museumName}.
        </p>
      </div>

      <div className="space-y-3">
        {onGiveFeedback && (
          <button
            onClick={onGiveFeedback}
            className="w-full bg-museum-gold-500 text-museum-primary-900 px-6 py-3 font-normal hover:bg-museum-gold-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-museum-gold-500 focus:ring-inset"
          >
            Share Your Experience
          </button>
        )}

        <PWAInstallButton
          variant="secondary"
          className="w-full"
        >
          <span>Install App for Offline Tours</span>
        </PWAInstallButton>

        {onStartNewTour && (
          <button
            onClick={onStartNewTour}
            className="w-full bg-white text-museum-primary-900 px-6 py-3 font-normal hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-museum-gold-500 focus:ring-inset"
          >
            <span>Explore Another Museum</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default CompletionCelebration;