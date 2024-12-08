const connectDB = require('../config/db');

// Tạo user mới
const createUser = async (username, email, passwordHash) => {
    const pool = await connectDB();
    await pool.request()
        .input('username', username)
        .input('email', email)
        .input('password', passwordHash)
        .query('INSERT INTO Users (Username, Email, Password) VALUES (@username, @email, @password)');
};

// Tìm user bằng email
const findUserByEmail = async (email) => {
    const pool = await connectDB();
    const result = await pool.request()
        .input('email', email)
        .query('SELECT * FROM Users WHERE Email = @email');
    return result.recordset[0];
};

module.exports = { createUser, findUserByEmail };
