import { Router } from 'express';
import rescue from 'express-rescue';
import teamController from './teamController';

const teamRouter = Router();
teamRouter.get('/', rescue(teamController.get));
teamRouter.get('/:id', rescue(teamController.getById));

export default teamRouter;
