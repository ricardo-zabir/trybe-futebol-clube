import bcryptjs from 'bcryptjs';
import auth from '../middlewares/authMiddleware';
import User from '../database/models/User';

const throwError = (status: string, message: string) => {
  const err = new Error(message);
  err.name = status;
  throw err;
};

const checkFieldNotEmpty = (param: string) => {
  if (!param) {
    throwError('400', 'All fields must be filled');
  }
};

const post = async (email: string, password: string) => {
  checkFieldNotEmpty(email); checkFieldNotEmpty(password);
  const result = await User.findOne({ where: { email } });
  if (!result) throwError('401 ', 'Incorrect email or password');
  const valid = await bcryptjs.compare(password || '', result?.password || '');
  if (!valid) throwError('401 ', 'Incorrect email or password');
  const token = await auth.generateToken({
    id: result?.id,
    username: result?.username,
    role: result?.role,
    email: result?.email,
    password: result?.password });
  return {
    user: {
      id: result?.id, username: result?.username, role: result?.role, email: result?.email },
    token };
};

const get = async (token: string | undefined) => {
  const user = await auth.decodeToken(token || '');
  return user.role;
};

const loginService = {
  post,
  get,
};
export default loginService;
