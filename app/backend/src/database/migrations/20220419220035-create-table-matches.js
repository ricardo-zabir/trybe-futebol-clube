module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('matches', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      }, 
      home_team: {
        type: Sequelize.INTEGER,
        foreignKey: true,
        references: {
          model: 'teams',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      home_team_goals: Sequelize.INTEGER,
      away_team: {
        type: Sequelize.INTEGER,
        foreignKey: true,
        references: {
          model: 'teams',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      away_team_goals: Sequelize.INTEGER,
      in_progress: Sequelize.INTEGER
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('matches');
  },
};
