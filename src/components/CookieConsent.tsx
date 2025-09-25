import React, { useState, useEffect } from 'react';
import { X, Shield } from 'lucide-react';

interface CookieConsentProps {
  onConsentChange: (hasConsent: boolean) => void;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ onConsentChange }) => {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('museum-tour-cookie-consent');
    if (consent === null) {
      setShowBanner(true);
    } else {
      onConsentChange(consent === 'accepted');
    }
  }, [onConsentChange]);

  const handleAccept = () => {
    localStorage.setItem('museum-tour-cookie-consent', 'accepted');
    setShowBanner(false);
    onConsentChange(true);
  };

  const handleDecline = () => {
    localStorage.setItem('museum-tour-cookie-consent', 'declined');
    setShowBanner(false);
    onConsentChange(false);
  };

  const handleAcceptEssential = () => {
    localStorage.setItem('museum-tour-cookie-consent', 'essential-only');
    setShowBanner(false);
    onConsentChange(false); // No analytics tracking
  };

  if (!showBanner) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-amber-600" />
              <h3 className="text-xl font-normal text-gray-900">Privacy & Cookies</h3>
            </div>
            <button
              onClick={handleDecline}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-museum-gold-500 focus:ring-inset"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Main content */}
          {!showDetails ? (
            <>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We use cookies to improve your museum tour experience and understand how our app is used.
                This helps us make the tours better for everyone.
              </p>

              <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-xl">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Essential Cookies</h4>
                    <p className="text-sm text-gray-600">
                      Required for the app to function properly. Includes tour progress and preferences.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-xl">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Analytics Cookies</h4>
                    <p className="text-sm text-gray-600">
                      Help us understand which tours are popular and improve the experience.
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAccept}
                  className="flex-1 bg-museum-gold-500 text-museum-primary-900 px-6 py-3 rounded-xl font-medium hover:bg-museum-gold-400 transition-all duration-200"
                >
                  Accept All Cookies
                </button>
                <button
                  onClick={handleAcceptEssential}
                  className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Essential Only
                </button>
              </div>

              <button
                onClick={() => setShowDetails(true)}
                className="w-full text-sm text-gray-500 hover:text-gray-700 mt-4 underline focus:outline-none focus:ring-2 focus:ring-museum-gold-500 focus:ring-inset"
              >
                View detailed cookie information
              </button>
            </>
          ) : (
            <>
              {/* Detailed view */}
              <div className="space-y-6 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Cookie Details</h4>

                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-xl p-4">
                      <h5 className="font-medium text-gray-900 mb-2">Essential Cookies</h5>
                      <p className="text-sm text-gray-600 mb-2">
                        These cookies are necessary for the website to function and cannot be switched off.
                      </p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Tour progress and completion status</li>
                        <li>• Audio player preferences</li>
                        <li>• Cookie consent preferences</li>
                      </ul>
                    </div>

                    <div className="border border-gray-200 rounded-xl p-4">
                      <h5 className="font-medium text-gray-900 mb-2">Analytics Cookies</h5>
                      <p className="text-sm text-gray-600 mb-2">
                        These cookies help us understand how visitors interact with our tours.
                      </p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Google Analytics (anonymized data)</li>
                        <li>• Tour completion rates</li>
                        <li>• Popular museums and tours</li>
                        <li>• Session duration and engagement</li>
                      </ul>
                      <p className="text-xs text-gray-500 mt-2">
                        Data retention: 26 months. No personal information is collected.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAccept}
                  className="flex-1 bg-museum-gold-500 text-museum-primary-900 px-6 py-3 rounded-xl font-medium hover:bg-museum-gold-400 transition-all duration-200"
                >
                  Accept All
                </button>
                <button
                  onClick={handleAcceptEssential}
                  className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Essential Only
                </button>
              </div>

              <button
                onClick={() => setShowDetails(false)}
                className="w-full text-sm text-gray-500 hover:text-gray-700 mt-4 underline focus:outline-none focus:ring-2 focus:ring-museum-gold-500 focus:ring-inset"
              >
                Back to simple view
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;