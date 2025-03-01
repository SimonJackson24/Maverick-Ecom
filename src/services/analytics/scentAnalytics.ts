import { AnalyticsEvent } from './types';
import { CustomerScentPreferences, ScentProfile } from '../../types/scent';

export interface ScentAnalyticsEvents extends AnalyticsEvent {
  scent_note_hover: {
    product_id: string;
    product_name: string;
    note_name: string;
    note_intensity: number;
    note_type?: string;
  };

  scent_recommendations_scroll: {
    product_sku: string;
    product_name: string;
    scroll_direction: 'left' | 'right';
  };

  scent_recommendation_click: {
    source_product_sku: string;
    source_product_name: string;
    recommended_product_sku: string;
    recommended_product_name: string;
    match_score: number;
  };

  scent_preferences_updated: {
    preferences: CustomerScentPreferences;
  };

  scent_note_preference_changed: {
    note: string;
    type: 'favorite' | 'avoided';
    action: 'added' | 'removed';
  };

  scent_intensity_preference_changed: {
    intensity: string;
    action: 'added' | 'removed';
  };

  scent_season_preference_changed: {
    season: string;
    action: 'added' | 'removed';
  };

  scent_profile_viewed: {
    product_id: string;
    product_name: string;
    scent_profile: ScentProfile;
    view_duration: number;
    view_source: 'product_page' | 'recommendation' | 'search_results';
  };

  scent_based_purchase: {
    product_id: string;
    product_name: string;
    scent_profile: ScentProfile;
    recommendation_source?: {
      source_product_id: string;
      match_score: number;
    };
    customer_preferences_match_score: number;
  };
}

export class ScentAnalytics {
  private startViewTime: number | null = null;

  public trackScentProfileView(
    productId: string,
    productName: string,
    profile: ScentProfile,
    source: 'product_page' | 'recommendation' | 'search_results'
  ) {
    this.startViewTime = Date.now();

    // Return cleanup function
    return () => {
      if (this.startViewTime) {
        const viewDuration = Date.now() - this.startViewTime;
        window.analytics?.track('scent_profile_viewed', {
          product_id: productId,
          product_name: productName,
          scent_profile: profile,
          view_duration: viewDuration,
          view_source: source
        });
        this.startViewTime = null;
      }
    };
  }

  public trackScentBasedPurchase(
    productId: string,
    productName: string,
    profile: ScentProfile,
    customerPreferencesMatchScore: number,
    recommendationSource?: {
      source_product_id: string;
      match_score: number;
    }
  ) {
    window.analytics?.track('scent_based_purchase', {
      product_id: productId,
      product_name: productName,
      scent_profile: profile,
      recommendation_source: recommendationSource,
      customer_preferences_match_score: customerPreferencesMatchScore
    });
  }
}

export const scentAnalytics = new ScentAnalytics();
