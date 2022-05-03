import Match from '../database/models/Match';
import Team from '../database/models/Team';

const getProperObj = (teamName: string, arrOfMatches: Match[]) => ({
  name: teamName,
  totalPoints: (arrOfMatches.filter((match) => match.homeTeamGoals > match.awayTeamGoals)
    .length * 3) + (
    arrOfMatches.filter((match) => match.homeTeamGoals === match.awayTeamGoals).length),
  totalGames: arrOfMatches.length,
  totalVictories: arrOfMatches.filter((match) => match.homeTeamGoals > match.awayTeamGoals).length,
  totalDraws: arrOfMatches.filter((match) => match.homeTeamGoals === match.awayTeamGoals).length,
  totalLosses: arrOfMatches.filter((match) => match.awayTeamGoals > match.homeTeamGoals).length,
  goalsFavor: arrOfMatches.map((match) => match.homeTeamGoals).reduce((acc, curr) => acc + curr, 0),
  goalsOwn: arrOfMatches.map((match) => match.awayTeamGoals).reduce((acc, curr) => acc + curr, 0),
  goalsBalance: (arrOfMatches.map((match) => match.homeTeamGoals)
    .reduce((acc, curr) => acc + curr, 0)) - (arrOfMatches.map((
    match,
  ) => match.awayTeamGoals).reduce((acc, curr) => acc + curr, 0)
  ),
  efficiency: parseFloat(((((arrOfMatches.filter((mt) => mt.homeTeamGoals > mt.awayTeamGoals)
    .length * 3) + (arrOfMatches.filter((match) => match.homeTeamGoals === match.awayTeamGoals)
    .length)) / (arrOfMatches.length * 3)) * 100).toFixed(2)),
});

const leaderboardHome = async () => {
  const teamsData = await Team.findAll();
  const teamIds = teamsData.map((tm) => tm.id);
  const homeGamesPromise = teamIds.map((id) => Match.findAll({
    where: { homeTeam: id, inProgress: 0 },
  }));
  const homeGames = await Promise.all(homeGamesPromise);
  const finalObjArr = homeGames.map((arrOfMatches, idx) =>
    getProperObj(teamsData[idx].teamName, arrOfMatches));
  const orderedArr = finalObjArr.sort((finalObj1, finalObj2) => {
    if (finalObj1.totalPoints > finalObj2.totalPoints) return -1;
    if (finalObj2.totalPoints > finalObj1.totalPoints) return 1;
    if (finalObj1.goalsBalance > finalObj2.goalsBalance) return -1;
    if (finalObj2.goalsBalance > finalObj1.goalsBalance) return 1;
    if (finalObj1.goalsFavor > finalObj2.goalsFavor) return -1;
    return 1;
  });
  return orderedArr;
};

const leaderboardService = {
  leaderboardHome,
};

export default leaderboardService;
