const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sql = require('mssql');
require('dotenv').config();
// Routes
const authRoutes = require('./routes/authRoutes');
const tableRoutes = require('./routes/tableRoutes');

// Middleware
const authenticate = require('./middlewares/authenticate');
const errorHandler = require('./middlewares/errorHandler');
const { validateSignup, validateLogin } = require('./middlewares/validateInputs');

const app = express();


// Middleware cơ bản
app.use(cors());
app.use(bodyParser.json());

// Logging request (nếu cần kiểm tra)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/node/auth', authRoutes); // Các route liên quan đến auth (login/signup)
app.use('/node/table', tableRoutes); // Các route liên quan đến table

// Route mẫu cho private route cần xác thực
app.get('/node/protected', authenticate, (req, res) => {
    res.status(200).json({ message: `Welcome, ${req.user.username}!` });
});

const sqlConfig = {
    user: process.env.EHR_DB_USER,
    password: process.env.EHR_DB_PASSWORD,
    server: process.env.EHR_DB_SERVER, // e.g., localhost
    database: process.env.EHR_DB_DATABASE,
    options: {
        encrypt: true, // Set to true if using Azure SQL or require encryption
        trustServerCertificate: true, // True for local dev/test; adjust for production
    },
};

// Connect to SQL Server
sql.connect(sqlConfig).then(() => {
    console.log("Connected to SQL Server");
}).catch(err => {
    console.error("Database connection failed:", err);
});

// Route to query all rows from a specified table
app.get('node/tables/:tableName', async (req, res) => {
    const { tableName } = req.params;

    try {
        const request = new sql.Request();
        const query = `SELECT * FROM ${tableName};`; // Basic query
        const result = await request.query(query);

        res.status(200).json({
            success: true,
            table: tableName,
            data: result.recordset, // Contains the rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error querying the database. Check table name or database configuration.",
            error: error.message,
        });
    }
});

// Middleware xử lý lỗi (phải đặt cuối cùng)
app.use(errorHandler);

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(5000, '127.0.0.1',() => {
    console.log(`Server running on http://localhost:${PORT}`);
});
