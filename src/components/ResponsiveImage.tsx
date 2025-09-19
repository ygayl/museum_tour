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
  sizes = '(max-width: 768px) 360px, (max-width: 1024px) 720px, 1080px'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const containerRef = useRef<HTMLDivElement>(null);

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
      { rootMargin: '50px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  // Check if this is a WebP-optimized path (no .jpg in base src)
  const hasWebPVersions = !src.includes('.jpg');

  // Generate WebP and JPG srcsets
  const generateSrcSet = (format: 'webp' | 'jpg') => {
    if (!hasWebPVersions) {
      // For traditional images, just return the original path
      return src;
    }
    const sizes = [360, 720, 1080];
    return sizes
      .map(size => `${src}_${size}.${format} ${size}w`)
      .join(', ');
  };

  // Fallback single image path (for when srcset fails)
  const getFallbackSrc = () => {
    if (!hasWebPVersions) {
      return src; // Return original JPG path
    }
    return `${src}_720.jpg`;
  };

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* Blur placeholder while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-museum-neutral-100 animate-pulse" />
      )}

      {isInView && (
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
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  isLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                loading={priority ? 'eager' : 'lazy'}
                decoding="async"
                fetchPriority={priority ? 'high' : 'low'}
                onLoad={() => setIsLoaded(true)}
                onError={(e) => {
                  // Fallback to basic JPG if responsive images fail
                  const target = e.target as HTMLImageElement;
                  if (!target.src.includes('_720.jpg')) {
                    target.src = getFallbackSrc();
                  }
                }}
              />
            </picture>
          ) : (
            /* Simple img for traditional JPG images */
            <img
              src={src}
              alt={alt}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
              fetchPriority={priority ? 'high' : 'low'}
              onLoad={() => setIsLoaded(true)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ResponsiveImage;