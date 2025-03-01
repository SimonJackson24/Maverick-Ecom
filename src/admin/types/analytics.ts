import { Product } from '../../types/product';
import { Order } from '../../types/order';

export interface DateRangeInput {
  startDate: Date;
  endDate: Date;
}

export interface AnalyticsFilter {
  categories?: string[];
  products?: string[];
  customerSegments?: string[];
  paymentMethods?: string[];
  shippingMethods?: string[];
}

export interface SalesAnalytics {
  revenue: {
    total: number;
    byDay: {
      date: string;
      amount: number;
    }[];
    byCategory: {
      category: string;
      amount: number;
    }[];
    byProduct: {
      product: Product;
      amount: number;
    }[];
  };
  orders: {
    total: number;
    byDay: {
      date: string;
      count: number;
    }[];
    byStatus: {
      status: string;
      count: number;
    }[];
    averageValue: number;
  };
  conversions: {
    rate: number;
    bySource: {
      source: string;
      rate: number;
    }[];
  };
}

export interface ScentAnalytics {
  popularScents: {
    scent: string;
    count: number;
  }[];
  scentCombinations: {
    combination: string[];
    count: number;
  }[];
  seasonalTrends: {
    season: string;
    topScents: {
      scent: string;
      count: number;
    }[];
  }[];
}

export interface CustomerAnalytics {
  total: number;
  new: number;
  returning: number;
  segments: {
    name: string;
    count: number;
    value: number;
  }[];
  retention: {
    rate: number;
    bySegment: {
      segment: string;
      rate: number;
    }[];
  };
  lifetime: {
    value: number;
    bySegment: {
      segment: string;
      value: number;
    }[];
  };
}

export interface InventoryAnalytics {
  stock: {
    total: number;
    low: Product[];
    outOfStock: Product[];
  };
  turnover: {
    rate: number;
    byProduct: {
      product: Product;
      rate: number;
    }[];
  };
  forecast: {
    demand: {
      product: Product;
      quantity: number;
    }[];
    restockDates: {
      product: Product;
      date: string;
    }[];
  };
}
