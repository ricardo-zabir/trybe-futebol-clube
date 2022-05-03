import Team from '../database/models/Team';
import Match from '../database/models/Match';
import MatchInterface from '../interfaces/Imatch';
import auth from '../middlewares/authMiddleware';

const throwError = (status: string, message: string) => {
  const err = new Error(message);
  err.name = status;
  throw err;
};

const formatObj = (obj: MatchInterface | any) => ({
  id: obj.id,
  homeTeam: obj.homeTeam,
  homeTeamGoals: obj.homeTeamGoals,
  awayTeam: obj.awayTeam,
  awayTeamGoals: obj.awayTeamGoals,
  inProgress: obj.inProgress !== 0,
  teamHome: {
    teamName: obj.teamHome.teamName,
  },
  teamAway: {
    teamName: obj.teamAway.teamName,
  },
});

const checkIfTeamExist = async (id: number) => {
  const result = await Team.findAll({ where: { id } });
  if (result.length === 0) return false;
  return true;
};

const get = async () => {
  const rawResult = await Match.findAll({
    include:
        [{
          model: Team,
          as: 'teamHome',
          attributes: {
            exclude: ['id'],
          },
        }, {
          model: Team,
          as: 'teamAway',
          attributes: {
            exclude: ['id'],
          },
        }],
  });
  const result = rawResult.map((obj) => formatObj(obj));
  return result;
};

const getOngoing = async () => {
  const rawResult = await Match.findAll({
    include:
        [{
          model: Team,
          as: 'teamHome',
          attributes: {
            exclude: ['id'],
          },
        }, {
          model: Team,
          as: 'teamAway',
          attributes: {
            exclude: ['id'],
          },
        }],
    where: { inProgress: 1 },
  });
  const result = rawResult.map((obj) => formatObj(obj)); return result;
};

const getFinished = async () => {
  const rawResult = await Match.findAll({
    include:
        [{
          model: Team,
          as: 'teamHome',
          attributes: {
            exclude: ['id'],
          },
        }, {
          model: Team,
          as: 'teamAway',
          attributes: {
            exclude: ['id'],
          },
        }],
    where: { inProgress: 0 },
  });
  const result = rawResult.map((obj) => formatObj(obj)); return result;
};

const post = async (
  data: {
    homeTeam: number, awayTeam: number, homeTeamGoals:number, awayTeamGoals: number,
    inProgress: boolean,
  },
  token: string,
) => {
  const tokenCheck = await auth.decodeToken(token);
  const { homeTeam, awayTeam, homeTeamGoals, awayTeamGoals, inProgress } = data;
  if (tokenCheck) {
    if (homeTeam === awayTeam) {
      throwError('401', 'It is not possible to create a match with two equal teams');
    }
    if (!await checkIfTeamExist(homeTeam)) throwError('404', 'There is no team with such id!');
    if (!await checkIfTeamExist(awayTeam)) throwError('404', 'There is no team with such id!');
    const result = Match.create({ homeTeam, awayTeam, homeTeamGoals, awayTeamGoals, inProgress });
    return result;
  }
  throwError('400', 'Invalid token');
};

const changeToFinished = async (id: number) => {
  await Match.update({ inProgress: 0 }, { where: { id } });
};

const matchService = {
  get,
  getOngoing,
  getFinished,
  post,
  changeToFinished,
};

export default matchService;
