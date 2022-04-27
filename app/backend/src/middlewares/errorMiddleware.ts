import { Request, Response, NextFunction } from 'express';

export default (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  const { name, message } = err;
  const status = parseInt(name, 10) || 500;
  return res.status(status).json({ message });
};
