import { Model, DataTypes, Sequelize } from 'sequelize';

interface SuspiciousActivityAttributes {
  id: string;
  paymentLogId?: string;
  patterns: any;
  timestamp: Date;
  status: string;
  resolution: string;
  resolvedBy: string;
  resolvedAt: Date;
  notificationSent: boolean;
  notificationTimestamp: Date;
}

export class SuspiciousActivity extends Model<SuspiciousActivityAttributes> {
  static init(sequelize: Sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        paymentLogId: {
          type: DataTypes.STRING,
          allowNull: true,
          references: {
            model: 'PaymentLog',
            key: 'id'
          }
        },
        patterns: {
          type: DataTypes.JSONB,
          allowNull: false,
        },
        timestamp: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        status: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
        resolution: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        resolvedBy: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        resolvedAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        notificationSent: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        notificationTimestamp: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: 'SuspiciousActivity',
        tableName: 'suspicious_activities',
      }
    );
  }

  static associate(models: any) {
    this.belongsTo(models.PaymentLog, {
      foreignKey: 'paymentLogId',
      as: 'paymentLog'
    });
  }
}
