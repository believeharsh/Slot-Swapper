import { Router } from 'express';
import {
  getMyEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
} from '../controllers/event.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// All routes are protected
router.use(protect);

/**
 * @route   GET /api/events
 * @desc    Get all events for current user
 * @access  Private
 */
router.get('/', getMyEvents);

/**
 * @route   POST /api/events
 * @desc    Create new event
 * @access  Private
 */
router.post('/', createEvent);

/**
 * @route   GET /api/events/:id
 * @desc    Get single event
 * @access  Private
 */
router.get('/:id', getEventById);

/**
 * @route   PUT /api/events/:id
 * @desc    Update event
 * @access  Private
 */
router.put('/:id', updateEvent);

/**
 * @route   DELETE /api/events/:id
 * @desc    Delete event
 * @access  Private
 */
router.delete('/:id', deleteEvent);

export default router;