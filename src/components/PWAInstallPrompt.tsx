import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppiOS = (window.navigator as any).standalone === true;
    const isInWebAppChrome = window.matchMedia('(display-mode: standalone)').matches;

    if (isStandalone || isInWebAppiOS || isInWebAppChrome) {
      setIsInstalled(true);
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Show install prompt after a delay to avoid being intrusive
      setTimeout(() => {
        const hasSeenPrompt = localStorage.getItem('pwa-install-prompt-seen');
        const hasDeclined = localStorage.getItem('pwa-install-declined');

        if (!hasSeenPrompt && !hasDeclined) {
          setShowInstallPrompt(true);
        }
      }, 10000); // Show after 10 seconds
    };

    // Listen for successful installation
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      localStorage.setItem('pwa-install-success', 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        localStorage.setItem('pwa-install-accepted', 'true');
      } else {
        localStorage.setItem('pwa-install-declined', 'true');
      }

      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    } catch (error) {
      console.error('Error installing PWA:', error);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('pwa-install-prompt-seen', 'true');
  };

  if (isInstalled || !showInstallPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-6 relative">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-museum-gold-500 focus:ring-inset"
          aria-label="Dismiss install prompt"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-12 h-12 bg-museum-gold-500 rounded-full flex items-center justify-center">
            <Smartphone className="w-6 h-6 text-museum-primary-900" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-light text-museum-primary-900 font-serif mb-2">
              Install Museum Tour
            </h3>
            <p className="text-sm text-museum-neutral-600 font-light leading-relaxed mb-4">
              Get instant access to audio tours even when you're offline. Install our app for a better museum experience!
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleInstallClick}
                className="flex-1 bg-museum-gold-500 text-museum-primary-900 px-4 py-2 font-normal hover:bg-museum-gold-400 transition-all duration-200 flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-museum-gold-500 focus:ring-inset"
              >
                <Download className="w-4 h-4" />
                <span>Install App</span>
              </button>
              <button
                onClick={handleDismiss}
                className="flex-1 border border-gray-300 text-museum-neutral-700 px-4 py-2 font-normal hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-museum-gold-500 focus:ring-inset"
              >
                Not Now
              </button>
            </div>

            <div className="flex items-center justify-center space-x-2 mt-3 text-xs text-museum-neutral-500">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Offline Access</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Faster Loading</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Native Experience</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;