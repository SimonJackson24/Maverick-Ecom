import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  scent: {
    profile: string;
    notes: string[];
    intensity: number;
    seasonal: string[];
  };
  stock: number;
  sku: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  metadata: {
    [key: string]: any;
  };
}

const ProductSchema = new Schema({
  name: { type: String, required: true, index: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  images: [{ type: String }],
  category: { type: String, required: true, index: true },
  scent: {
    profile: { type: String, required: true },
    notes: [{ type: String }],
    intensity: { type: Number, min: 1, max: 5 },
    seasonal: [{ type: String }]
  },
  stock: { type: Number, required: true, default: 0 },
  sku: { type: String, required: true, unique: true },
  isActive: { type: Boolean, default: true },
  metadata: { type: Map, of: Schema.Types.Mixed }
}, {
  timestamps: true,
  collection: 'products'
});

// Add text search indexes
ProductSchema.index({ name: 'text', description: 'text', 'scent.profile': 'text' });

export default mongoose.model<IProduct>('Product', ProductSchema);
