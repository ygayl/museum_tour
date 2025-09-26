import React, { useState, useEffect } from 'react';
import { Download, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface PWAInstallButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppiOS = (window.navigator as any).standalone === true;

    if (isStandalone || isInWebAppiOS) {
      return; // Don't show install button if already installed
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setCanInstall(true);
    };

    const handleAppInstalled = () => {
      setCanInstall(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      setDeferredPrompt(null);
      setCanInstall(false);
    } catch (error) {
      console.error('Error installing PWA:', error);
    }
  };

  if (!canInstall) {
    return null;
  }

  const baseClasses = 'inline-flex items-center justify-center space-x-2 font-normal transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-museum-gold-500 focus:ring-inset';

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const variantClasses = {
    primary: 'bg-museum-gold-500 text-museum-primary-900 hover:bg-museum-gold-400',
    secondary: 'border border-gray-300 text-museum-neutral-700 hover:bg-gray-50'
  };

  return (
    <button
      onClick={handleInstall}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      title="Install app for offline access"
    >
      {children || (
        <>
          <Download className="w-4 h-4" />
          <span>Install App</span>
        </>
      )}
    </button>
  );
};

export default PWAInstallButton;