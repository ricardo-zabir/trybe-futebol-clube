import { Request, Response, NextFunction } from 'express';
import leaderboardService from '../services/leaderboardService';

const leaderboardHome = async (_req: Request, res: Response, _next: NextFunction) => {
  const result = await leaderboardService.leaderboardHome();
  res.status(200).json(result);
};

const leaderboardController = {
  leaderboardHome,
};

export default leaderboardController;
