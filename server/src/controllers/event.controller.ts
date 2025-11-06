import { Response } from 'express';
import { Event } from '../models/event.modal';
import { AuthRequest, EventStatus } from '../types/types';
import mongoose from 'mongoose';

/**
 * @route   GET /api/events
 * @desc    Get all events for logged-in user
 * @access  Private
 */
export const getMyEvents = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }

    const events = await Event.find({ userId: req.user.userId })
      .sort({ startTime: 1 }) // Sort by start time ascending
      .lean();

    res.status(200).json({
      success: true,
      data: events,
      count: events.length
    });
  } catch (error: any) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error fetching events'
    });
  }
};

/**
 * @route   GET /api/events/:id
 * @desc    Get single event by ID
 * @access  Private
 */
export const getEventById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }

    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, error: 'Invalid event ID' });
      return;
    }

    const event = await Event.findOne({
      _id: id,
      userId: req.user.userId // Ensure user owns this event
    });

    if (!event) {
      res.status(404).json({
        success: false,
        error: 'Event not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error: any) {
    console.error('Get event error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error fetching event'
    });
  }
};

/**
 * @route   POST /api/events
 * @desc    Create new event
 * @access  Private
 */
export const createEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }

    const { title, startTime, endTime } = req.body;

    // Validation
    if (!title || !startTime || !endTime) {
      res.status(400).json({
        success: false,
        error: 'Please provide title, startTime, and endTime'
      });
      return;
    }

    // Validate dates
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      res.status(400).json({
        success: false,
        error: 'Invalid date format'
      });
      return;
    }

    if (end <= start) {
      res.status(400).json({
        success: false,
        error: 'End time must be after start time'
      });
      return;
    }

    // Create event
    const event = await Event.create({
      title,
      startTime: start,
      endTime: end,
      status: EventStatus.BUSY,
      userId: req.user.userId
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event
    });
  } catch (error: any) {
    console.error('Create event error:', error);
    
    // Handle overlap error
    if (error.message?.includes('overlaps')) {
      res.status(400).json({
        success: false,
        error: error.message
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: error.message || 'Error creating event'
    });
  }
};

/**
 * @route   PUT /api/events/:id
 * @desc    Update event
 * @access  Private
 */
export const updateEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }

    const { id } = req.params;
    const { title, startTime, endTime, status } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, error: 'Invalid event ID' });
      return;
    }

    // Find event and check ownership
    const event = await Event.findOne({
      _id: id,
      userId: req.user.userId
    });

    if (!event) {
      res.status(404).json({
        success: false,
        error: 'Event not found'
      });
      return;
    }

    // Prevent updating event if it's in SWAP_PENDING status
    if (event.status === EventStatus.SWAP_PENDING) {
      res.status(400).json({
        success: false,
        error: 'Cannot update event while swap is pending'
      });
      return;
    }

    // Update fields if provided
    if (title !== undefined) event.title = title;
    if (startTime !== undefined) event.startTime = new Date(startTime);
    if (endTime !== undefined) event.endTime = new Date(endTime);
    if (status !== undefined) {
      // Validate status
      if (!Object.values(EventStatus).includes(status)) {
        res.status(400).json({
          success: false,
          error: 'Invalid status value'
        });
        return;
      }
      event.status = status;
    }

    await event.save();

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: event
    });
  } catch (error: any) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error updating event'
    });
  }
};

/**
 * @route   DELETE /api/events/:id
 * @desc    Delete event
 * @access  Private
 */
export const deleteEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }

    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, error: 'Invalid event ID' });
      return;
    }

    // Find event and check ownership
    const event = await Event.findOne({
      _id: id,
      userId: req.user.userId
    });

    if (!event) {
      res.status(404).json({
        success: false,
        error: 'Event not found'
      });
      return;
    }

    // Prevent deleting event if it's in SWAP_PENDING status
    if (event.status === EventStatus.SWAP_PENDING) {
      res.status(400).json({
        success: false,
        error: 'Cannot delete event while swap is pending'
      });
      return;
    }

    await event.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error deleting event'
    });
  }
};