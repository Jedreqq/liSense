const express = require("express");
const router = express.Router();
const {
  verifyToken,
  isInstructor,
  isStudent,
  isOwner,
  isStudentOrInstructor,
} = require("../middleware/is-auth");

const userController = require("../controllers/user");

router.get("/dashboard", verifyToken, userController.getDashboard);

router.put("/createSchool", verifyToken, isOwner, userController.createSchool);

router.get("/school", verifyToken, userController.getSchool);

router.get("/ownerBranches", verifyToken, userController.getOwnerBranches);

router.post("/branch", verifyToken, isOwner, userController.createBranch);

router.get("/branchesList", verifyToken, userController.getBranchesList);

router.patch(
  "/applyToBranch",
  verifyToken,
  isStudentOrInstructor,
  userController.applyToBranch
);

router.patch(
  "/sendActiveBranch",
  verifyToken,
  isOwner,
  userController.sendActiveBranch
);

router.get("/instructorList", verifyToken, userController.getInstructorList);

router.get("/instructorList/:instructorId", verifyToken, userController.getSingleInstructor);

router.get("/applierList", verifyToken, isOwner, userController.getApplierList);

router.get("/applierList/:studentId", verifyToken, userController.getSingleApplier);

router.patch(
  "/replyToApplier",
  verifyToken,
  isOwner,
  userController.replyToApplier
);

router.post(
  "/createVehicle",
  verifyToken,
  isOwner,
  userController.createVehicle
);

router.get("/fleet", verifyToken, userController.getVehicleList);

router.get("/fleet/:vehicleId", verifyToken, isOwner, userController.getSingleVehicle);

router.post("/createCourse", verifyToken, isOwner, userController.createCourse);

router.get('/courseList', verifyToken, isOwner, userController.getCourseList);

router.get('/courses/:courseId', verifyToken, isOwner, userController.getSingleCourse);

router.get('/memberCourses', verifyToken, isStudent, userController.getMemberCourses);

router.patch('/joinToCourse', verifyToken, isStudent, userController.joinToCourse);

router.get('/studentData', verifyToken, isStudent, userController.getStudentData);

router.get('/studentPaymentData', verifyToken, isStudent, userController.getStudentPaymentData);

router.post('/payForCourse', verifyToken, isStudent, userController.payForCourse)

router.post('/retrieveStripeObj', verifyToken, isStudent, userController.retrieveStripeObj);

router.patch('/changePaymentStatus', verifyToken, isOwner, userController.changePaymentStatus)
//
router.post('/addCategory', userController.addCategory);




module.exports = router;
