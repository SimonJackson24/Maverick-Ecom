import { Model, DataTypes, Sequelize } from 'sequelize';

interface PaymentLogAttributes {
  id: string;
  orderId: string;
  provider: string;
  amount: number;
  status: string;
  transactionId: string;
  response?: any;
  createdAt?: Date;
  updatedAt?: Date;
}

export class PaymentLog extends Model<PaymentLogAttributes> {
  static init(sequelize: Sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        orderId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'orders',
            key: 'id'
          }
        },
        provider: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        amount: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        status: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        transactionId: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        response: {
          type: DataTypes.JSONB,
          allowNull: true,
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
        modelName: 'PaymentLog',
        tableName: 'payment_log',
      }
    );
  }

  static associate(models: any) {
    this.belongsTo(models.Order, {
      foreignKey: 'orderId',
      as: 'order'
    });
  }
}
