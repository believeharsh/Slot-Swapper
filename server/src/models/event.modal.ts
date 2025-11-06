import mongoose, { Schema } from 'mongoose';
import { IEvent, EventStatus } from '../types/types';

const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    startTime: {
      type: Date,
      required: [true, 'Start time is required']
    },
    endTime: {
      type: Date,
      required: [true, 'End time is required'],
      validate: {
        validator: function(this: IEvent, value: Date) {
          return value > this.startTime;
        },
        message: 'End time must be after start time'
      }
    },
    status: {
      type: String,
      enum: Object.values(EventStatus),
      default: EventStatus.BUSY,
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true
    }
  },
  {
    timestamps: true,
    // toJSON: {
    //   transform: function(_doc, ret) {
    //     delete ret.__v;
    //     return ret;
    //   }
    // }
  }
);

// Indexes for better query performance
eventSchema.index({ userId: 1, startTime: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ startTime: 1, endTime: 1 });

// Validation to prevent overlapping events for same user
eventSchema.pre('save', async function(next) {
  // Only check for new events or if times are modified
  if (!this.isNew && !this.isModified('startTime') && !this.isModified('endTime')) {
    return next();
  }

  try {
    const overlappingEvent = await Event.findOne({
      userId: this.userId,
      _id: { $ne: this._id }, // Exclude current event
      $or: [
        // New event starts during existing event
        {
          startTime: { $lte: this.startTime },
          endTime: { $gt: this.startTime }
        },
        // New event ends during existing event
        {
          startTime: { $lt: this.endTime },
          endTime: { $gte: this.endTime }
        },
        // New event completely contains existing event
        {
          startTime: { $gte: this.startTime },
          endTime: { $lte: this.endTime }
        }
      ]
    });

    if (overlappingEvent) {
      const error = new Error('This time slot overlaps with an existing event');
      return next(error);
    }

    next();
  } catch (error: any) {
    next(error);
  }
});

export const Event = mongoose.model<IEvent>('Event', eventSchema);