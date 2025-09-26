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
  // const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    // Check if this is an iOS device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);

    // If iOS, don't show this prompt (IOSInstallBanner handles iOS)
    if (isIOSDevice) {
      return;
    }

    // Debug information (commented out for production)
    // const userAgent = navigator.userAgent;
    // const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
    // const hasServiceWorker = 'serviceWorker' in navigator;

    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppiOS = (window.navigator as any).standalone === true;
    const isInWebAppChrome = window.matchMedia('(display-mode: standalone)').matches;

    // setDebugInfo(`
    //   Browser: ${userAgent.includes('Chrome') && !userAgent.includes('Edg') ? 'Chrome' :
    //              userAgent.includes('Edg') ? 'Edge' :
    //              userAgent.includes('Firefox') ? 'Firefox' :
    //              userAgent.includes('Safari') && !userAgent.includes('Chrome') ? 'Safari' : 'Other'}
    //   Secure: ${isSecure}
    //   Service Worker: ${hasServiceWorker}
    //   Standalone: ${isStandalone}
    //   iOS Webapp: ${isInWebAppiOS}
    //   Chrome Webapp: ${isInWebAppChrome}
    // `);

    if (isStandalone || isInWebAppiOS || isInWebAppChrome) {
      setIsInstalled(true);
      // setDebugInfo(prev => prev + '\nApp already installed');
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // console.log('beforeinstallprompt event fired');
      // setDebugInfo(prev => prev + '\nbeforeinstallprompt event received');

      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Show install prompt after a delay to avoid being intrusive
      setTimeout(() => {
        const hasSeenPrompt = localStorage.getItem('pwa-install-prompt-seen');
        const hasDeclined = localStorage.getItem('pwa-install-declined');

        // setDebugInfo(prev => prev + `\nChecking localStorage: seen=${hasSeenPrompt}, declined=${hasDeclined}`);

        if (!hasSeenPrompt && !hasDeclined) {
          setShowInstallPrompt(true);
          // setDebugInfo(prev => prev + '\nShowing install prompt');
        } else {
          // setDebugInfo(prev => prev + '\nNot showing prompt (already seen/declined)');
        }
      }, 10000); // Restored to 10 seconds for production
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

  // Debug panel commented out for production
  // const showDebugPanel = !isInstalled && !showInstallPrompt && import.meta.env.PROD;

  // Safari-specific install prompt (desktop Safari only, not iOS)
  const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
  const userAgent = window.navigator.userAgent.toLowerCase();
  const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
  const showSafariInstallPrompt = isSafari && !isIOSDevice && !isInstalled && !localStorage.getItem('safari-install-dismissed');

  if (isInstalled || (!showInstallPrompt && !showSafariInstallPrompt)) {
    return null;
  }

  // Debug panel commented out for production
  // if (showDebugPanel) {
  //   return (
  //     <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto">
  //       <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-xs">
  //         <h4 className="font-semibold text-red-800 mb-2">PWA Install Debug</h4>
  //         <pre className="text-red-700 whitespace-pre-wrap">{debugInfo}</pre>
  //         <button
  //           onClick={() => localStorage.clear()}
  //           className="mt-2 text-xs bg-red-100 px-2 py-1 rounded"
  //         >
  //           Clear localStorage
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  // Safari install instructions
  if (showSafariInstallPrompt) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-6 relative">
          <button
            onClick={() => localStorage.setItem('safari-install-dismissed', 'true')}
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
                Add this app to your home screen for offline access and a better experience!
              </p>

              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">📱 How to install:</h4>
                <ol className="text-sm text-blue-800 space-y-1">
                  <li>1. Tap the <strong>Share button</strong> (↗️) in Safari</li>
                  <li>2. Scroll down and tap <strong>"Add to Home Screen"</strong></li>
                  <li>3. Tap <strong>"Add"</strong> to confirm</li>
                </ol>
              </div>

              <div className="flex items-center justify-center space-x-2 text-xs text-museum-neutral-500">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Works Offline</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Full Screen</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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