import { Model, DataTypes } from 'sequelize';
import database from '../config/database.js';

const sequelize = database.getSequelize();

// SEO Metrics Model
export class SeoMetrics extends Model {}
SeoMetrics.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  overallScore: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  scoreTrend: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  contentHealthScore: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  contentHealthTrend: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  metaTagScore: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  metaTagTrend: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  urlScore: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  urlTrend: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  updatedAt: DataTypes.DATE,
  createdAt: DataTypes.DATE
}, {
  sequelize,
  modelName: 'SeoMetrics'
});

// Content Health Model
export class ContentHealth extends Model {}
ContentHealth.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  wordCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  readabilityScore: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  keywordDensity: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  issues: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  updatedAt: DataTypes.DATE,
  createdAt: DataTypes.DATE
}, {
  sequelize,
  modelName: 'ContentHealth'
});

// Meta Tags Model
export class MetaTag extends Model {}
MetaTag.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  keywords: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'OK'
  },
  issues: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  updatedAt: DataTypes.DATE,
  createdAt: DataTypes.DATE
}, {
  sequelize,
  modelName: 'MetaTag'
});

// URL Management Model
export class UrlManagement extends Model {}
UrlManagement.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  currentUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  targetUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('REDIRECT', 'CANONICAL', 'ALTERNATE'),
    allowNull: false
  },
  status: {
    type: DataTypes.INTEGER,
    defaultValue: 301
  },
  lastChecked: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: DataTypes.DATE,
  createdAt: DataTypes.DATE
}, {
  sequelize,
  modelName: 'UrlManagement'
});

// SEO Issues Model
export class SeoIssue extends Model {}
SeoIssue.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  type: {
    type: DataTypes.ENUM('ERROR', 'WARNING', 'INFO'),
    allowNull: false
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  component: {
    type: DataTypes.STRING,
    allowNull: false
  },
  updatedAt: DataTypes.DATE,
  createdAt: DataTypes.DATE
}, {
  sequelize,
  modelName: 'SeoIssue'
});

// Keyword Performance Model
export class KeywordPerformance extends Model {}
KeywordPerformance.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  keyword: {
    type: DataTypes.STRING,
    allowNull: false
  },
  position: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  trend: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  volume: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  difficulty: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  relevance: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  lastChecked: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: DataTypes.DATE,
  createdAt: DataTypes.DATE
}, {
  sequelize,
  modelName: 'KeywordPerformance'
});

// Set up associations
SeoMetrics.hasMany(ContentHealth);
ContentHealth.belongsTo(SeoMetrics);

SeoMetrics.hasMany(MetaTag);
MetaTag.belongsTo(SeoMetrics);

SeoMetrics.hasMany(UrlManagement);
UrlManagement.belongsTo(SeoMetrics);

SeoMetrics.hasMany(SeoIssue);
SeoIssue.belongsTo(SeoMetrics);

SeoMetrics.hasMany(KeywordPerformance);
KeywordPerformance.belongsTo(SeoMetrics);

// Export all models
export const models = {
  SeoMetrics,
  ContentHealth,
  MetaTag,
  UrlManagement,
  SeoIssue,
  KeywordPerformance
};
