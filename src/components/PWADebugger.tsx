import React, { useEffect, useState } from 'react';

interface PWADebugInfo {
  isSecureContext: boolean;
  hasServiceWorker: boolean;
  manifestExists: boolean;
  manifestValid: boolean;
  hasRequiredIcons: boolean;
  beforeInstallPromptFired: boolean;
  isStandalone: boolean;
  userAgent: string;
  manifestData?: any;
  errors: string[];
}

const PWADebugger: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<PWADebugInfo>({
    isSecureContext: false,
    hasServiceWorker: false,
    manifestExists: false,
    manifestValid: false,
    hasRequiredIcons: false,
    beforeInstallPromptFired: false,
    isStandalone: false,
    userAgent: '',
    errors: []
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in production for debugging
    if (import.meta.env.DEV) return;

    const errors: string[] = [];

    // Check secure context
    const isSecureContext = window.isSecureContext || window.location.protocol === 'https:' || window.location.hostname === 'localhost';
    if (!isSecureContext) errors.push('Not in secure context (HTTPS required)');

    // Check service worker support
    const hasServiceWorker = 'serviceWorker' in navigator;
    if (!hasServiceWorker) errors.push('Service Worker not supported');

    // Check if standalone
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                         (window.navigator as any).standalone === true;

    // Check manifest
    let manifestExists = false;
    let manifestValid = false;
    let hasRequiredIcons = false;
    let manifestData: any = null;

    const manifestLink = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
    if (manifestLink) {
      manifestExists = true;
      fetch(manifestLink.href)
        .then(response => response.json())
        .then(manifest => {
          manifestData = manifest;
          manifestValid = !!(manifest.name && manifest.start_url && manifest.display);
          hasRequiredIcons = manifest.icons && manifest.icons.some((icon: any) =>
            icon.sizes === '192x192' || icon.sizes === '512x512'
          );

          if (!manifestValid) errors.push('Manifest missing required fields (name, start_url, display)');
          if (!hasRequiredIcons) errors.push('Manifest missing required icons (192x192 or 512x512)');

          setDebugInfo(prev => ({
            ...prev,
            manifestData,
            manifestValid,
            hasRequiredIcons
          }));
        })
        .catch(() => {
          errors.push('Could not fetch manifest file');
        });
    } else {
      errors.push('No manifest link found in HTML');
    }

    // Listen for beforeinstallprompt
    let beforeInstallPromptFired = false;
    const handleBeforeInstallPrompt = () => {
      beforeInstallPromptFired = true;
      setDebugInfo(prev => ({ ...prev, beforeInstallPromptFired: true }));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Set timeout to show debug info if beforeinstallprompt doesn't fire
    setTimeout(() => {
      setDebugInfo({
        isSecureContext,
        hasServiceWorker,
        manifestExists,
        manifestValid,
        hasRequiredIcons,
        beforeInstallPromptFired,
        isStandalone,
        userAgent: navigator.userAgent,
        manifestData,
        errors
      });
      setIsVisible(true);
    }, 5000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 w-80">
      <div className="bg-white border-2 border-red-300 rounded-lg p-4 text-xs shadow-lg">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-red-800">PWA Debug Panel</h3>
          <button
            onClick={() => setIsVisible(false)}
            className="text-red-600 hover:text-red-800"
          >
            ✕
          </button>
        </div>

        <div className="space-y-2">
          <div className={`flex justify-between ${debugInfo.isSecureContext ? 'text-green-600' : 'text-red-600'}`}>
            <span>Secure Context:</span>
            <span>{debugInfo.isSecureContext ? '✓' : '✗'}</span>
          </div>

          <div className={`flex justify-between ${debugInfo.hasServiceWorker ? 'text-green-600' : 'text-red-600'}`}>
            <span>Service Worker:</span>
            <span>{debugInfo.hasServiceWorker ? '✓' : '✗'}</span>
          </div>

          <div className={`flex justify-between ${debugInfo.manifestExists ? 'text-green-600' : 'text-red-600'}`}>
            <span>Manifest:</span>
            <span>{debugInfo.manifestExists ? '✓' : '✗'}</span>
          </div>

          <div className={`flex justify-between ${debugInfo.manifestValid ? 'text-green-600' : 'text-red-600'}`}>
            <span>Manifest Valid:</span>
            <span>{debugInfo.manifestValid ? '✓' : '✗'}</span>
          </div>

          <div className={`flex justify-between ${debugInfo.hasRequiredIcons ? 'text-green-600' : 'text-red-600'}`}>
            <span>Required Icons:</span>
            <span>{debugInfo.hasRequiredIcons ? '✓' : '✗'}</span>
          </div>

          <div className={`flex justify-between ${debugInfo.beforeInstallPromptFired ? 'text-green-600' : 'text-red-600'}`}>
            <span>Install Prompt:</span>
            <span>{debugInfo.beforeInstallPromptFired ? '✓' : '✗'}</span>
          </div>

          <div className={`flex justify-between ${debugInfo.isStandalone ? 'text-blue-600' : 'text-gray-600'}`}>
            <span>Standalone:</span>
            <span>{debugInfo.isStandalone ? '✓' : '✗'}</span>
          </div>

          <div className="mt-2 pt-2 border-t">
            <div className="text-gray-600 font-medium mb-1">Browser:</div>
            <div className="text-gray-500 break-all mb-2">
              {debugInfo.userAgent.includes('Chrome') && !debugInfo.userAgent.includes('Edg') ? 'Chrome' :
               debugInfo.userAgent.includes('Edg') ? 'Edge' :
               debugInfo.userAgent.includes('Firefox') ? 'Firefox' :
               debugInfo.userAgent.includes('Safari') && !debugInfo.userAgent.includes('Chrome') ? 'Safari' : 'Other'}
            </div>
            <details className="text-xs">
              <summary className="cursor-pointer text-gray-400 hover:text-gray-600">Show User Agent</summary>
              <div className="mt-1 p-2 bg-gray-50 rounded text-gray-600 break-all">
                {debugInfo.userAgent}
              </div>
            </details>
          </div>

          {debugInfo.errors.length > 0 && (
            <div className="mt-2 pt-2 border-t">
              <div className="text-red-600 font-medium mb-1">Errors:</div>
              {debugInfo.errors.map((error, index) => (
                <div key={index} className="text-red-500 text-xs mb-1">• {error}</div>
              ))}
            </div>
          )}

          <div className="mt-2 pt-2 border-t">
            <button
              onClick={() => localStorage.clear()}
              className="text-xs bg-gray-100 px-2 py-1 rounded mr-2"
            >
              Clear Storage
            </button>
            <button
              onClick={() => window.location.reload()}
              className="text-xs bg-blue-100 px-2 py-1 rounded"
            >
              Reload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWADebugger;