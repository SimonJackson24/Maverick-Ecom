import { analytics } from '../analytics/unifiedAnalytics';

export interface Experiment {
  id: string;
  name: string;
  variants: string[];
  weights?: number[];
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
}

export interface ExperimentResult {
  variant: string;
  shouldParticipate: boolean;
}

class ABTesting {
  private static instance: ABTesting;
  private experiments: Map<string, Experiment> = new Map();
  private userAssignments: Map<string, string> = new Map();

  private constructor() {}

  public static getInstance(): ABTesting {
    if (!ABTesting.instance) {
      ABTesting.instance = new ABTesting();
    }
    return ABTesting.instance;
  }

  public async initialize() {
    // Load active experiments from configuration
    await this.loadExperiments();
    
    // Load user's existing variant assignments
    this.loadUserAssignments();
  }

  public getExperimentVariant(experimentId: string): ExperimentResult {
    const experiment = this.experiments.get(experimentId);
    
    if (!experiment || !experiment.isActive) {
      return { variant: 'control', shouldParticipate: false };
    }

    // Check if user is already assigned to a variant
    const existingVariant = this.userAssignments.get(experimentId);
    if (existingVariant) {
      return { variant: existingVariant, shouldParticipate: true };
    }

    // Assign user to a variant
    const variant = this.assignVariant(experiment);
    this.userAssignments.set(experimentId, variant);
    this.saveUserAssignments();

    // Track experiment participation
    analytics.track('experiment_assigned', {
      experiment_id: experimentId,
      experiment_name: experiment.name,
      variant
    });

    return { variant, shouldParticipate: true };
  }

  private assignVariant(experiment: Experiment): string {
    const weights = experiment.weights || experiment.variants.map(() => 1);
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    const random = Math.random() * totalWeight;
    
    let sum = 0;
    for (let i = 0; i < weights.length; i++) {
      sum += weights[i];
      if (random <= sum) {
        return experiment.variants[i];
      }
    }
    
    return experiment.variants[0];
  }

  public trackExperimentEvent(experimentId: string, eventName: string, data: any = {}) {
    const variant = this.userAssignments.get(experimentId);
    if (!variant) return;

    analytics.track('experiment_event', {
      experiment_id: experimentId,
      experiment_name: this.experiments.get(experimentId)?.name,
      variant,
      event_name: eventName,
      ...data
    });
  }

  public async getExperimentResults(experimentId: string): Promise<any> {
    // Get experiment results from analytics
    return {};
  }

  private async loadExperiments() {
    // Load experiments from configuration
    const activeExperiments: Experiment[] = [
      {
        id: 'search_ranking',
        name: 'Search Result Ranking Algorithm',
        variants: ['algorithm_v1', 'algorithm_v2'],
        weights: [0.5, 0.5],
        startDate: new Date('2025-02-01'),
        isActive: true
      },
      {
        id: 'checkout_flow',
        name: 'Checkout Flow Optimization',
        variants: ['single_page', 'multi_step'],
        weights: [0.5, 0.5],
        startDate: new Date('2025-02-01'),
        isActive: true
      },
      {
        id: 'recommendation_placement',
        name: 'Product Recommendation Placement',
        variants: ['sidebar', 'below_product', 'popup'],
        weights: [0.33, 0.33, 0.34],
        startDate: new Date('2025-02-01'),
        isActive: true
      }
    ];

    activeExperiments.forEach(experiment => {
      this.experiments.set(experiment.id, experiment);
    });
  }

  private loadUserAssignments() {
    const saved = localStorage.getItem('ab_test_assignments');
    if (saved) {
      this.userAssignments = new Map(JSON.parse(saved));
    }
  }

  private saveUserAssignments() {
    localStorage.setItem(
      'ab_test_assignments',
      JSON.stringify(Array.from(this.userAssignments.entries()))
    );
  }

  public getAllExperiments(): Experiment[] {
    return Array.from(this.experiments.values());
  }

  public isExperimentActive(experimentId: string): boolean {
    const experiment = this.experiments.get(experimentId);
    return experiment?.isActive || false;
  }

  public getUserVariant(experimentId: string): string | null {
    return this.userAssignments.get(experimentId) || null;
  }
}

export const abTesting = ABTesting.getInstance();
