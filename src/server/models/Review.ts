import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  userId: Schema.Types.ObjectId;
  productId: Schema.Types.ObjectId;
  orderId: Schema.Types.ObjectId;
  rating: number;
  title: string;
  content: string;
  scent: {
    rating: number;
    comment?: string;
  };
  burn: {
    rating: number;
    comment?: string;
  };
  verified: boolean;
  helpful: number;
  reported: boolean;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  rating: { 
    type: Number, 
    required: true,
    min: 1,
    max: 5,
    validate: {
      validator: Number.isInteger,
      message: 'Rating must be a whole number between 1 and 5'
    }
  },
  title: { type: String, required: true, maxlength: 100 },
  content: { type: String, required: true, maxlength: 2000 },
  scent: {
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: String
  },
  burn: {
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: String
  },
  verified: { type: Boolean, default: false },
  helpful: { type: Number, default: 0 },
  reported: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true,
  collection: 'reviews'
});

// Indexes for common queries
ReviewSchema.index({ productId: 1, status: 1 });
ReviewSchema.index({ userId: 1, createdAt: -1 });
ReviewSchema.index({ rating: -1, helpful: -1 });

// Virtual for average rating
ReviewSchema.virtual('overallRating').get(function() {
  return (this.rating + this.scent.rating + this.burn.rating) / 3;
});

export default mongoose.model<IReview>('Review', ReviewSchema);
