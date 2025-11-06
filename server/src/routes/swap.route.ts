import { Router } from 'express';
import {
  getSwappableSlots,
  createSwapRequest,
  getIncomingRequests,
  getOutgoingRequests,
  respondToSwapRequest
} from '../controllers/swap.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// All routes are protected
router.use(protect);

/**
 * @route   GET /api/swappable-slots
 * @desc    Get all swappable slots from other users
 * @access  Private
 */
router.get('/swappable-slots', getSwappableSlots);

/**
 * @route   POST /api/swap-request
 * @desc    Create a swap request
 * @access  Private
 */
router.post('/swap-request', createSwapRequest);

/**
 * @route   GET /api/swap-requests/incoming
 * @desc    Get incoming swap requests
 * @access  Private
 */
router.get('/swap-requests/incoming', getIncomingRequests);

/**
 * @route   GET /api/swap-requests/outgoing
 * @desc    Get outgoing swap requests
 * @access  Private
 */
router.get('/swap-requests/outgoing', getOutgoingRequests);

/**
 * @route   POST /api/swap-response/:requestId
 * @desc    Accept or reject a swap request
 * @access  Private
 */
router.post('/swap-response/:requestId', respondToSwapRequest);

export default router;