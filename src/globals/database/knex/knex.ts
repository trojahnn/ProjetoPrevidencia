
import knex from 'knex';
import config from './config';

const connection = knex(config.development);

export default connection;