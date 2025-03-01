import { AnalyticsEvent } from './types';

export type CheckoutStep = 'email' | 'shipping' | 'payment' | 'review';

export interface CheckoutAnalyticsData {
  cartId: string;
  step: CheckoutStep;
  value?: number;
  currency?: string;
  error?: string;
  paymentMethod?: string;
  shippingMethod?: string;
}

export interface CartSummaryAnalyticsData extends CheckoutAnalyticsData {
  itemId?: string;
  itemSku?: string;
  itemName?: string;
  quantity?: number;
  promoCode?: string;
  summaryExpanded?: boolean;
  interactionType?: 'view' | 'expand' | 'collapse' | 'scroll' | 'hover';
}

class CheckoutAnalytics {
  private trackEvent(event: string, data: CheckoutAnalyticsData) {
    const analyticsEvent: AnalyticsEvent = {
      category: 'Checkout',
      action: event,
      label: `Step: ${data.step}`,
      value: data.value,
      metadata: {
        cartId: data.cartId,
        currency: data.currency,
        error: data.error,
        paymentMethod: data.paymentMethod,
        shippingMethod: data.shippingMethod,
        timestamp: new Date().toISOString(),
      },
    };

    // Send to analytics service
    window.dataLayer?.push({ event: 'checkout', ...analyticsEvent });
  }

  stepView(data: CheckoutAnalyticsData) {
    this.trackEvent('step_view', data);
  }

  stepComplete(data: CheckoutAnalyticsData) {
    this.trackEvent('step_complete', data);
  }

  stepError(data: CheckoutAnalyticsData & { error: string }) {
    this.trackEvent('step_error', data);
  }

  orderPlaced(data: CheckoutAnalyticsData & { 
    orderId: string;
    items: Array<{
      sku: string;
      name: string;
      price: number;
      quantity: number;
    }>;
  }) {
    this.trackEvent('order_placed', {
      ...data,
      value: data.items.reduce((total, item) => total + (item.price * item.quantity), 0),
    });
  }

  abandonedCart(data: CheckoutAnalyticsData) {
    this.trackEvent('cart_abandoned', data);
  }

  paymentMethodSelected(data: CheckoutAnalyticsData & { paymentMethod: string }) {
    this.trackEvent('payment_method_selected', data);
  }

  shippingMethodSelected(data: CheckoutAnalyticsData & { shippingMethod: string }) {
    this.trackEvent('shipping_method_selected', data);
  }

  promoCodeApplied(data: CheckoutAnalyticsData & { 
    promoCode: string;
    discount: number;
  }) {
    this.trackEvent('promo_code_applied', data);
  }

  promoCodeError(data: CheckoutAnalyticsData & { 
    promoCode: string;
    error: string;
  }) {
    this.trackEvent('promo_code_error', data);
  }

  // Cart Summary specific events
  cartSummaryInteraction(data: CartSummaryAnalyticsData) {
    this.trackEvent('cart_summary_interaction', data);
  }

  cartSummaryExpand(data: CartSummaryAnalyticsData) {
    this.trackEvent('cart_summary_expand', {
      ...data,
      summaryExpanded: true,
      interactionType: 'expand',
    });
  }

  cartSummaryCollapse(data: CartSummaryAnalyticsData) {
    this.trackEvent('cart_summary_collapse', {
      ...data,
      summaryExpanded: false,
      interactionType: 'collapse',
    });
  }

  cartItemHover(data: CartSummaryAnalyticsData) {
    this.trackEvent('cart_item_hover', {
      ...data,
      interactionType: 'hover',
    });
  }

  cartSummaryScroll(data: CartSummaryAnalyticsData) {
    this.trackEvent('cart_summary_scroll', {
      ...data,
      interactionType: 'scroll',
    });
  }

  cartItemView(data: CartSummaryAnalyticsData) {
    this.trackEvent('cart_item_view', {
      ...data,
      interactionType: 'view',
    });
  }

  // Enhanced promo code events
  promoCodeView(data: CartSummaryAnalyticsData) {
    this.trackEvent('promo_code_view', data);
  }

  promoCodeFocus(data: CartSummaryAnalyticsData) {
    this.trackEvent('promo_code_focus', data);
  }

  promoCodeBlur(data: CartSummaryAnalyticsData) {
    this.trackEvent('promo_code_blur', data);
  }
}

export const checkoutAnalytics = new CheckoutAnalytics();
