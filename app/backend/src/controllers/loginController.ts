import { Request, Response, NextFunction } from 'express';
import loginService from '../services/loginService';

const post = async (req: Request, res: Response, _next: NextFunction) => {
  const { email, password } = req.body;
  const result = await loginService.post(email, password);
  res.status(200).json(result);
};

const get = async (req: Request, res: Response, _next: NextFunction) => {
  const { authorization } = req.headers;
  const result = await loginService.get(authorization);
  res.status(200).json(result);
};
const loginController = {
  post,
  get,
};
export default loginController;
