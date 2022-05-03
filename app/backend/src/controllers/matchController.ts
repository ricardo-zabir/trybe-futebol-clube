import { Request, Response, NextFunction } from 'express';
import matchService from '../services/matchService';

const get = async (req: Request, res: Response, _next: NextFunction) => {
  const { inProgress } = req.query;
  if (inProgress === undefined) {
    const result = await matchService.get();
    res.status(200).json(result);
    return;
  }
  if (inProgress === 'false') {
    const result = await matchService.getFinished();
    res.status(200).json(result);
    return;
  }
  const result = await matchService.getOngoing();
  res.status(200).json(result);
};

const post = async (req: Request, res: Response, _next: NextFunction) => {
  const { authorization } = req.headers;
  const { homeTeam, awayTeam, homeTeamGoals, awayTeamGoals, inProgress } = req.body;
  const result = await matchService.post(
    { homeTeam, awayTeam, homeTeamGoals, awayTeamGoals, inProgress },
    authorization || '',
  );
  res.status(201).json(result);
};

const patch = async (req: Request, res: Response, _next: NextFunction) => {
  const { id } = req.params;
  await matchService.changeToFinished(parseInt(id, 10));
  res.status(200).json({ message: 'Updated' });
};

const patchScore = async (req: Request, res: Response, _next: NextFunction) => {
  const { id } = req.params;
  const { homeTeamGoals, awayTeamGoals } = req.body;
  await matchService.changeScore(parseInt(id, 10), homeTeamGoals, awayTeamGoals);
  res.status(200).json({ message: 'Updated' });
};

const matchController = {
  get,
  post,
  patch,
  patchScore,
};

export default matchController;
