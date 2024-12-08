// xác thực JWT token trước khi gửi request đến các route
const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Gắn thông tin user vào request
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(403).json({ message: "Forbidden" });
    }
};

module.exports = authenticate;

