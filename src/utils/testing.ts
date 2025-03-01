import { Product, Price, Image } from '../types/commerce';
import { ScentProfile, ScentIntensity } from '../types/scent';

/**
 * Measures the time taken to render a component
 * @param renderFn Function that renders the component
 * @returns Time taken in milliseconds
 */
export const measureRenderTime = async (renderFn: () => void): Promise<number> => {
  const start = performance.now();
  await renderFn();
  const end = performance.now();
  return end - start;
};

/**
 * Measures memory usage before and after an operation
 * @returns Memory usage in bytes
 */
export const measureMemoryUsage = async (): Promise<number> => {
  if (performance.memory) {
    return performance.memory.usedJSHeapSize;
  }
  // Fallback for browsers that don't support performance.memory
  return process.memoryUsage().heapUsed;
};

/**
 * Generates a large list of mock products for performance testing
 * @param count Number of products to generate
 * @returns Array of mock products
 */
export const generateLargeProductList = (count: number): Product[] => {
  const intensities: ScentIntensity[] = ['LIGHT', 'MODERATE', 'STRONG'];
  const notes = [
    'Lavender', 'Vanilla', 'Rose', 'Jasmine', 'Bergamot', 'Sandalwood',
    'Patchouli', 'Ylang-Ylang', 'Cedarwood', 'Frankincense'
  ];
  const moods = ['Relaxing', 'Energizing', 'Calming', 'Uplifting', 'Soothing'];
  const seasons = ['Spring', 'Summer', 'Fall', 'Winter'];

  return Array.from({ length: count }, (_, i) => ({
    id: `product-${i}`,
    name: `Test Product ${i}`,
    price: {
      regularPrice: {
        amount: {
          value: 19.99 + (i % 10),
          currency: 'USD'
        }
      }
    } as Price,
    image: {
      url: `/images/product-${i}.jpg`,
      label: `Test Product ${i} Image`
    } as Image,
    scent_profile: {
      primary_notes: [
        {
          name: notes[i % notes.length],
          intensity: (i % 10) + 1
        }
      ],
      middle_notes: [
        {
          name: notes[(i + 1) % notes.length],
          intensity: (i % 10) + 1
        }
      ],
      base_notes: [
        {
          name: notes[(i + 2) % notes.length],
          intensity: (i % 10) + 1
        }
      ],
      intensity: intensities[i % intensities.length],
      mood: [moods[i % moods.length]],
      season: [seasons[i % seasons.length]]
    } as ScentProfile
  }));
};

/**
 * Monitors component performance metrics
 * @param component Component to monitor
 * @returns Performance metrics
 */
export const monitorComponentPerformance = async (
  component: React.ComponentType<any>,
  props: any
) => {
  const metrics = {
    renderTime: 0,
    memoryUsage: 0,
    reflows: 0,
    repaintCount: 0
  };

  // Create performance observer
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'layout-shift') {
        metrics.reflows++;
      }
      if (entry.entryType === 'paint') {
        metrics.repaintCount++;
      }
    }
  });

  observer.observe({ entryTypes: ['layout-shift', 'paint'] });

  // Measure render time and memory usage
  const beforeMemory = await measureMemoryUsage();
  metrics.renderTime = await measureRenderTime(() => {
    render(React.createElement(component, props));
  });
  const afterMemory = await measureMemoryUsage();
  metrics.memoryUsage = afterMemory - beforeMemory;

  observer.disconnect();

  return metrics;
};

/**
 * Checks if a component meets performance budgets
 * @param metrics Performance metrics
 * @param budgets Performance budgets
 * @returns Boolean indicating if budgets are met
 */
export const checkPerformanceBudgets = (
  metrics: {
    renderTime: number;
    memoryUsage: number;
    reflows: number;
    repaintCount: number;
  },
  budgets: {
    maxRenderTime: number;
    maxMemoryUsage: number;
    maxReflows: number;
    maxRepaints: number;
  }
): boolean => {
  return (
    metrics.renderTime <= budgets.maxRenderTime &&
    metrics.memoryUsage <= budgets.maxMemoryUsage &&
    metrics.reflows <= budgets.maxReflows &&
    metrics.repaintCount <= budgets.maxRepaints
  );
};

/**
 * Generates a performance report
 * @param metrics Performance metrics
 * @returns Formatted performance report
 */
export const generatePerformanceReport = (metrics: {
  renderTime: number;
  memoryUsage: number;
  reflows: number;
  repaintCount: number;
}): string => {
  return `
Performance Report:
------------------
Render Time: ${metrics.renderTime.toFixed(2)}ms
Memory Usage: ${(metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB
Layout Shifts: ${metrics.reflows}
Repaints: ${metrics.repaintCount}
  `.trim();
};
