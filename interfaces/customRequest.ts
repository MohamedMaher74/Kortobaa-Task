import { Request } from 'express';

interface CustomRequest extends Request {
  role?: string;
  userId?: number;
  user?: any;
}

export default CustomRequest;
