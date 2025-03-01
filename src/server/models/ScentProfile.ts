import { Model, DataTypes } from 'sequelize';
import sequelize from './index';

interface ScentProfileAttributes {
  id: string;
  name: string;
  description: string;
  category: string;
  notes: string[];
  intensity: number;
  seasonal: string[];
  mood: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ScentProfileCreationAttributes extends Omit<ScentProfileAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class ScentProfile extends Model<ScentProfileAttributes, ScentProfileCreationAttributes> {
  declare id: string;
  declare name: string;
  declare description: string;
  declare category: string;
  declare notes: string[];
  declare intensity: number;
  declare seasonal: string[];
  declare mood: string[];
  declare isActive: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

ScentProfile.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    notes: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    intensity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    seasonal: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    mood: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
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
    modelName: 'ScentProfile',
    indexes: [
      {
        fields: ['name'],
        unique: true,
      },
      {
        fields: ['category'],
      },
    ],
  }
);

export default ScentProfile;
