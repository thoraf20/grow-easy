import { Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import { verifyToken } from '../utils';

export const authMiddleware = (req, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Unauthorized' });
  }
  try {
    const decoded = verifyToken(token);
    req.user = { id: decoded }; // Assuming the token contains id and email
    next();
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Invalid token' });
  }
}