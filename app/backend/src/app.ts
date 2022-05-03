import express from 'express';
import loginRouter from './controllers/loginRouter';
import teamRouter from './controllers/teamRouter';
import errorMiddleware from './middlewares/errorMiddleware';
import matchRouter from './controllers/matchRouter';
import leaderboardRouter from './controllers/leaderboardRouter';

class App {
  public app: express.Express;
  // ...

  constructor() {
    this.app = express();
    this.config();
    // ...
  }

  private config():void {
    const accessControl: express.RequestHandler = (_req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT,PATCH');
      res.header('Access-Control-Allow-Headers', '*');
      next();
    };

    this.app.use(accessControl);
    this.app.use(express.json());
    this.app.use('/login', loginRouter);
    this.app.use('/teams', teamRouter);
    this.app.use('/matches', matchRouter);
    this.app.use('/leaderboard', leaderboardRouter);
    this.app.use(errorMiddleware);
    // ...
  }

  // ...
  public start(PORT: string | number):void {
    this.app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
  }
}

export { App };

// A execução dos testes de cobertura depende dessa exportação
export const { app } = new App();
