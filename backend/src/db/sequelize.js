import { Sequelize } from 'sequelize';

import { env } from '../config/env.js';

export const sequelize = new Sequelize(env.db.database, env.db.user, env.db.password, {
  host: env.db.host,
  port: env.db.port,
  dialect: 'mysql',
  logging: false,
  define: {
    timestamps: false,
    freezeTableName: true,
  },
  pool: {
    max: env.db.connectionLimit,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});
