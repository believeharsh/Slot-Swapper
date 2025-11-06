import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/types';
import { verifyToken } from '../utils/jwt';

/**
 * Middleware to protect routes - requires valid JWT token
 */
export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'Not authorized. No token provided.'
      });
      return;
    }

    // Extract token
    const token = authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Not authorized. Invalid token format.'
      });
      return;
    }

    // Verify token
    try {
      const decoded = verifyToken(token);
      
      // Attach user info to request
      req.user = {
        userId: decoded.userId,
        email: decoded.email
      };

      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        error: 'Not authorized. Token is invalid or expired.'
      });
      return;
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error during authentication'
    });
    return;
  }
};