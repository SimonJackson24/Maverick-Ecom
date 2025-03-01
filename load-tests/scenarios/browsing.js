import http from 'k6/http';
import { check, group } from 'k6';
import { randomItem } from '../utils.js';

export function browsingFlow(baseUrl, metrics) {
  group('Browse Homepage', function () {
    const homeStart = new Date();
    const homeResponse = http.get(`${baseUrl}/`);
    metrics.homepage_load.add(new Date() - homeStart);

    check(homeResponse, {
      'homepage status is 200': (r) => r.status === 200,
      'homepage has content': (r) => r.body.includes('Wick & Wax Co'),
    });
  });

  group('Browse Product List', function () {
    const categories = ['candles', 'diffusers', 'accessories'];
    const category = randomItem(categories);
    
    const listResponse = http.get(`${baseUrl}/products?category=${category}`);
    
    check(listResponse, {
      'product list status is 200': (r) => r.status === 200,
      'product list has items': (r) => {
        const data = JSON.parse(r.body);
        return data.products && data.products.length > 0;
      },
    });
  });

  group('View Product Details', function () {
    const productStart = new Date();
    const productResponse = http.get(`${baseUrl}/api/products/featured`);
    metrics.product_load.add(new Date() - productStart);

    check(productResponse, {
      'product details status is 200': (r) => r.status === 200,
      'product has details': (r) => {
        const data = JSON.parse(r.body);
        return data.length > 0;
      },
    });
  });

  group('Search Products', function () {
    const searchTerms = ['vanilla', 'lavender', 'citrus', 'wood'];
    const term = randomItem(searchTerms);
    
    const searchResponse = http.get(`${baseUrl}/api/products/search?q=${term}`);
    
    check(searchResponse, {
      'search status is 200': (r) => r.status === 200,
      'search has results': (r) => {
        const data = JSON.parse(r.body);
        return Array.isArray(data.results);
      },
    });
  });

  group('View Reviews', function () {
    const reviewsResponse = http.get(`${baseUrl}/api/products/1/reviews`);
    
    check(reviewsResponse, {
      'reviews status is 200': (r) => r.status === 200,
      'reviews are available': (r) => {
        const data = JSON.parse(r.body);
        return Array.isArray(data.reviews);
      },
    });
  });
}
