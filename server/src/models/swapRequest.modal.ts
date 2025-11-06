import mongoose, { Schema } from 'mongoose';
import { ISwapRequest, SwapRequestStatus } from '../types/types';

const swapRequestSchema = new Schema<ISwapRequest>(
  {
    requesterId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Requester ID is required'],
      index: true
    },
    requesterSlotId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Requester slot ID is required']
    },
    targetUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Target user ID is required'],
      index: true
    },
    targetSlotId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Target slot ID is required']
    },
    status: {
      type: String,
      enum: Object.values(SwapRequestStatus),
      default: SwapRequestStatus.PENDING,
      required: true
    }
  },
  {
    timestamps: true,
    // toJSON: {
    //   transform: function(doc, ret) {
    //     delete ret.__v;
    //     return ret;
    //   }
    // }
  }
);

// Indexes for better query performance
swapRequestSchema.index({ requesterId: 1, status: 1 });
swapRequestSchema.index({ targetUserId: 1, status: 1 });
swapRequestSchema.index({ status: 1, createdAt: -1 });

// Prevent duplicate pending requests for same slot combination
swapRequestSchema.index(
  { 
    requesterSlotId: 1, 
    targetSlotId: 1, 
    status: 1 
  },
  { 
    unique: true,
    partialFilterExpression: { status: SwapRequestStatus.PENDING }
  }
);

// Validation: Prevent user from swapping with themselves
swapRequestSchema.pre('save', async function(next) {
  if (this.requesterId.equals(this.targetUserId)) {
    const error = new Error('Cannot create swap request with yourself');
    return next(error);
  }
  next();
});

// Validation: Prevent same slot being used for requester and target
swapRequestSchema.pre('save', async function(next) {
  if (this.requesterSlotId.equals(this.targetSlotId)) {
    const error = new Error('Cannot swap a slot with itself');
    return next(error);
  }
  next();
});

export const SwapRequest = mongoose.model<ISwapRequest>('SwapRequest', swapRequestSchema);