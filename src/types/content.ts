export enum ContentStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

export enum ContentType {
  BLOG_POST = 'BLOG_POST',
  PRODUCT_PAGE = 'PRODUCT_PAGE',
  CATEGORY_PAGE = 'CATEGORY_PAGE',
  LANDING_PAGE = 'LANDING_PAGE',
  HELP_ARTICLE = 'HELP_ARTICLE'
}

export interface MediaAsset {
  id: string;
  filename: string;
  url: string;
  type: 'IMAGE' | 'VIDEO' | 'DOCUMENT';
  size: number;
  dimensions?: {
    width: number;
    height: number;
  };
  alt?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  canonicalUrl?: string;
  robots?: string;
  structuredData?: Record<string, any>;
}

export interface ContentVersion {
  id: string;
  contentId: string;
  version: number;
  changes: string;
  author: string;
  createdAt: Date;
}

export interface Content {
  id: string;
  type: ContentType;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  status: ContentStatus;
  author: string;
  featuredImage?: string;
  mediaAssets: MediaAsset[];
  seo: SEOMetadata;
  publishDate?: Date;
  versions: ContentVersion[];
  tags: string[];
  categories: string[];
  createdAt: Date;
  updatedAt: Date;
}
