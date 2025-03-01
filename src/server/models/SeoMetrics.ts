import mongoose, { Schema, Document } from 'mongoose';

export interface ISeoMetrics extends Document {
  url: string;
  title: string;
  description: string;
  keywords: string[];
  contentScore: number;
  metaScore: number;
  urlScore: number;
  readabilityScore: number;
  issueCount: number;
  lastUpdated: Date;
  issues: {
    severity: 'error' | 'warning' | 'info';
    message: string;
    category: string;
  }[];
  keywordPerformance: {
    keyword: string;
    position: number;
    lastPosition: number;
    volume: number;
    lastUpdated: Date;
  }[];
  contentHealth: {
    wordCount: number;
    readingTime: number;
    headingStructure: {
      h1Count: number;
      h2Count: number;
      h3Count: number;
    };
    contentGaps: string[];
  };
}

const SeoMetricsSchema = new Schema({
  url: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  keywords: [{ type: String }],
  contentScore: { type: Number, default: 0 },
  metaScore: { type: Number, default: 0 },
  urlScore: { type: Number, default: 0 },
  readabilityScore: { type: Number, default: 0 },
  issueCount: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now },
  issues: [{
    severity: { type: String, enum: ['error', 'warning', 'info'] },
    message: String,
    category: String
  }],
  keywordPerformance: [{
    keyword: String,
    position: Number,
    lastPosition: Number,
    volume: Number,
    lastUpdated: Date
  }],
  contentHealth: {
    wordCount: Number,
    readingTime: Number,
    headingStructure: {
      h1Count: Number,
      h2Count: Number,
      h3Count: Number
    },
    contentGaps: [String]
  }
}, {
  timestamps: true
});

// Add indexes for common queries
SeoMetricsSchema.index({ url: 1 });
SeoMetricsSchema.index({ contentScore: -1 });
SeoMetricsSchema.index({ lastUpdated: -1 });

// Virtual for overall health score
SeoMetricsSchema.virtual('healthScore').get(function() {
  const weights = {
    content: 0.4,
    meta: 0.3,
    url: 0.2,
    readability: 0.1
  };

  return Math.round(
    this.contentScore * weights.content +
    this.metaScore * weights.meta +
    this.urlScore * weights.url +
    this.readabilityScore * weights.readability
  );
});

export default mongoose.model<ISeoMetrics>('SeoMetrics', SeoMetricsSchema);
