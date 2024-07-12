import { plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsString, validateSync } from 'class-validator';

class Env {
  @IsNotEmpty()
  PORT: string | number;

  @IsString()
  @IsNotEmpty()
  jwtSecret: string;

  @IsString()
  @IsNotEmpty()
  jwtExpiresIn: string;
}

export const env: Env = plainToInstance(Env, {
  PORT: process.env.PORT ?? 3001,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
});

const errors = validateSync(env);

if (errors.length > 0) {
  console.log(env);
  throw new Error(JSON.stringify(errors, null, 4));
}
