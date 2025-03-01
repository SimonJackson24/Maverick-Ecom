import { checkoutAnalytics } from '../analytics/checkoutAnalytics';

export interface ExperimentVariant {
  id: string;
  name: string;
  weight: number;
}

export interface Experiment {
  id: string;
  name: string;
  description: string;
  variants: ExperimentVariant[];
  isActive: boolean;
}

export interface ExperimentAssignment {
  experimentId: string;
  variantId: string;
  timestamp: string;
}

class CheckoutExperiments {
  private experiments: Map<string, Experiment> = new Map();
  private assignments: Map<string, ExperimentAssignment> = new Map();
  private readonly STORAGE_KEY = 'checkout_experiments';

  constructor() {
    this.loadExperiments();
    this.loadAssignments();
  }

  private loadExperiments(): void {
    // Default experiments
    this.addExperiment({
      id: 'checkout_layout',
      name: 'Checkout Layout Test',
      description: 'Testing different checkout layout variations',
      variants: [
        { id: 'control', name: 'Standard Layout', weight: 50 },
        { id: 'compact', name: 'Compact Layout', weight: 25 },
        { id: 'expanded', name: 'Expanded Layout', weight: 25 },
      ],
      isActive: true,
    });

    this.addExperiment({
      id: 'cart_summary_position',
      name: 'Cart Summary Position',
      description: 'Testing different positions for the cart summary',
      variants: [
        { id: 'right', name: 'Right Sidebar', weight: 34 },
        { id: 'left', name: 'Left Sidebar', weight: 33 },
        { id: 'floating', name: 'Floating Panel', weight: 33 },
      ],
      isActive: true,
    });

    this.addExperiment({
      id: 'progress_indicator',
      name: 'Progress Indicator Style',
      description: 'Testing different styles of checkout progress indication',
      variants: [
        { id: 'steps', name: 'Step Numbers', weight: 50 },
        { id: 'progress_bar', name: 'Progress Bar', weight: 50 },
      ],
      isActive: true,
    });
  }

  private loadAssignments(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const assignments = JSON.parse(stored);
        Object.entries(assignments).forEach(([userId, assignment]) => {
          this.assignments.set(userId, assignment as ExperimentAssignment);
        });
      }
    } catch (error) {
      console.error('Error loading experiment assignments:', error);
    }
  }

  private saveAssignments(): void {
    try {
      const assignments = Object.fromEntries(this.assignments);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(assignments));
    } catch (error) {
      console.error('Error saving experiment assignments:', error);
    }
  }

  public addExperiment(experiment: Experiment): void {
    this.experiments.set(experiment.id, experiment);
  }

  public getExperiment(experimentId: string): Experiment | undefined {
    return this.experiments.get(experimentId);
  }

  public getAssignment(userId: string, experimentId: string): string {
    const key = `${userId}_${experimentId}`;
    let assignment = this.assignments.get(key);

    if (!assignment) {
      const experiment = this.experiments.get(experimentId);
      if (!experiment || !experiment.isActive) return 'control';

      // Assign variant based on weights
      const totalWeight = experiment.variants.reduce((sum, v) => sum + v.weight, 0);
      let random = Math.random() * totalWeight;
      
      let selectedVariant = experiment.variants[0];
      for (const variant of experiment.variants) {
        if (random <= variant.weight) {
          selectedVariant = variant;
          break;
        }
        random -= variant.weight;
      }

      assignment = {
        experimentId,
        variantId: selectedVariant.id,
        timestamp: new Date().toISOString(),
      };

      this.assignments.set(key, assignment);
      this.saveAssignments();

      // Track experiment assignment
      checkoutAnalytics.trackEvent('experiment_assignment', {
        cartId: userId,
        step: 'experiment',
        metadata: {
          experimentId,
          variantId: selectedVariant.id,
        },
      });
    }

    return assignment.variantId;
  }

  public trackExperimentEvent(
    userId: string,
    experimentId: string,
    eventName: string,
    metadata?: Record<string, any>
  ): void {
    const assignment = this.assignments.get(`${userId}_${experimentId}`);
    if (!assignment) return;

    checkoutAnalytics.trackEvent('experiment_event', {
      cartId: userId,
      step: 'experiment',
      metadata: {
        experimentId,
        variantId: assignment.variantId,
        eventName,
        ...metadata,
      },
    });
  }

  public getAllExperiments(): Experiment[] {
    return Array.from(this.experiments.values());
  }

  public getActiveExperiments(): Experiment[] {
    return Array.from(this.experiments.values()).filter(exp => exp.isActive);
  }

  public setExperimentStatus(experimentId: string, isActive: boolean): void {
    const experiment = this.experiments.get(experimentId);
    if (experiment) {
      experiment.isActive = isActive;
      this.experiments.set(experimentId, experiment);
    }
  }
}

export const checkoutExperiments = new CheckoutExperiments();
