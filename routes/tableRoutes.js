const express = require('express');
const { getTableData } = require('../controllers/tableController');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

router.get('/:table_name', (req, res, next) => {
    next();
}, getTableData);
module.exports = router;
