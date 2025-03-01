import sharp from 'sharp';
import { logger } from '../utils/logger';

class ImageOptimizationService {
  private static instance: ImageOptimizationService;

  private constructor() {}

  public static getInstance(): ImageOptimizationService {
    if (!ImageOptimizationService.instance) {
      ImageOptimizationService.instance = new ImageOptimizationService();
    }
    return ImageOptimizationService.instance;
  }

  public async optimizeImages(images: Array<{ url: string; buffer: Buffer }>): Promise<any> {
    try {
      const optimizedImages = await Promise.all(
        images.map(async (image) => {
          const webp = await this.convertToWebP(image.buffer);
          const optimized = await this.optimizeImage(image.buffer);
          return {
            original: image.url,
            webp,
            optimized
          };
        })
      );
      return optimizedImages;
    } catch (error) {
      logger.error('Error optimizing images:', error);
      throw error;
    }
  }

  private async convertToWebP(buffer: Buffer): Promise<Buffer> {
    return sharp(buffer)
      .webp({ quality: 85 })
      .toBuffer();
  }

  private async optimizeImage(buffer: Buffer): Promise<Buffer> {
    return sharp(buffer)
      .jpeg({ quality: 85, progressive: true })
      .toBuffer();
  }
}

export const imageOptimizer = ImageOptimizationService.getInstance();
