const keys = require('./keys');
const pg = require('pg');

const pool = new pg.Pool({
    user: keys.DB_USER,
    host: keys.DB_HOST,
    database: keys.DB_DATABASE,
    password: keys.DB_PASSWORD,
    port: keys.DB_PORT
});

// check if the database is connected
pool.on('connect', () => {
    
});
// check if the database is disconnected
pool.on('error', (err) => {
    
});

// export the pool
module.exports = pool;