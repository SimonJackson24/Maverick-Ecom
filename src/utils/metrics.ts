export function calculateTrend(values: number[]): number {
  if (values.length < 2) return 0;

  // Get the average of the most recent 7 days
  const recent = values.slice(0, 7);
  const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length;

  // Get the average of the previous 7 days
  const previous = values.slice(7, 14);
  const previousAvg = previous.length > 0
    ? previous.reduce((sum, val) => sum + val, 0) / previous.length
    : recentAvg;

  // Calculate percentage change
  const percentageChange = ((recentAvg - previousAvg) / previousAvg) * 100;

  // Round to 2 decimal places
  return Math.round(percentageChange * 100) / 100;
}

export function calculateMovingAverage(values: number[], window: number = 7): number[] {
  if (values.length < window) return values;

  const result: number[] = [];
  for (let i = 0; i <= values.length - window; i++) {
    const windowValues = values.slice(i, i + window);
    const average = windowValues.reduce((sum, val) => sum + val, 0) / window;
    result.push(Math.round(average * 100) / 100);
  }

  return result;
}

export function normalizeScore(value: number, min: number, max: number): number {
  return Math.round(((value - min) / (max - min)) * 100);
}

export function calculateGrowthRate(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

export function aggregateScores(scores: number[]): number {
  if (scores.length === 0) return 0;
  
  // Remove any invalid scores
  const validScores = scores.filter(score => !isNaN(score) && score >= 0 && score <= 100);
  if (validScores.length === 0) return 0;

  // Calculate weighted average
  return Math.round(validScores.reduce((sum, score) => sum + score, 0) / validScores.length);
}

export function calculateHealthScore(metrics: {
  contentScore: number;
  metaScore: number;
  urlScore: number;
  issueCount: number;
}): number {
  // Weight factors
  const weights = {
    content: 0.4,
    meta: 0.3,
    url: 0.2,
    issues: 0.1
  };

  // Calculate issue penalty (0-100)
  const issuePenalty = Math.min(metrics.issueCount * 5, 100);

  // Calculate weighted score
  const score = (
    metrics.contentScore * weights.content +
    metrics.metaScore * weights.meta +
    metrics.urlScore * weights.url +
    (100 - issuePenalty) * weights.issues
  );

  return Math.round(score);
}
