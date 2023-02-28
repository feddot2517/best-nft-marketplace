import { Sequelize } from 'sequelize';
require('dotenv').config();

const { PG_DB, PG_USER, PG_PASSWORD, PG_URI } = process.env;

export const sequelize = new Sequelize(`postgres://${PG_USER}:${PG_PASSWORD}@${PG_URI}/${PG_DB}`, {
  logging: true,
});
