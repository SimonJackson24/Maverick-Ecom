import { Model, DataTypes, Sequelize } from 'sequelize';

interface PaymentConfigAttributes {
  id: string;
  provider: string;
  config: any;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class PaymentConfig extends Model<PaymentConfigAttributes> {
  static init(sequelize: Sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        provider: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        config: {
          type: DataTypes.JSONB,
          allowNull: false,
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        modelName: 'PaymentConfig',
        tableName: 'payment_config',
      }
    );
  }
}
