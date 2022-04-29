export default interface MatchInterface {
  id: number,
  homeTeam: number,
  homeTeamGoals: number,
  awayTeam: number,
  awayTeamGoals: number,
  inProgress: number,
  hometeam: {
    teamName: string
  },
  awayteam: {
    teamName: string
  }
}
