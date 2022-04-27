import { Router } from 'express';
import rescue from 'express-rescue';
import loginController from './loginController';

const loginRouter = Router();
loginRouter.post('/', rescue(loginController.post));
loginRouter.get('/validate', rescue(loginController.get));

export default loginRouter;
