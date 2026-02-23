import mysqlRepo from './mysql';
import inmemoryRepo from './inmemory';
import sqliteRepo from './sqlite';

let repository;
if (process.env.MYSQL_HOST) repository = mysqlRepo;
else if (process.env.NODE_ENV === 'test') repository = inmemoryRepo;
else repository = sqliteRepo;

export default repository;
