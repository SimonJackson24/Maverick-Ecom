import { logger } from '../utils/logger';

class SchemaGeneratorService {
  private static instance: SchemaGeneratorService;

  private constructor() {}

  public static getInstance(): SchemaGeneratorService {
    if (!SchemaGeneratorService.instance) {
      SchemaGeneratorService.instance = new SchemaGeneratorService();
    }
    return SchemaGeneratorService.instance;
  }

  public async generate(type: string, data: any): Promise<any> {
    try {
      switch (type) {
        case 'Organization':
          return this.generateOrganizationSchema(data);
        case 'LocalBusiness':
          return this.generateLocalBusinessSchema(data);
        case 'Product':
          return this.generateProductSchema(data);
        case 'BreadcrumbList':
          return this.generateBreadcrumbSchema(data);
        default:
          throw new Error(`Unsupported schema type: ${type}`);
      }
    } catch (error) {
      logger.error('Error generating schema:', error);
      throw error;
    }
  }

  private generateOrganizationSchema(data: any): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: data.name,
      url: data.url,
      logo: data.logo,
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: data.telephone,
        email: data.email,
        contactType: data.contactType
      }
    };
  }

  private generateLocalBusinessSchema(data: any): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: data.name,
      image: data.image,
      '@id': data.url,
      url: data.url,
      telephone: data.telephone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: data.address.streetAddress,
        addressLocality: data.address.addressLocality,
        addressRegion: data.address.addressRegion,
        postalCode: data.address.postalCode,
        addressCountry: data.address.addressCountry
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: data.geo.latitude,
        longitude: data.geo.longitude
      },
      openingHoursSpecification: data.openingHours.map((hours: string) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: hours.split(' ')[0],
        opens: hours.split(' ')[1].split('-')[0],
        closes: hours.split(' ')[1].split('-')[1]
      }))
    };
  }

  private generateProductSchema(data: any): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: data.name,
      image: data.images,
      description: data.description,
      sku: data.sku,
      brand: {
        '@type': 'Brand',
        name: data.brand
      },
      offers: {
        '@type': 'Offer',
        url: data.url,
        priceCurrency: data.currency,
        price: data.price,
        priceValidUntil: data.priceValidUntil,
        availability: `https://schema.org/${data.inStock ? 'InStock' : 'OutOfStock'}`
      },
      aggregateRating: data.rating ? {
        '@type': 'AggregateRating',
        ratingValue: data.rating.average,
        reviewCount: data.rating.count
      } : undefined
    };
  }

  private generateBreadcrumbSchema(data: any): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: data.items.map((item: any, index: number) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@id': item.url,
          name: item.name
        }
      }))
    };
  }
}

export const schemaGenerator = SchemaGeneratorService.getInstance();
