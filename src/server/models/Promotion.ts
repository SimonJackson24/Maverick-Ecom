import { Model, DataTypes } from 'sequelize';
import sequelize from './index';
import Product from './ProductSequelize';

interface PromotionAttributes {
  id: string;
  code: string;
  type: 'percentage' | 'fixed' | 'bogo';
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  startDate: Date;
  endDate: Date;
  usageLimit?: number;
  usageCount: number;
  applicableProducts: string[];
  excludedProducts: string[];
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface PromotionCreationAttributes extends Omit<PromotionAttributes, 'id' | 'usageCount' | 'createdAt' | 'updatedAt'> {}

class Promotion extends Model<PromotionAttributes, PromotionCreationAttributes> {
  declare id: string;
  declare code: string;
  declare type: 'percentage' | 'fixed' | 'bogo';
  declare value: number;
  declare minPurchase: number | null;
  declare maxDiscount: number | null;
  declare startDate: Date;
  declare endDate: Date;
  declare usageLimit: number | null;
  declare usageCount: number;
  declare applicableProducts: string[];
  declare excludedProducts: string[];
  declare description: string;
  declare isActive: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Promotion.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    type: {
      type: DataTypes.ENUM('percentage', 'fixed', 'bogo'),
      allowNull: false,
    },
    value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    minPurchase: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    maxDiscount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    usageLimit: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    usageCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    applicableProducts: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      defaultValue: [],
    },
    excludedProducts: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      defaultValue: [],
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Promotion',
    indexes: [
      {
        fields: ['code'],
        unique: true,
      },
      {
        fields: ['startDate', 'endDate'],
      },
      {
        fields: ['isActive'],
      },
    ],
  }
);

export default Promotion;
