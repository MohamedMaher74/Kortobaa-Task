import { NextFunction } from 'express';
import ApiError from '../utils/ApiError';
import CustomRequest from '../interfaces/customRequest';

export const allowedTo = (...roles: string[]) => {
  return (req: CustomRequest, res: any, next: NextFunction) => {
    if (!roles.includes(req.role!)) {
      return next(
        new ApiError('You are not allowed to access this route', 403),
      );
    }
    next();
  };
};
