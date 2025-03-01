import React from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  className?: string;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
}

export const OptimizedImage = React.forwardRef<HTMLImageElement, OptimizedImageProps>(
  function OptimizedImage(
    { src, alt, width, height, className, priority = false, loading = 'lazy' },
    ref
  ) {
    // Use native browser lazy loading and srcset for optimization
    const sizes = width ? `${width}px` : '100vw';
    const srcSet = width ? generateSrcSet(src, width) : undefined;

    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={priority ? 'eager' : loading}
        sizes={sizes}
        srcSet={srcSet}
      />
    );
  }
);

function generateSrcSet(src: string, baseWidth: number): string {
  // Generate a srcset with multiple widths for responsive images
  const widths = [
    Math.round(baseWidth / 2),
    baseWidth,
    Math.round(baseWidth * 1.5),
    Math.round(baseWidth * 2),
  ].filter(w => w > 0);

  return widths
    .map(w => {
      const url = new URL(src, window.location.origin);
      url.searchParams.set('w', w.toString());
      return `${url.toString()} ${w}w`;
    })
    .join(', ');
}
