import React from 'react';
import { Trophy, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

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
        <div className="w-16 h-16 bg-museum-terracotta-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-8 h-8 text-white" />
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
          <Button
            onClick={onGiveFeedback}
            className="w-full"
          >
            Share Your Experience
          </Button>
        )}

        {onStartNewTour && (
          <Button
            onClick={onStartNewTour}
            variant="outline"
            className="w-full space-x-2 border-gray-200"
          >
            <span>Explore Another Museum</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default CompletionCelebration;