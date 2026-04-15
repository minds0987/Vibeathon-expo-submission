// Utility functions for KitchenOS

/**
 * Filters orders to only include those from the current operational day
 * Validates: Requirements 11.7
 */
export function filterCurrentDayOrders<T extends { createdAt: string }>(
  items: T[]
): T[] {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  return items.filter((item) => {
    const itemDate = new Date(item.createdAt);
    return itemDate >= startOfDay && itemDate < endOfDay;
  });
}

/**
 * Formats currency values with appropriate symbols
 * Validates: Requirements 11.6
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Formats time duration in seconds to human-readable format
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes === 0) {
    return `${remainingSeconds}s`;
  }
  
  return `${minutes}m ${remainingSeconds}s`;
}

/**
 * Clamps a number between min and max values
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
