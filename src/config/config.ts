import { Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

const envSchema = Type.Object({
  PORT_APP: Type.String(),  
  MYSQL_ROOT_PASSWORD: Type.String(),
  MYSQL_HOST: Type.String(),
  MYSQL_USER: Type.String(),
  MYSQL_PASSWORD: Type.String(),
  MYSQL_DATABASE: Type.String(),
  MYSQL_PORT: Type.String(),
  HTTP_TIMEOUT: Type.String(),
  HTTP_MAX_REDIRECTS: Type.String(),
  JWT_SECRET: Type.String(),
  X_MID_TOKEN_PUSH: Type.String(),
  HOST_PUSH_NOTIFYCATION: Type.String(),
});

// TODO: this is ugly, find a better way to do this
if (!Value.Check(envSchema, process.env)) throw new Error('Invalid env variables');
export const env = Value.Cast(envSchema, process.env);