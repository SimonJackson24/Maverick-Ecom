import { Model, DataTypes } from 'sequelize';
import sequelize from './index';
import User from './UserSequelize';

interface AddressAttributes {
  id: string;
  userId: string;
  type: 'shipping' | 'billing';
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface AddressCreationAttributes extends Omit<AddressAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Address extends Model<AddressAttributes, AddressCreationAttributes> {
  declare id: string;
  declare userId: string;
  declare type: 'shipping' | 'billing';
  declare line1: string;
  declare line2: string | null;
  declare city: string;
  declare state: string;
  declare postalCode: string;
  declare country: string;
  declare isDefault: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Address.init(
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
    type: {
      type: DataTypes.ENUM('shipping', 'billing'),
      allowNull: false,
    },
    line1: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    line2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    modelName: 'Address',
    hooks: {
      beforeCreate: async (address: Address) => {
        if (address.isDefault) {
          // Set all other addresses of the same type for this user to non-default
          await Address.update(
            { isDefault: false },
            {
              where: {
                userId: address.userId,
                type: address.type,
                isDefault: true,
              },
            }
          );
        }
      },
      beforeUpdate: async (address: Address) => {
        if (address.changed('isDefault') && address.isDefault) {
          // Set all other addresses of the same type for this user to non-default
          await Address.update(
            { isDefault: false },
            {
              where: {
                userId: address.userId,
                type: address.type,
                isDefault: true,
                id: { [DataTypes.Op.ne]: address.id },
              },
            }
          );
        }
      },
    },
  }
);

// Define associations
User.hasMany(Address, {
  foreignKey: 'userId',
  as: 'addresses',
});

Address.belongsTo(User, {
  foreignKey: 'userId',
});

export default Address;
