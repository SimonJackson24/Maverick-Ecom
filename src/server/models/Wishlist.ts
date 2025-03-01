import mongoose, { Schema, Document } from 'mongoose';

export interface IWishlist extends Document {
  userId: Schema.Types.ObjectId;
  items: Array<{
    productId: Schema.Types.ObjectId;
    addedAt: Date;
    notes?: string;
  }>;
  isPublic: boolean;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const WishlistSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true 
  },
  items: [{
    productId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Product', 
      required: true 
    },
    addedAt: { 
      type: Date, 
      default: Date.now 
    },
    notes: String
  }],
  isPublic: { 
    type: Boolean, 
    default: false 
  },
  name: {
    type: String,
    required: true,
    default: 'My Wishlist'
  }
}, {
  timestamps: true,
  collection: 'wishlists'
});

// Compound index for efficient querying
WishlistSchema.index({ userId: 1, isPublic: 1 });
WishlistSchema.index({ 'items.productId': 1 });

// Middleware to prevent duplicate items
WishlistSchema.pre('save', function(next) {
  const uniqueItems = new Map();
  this.items = this.items.filter(item => {
    const key = item.productId.toString();
    if (!uniqueItems.has(key)) {
      uniqueItems.set(key, true);
      return true;
    }
    return false;
  });
  next();
});

export default mongoose.model<IWishlist>('Wishlist', WishlistSchema);
