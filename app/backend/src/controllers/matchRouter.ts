import { Router } from 'express';
import rescue from 'express-rescue';
import matchController from './matchController';

const matchRouter = Router();
matchRouter.get('/', rescue(matchController.get));
matchRouter.post('/', rescue(matchController.post));
matchRouter.patch('/:id/finish', rescue(matchController.patch));
matchRouter.patch('/:id', rescue(matchController.patchScore));

export default matchRouter;
