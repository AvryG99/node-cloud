const express = require('express');
const { login, signup, getUserInfo } = require('../controllers/authController');
const { validateSignup, validateLogin } = require('../middlewares/validateInputs');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

router.post('/signup', validateSignup, signup); // processing Signup from middleware -> controller
router.post('/login', validateLogin, login); // Login route

// Route riêng tư (chỉ truy cập khi có token)
router.get('/protected', authenticate, (req, res) => {
    res.status(200).json({ message: `Welcome, ${req.user.username}!` });
});

// Route mới để lấy thông tin người dùng
router.get('/user-info', authenticate, (req, res) => {
    const { username } = req.user; // Lấy username từ token
    if (!username) {
        return res.status(404).json({ message: 'User not found in token' });
    }
    res.status(200).json({ username });
});

module.exports = router;
