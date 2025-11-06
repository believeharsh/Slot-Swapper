import { Response } from 'express';
import mongoose from 'mongoose';
import { Event } from '../models/event.modal';
import { SwapRequest } from '../models/swapRequest.modal';
// import { User } from '../models/user.modal';
import { AuthRequest, EventStatus, SwapRequestStatus } from '../types/types';

/**
 * @route   GET /api/swappable-slots
 * @desc    Get all swappable slots from OTHER users
 * @access  Private
 */
export const getSwappableSlots = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }

    // Find all SWAPPABLE events from OTHER users
    const swappableSlots = await Event.find({
      status: EventStatus.SWAPPABLE,
      userId: { $ne: req.user.userId } // Not equal to current user
    })
      .populate('userId', 'name email') // Include owner info
      .sort({ startTime: 1 })
      .lean();

    console.log(swappableSlots); 

    res.status(200).json({
      success: true,
      data: swappableSlots,
      count: swappableSlots.length
    });
  } catch (error: any) {
    console.error('Get swappable slots error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error fetching swappable slots'
    });
  }
};

/**
 * @route   POST /api/swap-request
 * @desc    Create a swap request
 * @access  Private
 */
export const createSwapRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }

    const { mySlotId, theirSlotId } = req.body;

    // Validation
    if (!mySlotId || !theirSlotId) {
      res.status(400).json({
        success: false,
        error: 'Please provide both mySlotId and theirSlotId'
      });
      return;
    }

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(mySlotId) || !mongoose.Types.ObjectId.isValid(theirSlotId)) {
      res.status(400).json({ success: false, error: 'Invalid slot ID format' });
      return;
    }

    // 1. Verify requester owns mySlotId
    const mySlot = await Event.findOne({
      _id: mySlotId,
      userId: req.user.userId
    });

    if (!mySlot) {
      res.status(404).json({
        success: false,
        error: 'Your slot not found or you do not own it'
      });
      return;
    }

    // 2. Verify mySlot is SWAPPABLE
    if (mySlot.status !== EventStatus.SWAPPABLE) {
      res.status(400).json({
        success: false,
        error: 'Your slot must be marked as SWAPPABLE'
      });
      return;
    }

    // 3. Verify theirSlot exists and is SWAPPABLE
    const theirSlot = await Event.findById(theirSlotId);

    if (!theirSlot) {
      res.status(404).json({
        success: false,
        error: 'Target slot not found'
      });
      return;
    }

    if (theirSlot.status !== EventStatus.SWAPPABLE) {
      res.status(400).json({
        success: false,
        error: 'Target slot is not available for swapping'
      });
      return;
    }

    // 4. Prevent swapping with yourself
    if (mySlot.userId.toString() === theirSlot.userId.toString()) {
      res.status(400).json({
        success: false,
        error: 'Cannot swap with your own slot'
      });
      return;
    }

    // 5. Check for existing pending request with same slots
    const existingRequest = await SwapRequest.findOne({
      requesterSlotId: mySlotId,
      targetSlotId: theirSlotId,
      status: SwapRequestStatus.PENDING
    });

    if (existingRequest) {
      res.status(400).json({
        success: false,
        error: 'A pending swap request already exists for these slots'
      });
      return;
    }

    // Start transaction for atomic operation
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 6. Create swap request
      const swapRequest = await SwapRequest.create([{
        requesterId: req.user.userId,
        requesterSlotId: mySlotId,
        targetUserId: theirSlot.userId,
        targetSlotId: theirSlotId,
        status: SwapRequestStatus.PENDING
      }], { session });

      // 7. Update both slots to SWAP_PENDING
      await Event.updateMany(
        { _id: { $in: [mySlotId, theirSlotId] } },
        { status: EventStatus.SWAP_PENDING },
        { session }
      );

      await session.commitTransaction();

      // Populate the swap request with details
      const populatedRequest = await SwapRequest.findById(swapRequest[0]._id)
        .populate('requesterId', 'name email')
        .populate('requesterSlotId')
        .populate('targetUserId', 'name email')
        .populate('targetSlotId');

      res.status(201).json({
        success: true,
        message: 'Swap request created successfully',
        data: populatedRequest
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error: any) {
    console.error('Create swap request error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error creating swap request'
    });
  }
};

/**
 * @route   GET /api/swap-requests/incoming
 * @desc    Get incoming swap requests (where user is the target)
 * @access  Private
 */
export const getIncomingRequests = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }

    const requests = await SwapRequest.find({
      targetUserId: req.user.userId,
      status: SwapRequestStatus.PENDING
    })
      .populate('requesterId', 'name email')
      .populate('requesterSlotId')
      .populate('targetSlotId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: requests,
      count: requests.length
    });
  } catch (error: any) {
    console.error('Get incoming requests error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error fetching incoming requests'
    });
  }
};

/**
 * @route   GET /api/swap-requests/outgoing
 * @desc    Get outgoing swap requests (where user is the requester)
 * @access  Private
 */
export const getOutgoingRequests = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }

    const requests = await SwapRequest.find({
      requesterId: req.user.userId
    })
      .populate('targetUserId', 'name email')
      .populate('requesterSlotId')
      .populate('targetSlotId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: requests,
      count: requests.length
    });
  } catch (error: any) {
    console.error('Get outgoing requests error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error fetching outgoing requests'
    });
  }
};

/**
 * @route   POST /api/swap-response/:requestId
 * @desc    Accept or reject a swap request (THE CRITICAL LOGIC!)
 * @access  Private
 */
export const respondToSwapRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }

    const { requestId } = req.params;
    const { accepted } = req.body;

    // Validation
    if (accepted === undefined || typeof accepted !== 'boolean') {
      res.status(400).json({
        success: false,
        error: 'Please provide accepted field (true/false)'
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      res.status(400).json({ success: false, error: 'Invalid request ID' });
      return;
    }

    // 1. Find the swap request
    const swapRequest = await SwapRequest.findById(requestId);

    if (!swapRequest) {
      res.status(404).json({
        success: false,
        error: 'Swap request not found'
      });
      return;
    }

    // 2. Verify user is the target of this request
    if (swapRequest.targetUserId.toString() !== req.user.userId) {
      res.status(403).json({
        success: false,
        error: 'You are not authorized to respond to this request'
      });
      return;
    }

    // 3. Check if request is still pending
    if (swapRequest.status !== SwapRequestStatus.PENDING) {
      res.status(400).json({
        success: false,
        error: `This request has already been ${swapRequest.status.toLowerCase()}`
      });
      return;
    }

    // Start transaction for atomic operation
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      if (!accepted) {
        // ========== REJECTION LOGIC ==========
        
        // Update swap request to REJECTED
        swapRequest.status = SwapRequestStatus.REJECTED;
        await swapRequest.save({ session });

        // Set both slots back to SWAPPABLE
        await Event.updateMany(
          { _id: { $in: [swapRequest.requesterSlotId, swapRequest.targetSlotId] } },
          { status: EventStatus.SWAPPABLE },
          { session }
        );

        await session.commitTransaction();

        res.status(200).json({
          success: true,
          message: 'Swap request rejected',
          data: swapRequest
        });
      } else {
        // ========== ACCEPTANCE LOGIC (THE MAGIC!) ==========
        
        // Verify both slots still exist and are in correct state
        const requesterSlot = await Event.findById(swapRequest.requesterSlotId).session(session);
        const targetSlot = await Event.findById(swapRequest.targetSlotId).session(session);

        if (!requesterSlot || !targetSlot) {
          await session.abortTransaction();
          res.status(400).json({
            success: false,
            error: 'One or both slots no longer exist'
          });
          return;
        }

        if (requesterSlot.status !== EventStatus.SWAP_PENDING || 
            targetSlot.status !== EventStatus.SWAP_PENDING) {
          await session.abortTransaction();
          res.status(400).json({
            success: false,
            error: 'Slots are not in valid state for swapping'
          });
          return;
        }

        // THE CRITICAL SWAP: Exchange the owners (userId)
        const tempUserId = requesterSlot.userId;
        requesterSlot.userId = targetSlot.userId;
        targetSlot.userId = tempUserId;

        // Set both slots back to BUSY
        requesterSlot.status = EventStatus.BUSY;
        targetSlot.status = EventStatus.BUSY;

        // Save both events
        await requesterSlot.save({ session });
        await targetSlot.save({ session });

        // Update swap request to ACCEPTED
        swapRequest.status = SwapRequestStatus.ACCEPTED;
        await swapRequest.save({ session });

        await session.commitTransaction();

        res.status(200).json({
          success: true,
          message: 'Swap request accepted! Slots have been exchanged.',
          data: {
            swapRequest,
            requesterSlot,
            targetSlot
          }
        });
      }
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error: any) {
    console.error('Respond to swap request error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error responding to swap request'
    });
  }
};