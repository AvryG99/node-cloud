const validateSignup = (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Kiểm tra email hợp lệ
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gm\.medi\.com$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    next();
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    next();
};

module.exports = { validateSignup, validateLogin };
