import { AnalyticsEvent, AnalyticsData } from '../../types/analytics';

class UnifiedAnalytics {
  private static instance: UnifiedAnalytics;
  private initialized: boolean = false;

  private constructor() {}

  public static getInstance(): UnifiedAnalytics {
    if (!UnifiedAnalytics.instance) {
      UnifiedAnalytics.instance = new UnifiedAnalytics();
    }
    return UnifiedAnalytics.instance;
  }

  public init() {
    if (this.initialized) {
      console.warn('Analytics already initialized');
      return;
    }
    // Initialize Adobe Analytics
    this.initialized = true;
  }

  public track(event: AnalyticsEvent, data: AnalyticsData) {
    if (!this.initialized) {
      console.error('Analytics not initialized');
      return;
    }

    // Deduplicate events if needed
    if (this.isDuplicateEvent(event, data)) {
      return;
    }

    // Normalize data
    const normalizedData = this.normalizeData(data);

    // Track in Adobe Analytics
    this.trackInAdobeAnalytics(event, normalizedData);

    // Additional tracking systems if needed
    this.trackInCustomSystems(event, normalizedData);
  }

  private isDuplicateEvent(event: AnalyticsEvent, data: AnalyticsData): boolean {
    // Implement deduplication logic based on event type and timestamp
    const key = this.generateEventKey(event, data);
    const now = Date.now();
    const recentEvents = this.getRecentEvents();

    // Check if same event occurred in last 2 seconds
    return recentEvents.some(e => 
      e.key === key && now - e.timestamp < 2000
    );
  }

  private normalizeData(data: AnalyticsData): AnalyticsData {
    return {
      ...data,
      timestamp: Date.now(),
      session_id: this.getSessionId(),
      page_url: window.location.href,
      // Add any other common fields
    };
  }

  private trackInAdobeAnalytics(event: AnalyticsEvent, data: AnalyticsData) {
    // Implement Adobe Analytics tracking
  }

  private trackInCustomSystems(event: AnalyticsEvent, data: AnalyticsData) {
    // Implement any additional tracking systems
  }

  private generateEventKey(event: AnalyticsEvent, data: AnalyticsData): string {
    return `${event}_${JSON.stringify(data)}`;
  }

  private getRecentEvents(): Array<{ key: string; timestamp: number }> {
    // Implement recent events tracking
    return [];
  }

  private getSessionId(): string {
    // Implement session management
    return '';
  }

  // Specific tracking methods to ensure consistent event naming and data structure
  public trackSearch(data: {
    query: string;
    filters?: any;
    results_count: number;
    page?: number;
    sort_by?: string;
  }) {
    this.track('search', {
      event_category: 'search',
      event_action: 'perform_search',
      ...data
    });
  }

  public trackProductView(data: {
    product_id: string;
    product_name: string;
    price: number;
    category?: string;
    scent_profile?: any;
  }) {
    this.track('product_view', {
      event_category: 'product',
      event_action: 'view',
      ...data
    });
  }

  public trackScentInteraction(data: {
    interaction_type: 'view' | 'hover' | 'select';
    scent_note: string;
    product_id?: string;
    source: string;
  }) {
    this.track('scent_interaction', {
      event_category: 'scent',
      event_action: data.interaction_type,
      ...data
    });
  }

  public trackWishlistAction(data: {
    action: 'add' | 'remove' | 'move' | 'share';
    product_id: string;
    wishlist_id: string;
    wishlist_name?: string;
  }) {
    this.track('wishlist_action', {
      event_category: 'wishlist',
      event_action: data.action,
      ...data
    });
  }
}

export const analytics = UnifiedAnalytics.getInstance();
