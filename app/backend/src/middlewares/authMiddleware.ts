import * as jwt from 'jsonwebtoken';
import * as fs from 'fs/promises';
import User from '../database/models/User';
import UserInterface from '../interfaces/IUser';

const generateToken = async (content: UserInterface) => {
  const JWTpass = await fs.readFile('jwt.evaluation.key');
  const token = jwt.sign(content, JWTpass);
  return token;
};

const decodeToken = async (token: string) => {
  const decoded = jwt.decode(token);
  return decoded as User;
};

const auth = {
  generateToken,
  decodeToken,
};

export default auth;
