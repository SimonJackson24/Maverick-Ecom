/**
 * Formats a number as a currency string using the specified locale and currency
 * @param amount - The amount to format
 * @param locale - The locale to use for formatting (default: 'en-US')
 * @param currency - The currency code to use (default: 'USD')
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number,
  locale: string = 'en-US',
  currency: string = 'USD'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Parses a currency string into a number
 * @param currencyString - The currency string to parse
 * @returns The parsed number or null if invalid
 */
export const parseCurrency = (currencyString: string): number | null => {
  const cleanString = currencyString.replace(/[^0-9.-]/g, '');
  const number = parseFloat(cleanString);
  return isNaN(number) ? null : number;
};

/**
 * Calculates the discount percentage between original and discounted price
 * @param originalPrice - The original price
 * @param discountedPrice - The discounted price
 * @returns The discount percentage
 */
export const calculateDiscountPercentage = (
  originalPrice: number,
  discountedPrice: number
): number => {
  if (originalPrice <= 0) return 0;
  const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
  return Math.round(discount);
};

/**
 * Applies a discount percentage to a price
 * @param price - The original price
 * @param discountPercentage - The discount percentage to apply
 * @returns The discounted price
 */
export const applyDiscount = (
  price: number,
  discountPercentage: number
): number => {
  if (discountPercentage < 0 || discountPercentage > 100) {
    throw new Error('Discount percentage must be between 0 and 100');
  }
  const discountAmount = (price * discountPercentage) / 100;
  return Number((price - discountAmount).toFixed(2));
};
