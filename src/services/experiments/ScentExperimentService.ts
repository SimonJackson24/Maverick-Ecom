import { MonitoringService } from '../monitoring/MonitoringService';
import { ApiOptimizationService } from '../optimization/ApiOptimizationService';
import { Product } from '../../types/product';
import { ABTestMetrics } from '../../types/analytics';

interface ExperimentVariant {
  id: string;
  name: string;
  weight: number;
  config: Record<string, any>;
}

interface ExperimentConfig {
  id: string;
  name: string;
  description: string;
  variants: ExperimentVariant[];
  startDate: string;
  endDate?: string;
  minSampleSize: number;
  targetMetric: string;
}

interface ExperimentAssignment {
  userId: string;
  experimentId: string;
  variantId: string;
  assignedAt: string;
}

export class ScentExperimentService {
  private static instance: ScentExperimentService;
  private monitoring: MonitoringService;
  private api: ApiOptimizationService;
  private activeExperiments: Map<string, ExperimentConfig>;
  private assignments: Map<string, ExperimentAssignment>;

  private constructor() {
    this.monitoring = MonitoringService.getInstance();
    this.api = ApiOptimizationService.getInstance();
    this.activeExperiments = new Map();
    this.assignments = new Map();
    this.loadActiveExperiments();
  }

  public static getInstance(): ScentExperimentService {
    if (!ScentExperimentService.instance) {
      ScentExperimentService.instance = new ScentExperimentService();
    }
    return ScentExperimentService.instance;
  }

  private async loadActiveExperiments(): Promise<void> {
    try {
      const experiments = await this.api.request<ExperimentConfig[]>('/api/experiments/active', {
        cache: { maxAge: 5 * 60 * 1000 }, // 5 minutes
      });
      
      experiments.forEach(exp => this.activeExperiments.set(exp.id, exp));
    } catch (error) {
      this.monitoring.logError('experiment_load_failed', {
        message: 'Failed to load active experiments',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  public async getVariant(experimentId: string, userId: string): Promise<ExperimentVariant | null> {
    const experiment = this.activeExperiments.get(experimentId);
    if (!experiment) {
      return null;
    }

    // Check for existing assignment
    const assignmentKey = `${experimentId}:${userId}`;
    const existing = this.assignments.get(assignmentKey);
    if (existing) {
      return experiment.variants.find(v => v.id === existing.variantId) || null;
    }

    // Create new assignment
    const variant = this.assignVariant(experiment);
    if (variant) {
      const assignment: ExperimentAssignment = {
        userId,
        experimentId,
        variantId: variant.id,
        assignedAt: new Date().toISOString(),
      };
      this.assignments.set(assignmentKey, assignment);
      this.trackAssignment(assignment);
    }

    return variant;
  }

  private assignVariant(experiment: ExperimentConfig): ExperimentVariant | null {
    const totalWeight = experiment.variants.reduce((sum, v) => sum + v.weight, 0);
    const random = Math.random() * totalWeight;
    let cumulative = 0;

    for (const variant of experiment.variants) {
      cumulative += variant.weight;
      if (random <= cumulative) {
        return variant;
      }
    }

    return experiment.variants[0] || null;
  }

  private async trackAssignment(assignment: ExperimentAssignment): Promise<void> {
    try {
      await this.api.request('/api/experiments/assignments', {
        method: 'POST',
        body: assignment,
      });
    } catch (error) {
      this.monitoring.logError('experiment_assignment_failed', {
        message: 'Failed to track experiment assignment',
        error: error instanceof Error ? error.message : 'Unknown error',
        assignment,
      });
    }
  }

  public async trackConversion(
    experimentId: string,
    userId: string,
    metric: string,
    value: number
  ): Promise<void> {
    const assignment = this.assignments.get(`${experimentId}:${userId}`);
    if (!assignment) {
      return;
    }

    try {
      await this.api.request('/api/experiments/conversions', {
        method: 'POST',
        body: {
          experimentId,
          userId,
          variantId: assignment.variantId,
          metric,
          value,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      this.monitoring.logError('experiment_conversion_failed', {
        message: 'Failed to track experiment conversion',
        error: error instanceof Error ? error.message : 'Unknown error',
        experimentId,
        userId,
        metric,
      });
    }
  }

  public async getExperimentResults(experimentId: string): Promise<ABTestMetrics | null> {
    try {
      return await this.api.request<ABTestMetrics>(`/api/experiments/${experimentId}/results`, {
        cache: { maxAge: 5 * 60 * 1000 }, // 5 minutes
      });
    } catch (error) {
      this.monitoring.logError('experiment_results_failed', {
        message: 'Failed to fetch experiment results',
        error: error instanceof Error ? error.message : 'Unknown error',
        experimentId,
      });
      return null;
    }
  }

  public async getScentExperiments(product: Product): Promise<ExperimentConfig[]> {
    return Array.from(this.activeExperiments.values()).filter(exp => 
      exp.config.productCategories?.includes(product.category) ||
      exp.config.scentProfiles?.some(profile => 
        product.scentProfile?.topNotes.includes(profile) ||
        product.scentProfile?.middleNotes.includes(profile) ||
        product.scentProfile?.baseNotes.includes(profile)
      )
    );
  }

  public clearAssignments(): void {
    this.assignments.clear();
  }
}
