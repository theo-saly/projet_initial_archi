import inmemoryRepo from './inmemory';
import sqliteRepo from './sqlite';

let repository;
if (process.env.NODE_ENV === 'test') repository = inmemoryRepo;
else repository = sqliteRepo;

export default repository;
