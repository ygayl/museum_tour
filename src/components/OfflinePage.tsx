import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

const OfflinePage: React.FC = () => {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="bg-cream-gradient min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-museum-neutral-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <WifiOff className="w-12 h-12 text-museum-neutral-600" />
          </div>

          <h1 className="text-2xl font-light text-museum-primary-900 font-serif mb-4">
            You're Offline
          </h1>

          <p className="text-museum-neutral-600 font-light leading-relaxed mb-6">
            It looks like you've lost your internet connection. Don't worry – if you've visited tours before,
            they may still be available offline.
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={handleRetry}
            className="w-full space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </Button>

        </div>

        <div className="mt-8 p-4 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-lg">
          <h3 className="text-sm font-normal text-museum-primary-900 mb-2">Available Offline:</h3>
          <ul className="text-sm text-museum-neutral-600 space-y-1 font-light">
            <li>• Previously visited tour content</li>
            <li>• Downloaded audio files</li>
            <li>• Tour progress and bookmarks</li>
            <li>• App interface and navigation</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OfflinePage;