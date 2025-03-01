import { Request, Response } from 'express';
import { AdminSettings } from '../models/AdminSettings';
import { logger } from '../utils/logger';
import { performanceMetrics } from '../services/PerformanceMetricsService';
import { imageOptimizer } from '../services/ImageOptimizationService';
import { schemaGenerator } from '../services/SchemaGeneratorService';
import { contentOptimizer } from '../services/ContentOptimizationService';
import { rankTracker } from '../services/RankTrackerService';

export class SeoController {
  private static instance: SeoController;

  private constructor() {}

  public static getInstance(): SeoController {
    if (!SeoController.instance) {
      SeoController.instance = new SeoController();
    }
    return SeoController.instance;
  }

  // Get all SEO settings
  public async getSeoSettings(req: Request, res: Response): Promise<void> {
    try {
      const settings = await AdminSettings.findOne().select('seo');
      res.json({ success: true, data: settings?.seo || {} });
    } catch (error) {
      logger.error('Error fetching SEO settings:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch SEO settings' });
    }
  }

  // Update SEO settings
  public async updateSeoSettings(req: Request, res: Response): Promise<void> {
    try {
      const settings = await AdminSettings.findOneAndUpdate(
        {},
        { $set: { seo: req.body } },
        { new: true, upsert: true }
      );
      res.json({ success: true, data: settings.seo });
    } catch (error) {
      logger.error('Error updating SEO settings:', error);
      res.status(500).json({ success: false, error: 'Failed to update SEO settings' });
    }
  }

  // Generate structured data
  public async generateStructuredData(req: Request, res: Response): Promise<void> {
    try {
      const { type, data } = req.body;
      const schema = await schemaGenerator.generate(type, data);
      res.json({ success: true, data: schema });
    } catch (error) {
      logger.error('Error generating structured data:', error);
      res.status(500).json({ success: false, error: 'Failed to generate structured data' });
    }
  }

  // Optimize content
  public async optimizeContent(req: Request, res: Response): Promise<void> {
    try {
      const { content, keywords } = req.body;
      const optimized = await contentOptimizer.optimize(content, keywords);
      res.json({ success: true, data: optimized });
    } catch (error) {
      logger.error('Error optimizing content:', error);
      res.status(500).json({ success: false, error: 'Failed to optimize content' });
    }
  }

  // Get performance metrics
  public async getPerformanceMetrics(req: Request, res: Response): Promise<void> {
    try {
      const metrics = await performanceMetrics.getMetrics();
      res.json({ success: true, data: metrics });
    } catch (error) {
      logger.error('Error fetching performance metrics:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch performance metrics' });
    }
  }

  // Track keyword rankings
  public async trackKeywordRankings(req: Request, res: Response): Promise<void> {
    try {
      const { keywords, location } = req.body;
      const rankings = await rankTracker.trackKeywords(keywords, location);
      res.json({ success: true, data: rankings });
    } catch (error) {
      logger.error('Error tracking keyword rankings:', error);
      res.status(500).json({ success: false, error: 'Failed to track keyword rankings' });
    }
  }

  // Optimize images
  public async optimizeImages(req: Request, res: Response): Promise<void> {
    try {
      const { images } = req.body;
      const optimized = await imageOptimizer.optimizeImages(images);
      res.json({ success: true, data: optimized });
    } catch (error) {
      logger.error('Error optimizing images:', error);
      res.status(500).json({ success: false, error: 'Failed to optimize images' });
    }
  }

  // Generate sitemap
  public async generateSitemap(req: Request, res: Response): Promise<void> {
    try {
      const settings = await AdminSettings.findOne().select('seo.global.sitemapConfig');
      const sitemap = await this.generateSitemapXml(settings?.seo?.global?.sitemapConfig);
      res.header('Content-Type', 'application/xml');
      res.send(sitemap);
    } catch (error) {
      logger.error('Error generating sitemap:', error);
      res.status(500).json({ success: false, error: 'Failed to generate sitemap' });
    }
  }

  // Generate robots.txt
  public async generateRobotsTxt(req: Request, res: Response): Promise<void> {
    try {
      const settings = await AdminSettings.findOne().select('seo.global.robotsTxt');
      res.header('Content-Type', 'text/plain');
      res.send(settings?.seo?.global?.robotsTxt || this.getDefaultRobotsTxt());
    } catch (error) {
      logger.error('Error generating robots.txt:', error);
      res.status(500).json({ success: false, error: 'Failed to generate robots.txt' });
    }
  }

  private async generateSitemapXml(config: any): Promise<string> {
    // Implementation for generating sitemap XML
    return '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>';
  }

  private getDefaultRobotsTxt(): string {
    return `User-agent: *\nAllow: /\nSitemap: ${process.env.VITE_APP_URL}/sitemap.xml`;
  }
}
