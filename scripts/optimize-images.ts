import { ImageOptimizationService } from '../src/services/optimization/ImageOptimizationService';
import { promises as fs } from 'fs';
import path from 'path';

const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.webp'];

async function* walkDirectory(dir: string): AsyncGenerator<string> {
  const files = await fs.readdir(dir, { withFileTypes: true });
  for (const file of files) {
    const res = path.resolve(dir, file.name);
    if (file.isDirectory()) {
      yield* walkDirectory(res);
    } else {
      yield res;
    }
  }
}

async function optimizeAllImages() {
  const imageService = new ImageOptimizationService();
  const publicDir = path.join(process.cwd(), 'public');
  const srcDir = path.join(process.cwd(), 'src');
  
  console.log('Starting image optimization...');
  
  let optimizedCount = 0;
  let totalSize = 0;
  let optimizedSize = 0;
  
  const processImage = async (filePath: string) => {
    const ext = path.extname(filePath).toLowerCase();
    if (!SUPPORTED_FORMATS.includes(ext)) return;
    
    const stats = await fs.stat(filePath);
    totalSize += stats.size;
    
    try {
      // Generate multiple sizes for responsive images
      const breakpoints = [320, 640, 768, 1024, 1280];
      const optimizedPaths = await imageService.generateResponsiveImages(filePath, breakpoints);
      
      // Get size of all optimized versions
      let currentOptimizedSize = 0;
      for (const [_, optimizedPath] of optimizedPaths) {
        const optimizedStats = await fs.stat(optimizedPath);
        currentOptimizedSize += optimizedStats.size;
      }
      
      optimizedSize += currentOptimizedSize;
      optimizedCount++;
      
      console.log(`Optimized ${path.basename(filePath)}`);
      console.log(`Original size: ${(stats.size / 1024).toFixed(2)}KB`);
      console.log(`Optimized size: ${(currentOptimizedSize / 1024).toFixed(2)}KB`);
      console.log(`Saved: ${((stats.size - currentOptimizedSize) / 1024).toFixed(2)}KB\n`);
    } catch (error) {
      console.error(`Failed to optimize ${filePath}:`, error);
    }
  };
  
  // Process all images in public and src directories
  for await (const filePath of walkDirectory(publicDir)) {
    await processImage(filePath);
  }
  
  for await (const filePath of walkDirectory(srcDir)) {
    await processImage(filePath);
  }
  
  // Clean up old cached images
  await imageService.cleanCache();
  
  console.log('\nOptimization Summary:');
  console.log(`Total images processed: ${optimizedCount}`);
  console.log(`Total original size: ${(totalSize / 1024 / 1024).toFixed(2)}MB`);
  console.log(`Total optimized size: ${(optimizedSize / 1024 / 1024).toFixed(2)}MB`);
  console.log(`Total space saved: ${((totalSize - optimizedSize) / 1024 / 1024).toFixed(2)}MB`);
  console.log(`Reduction: ${((1 - optimizedSize / totalSize) * 100).toFixed(1)}%`);
}

optimizeAllImages().catch(console.error);
