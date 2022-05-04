import { Request, Response, NextFunction } from 'express';
import leaderboardService from '../services/leaderboardService';

const leaderboardHome = async (_req: Request, res: Response, _next: NextFunction) => {
  const result = await leaderboardService.leaderboard('home');
  res.status(200).json(result);
};

const leaderboardAway = async (_req: Request, res: Response, _next: NextFunction) => {
  const result = await leaderboardService.leaderboard('away');
  res.status(200).json(result);
};

const leaderboardController = {
  leaderboardHome,
  leaderboardAway,
};

export default leaderboardController;
