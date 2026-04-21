import dotenv from 'dotenv';

dotenv.config();

function toNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toList(value, fallback) {
  const source = value ?? fallback;
  return source
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: toNumber(process.env.PORT, 4000),
  jwtSecret: process.env.JWT_SECRET ?? 'change-this-super-secret-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  corsOrigins: toList(
    process.env.CORS_ORIGIN,
    'http://localhost:5173,http://localhost:8080',
  ),
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:8080',
  db: {
    host: process.env.DB_HOST ?? 'localhost',
    port: toNumber(process.env.DB_PORT, 3306),
    database: process.env.DB_NAME ?? 'plushstore_db',
    user: process.env.DB_USER ?? 'proy2',
    password: process.env.DB_PASSWORD ?? 'secret',
    connectionLimit: toNumber(process.env.DB_CONNECTION_LIMIT, 10),
  },
  googleClientId: process.env.GOOGLE_CLIENT_ID ?? '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
};
