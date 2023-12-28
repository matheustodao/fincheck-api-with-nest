import { env } from '../config/env';

export const jwtConstants = {
  secret: env.jwtSecret,
  expiresIn: env.jwtExpiresIn,
};
