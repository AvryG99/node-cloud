const sql = require('mssql');

const dbConfig = {
    user: process.env.EHR_DB_USER,
    password: process.env.EHR_DB_PASSWORD,
    server: process.env.EHR_DB_SERVER,
    database: process.env.EHR_DB_DATABASE,
    options: {
        encrypt: true, // Use encryption for Azure SQL Server
        trustServerCertificate: true, // Change to false in production
    },
};

// API to fetch data from a specific table
exports.getTableData = async (req, res) => {
    const { table_name } = req.params;

    // Basic validation for table_name
    if (!/^[a-zA-Z0-9_]+$/.test(table_name)) {
        return res.status(400).json({ error: 'Invalid table name' });
    }

    try {
        // Connect to the database
        const pool = await sql.connect(dbConfig);

        // Query the data
        const result = await pool.request().query(`SELECT * FROM ${table_name}`);
        
        // Send response
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error(`Error querying table ${table_name}:`, err);
        res.status(500).json({ error: 'Database query failed' });
    } finally {
        // Close the connection
        sql.close();
    }
};
