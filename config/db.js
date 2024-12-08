const sql = require('mssql');
require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: true,
        trustServerCertificate: true,
    },
};

const connectDB = async () => {
    try {
        const pool = await sql.connect(config);
        console.log('Connected to SQL Server');
        return pool;
    } catch (error) {
        console.error('Database connection failed:', error);
        throw error;
    }
};

const queryDB = async (query, params = []) => {
    try {
        const pool = await connectDB();
        const request = pool.request();

        params.forEach((param, index) => {
            request.input(`param${index}`, param);
        });

        const result = await request.query(query);
        return result.recordset;
    } catch (error) {
        console.error('Query failed:', error);
        throw error;
    }
};

module.exports = {
    connectDB,
    queryDB,
};
