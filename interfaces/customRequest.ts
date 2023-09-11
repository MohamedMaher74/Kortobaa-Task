import { Request } from 'express';

interface CustomRequest extends Request {
  role?: string;
  userId?: string;
  user?: any;
}

export default CustomRequest;
