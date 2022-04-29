import { Router } from 'express';
import rescue from 'express-rescue';
import matchController from './matchController';

const matchRouter = Router();
matchRouter.get('/', rescue(matchController.get));

export default matchRouter;
