import { Model, DataTypes } from 'sequelize';
import db from '.';
import Team from './Team';

class Match extends Model {
  // public <campo>!: <tipo>;
  public id: number;

  public homeTeam: number;

  public homeTeamGoals: number;

  public awayTeam: number;

  public awayTeamGoals: number;

  public inProgress: number;
}

Match.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  homeTeamGoals: DataTypes.INTEGER,
  awayTeamGoals: DataTypes.INTEGER,
  inProgress: DataTypes.INTEGER,
}, {
  // ... Outras configs
  underscored: true,
  sequelize: db,
  modelName: 'matches',
  timestamps: false,
});

/**
  * `Workaround` para aplicar as associations em TS:
  * Associations 1:N devem ficar em uma das instâncias de modelo
  * */

// OtherModel.belongsTo(Example, { foreignKey: 'campoA', as: 'campoEstrangeiroA' });
// OtherModel.belongsTo(Example, { foreignKey: 'campoB', as: 'campoEstrangeiroB' });
Match.belongsTo(Team, {
  foreignKey: 'homeTeam',
  as: 'teamHome',
});
Match.belongsTo(Team, {
  foreignKey: 'awayTeam',
  as: 'teamAway',
});
// Example.hasMany(OtherModel, { foreignKey: 'campoC', as: 'campoEstrangeiroC' });
// Example.hasMany(OtherModel, { foreignKey: 'campoD', as: 'campoEstrangeiroD' });

export default Match;
