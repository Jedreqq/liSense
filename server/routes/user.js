const express = require("express");
const router = express.Router();
const {
  verifyToken,
  isInstructor,
  isStudent,
  isOwner,
  isStudentOrInstructor,
} = require("../security/is-auth");

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

router.patch("/assignInstructorToStudent", verifyToken, isOwner, userController.assignInstructorToStudent);

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

router.patch("/assignInstructorToVehicle", verifyToken, isOwner, userController.assignInstructorToVehicle);

router.post("/createCourse", verifyToken, isOwner, userController.createCourse);

router.get('/courseList', verifyToken, isOwner, userController.getCourseList);

router.post('/getStudentsOfCourse', verifyToken, userController.getStudentsOfCourse);

router.get('/courses/:courseId', verifyToken, isOwner, userController.getSingleCourse);

router.get('/memberCourses', verifyToken, isStudent, userController.getMemberCourses);

router.patch('/joinToCourse', verifyToken, isStudent, userController.joinToCourse);

router.get('/studentData', verifyToken, isStudent, userController.getStudentData);

router.get('/studentPaymentData', verifyToken, isStudent, userController.getStudentPaymentData);

router.post('/payForCourse', verifyToken, isStudent, userController.payForCourse)

router.post('/retrieveStripeObj', verifyToken, isStudent, userController.retrieveStripeObj);

router.patch('/changePaymentStatus', verifyToken, isOwner, userController.changePaymentStatus)
//

router.get('/branchPaymentsList', verifyToken, isOwner, userController.getBranchPaymentsList);

router.get('/instructorListForStudent', verifyToken, isStudent, userController.getInstructorListForStudent);

router.patch('/sendRequestToInstructor', verifyToken, isStudent, userController.sendRequestToInstructor);

router.get('/studentListOfInstructor', verifyToken, isInstructor, userController.studentListOfInstructor);

router.patch('/replyToApplierInstructorRequest', verifyToken, isInstructor, userController.replyToApplierInstructorRequest);

router.post('/postNewComment', verifyToken,  userController.postNewComment);

router.get('/instructorListForStudent/:instructorId', verifyToken, isStudent, userController.getSingleInstructorOfStudent);

router.post('/sendMessage', verifyToken, userController.sendMessage);

router.get('/messages', verifyToken, userController.getMessages);

router.get('/messages/:messageId', verifyToken, userController.getSingleMessage);

router.get('/notifications', verifyToken, userController.getNotifications);

router.post('/createNewEvent', verifyToken, userController.createNewEvent);

router.get('/getInstructorsForSchedule', verifyToken, userController.getInstructorsForSchedule)

///calendar get
router.get('/getBranchCalendar', verifyToken, isOwner, userController.getBranchCalendar);

router.post('/getCourseCalendar', verifyToken, isOwner, userController.getCourseCalendar);

router.get('/getUserCalendar', verifyToken, isStudentOrInstructor, userController.getUserCalendar);

router.post('/getStudentCalendarForInstructor', verifyToken, userController.getStudentCalendarForInstructor)

router.post('/changeEventStatus', verifyToken, userController.changeEventStatus);

router.patch('/deleteEvent', verifyToken, userController.deleteEvent);

router.post('/getStudentListOfSelectedInstructor', verifyToken, isOwner, userController.getStudentListOfSelectedInstructor);


router.post('/addCategory', userController.addCategory);




module.exports = router;
