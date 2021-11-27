const express = require('express');
const router = express.Router();
const { verifyToken, isInstructor, isStudent, isOwner } = require('../middleware/is-auth');

const userController = require('../controllers/user');

router.get('/dashboard', verifyToken, userController.getDashboard);

router.put('/createSchool', verifyToken, isOwner, userController.createSchool);

router.get('/school/:schoolId', verifyToken)

module.exports = router;
