const express = require('express');
const router = express.Router();
const { verifyToken, isInstructor, isStudent, isOwner } = require('../middleware/is-auth');

const userController = require('../controllers/user');

router.get('/dashboard', verifyToken, userController.getDashboard);

router.put('/createSchool', verifyToken, isOwner, userController.createSchool);

router.get('/school', verifyToken, userController.getSchool);

router.get('/ownerBranches', verifyToken, userController.getOwnerBranches);

router.post('/branch', verifyToken, isOwner, userController.createBranch);

router.get('/branchesList', verifyToken, userController.getBranchesList);

router.patch('/applyToBranch', verifyToken, isStudent, userController.applyToBranch);

router.patch('/sendActiveBranch', verifyToken, isOwner, userController.sendActiveBranch);

router.get('/studentList', verifyToken, isOwner, userController.getStudentList);
router.get('/applierList', verifyToken, isOwner, userController.getApplierList);

router.patch('/replyToApplier', verifyToken, isOwner, userController.replyToApplier);

module.exports = router;
