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

// const getFiltered = async (req: Request, res: Response, _next: NextFunction) => {
//     const { inProgress } = req.query;
//     if(inProgress) {
//         const result = await matchService.getOngoing();
//         res.status(200).json(result)
//     }
//     const result = await matchService.getFinished();
//     res.status(200).json(result);
// }

const matchController = {
  get,
};

export default matchController;
