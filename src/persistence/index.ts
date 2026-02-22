if (process.env.MYSQL_HOST) module.exports = require('./mysql');
else if (process.env.NODE_ENV === 'test') module.exports = require('./inmemory');
else module.exports = require('./sqlite');
