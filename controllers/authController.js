const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { queryDB } = require('../config/db');

// const signup = async (req, res) => {
//     const { username, email, password } = req.body;

//     try {
//         // Kiểm tra email đã tồn tại
//         const existingUser = await queryDB('SELECT * FROM Users WHERE email = @param0', [email]);
//         if (existingUser.length > 0) {
//             return res.status(400).json({ message: 'Email already exists' });
//         }

//         // Mã hóa mật khẩu
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Thêm user mới vào cơ sở dữ liệu
//         await queryDB('INSERT INTO Users (username, email, password) VALUES (@param0, @param1, @param2)', [
//             username,
//             email,
//             hashedPassword,
//         ]);

//         res.status(201).json({ message: 'User registered successfully' });
//     } catch (error) {
//         console.error('Signup error:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// };

// const login = async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         // Thực hiện truy vấn tìm người dùng bằng email
//         const userResult = await queryDB('SELECT * FROM Users WHERE Email = @param0', [email]);
//         const user = userResult[0]; // Lấy người dùng đầu tiên trong kết quả

//         if (!user) {
//             return res.status(400).json({ message: 'Invalid email or password' });
//         }

//         // Kiểm tra mật khẩu
//         const isPasswordValid = await bcrypt.compare(password, user.Password);
//         if (!isPasswordValid) {
//             return res.status(400).json({ message: 'Invalid email or password' });
//         }

//         // Tạo token JWT
//         const token = jwt.sign(
//             { id: user.ID, username: user.Username },
//             process.env.JWT_SECRET,
//             { expiresIn: '1h' }
//         );

//         // Gửi token và thông báo thành công
//         res.status(200).json({ token, username: user.Username, message: 'Login successful' });
//     } catch (error) {
//         console.error('Login error:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// };

const signup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if the email already exists
        const existingUser = await queryDB('SELECT * FROM Users WHERE email = @param0', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Trim any extra spaces
        const trimmedHashedPassword = hashedPassword.trim();
        console.log(trimmedHashedPassword);
        // Insert new user into the database
        await queryDB('INSERT INTO Users (username, email, password) VALUES (@param0, @param1, @param2)', [
            username,
            email,
            trimmedHashedPassword,
        ]);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Query the database for the user by email
        const userResult = await queryDB('SELECT Username, Email, Password FROM Users WHERE Email = @param0', [email]);
        
        if (userResult.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const user = userResult[0]; // Get the first user from the result

        // Trim the stored hashed password before comparing
        const storedHashedPassword = user.Password.trim();

        // Compare the entered password with the trimmed hashed password
        const isPasswordValid = await bcrypt.compare(password, storedHashedPassword);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: user.ID, username: user.Username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ token, username: user.Username, message: 'Login successful' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};




const getUserInfo = async (req, res) => {
    const userId = req.user.id; // Lấy userID từ middleware xác thực (JWT)

    try {
        const pool = await connectDB();
        const result = await pool
            .request()
            .input("userId", sql.Int, userId)
            .query("SELECT Username FROM Users WHERE ID = @userId");

        if (result.recordset.length > 0) {
            const username = result.recordset[0].Username;
            res.status(200).json({ username });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error("Error fetching user info:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { signup, login, getUserInfo };


