import React, { useState, useEffect } from 'react';

interface BackgroundImageProps {
  src: string; // Base path without extension (e.g., "/images/hero/hero")
  alt?: string; // For accessibility (used in aria-label)
  className?: string;
  children?: React.ReactNode;
}

const BackgroundImage: React.FC<BackgroundImageProps> = ({
  src,
  alt,
  className = '',
  children
}) => {
  const [backgroundImage, setBackgroundImage] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Check if this is a WebP-optimized path (no .jpg in base src)
  const hasWebPVersions = !src.includes('.jpg');

  // Function to check if WebP is supported
  const supportsWebP = (): Promise<boolean> => {
    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        resolve(webP.height === 2);
      };
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  };

  // Get the best image URL based on WebP support and screen size
  const getBestImageUrl = async (): Promise<string> => {
    if (!hasWebPVersions) {
      return src; // Return original JPG path
    }

    // Determine appropriate size based on screen width
    const screenWidth = window.innerWidth;
    const dpr = window.devicePixelRatio || 1;
    const effectiveWidth = screenWidth * dpr;

    let targetWidth = 1080; // Default to largest
    if (effectiveWidth <= 360) targetWidth = 360;
    else if (effectiveWidth <= 720) targetWidth = 720;

    // Check WebP support
    const webpSupported = await supportsWebP();
    const format = webpSupported ? 'webp' : 'jpg';

    return `${src}_${targetWidth}.${format}`;
  };

  // Load the background image
  useEffect(() => {
    const loadBackgroundImage = async () => {
      try {
        const imageUrl = await getBestImageUrl();

        // Preload the image to avoid flash
        const img = new Image();
        img.onload = () => {
          setBackgroundImage(`url(${imageUrl})`);
          setIsLoaded(true);
        };
        img.onerror = () => {
          // Fallback to JPG if WebP fails
          const fallbackUrl = hasWebPVersions ? `${src}_720.jpg` : src;
          setBackgroundImage(`url(${fallbackUrl})`);
          setIsLoaded(true);
        };
        img.src = imageUrl;
      } catch (error) {
        // Ultimate fallback
        const fallbackUrl = hasWebPVersions ? `${src}_720.jpg` : src;
        setBackgroundImage(`url(${fallbackUrl})`);
        setIsLoaded(true);
      }
    };

    loadBackgroundImage();
  }, [src, hasWebPVersions]);

  return (
    <div
      className={`bg-cover bg-center bg-no-repeat transition-opacity duration-300 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      } ${className}`}
      style={{ backgroundImage }}
      aria-label={alt}
      role={alt ? 'img' : undefined}
    >
      {/* Loading placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-museum-neutral-100 animate-pulse" />
      )}
      {children}
    </div>
  );
};

export default BackgroundImage;