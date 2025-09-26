import React, { useState, useEffect } from 'react';
import { X, Share, Plus } from 'lucide-react';

const IOSInstallBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Detect iOS devices (iPhone, iPad, iPod)
    const detectIOS = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
      const isIOSStandalone = (window.navigator as any).standalone === true;
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

      return {
        isIOS: isIOSDevice,
        isInstalled: isIOSStandalone || isStandalone
      };
    };

    const { isIOS: deviceIsIOS, isInstalled: appIsInstalled } = detectIOS();
    setIsIOS(deviceIsIOS);
    setIsInstalled(appIsInstalled);

    // Only show banner if:
    // 1. Device is iOS
    // 2. App is not installed
    // 3. User hasn't dismissed banner
    // 4. Wait a bit before showing to avoid being intrusive
    if (deviceIsIOS && !appIsInstalled) {
      const hasSeenBanner = localStorage.getItem('ios-install-banner-seen');

      if (!hasSeenBanner) {
        const timer = setTimeout(() => {
          setShowBanner(true);
        }, 5000); // Show after 5 seconds

        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('ios-install-banner-seen', 'true');
  };

  const handleInstallLater = () => {
    setShowBanner(false);
    // Don't set the localStorage flag so it can show again later
  };

  if (!isIOS || isInstalled || !showBanner) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg">
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5 text-white" />
              </div>

              <div className="flex-1">
                <h3 className="text-sm font-medium">
                  Install Museum Tour
                </h3>
                <p className="text-xs text-blue-100 mt-0.5">
                  Get offline access and a native app experience
                </p>
              </div>
            </div>

            <div className="mt-3 bg-white/10 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-5 h-5 bg-white/20 rounded flex items-center justify-center">
                    <Share className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="flex-1 text-xs space-y-1">
                  <div className="flex items-center space-x-1">
                    <span className="font-medium">1.</span>
                    <span>Tap the</span>
                    <div className="inline-flex items-center space-x-1 bg-white/20 px-1.5 py-0.5 rounded">
                      <Share className="w-3 h-3" />
                      <span className="font-medium">Share</span>
                    </div>
                    <span>button</span>
                  </div>
                  <div>
                    <span className="font-medium">2.</span> Scroll down and tap <span className="font-medium">"Add to Home Screen"</span>
                  </div>
                  <div>
                    <span className="font-medium">3.</span> Tap <span className="font-medium">"Add"</span> to confirm
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3">
              <button
                onClick={handleInstallLater}
                className="text-xs text-blue-100 hover:text-white transition-colors"
              >
                Maybe later
              </button>
              <div className="flex items-center space-x-2 text-xs text-blue-100">
                <div className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 bg-green-300 rounded-full"></div>
                  <span>Offline</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 bg-yellow-300 rounded-full"></div>
                  <span>Faster</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="flex-shrink-0 ml-3 p-1 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Dismiss install banner"
          >
            <X className="w-4 h-4 text-blue-100 hover:text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default IOSInstallBanner;