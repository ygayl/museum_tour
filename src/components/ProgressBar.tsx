import React, { useState, useEffect } from 'react';

interface ProgressBarProps {
  totalStops: number;
  completedCount: number;
  onSegmentClick?: (index: number) => void;
  stops: Array<{ id: string; title: string }>;
  isStopCompleted: (stopId: string) => boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  totalStops, 
  completedCount, 
  onSegmentClick, 
  stops,
  isStopCompleted 
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const progressPercentage = Math.round((completedCount / totalStops) * 100);

  useEffect(() => {
    let rafId: number;

    const handleScroll = () => {
      if (rafId) return; // Already scheduled

      rafId = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const shouldCollapse = scrollY > 100; // Updated: 100px threshold
        setIsCollapsed(shouldCollapse);
        rafId = 0; // Reset for next frame
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className={`fixed top-16 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-museum-neutral-200 transition-all duration-300 ${
      isCollapsed ? 'h-1' : 'h-auto'
    }`}>
      {/* Collapsed State - Thin Progress Bar */}
      <div className={`transition-opacity duration-300 ${
        isCollapsed ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="h-1 bg-museum-neutral-200">
          <div 
            className="h-full bg-museum-gold-500 transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Expanded State - Full Progress Header */}
      <div className={`px-4 py-3 transition-opacity duration-300 ${
        isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-museum-primary-900 font-serif">
            Tour Progress
          </span>
          <span className="text-sm text-gray-600">
            {completedCount} of {totalStops} stops
          </span>
        </div>
        
        <div className="flex space-x-1 mb-2">
          {stops.map((stop, index) => {
            const isCompleted = isStopCompleted(stop.id);
            
            return (
              <button
                key={stop.id}
                onClick={() => onSegmentClick?.(index)}
                className={`flex-1 h-2 rounded-sm transition-all duration-200 ${
                  isCompleted 
                   ? 'bg-gradient-to-r from-museum-gold-500 to-museum-gold-600'
                   : 'bg-museum-neutral-200 hover:bg-museum-neutral-300'
                }`}
                title={`${stop.title} ${isCompleted ? '(Completed)' : '(Not completed)'}`}
                aria-label={`Jump to stop ${index + 1}: ${stop.title}`}
              />
            );
          })}
        </div>
        
        <div className="text-center">
          <span className="text-xs text-gray-500">
            {progressPercentage}% Complete
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;