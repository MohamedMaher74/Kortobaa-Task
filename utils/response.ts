import { Response } from 'express';
import { ResponseType } from '../responseTypes/responseType';

export default (res: Response, statusCode: number, data: ResponseType) => {
  res.status(statusCode).json(data);
};
