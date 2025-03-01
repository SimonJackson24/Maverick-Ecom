import { GraphQLClient } from 'graphql-request';
import { GET_PRODUCTS } from '../src/graphql/products';
import { Product } from '../src/types/commerce';

interface SEOValidationResult {
  title: boolean;
  description: boolean;
  images: boolean;
}

async function validateProductSEO(product: Product): Promise<SEOValidationResult> {
  return {
    title: product.name.length >= 5 && product.name.length <= 60,
    description: product.description.html.length >= 50 && product.description.html.length <= 160,
    images: product.media_gallery.length > 0 && product.media_gallery.every(img => img.url.length > 0),
  };
}

async function validateProductImages(product: Product): Promise<boolean> {
  // Check if all images exist and are optimized
  const allImages = [product.image, ...product.media_gallery];
  
  for (const image of allImages) {
    try {
      const response = await fetch(image.url);
      if (!response.ok) {
        console.error(`Image not found: ${image.url}`);
        return false;
      }

      const contentType = response.headers.get('content-type');
      if (!contentType?.startsWith('image/')) {
        console.error(`Invalid content type for ${image.url}: ${contentType}`);
        return false;
      }

      // Check if image is WebP or AVIF
      const isOptimized = contentType === 'image/webp' || contentType === 'image/avif';
      if (!isOptimized) {
        console.error(`Image not optimized: ${image.url}`);
        return false;
      }
    } catch (error) {
      console.error(`Error checking image ${image.url}:`, error);
      return false;
    }
  }
  return true;
}

async function main() {
  const client = new GraphQLClient('http://localhost:4000/graphql');
  
  try {
    const { products } = await client.request<{ products: { items: Product[] } }>(GET_PRODUCTS);
    
    let hasErrors = false;
    
    for (const product of products.items) {
      console.log(`\nVerifying product: ${product.name}`);
      
      // Validate SEO
      const seoResult = await validateProductSEO(product);
      if (!Object.values(seoResult).every(Boolean)) {
        console.error('SEO validation failed:', seoResult);
        hasErrors = true;
      }
      
      // Validate Images
      const imagesValid = await validateProductImages(product);
      if (!imagesValid) {
        console.error('Image validation failed');
        hasErrors = true;
      }
    }
    
    if (hasErrors) {
      process.exit(1);
    } else {
      console.log('\nAll content verified successfully!');
    }
  } catch (error) {
    console.error('Error verifying content:', error);
    process.exit(1);
  }
}

main();
