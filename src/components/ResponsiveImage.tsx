import React, { useState, useRef, useEffect } from 'react';

interface ResponsiveImageProps {
  src: string; // Base path without extension (e.g., "/images/artworks/caravaggio_david")
  alt: string;
  className?: string;
  priority?: boolean; // If true, eager loads instead of lazy
  sizes?: string;
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  className = '',
  priority = false,
  sizes = '(max-width: 480px) 360px, 100vw'
}) => {
  const [isLoaded, setIsLoaded] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasTriedFallback = useRef(false);

  // Intersection Observer for lazy loading - Fixed to observe container
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  // Reset fallback flag when src changes
  useEffect(() => {
    hasTriedFallback.current = false;
    setHasError(false);
    setIsLoaded(priority);
  }, [src, priority]);

  // Check if this is a WebP-optimized path (no .jpg in base src)
  const hasWebPVersions = !src.includes('.jpg');

  // Generate WebP and JPG srcsets (360 for mobile, base for larger screens)
  const generateSrcSet = (format: 'webp' | 'jpg') => {
    if (!hasWebPVersions) {
      // For traditional images, just return the original path
      return src;
    }
    // Mobile-first: 360px for small screens, base image for larger
    return `${src}_360.${format} 360w, ${src}.${format}`;
  };

  // Fallback single image path (for when srcset fails)
  const getFallbackSrc = () => {
    if (!hasWebPVersions) {
      return src; // Return original JPG path
    }
    return `${src}.jpg`;
  };

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* Enhanced skeleton loading state - skip for priority images */}
      {!isLoaded && !hasError && !priority && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse">
          {/* Museum-themed placeholder content */}
          <div className="w-full h-full flex items-center justify-center bg-museum-neutral-100">
            <div className="text-museum-neutral-400 opacity-50">
              <svg
                className="w-12 h-12 animate-pulse"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
          {/* Shimmer effect */}
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-museum-neutral-100 flex items-center justify-center">
          <div className="text-center text-museum-neutral-500">
            <svg
              className="w-16 h-16 mx-auto mb-2 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <p className="text-xs">Image unavailable</p>
          </div>
        </div>
      )}

      {isInView && !hasError && (
        <>
          {hasWebPVersions ? (
            <picture>
              {/* WebP sources with responsive sizes */}
              <source
                srcSet={generateSrcSet('webp')}
                sizes={sizes}
                type="image/webp"
              />
              {/* JPG fallback with responsive sizes */}
              <source
                srcSet={generateSrcSet('jpg')}
                sizes={sizes}
                type="image/jpeg"
              />
              {/* Final fallback img element */}
              <img
                src={getFallbackSrc()}
                alt={alt}
                className={`w-full h-full object-cover ${
                  priority ? '' : `transition-opacity duration-500 ease-out ${
                    isLoaded ? 'opacity-100' : 'opacity-0'
                  }`
                }`}
                loading={priority ? 'eager' : 'lazy'}
                decoding={priority ? 'sync' : 'async'}
                {...(priority ? { fetchpriority: 'high' } : { fetchpriority: 'low' }) as React.ImgHTMLAttributes<HTMLImageElement>}
                onLoad={() => setIsLoaded(true)}
                onError={(e) => {
                  // Prevent infinite error loop by only trying fallback once
                  if (hasTriedFallback.current) {
                    setHasError(true);
                    return;
                  }

                  // Fallback to basic JPG if responsive images fail
                  const target = e.target as HTMLImageElement;
                  hasTriedFallback.current = true;
                  target.src = getFallbackSrc();
                }}
              />
            </picture>
          ) : (
            /* Simple img for traditional JPG images */
            <img
              src={src}
              alt={alt}
              className={`w-full h-full object-cover ${
                priority ? '' : `transition-opacity duration-500 ease-out ${
                  isLoaded ? 'opacity-100' : 'opacity-0'
                }`
              }`}
              loading={priority ? 'eager' : 'lazy'}
              decoding={priority ? 'sync' : 'async'}
              {...(priority ? { fetchpriority: 'high' } : { fetchpriority: 'low' }) as React.ImgHTMLAttributes<HTMLImageElement>}
              onLoad={() => setIsLoaded(true)}
              onError={() => {
                hasTriedFallback.current = true;
                setHasError(true);
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ResponsiveImage;