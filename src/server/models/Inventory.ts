import { Model, DataTypes } from 'sequelize';
import sequelize from './index';
import Product from './ProductSequelize';

interface InventoryAttributes {
  id: string;
  productId: string;
  quantity: number;
  type: 'IN' | 'OUT';
  reason: 'PURCHASE' | 'SALE' | 'RETURN' | 'ADJUSTMENT' | 'DAMAGED';
  reference: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

interface InventoryCreationAttributes extends Omit<InventoryAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Inventory extends Model<InventoryAttributes, InventoryCreationAttributes> {
  declare id: string;
  declare productId: string;
  declare quantity: number;
  declare type: 'IN' | 'OUT';
  declare reason: 'PURCHASE' | 'SALE' | 'RETURN' | 'ADJUSTMENT' | 'DAMAGED';
  declare reference: string;
  declare notes: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Inventory.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Products',
        key: 'id',
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('IN', 'OUT'),
      allowNull: false,
    },
    reason: {
      type: DataTypes.ENUM('PURCHASE', 'SALE', 'RETURN', 'ADJUSTMENT', 'DAMAGED'),
      allowNull: false,
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    modelName: 'Inventory',
    hooks: {
      afterCreate: async (inventory: Inventory) => {
        // Update product stock
        const change = inventory.type === 'IN' ? inventory.quantity : -inventory.quantity;
        await Product.increment('stock', {
          by: change,
          where: { id: inventory.productId },
        });
      },
    },
  }
);

// Define associations
Product.hasMany(Inventory, {
  foreignKey: 'productId',
  as: 'inventoryMovements',
});

Inventory.belongsTo(Product, {
  foreignKey: 'productId',
});

export default Inventory;
