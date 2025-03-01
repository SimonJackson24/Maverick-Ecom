import { promises as fs } from 'fs';
import path from 'path';
import { MonitoringService } from '../monitoring/MonitoringService';

interface ImageOptimizationOptions {
  quality?: number;
  width?: number;
  height?: number;
  format?: 'webp' | 'jpeg' | 'png' | 'avif';
}

export class ImageOptimizationService {
  private static instance: ImageOptimizationService;
  private readonly supportedFormats = ['jpg', 'jpeg', 'png', 'webp', 'avif'];
  private readonly monitoring: MonitoringService;
  private readonly defaultOptions: Required<ImageOptimizationOptions> = {
    quality: 80,
    width: undefined,
    height: undefined,
    format: 'webp'
  };

  private readonly sizingBreakpoints = {
    thumbnail: { width: 150, height: 150 },
    small: { width: 300, height: 300 },
    medium: { width: 600, height: 600 },
    large: { width: 1200, height: 1200 }
  };

  private constructor() {
    this.monitoring = MonitoringService.getInstance();
  }

  public static getInstance(): ImageOptimizationService {
    if (!ImageOptimizationService.instance) {
      ImageOptimizationService.instance = new ImageOptimizationService();
    }
    return ImageOptimizationService.instance;
  }

  public async optimizeImage(
    imageUrl: string,
    options: ImageOptimizationOptions = {}
  ): Promise<string> {
    try {
      const url = new URL(imageUrl, window.location.origin);
      const mergedOptions = { ...this.defaultOptions, ...options };
      
      // Apply sizing based on device pixel ratio
      const dpr = window.devicePixelRatio || 1;
      if (mergedOptions.width) {
        mergedOptions.width = Math.round(mergedOptions.width * dpr);
      }
      if (mergedOptions.height) {
        mergedOptions.height = Math.round(mergedOptions.height * dpr);
      }

      // Add optimization parameters
      if (mergedOptions.width) {
        url.searchParams.set('w', mergedOptions.width.toString());
      }
      if (mergedOptions.height) {
        url.searchParams.set('h', mergedOptions.height.toString());
      }
      url.searchParams.set('q', mergedOptions.quality.toString());
      url.searchParams.set('fm', mergedOptions.format);
      url.searchParams.set('fit', 'cover');
      
      // Add cache control
      url.searchParams.set('v', Date.now().toString());

      this.monitoring.logInfo('image_optimization', {
        originalUrl: imageUrl,
        optimizedUrl: url.toString(),
        options: mergedOptions
      });

      return url.toString();
    } catch (error) {
      this.monitoring.logError('image_optimization_failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        imageUrl
      });
      return imageUrl; // Return original URL if optimization fails
    }
  }

  public getResponsiveImageSizes(breakpoint: keyof typeof this.sizingBreakpoints): ImageOptimizationOptions {
    return this.sizingBreakpoints[breakpoint];
  }

  public async optimizeImageBlob(blob: Blob): Promise<Blob> {
    try {
      // Convert to WebP if supported
      if (this.isWebPSupported() && blob.type.startsWith('image/')) {
        const response = await fetch(URL.createObjectURL(blob));
        const arrayBuffer = await response.arrayBuffer();
        
        // Use the Canvas API to convert to WebP
        const img = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = URL.createObjectURL(blob);
        });

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const webpBlob = await new Promise<Blob>((resolve) => {
          canvas.toBlob(
            (b) => resolve(b), 
            'image/webp', 
            this.defaultOptions.quality / 100
          );
        });

        return webpBlob;
      }
      
      return blob;
    } catch (error) {
      this.monitoring.logError('image_blob_optimization_failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      return blob;
    }
  }

  private isWebPSupported(): boolean {
    const canvas = document.createElement('canvas');
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  public isSupportedFormat(filename: string): boolean {
    const extension = filename.split('.').pop()?.toLowerCase();
    return extension ? this.supportedFormats.includes(extension) : false;
  }

  public getImageDimensions(url: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight
        });
      };
      img.onerror = reject;
      img.src = url;
    });
  }
}

export const imageOptimization = ImageOptimizationService.getInstance();
