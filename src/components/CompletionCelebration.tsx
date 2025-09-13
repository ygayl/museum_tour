import React from 'react';
import { Trophy, ArrowRight } from 'lucide-react';

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
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 text-center border border-amber-200">
      <div className="mb-4">
        <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <div className="text-2xl mb-2">🎉</div>
        <h3 className="text-xl font-bold text-text mb-2">
          Tour Complete!
        </h3>
        <p className="text-muted">
          Congratulations! You've completed your journey through {museumName}.
        </p>
      </div>
      
      <div className="space-y-3">
        {onGiveFeedback && (
          <button
            onClick={onGiveFeedback}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-full font-medium hover:from-amber-600 hover:to-orange-600 transition-all duration-200 border border-amber-400"
          >
            Share Your Experience
          </button>
        )}
        
        {onStartNewTour && (
          <button
            onClick={onStartNewTour}
            className="w-full bg-white/80 backdrop-blur-sm text-gray-800 px-6 py-3 rounded-full font-medium hover:bg-white transition-all duration-200 flex items-center justify-center space-x-2 border border-amber-200"
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