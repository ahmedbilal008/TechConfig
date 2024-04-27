require('dotenv').config(); // Load environment variables from config.env
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL // Use the environment variable
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};
