import {
  Content,
  ContentStatus,
  ContentType,
  MediaAsset,
  SEOMetadata,
  ContentVersion
} from '../types/content';

// Mock data
const mockContent: Content[] = [
  {
    id: '1',
    title: 'How to Choose the Perfect Candle Scent',
    slug: 'how-to-choose-perfect-candle-scent',
    type: ContentType.BLOG_POST,
    status: ContentStatus.PUBLISHED,
    author: 'Sarah Johnson',
    content: '<p>Detailed guide about choosing candle scents...</p>',
    excerpt: 'Learn how to select the perfect candle scent for your space.',
    featuredImage: 'candle-scents.jpg',
    tags: ['candles', 'scents', 'guide'],
    categories: ['Guides', 'Tips'],
    seo: {
      title: 'How to Choose the Perfect Candle Scent | Wick & Wax Co',
      description: 'Expert guide on selecting the ideal candle scent for your home.',
      keywords: ['candle scents', 'fragrance selection', 'home fragrance'],
    },
    publishedAt: new Date('2025-02-01').toISOString(),
    createdAt: new Date('2025-01-15').toISOString(),
    updatedAt: new Date('2025-02-01').toISOString(),
  },
  {
    id: '2',
    title: 'Seasonal Collection: Spring 2025',
    slug: 'seasonal-collection-spring-2025',
    type: ContentType.PRODUCT_PAGE,
    status: ContentStatus.PUBLISHED,
    author: 'Marketing Team',
    content: '<p>Discover our Spring 2025 collection...</p>',
    excerpt: 'Fresh and vibrant scents for the spring season.',
    featuredImage: 'spring-collection.jpg',
    tags: ['spring', 'collection', 'seasonal'],
    categories: ['Collections', 'Seasonal'],
    seo: {
      title: 'Spring 2025 Candle Collection | Wick & Wax Co',
      description: 'Explore our new spring candle collection.',
      keywords: ['spring candles', 'seasonal collection', 'spring scents'],
    },
    publishedAt: new Date('2025-03-01').toISOString(),
    createdAt: new Date('2025-02-15').toISOString(),
    updatedAt: new Date('2025-02-15').toISOString(),
  },
  {
    id: '3',
    title: 'Candle Care Guide',
    slug: 'candle-care-guide',
    type: ContentType.HELP_ARTICLE,
    status: ContentStatus.PUBLISHED,
    author: 'Customer Support',
    content: '<p>Learn how to properly care for your candles...</p>',
    excerpt: 'Essential tips for maintaining your candles.',
    featuredImage: 'candle-care.jpg',
    tags: ['care', 'maintenance', 'guide'],
    categories: ['Help', 'Guides'],
    seo: {
      title: 'Candle Care Guide | Wick & Wax Co',
      description: 'Learn how to properly maintain and care for your candles.',
      keywords: ['candle care', 'maintenance', 'candle tips'],
    },
    publishedAt: new Date('2025-01-15').toISOString(),
    createdAt: new Date('2025-01-10').toISOString(),
    updatedAt: new Date('2025-01-15').toISOString(),
  },
];

class ContentService {
  private static instance: ContentService;
  private constructor() {}

  static getInstance(): ContentService {
    if (!ContentService.instance) {
      ContentService.instance = new ContentService();
    }
    return ContentService.instance;
  }

  // Content Management
  async createContent(content: Omit<Content, 'id' | 'versions' | 'createdAt' | 'updatedAt'>): Promise<Content> {
    // Mock implementation
    const newContent: Content = {
      ...content,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockContent.push(newContent);
    return newContent;
  }

  async updateContent(contentId: string, updates: Partial<Content>): Promise<Content> {
    const index = mockContent.findIndex(c => c.id === contentId);
    if (index === -1) throw new Error('Content not found');
    
    mockContent[index] = {
      ...mockContent[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return mockContent[index];
  }

  async getContent(contentId: string): Promise<Content> {
    const content = mockContent.find(c => c.id === contentId);
    if (!content) throw new Error('Content not found');
    return content;
  }

  async listContent(filters?: {
    type?: ContentType;
    status?: ContentStatus;
    author?: string;
    tags?: string[];
    categories?: string[];
  }): Promise<Content[]> {
    let filteredContent = [...mockContent];
    
    if (filters) {
      if (filters.type) {
        filteredContent = filteredContent.filter(c => c.type === filters.type);
      }
      if (filters.status) {
        filteredContent = filteredContent.filter(c => c.status === filters.status);
      }
      if (filters.author) {
        filteredContent = filteredContent.filter(c => c.author === filters.author);
      }
      if (filters.tags) {
        filteredContent = filteredContent.filter(c => 
          filters.tags.some(tag => c.tags.includes(tag))
        );
      }
      if (filters.categories) {
        filteredContent = filteredContent.filter(c => 
          filters.categories.some(cat => c.categories.includes(cat))
        );
      }
    }
    
    return filteredContent;
  }

  async deleteContent(contentId: string): Promise<void> {
    const index = mockContent.findIndex(c => c.id === contentId);
    if (index === -1) throw new Error('Content not found');
    mockContent.splice(index, 1);
  }

  // Content Publishing
  async publishContent(contentId: string, publishDate?: Date): Promise<Content> {
    // Implementation will connect to backend API
    throw new Error('Not implemented');
  }

  async scheduleContent(contentId: string, publishDate: Date): Promise<Content> {
    // Implementation will connect to backend API
    throw new Error('Not implemented');
  }

  async unpublishContent(contentId: string): Promise<Content> {
    // Implementation will connect to backend API
    throw new Error('Not implemented');
  }

  // Media Management
  async uploadMedia(
    file: File,
    metadata: Pick<MediaAsset, 'alt' | 'tags'>
  ): Promise<MediaAsset> {
    // Implementation will connect to backend API
    throw new Error('Not implemented');
  }

  async updateMediaMetadata(
    mediaId: string,
    updates: Partial<MediaAsset>
  ): Promise<MediaAsset> {
    // Implementation will connect to backend API
    throw new Error('Not implemented');
  }

  async deleteMedia(mediaId: string): Promise<void> {
    // Implementation will connect to backend API
    throw new Error('Not implemented');
  }

  async listMedia(filters?: {
    type?: MediaAsset['type'];
    tags?: string[];
  }): Promise<MediaAsset[]> {
    // Implementation will connect to backend API
    throw new Error('Not implemented');
  }

  // SEO Management
  async updateSEO(
    contentId: string,
    seoMetadata: SEOMetadata
  ): Promise<Content> {
    // Implementation will connect to backend API
    throw new Error('Not implemented');
  }

  async generateSEOSuggestions(contentId: string): Promise<{
    title: string[];
    description: string[];
    keywords: string[];
  }> {
    // Implementation will connect to backend API
    throw new Error('Not implemented');
  }

  // Version Control
  async getContentVersions(contentId: string): Promise<ContentVersion[]> {
    // Implementation will connect to backend API
    throw new Error('Not implemented');
  }

  async revertToVersion(
    contentId: string,
    versionId: string
  ): Promise<Content> {
    // Implementation will connect to backend API
    throw new Error('Not implemented');
  }

  // Analytics
  async getContentMetrics(contentId: string): Promise<{
    views: number;
    uniqueVisitors: number;
    averageTimeOnPage: number;
    bounceRate: number;
    socialShares: number;
  }> {
    // Implementation will connect to backend API
    throw new Error('Not implemented');
  }
}

export default ContentService;
