import { Request, Response, NextFunction } from 'express';
import { v4 } from 'uuid';

const addRequestId = (req: Request, res: Response, next: NextFunction) => {
  req.requestTime = new Date().toISOString();
  req.requestId   = v4();
  let protocol = 'https';
  if (process.env.NODE_ENV === 'local') protocol = 'http';
  req.fullURL = `${protocol}://${req.get('host')}${req.originalUrl}`;
  next();
}

export default addRequestId;