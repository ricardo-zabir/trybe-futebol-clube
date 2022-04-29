import Team from '../database/models/Team';

const get = async () => {
  const result = await Team.findAll();
  return result;
};

const getById = async (id: number) => {
  const result = await Team.findOne({ where: { id } });
  return result;
};

const teamService = {
  get,
  getById,
};

export default teamService;
