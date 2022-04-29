import Team from '../database/models/Team';
import Match from '../database/models/Match';
import MatchInterface from '../interfaces/Imatch';

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

const matchService = {
  get,
  getOngoing,
  getFinished,
};

export default matchService;
