const express = require('express');
const router = express.Router();
const { verifyToken, isInstructor, isStudent, isOwner } = require('../middleware/is-auth');

const userController = require('../controllers/user');

router.get('/dashboard', verifyToken, userController.getDashboard);

module.exports = router;
