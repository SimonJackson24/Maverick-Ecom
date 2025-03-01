export interface Coupon {
  id: string;
  code: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  minimumPurchase?: number;
  startsAt: string;
  expiresAt?: string;
  usageLimit?: number;
  timesUsed: number;
  status: CouponStatus;
  createdAt: string;
  updatedAt: string;
}

export type DiscountType = 'percentage' | 'fixed';
export type CouponStatus = 'active' | 'inactive' | 'expired';

export interface CouponValidation {
  isValid: boolean;
  message?: string;
  coupon?: Coupon;
  discount?: number;
}

export interface CouponUsage {
  id: string;
  couponId: string;
  orderId: string;
  userId?: string;
  discountAmount: number;
  usedAt: string;
}

export interface CouponFilter {
  status?: CouponStatus[];
  discountType?: DiscountType[];
  minDiscount?: number;
  maxDiscount?: number;
  startDate?: string;
  endDate?: string;
  sortBy?: 'code' | 'usage' | 'value' | 'expiry';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface CouponSearchResult {
  items: Coupon[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface CouponAnalytics {
  totalCoupons: number;
  activeCoupons: number;
  totalUsage: number;
  totalDiscount: number;
  averageDiscount: number;
  topCoupons: {
    coupon: Coupon;
    usage: number;
    totalDiscount: number;
  }[];
  usageByDay: {
    date: string;
    usage: number;
    discount: number;
  }[];
}
