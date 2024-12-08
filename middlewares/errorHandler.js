const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Ghi log lỗi
    res.status(500).json({ message: 'Internal server error', error: err.message });
};

module.exports = errorHandler;
