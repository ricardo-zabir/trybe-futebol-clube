import { Router } from 'express';
import rescue from 'express-rescue';
import leaderboardController from './leaderboardController';

const leaderboardRouter = Router();
leaderboardRouter.get('/home', rescue(leaderboardController.leaderboardHome));
leaderboardRouter.get('/away', rescue(leaderboardController.leaderboardAway));

export default leaderboardRouter;
