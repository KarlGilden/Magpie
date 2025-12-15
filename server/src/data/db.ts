import knex from 'knex';
import {ConnectSessionKnexStore} from 'connect-session-knex';
import dotenv from 'dotenv';

dotenv.config();

export const db = knex({
    client: 'mysql2',
    connection: {
        host: process.env.DB_HOST!,
        user: process.env.DB_USER!,
        password: process.env.DB_PASSWORD!,
        database: process.env.DB_NAME!,
    },
    pool: { min: 0, max: 7 },
});

export const store = new ConnectSessionKnexStore({
  tableName: 'sessions', // Optional: customize the table name
  knex: db,
  cleanupInterval: 60000, // Optional: time between clearing expired sessions (in ms)
})