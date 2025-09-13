import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface HeaderProps {
  onBackClick?: () => void;
  title: string;
}

const Header: React.FC<HeaderProps> = ({ onBackClick, title }) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-amber-200/50 z-50">
      <div className="flex items-center justify-between px-4 py-3">
        {onBackClick ? (
          <button
            onClick={onBackClick}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
        ) : (
          <div className="w-10" />
        )}
        
        <h1 className="text-lg font-semibold text-gray-900 text-center flex-1 px-2">
          {title}
        </h1>
        
        <div className="w-10" />
      </div>
    </header>
  );
};

export default Header;