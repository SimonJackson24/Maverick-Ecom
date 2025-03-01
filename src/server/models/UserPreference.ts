import { Model, DataTypes } from 'sequelize';
import sequelize from './index';
import User from './UserSequelize';

interface UserPreferenceAttributes {
  id: string;
  userId: string;
  scentPreferences: string[];
  marketingEmails: boolean;
  orderNotifications: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface UserPreferenceCreationAttributes extends Omit<UserPreferenceAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class UserPreference extends Model<UserPreferenceAttributes, UserPreferenceCreationAttributes> {
  declare id: string;
  declare userId: string;
  declare scentPreferences: string[];
  declare marketingEmails: boolean;
  declare orderNotifications: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

UserPreference.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    scentPreferences: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    marketingEmails: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    orderNotifications: {
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
    modelName: 'UserPreference',
  }
);

// Define associations
User.hasOne(UserPreference, {
  foreignKey: 'userId',
  as: 'preferences',
});

UserPreference.belongsTo(User, {
  foreignKey: 'userId',
});

export default UserPreference;
