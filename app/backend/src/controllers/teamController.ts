import { Request, Response, NextFunction } from 'express';
import teamService from '../services/teamService';

const get = async (_req: Request, res: Response, _next: NextFunction) => {
  const result = await teamService.get();
  res.status(200).json(result);
};

const getById = async (req: Request, res: Response, _next: NextFunction) => {
  const { id } = req.params;
  const result = await teamService.getById(parseInt(id, 10));
  res.status(200).json(result);
};

const teamController = {
  get,
  getById,
};

export default teamController;
