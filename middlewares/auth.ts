import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/ApiError';
import CustomRequest from '../interfaces/customRequest';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token;
    if (req.headers.authorization) {
      token = req.headers.authorization.replace('Bearer ', '');
    }
    if (!token) {
      return next(new ApiError('No Token Provided', 401));
    }
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    // Add userId to the request object
    (req as CustomRequest).userId = decoded.id;

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
        id: true,
        role: true,
      },
    });
    if (!user) {
      return next(new ApiError('Unauthorized', 401));
    }

    // Set the user's role on the Request object
    (req as CustomRequest).role = user.role;

    next();
  } catch (error) {
    next(new ApiError('Invalid Token', 401));
  }
};
