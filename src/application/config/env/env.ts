import 'dotenv/config';
import { z } from 'zod';
import { MissingEnvironmentVariablesError } from '../../exceptions/MissingEnvironmentsVariableError';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  PORT: z
    .string()
    .default('3000')
    .transform(val => parseInt(val, 10)),
  DB_HOST: z.string(),
  DB_PORT: z
    .string()
    .default('5432')
    .transform(val => parseInt(val, 10)),
  DB_USER: z.string().default('postgres'),
  DB_PASS: z.string(),
  DB_NAME: z.string(),
  JWT_PASS: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_REGION: z.string(),
  BUCKET_NAME: z.string().default('Music Nook'),
  EMAIL_HOST: z.string(),
  EMAIL_PORT: z
    .string()
    .default('465')
    .transform(val => parseInt(val, 10)),
  EMAIL_USER: z.string(),
  EMAIL_PASS: z.string(),
  EMAIL_NAME: z.string(),
  EMAIL_FROM: z.string().email()
});

export const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('Invalid environment variables', _env.error.format());
  throw new MissingEnvironmentVariablesError('Invalid environment variables');
}

export const env = _env.data;
