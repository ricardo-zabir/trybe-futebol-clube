import Match from '../database/models/Match';
import Team from '../database/models/Team';
import ILeaderboard from '../interfaces/ILeaderboard';

const getEfficiency = (
  arrOfMatches: Match [],
  type: 'home' | 'away',
  othType: 'home' | 'away',
) => parseFloat(
  (((
    (arrOfMatches.filter((mt) => mt[`${type}TeamGoals`] > mt[`${othType}TeamGoals`])
      .length * 3)
  + (arrOfMatches.filter((match) => match[`${type}TeamGoals`] === match[`${othType}TeamGoals`])
    .length)) / (arrOfMatches.length * 3)) * 100).toFixed(2),
);

const joinLeaderboard = (
  homeLeaderboard: ILeaderboard | any,
  awayLeaderboard: ILeaderboard | any,
) => {
  const object = {
    name: homeLeaderboard.name,
    totalPoints: homeLeaderboard.totalPoints + awayLeaderboard.totalPoints,
    totalGames: homeLeaderboard.totalGames + awayLeaderboard.totalGames,
    totalVictories: homeLeaderboard.totalVictories + awayLeaderboard.totalVictories,
    totalDraws: homeLeaderboard.totalDraws + awayLeaderboard.totalDraws,
    totalLosses: homeLeaderboard.totalLosses + awayLeaderboard.totalLosses,
    goalsFavor: homeLeaderboard.goalsFavor + awayLeaderboard.goalsFavor,
    goalsOwn: homeLeaderboard.goalsOwn + awayLeaderboard.goalsOwn,
    goalsBalance: homeLeaderboard.goalsBalance + awayLeaderboard.goalsBalance,
  };
  const efficiency = parseFloat(((object.totalPoints / (object.totalGames * 3)) * 100).toFixed(2));
  return { ...object, efficiency };
};

const getPoints = (
  arrOfMatches: Match [],
  type: 'home' | 'away',
  othType: 'home' | 'away',
) => (arrOfMatches.filter((match) => match[`${type}TeamGoals`] > match[`${othType}TeamGoals`])
  .length * 3) + (
  arrOfMatches.filter(
    (match) => match[`${type}TeamGoals`] === match[`${othType}TeamGoals`],
  ).length);

const getGoalBalance = (
  arrOfMatches: Match [],
  type: 'home' | 'away',
  othType: 'home' | 'away',
) => (arrOfMatches.map((match) => match[`${type}TeamGoals`])
  .reduce((acc, curr) => acc + curr, 0)) - (arrOfMatches.map((
  match,
) => match[`${othType}TeamGoals`]).reduce((acc, curr) => acc + curr, 0)
);

const getVictories = (
  arrOfMatches: Match [],
  type: 'home' | 'away',
  othType: 'home' | 'away',
) => (arrOfMatches.filter(
  (match) => match[`${type}TeamGoals`] > match[`${othType}TeamGoals`],
).length);

const getDraws = (
  arrOfMatches: Match [],
  type: 'home' | 'away',
  othType: 'home' | 'away',
) => (arrOfMatches.filter(
  (match) => match[`${type}TeamGoals`] === match[`${othType}TeamGoals`],
).length);

const getLosses = (
  arrOfMatches: Match [],
  type: 'home' | 'away',
  othType: 'home' | 'away',
) => (arrOfMatches.filter(
  (match) => match[`${othType}TeamGoals`] > match[`${type}TeamGoals`],
).length);

const getGoalsFavor = (
  arrOfMatches: Match [],
  type: 'home' | 'away',
) => (arrOfMatches.map(
  (match) => match[`${type}TeamGoals`],
).reduce((acc, curr) => acc + curr, 0));

const getGoalsOwn = (
  arrOfMatches: Match [],
  othType: 'home' | 'away',
) => (arrOfMatches.map(
  (match) => match[`${othType}TeamGoals`],
).reduce((acc, curr) => acc + curr, 0));

const getProperObj = (
  type: 'home' | 'away',
  othType: 'home' | 'away',
  teamName: string,
  arrOfMatches: Match[],
) => ({
  name: teamName,
  totalPoints: getPoints(arrOfMatches, type, othType),
  totalGames: arrOfMatches.length,
  totalVictories: getVictories(arrOfMatches, type, othType),
  totalDraws: getDraws(arrOfMatches, type, othType),
  totalLosses: getLosses(arrOfMatches, type, othType),
  goalsFavor: getGoalsFavor(arrOfMatches, type),
  goalsOwn: getGoalsOwn(arrOfMatches, othType),
  goalsBalance: getGoalBalance(arrOfMatches, type, othType),
  efficiency: getEfficiency(arrOfMatches, type, othType),
});

const sortLeaderboard = (arr: ILeaderboard[]) => {
  const orderedArr = arr.sort((finalObj1, finalObj2) => {
    if (finalObj1.totalPoints > finalObj2.totalPoints) return -1;
    if (finalObj2.totalPoints > finalObj1.totalPoints) return 1;
    if (finalObj1.goalsBalance > finalObj2.goalsBalance) return -1;
    if (finalObj2.goalsBalance > finalObj1.goalsBalance) return 1;
    if (finalObj1.goalsFavor > finalObj2.goalsFavor) return -1;
    return 1;
  });
  return orderedArr;
};

const leaderboard = async (type: 'home' | 'away') => {
  const teamsData = await Team.findAll();
  const teamIds = teamsData.map((tm) => tm.id);
  const gamesPromise = teamIds.map((id) => Match.findAll({
    where: { [`${type}Team`]: id, inProgress: 0 },
  }));
  const games = await Promise.all(gamesPromise);
  const finalObjArr = games.map((arrOfMatches, idx) =>
    getProperObj(type, type === 'home' ? 'away' : 'home', teamsData[idx].teamName, arrOfMatches));
  const orderedArr = sortLeaderboard(finalObjArr);
  return orderedArr;
};

const generalLeaderboard = async () => {
  const teamsData = await Team.findAll();
  const teamNames = teamsData.map((team) => team.teamName);
  const homeLeaderboard = await leaderboard('home');
  const awayLeaderboard = await leaderboard('away');
  const teamsLeaderbords = teamNames.map((name) => ([
    homeLeaderboard.find((team) => team.name === name),
    awayLeaderboard.find((team) => team.name === name)]));
  const finalObjArr = teamsLeaderbords.map(
    (arrOfLead) => joinLeaderboard(arrOfLead[0], arrOfLead[1]),
  );
  const orderedArr = sortLeaderboard(finalObjArr);
  return orderedArr;
};

const leaderboardService = {
  leaderboard,
  generalLeaderboard,
};

export default leaderboardService;
