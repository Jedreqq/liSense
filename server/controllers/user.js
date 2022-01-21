const Branch = require("../models/branch");
const School = require("../models/school");
const User = require("../models/user");
const Category = require("../models/category");
const Vehicle = require("../models/vehicle");
const VehicleCategory = require("../models/vehicle-category");
const Course = require("../models/course");
const CourseCategory = require("../models/course-category");
const Payment = require("../models/payment");
const { compareSync } = require("bcryptjs");
const Comment = require("../models/comment");
const Message = require("../models/message");
const Mailbox = require("../models/mailbox");
const stripe = require("stripe")(
  "sk_test_51KDYX8DHdY0p08Gp7of2nr1GtaPydLV5vLptoSR7hqySoe7np3gYHEY06nWQkRGKzToM25sXICeFvbCI9zj0ypgo00qVaHyBWn"
);

const socketFunction = require("../app");
const Event = require("../models/event");
const CalendarEvent = require("../models/calendar-event");
const Calendar = require("../models/calendar");

exports.getDashboard = (req, res, next) => {
  User.findByPk(req.userId)
    .then((user) => {
      if (!user) {
        const error = new Error("User not found.");
        error.statusCode = 404;
        throw error;
      }

      if (user.role !== req.userRole) {
        const error = new Error("Invalid role");
        error.statusCode = 404;
        throw error;
      }

      let hasSchool = false;
      let memberId;

      if (user.role === "owner") {
        user.getSchool().then((school) => {
          if (school) {
            hasSchool = true;
          }
          res.status(200).json({ role: user.role, hasSchool: hasSchool });
        });
      } else if (user.role === "student" || user.role === "instructor") {
        memberId = user.memberId;
        res.status(200).json({ role: user.role, memberId: memberId });
      }
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createSchool = async (req, res, next) => {
  try {
    const name = req.body.name;

    const owner = await User.findByPk(req.userId);

    owner = `${owner.firstname} ${owner.lastname}`;
    const school = new School({
      name: name,
      owner: owner,
      userId: req.userId,
    });
    const result = await school.save();

    res.status(201).json({
      message: `New school ${name} created successfully`,
      school: result,
      owner: owner,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      console.log(err);
    }
    next(err);
  }
};

exports.getSchool = (req, res, next) => {
  User.findByPk(req.userId)
    .then((user) => {
      if (!user) {
        const error = new Error("User not found.");
        error.statusCode = 404;
        throw error;
      }
      if (user.role !== req.userRole) {
        const error = new Error("Invalid role");
        error.statusCode = 404;
        throw error;
      }
      user.getSchool().then((school) => {
        if (!school) {
          const error = new Error("Oops! Owner has no school.");
          error.statusCode = 404;
          throw error;
        }
        res
          .status(200)
          .json({ schoolName: school.name, schoolOwner: school.owner });
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getOwnerBranches = async (req, res, next) => {
  try {
    const owner = await User.findByPk(req.userId);
    let ownerActiveBranchId = owner.activeBranchId;
    const school = await School.findOne({ where: { userId: req.userId } });
    if (!school) {
      const error = new Error("School not found.");
      error.statusCode = 404;
      throw error;
    }
    if (school.userId !== req.userId) {
      const error = new Error("Invalid user");
      error.statusCode = 404;
      throw error;
    }
    const branches = await school.getBranches();
    if (!branches) {
      return res
        .status(200)
        .json({ message: "No branches found.", branches: null });
    }
    res.status(200).json({
      message: "Branches found successfully.",
      branches: branches,
      ownerActiveBranchId: ownerActiveBranchId,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createBranch = (req, res, next) => {
  const name = req.body.name;
  const city = req.body.city;
  const postalCode = req.body.postalCode;
  const address = req.body.address;
  const phoneNumber = req.body.phoneNumber;

  School.findOne({ where: { userId: req.userId } })
    .then((school) => {
      if (!school) {
        const error = new Error("School not found.");
        error.statusCode = 404;
        throw error;
      }
      if (school.userId !== req.userId) {
        const error = new Error("Invalid user");
        error.statusCode = 404;
        throw error;
      }

      const branch = new Branch({
        name: name,
        city: city,
        postalCode: postalCode,
        address: address,
        phoneNumber: phoneNumber,
        schoolId: school._id,
      });
      const result = branch.save();
      res
        .status(201)
        .json({ message: "Branch created successfully.", branch: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getBranchesList = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);

    let BranchRequestId = user.BranchRequestId;
    const branches = await Branch.findAll();
    if (!branches) {
      const error = new Error("Branches are not found.");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      message: "Fetched branches successfully.",
      branches: branches,
      BranchRequestId: BranchRequestId,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.applyToBranch = (req, res, next) => {
  const branchId = req.body.branchRequestId;
  User.findByPk(req.userId)
    .then((user) => {
      user.status = `Applies to branch #${branchId}`;
      user.BranchRequestId = branchId;
      const result = user.save();
      res
        .status(200)
        .json({ message: `User applied to branch #${branchId}`, user: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getApplierList = async (req, res, next) => {
  let activeBranchId;
  try {
    const owner = await User.findByPk(req.userId);
    activeBranchId = owner.activeBranchId;
    const appliers = await User.findAll({
      where: { BranchRequestId: activeBranchId, role: "student" },
    });
    const students = await User.findAll({
      where: { memberId: activeBranchId, role: "student" },
    });
    res.status(200).json({ appliers: appliers, students: students });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getSingleApplier = async (req, res, next) => {
  let activeBranchId;
  const studentId = req.params.studentId;
  try {
    const owner = await User.findByPk(req.userId);
    activeBranchId = owner.activeBranchId;
    const applier = await User.findByPk(studentId, { include: Payment });
    if (!applier) {
      const error = new Error("Could not find vehicle.");
      err.statusCode = 404;
      throw error;
    }
    if (
      applier.memberId !== activeBranchId ||
      applier.attendedCourseId === null
    ) {
      res.status(200).json({
        message: "Student without or in other branch.",
        student: applier,
      });
    } else {
      const attendedCourse = await Course.findByPk(applier.attendedCourseId, {
        include: Category,
      });

      const instructors = await User.findAll({
        where: {
          memberId: activeBranchId,
          role: "instructor",
        },
        include: Category,
      });

      let courseCategories = [];

      courseCategories = attendedCourse.categories.map((category) => {
        return category.type;
      });

      let instructorsThatMatchCategoriesOfCourse = [];

      instructors.forEach((instructor) => {
        let helper = [];
        helper = instructor.categories.map((category) => {
          return category.type;
        });

        if (helper.some((v) => courseCategories.indexOf(v) >= 0)) {
          instructorsThatMatchCategoriesOfCourse.push(instructor);
        }
      });

      res.status(200).json({
        message: "Student fetched.",
        student: applier,
        attendedCourse: attendedCourse,
        instructors: instructorsThatMatchCategoriesOfCourse,
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.assignInstructorToStudent = async (req, res, next) => {
  const assignedInstructor = req.body.assignedInstructor;
  const curStudent = req.body.curStudent;

  try {
    const user = await User.findByPk(curStudent);
    if (!user) {
      const error = new Error("Could not find user.");
      err.statusCode = 404;
      throw error;
    }
    user.assignedInstructorId = assignedInstructor;
    if (user.instructorRequestId) {
      user.instructorRequestId = null;
    }
    user.save();
    res.status(200).json({ message: "Instructor assigned.", user: user });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.sendActiveBranch = (req, res, next) => {
  const activeBranchId = req.body.activeBranchId;
  User.findByPk(req.userId)
    .then((user) => {
      user.activeBranchId = activeBranchId;
      const result = user.save();
      res
        .status(200)
        .json({ message: `Branch ${activeBranchId} is now active.` });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.replyToApplier = (req, res, next) => {
  const decision = req.body.decision;
  const studentId = req.body.id;

  User.findByPk(studentId)
    .then((user) => {
      if (!user) {
        const error = new Error("User not found.");
        error.statusCode = 404;
        throw error;
      }
      if (decision !== "accept" && decision !== "reject") {
        const error = new Error("Invalid response.");
        error.statusCode = 404;
        throw error;
      }
      let newMember = user.BranchRequestId;
      if (decision === "accept") {
        user.BranchRequestId = null;
        user.memberId = newMember;
        user.status = `member`;
        user.save();
        res.status(200).json({
          message: `ACCEPT - Student with id ${studentId} added to branch ${newMember}`,
        });
      } else if (decision === "reject") {
        user.BranchRequestId = null;
        user.status = "rejected";
        user.save();
        res.status(200).json({
          message: `REJECT - Student with id ${studentId} rejected by branch ${newMember}`,
        });
      }
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getInstructorList = async (req, res, next) => {
  let activeBranchId;
  try {
    const owner = await User.findByPk(req.userId);
    activeBranchId = owner.activeBranchId;
    const appliers = await User.findAll({
      where: { BranchRequestId: activeBranchId, role: "instructor" },
      include: Category,
    });
    const instructors = await User.findAll({
      where: { memberId: activeBranchId, role: "instructor" },
      include: [Category, Vehicle],
    });
    res.status(200).json({ appliers: appliers, instructors: instructors });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getInstructorsForSchedule = async (req, res, next) => {
  let activeBranchId;
  try {
    const owner = await User.findByPk(req.userId);
    activeBranchId = owner.activeBranchId;
    const instructors = await User.findAll({
      where: { memberId: activeBranchId, role: "instructor" },
    });
    res.status(200).json({ instructors: instructors });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getSingleInstructorOfStudent = async (req, res, next) => {
  let assignedInstructorId;
  const instructorId = req.params.instructorId;
  try {
    const student = await User.findByPk(req.userId);
    assignedInstructorId = student.assignedInstructorId;

    const instructor = await User.findByPk(instructorId);

    if (!instructor) {
      const error = new Error("Could not find instructor.");
      err.statusCode = 404;
      throw error;
    }
    const comments = await Comment.findAll({
      where: { instructorId: instructor._id },
    });

    res.status(200).json({
      message: "Instructor fetched.",
      instructor: instructor,
      comments: comments,
      assignedInstructorId: assignedInstructorId,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getSingleInstructor = async (req, res, next) => {
  let activeBranchId;
  const instructorId = req.params.instructorId;
  try {
    const owner = await User.findByPk(req.userId);
    activeBranchId = owner.activeBranchId;
    const instructor = await User.findByPk(instructorId, {
      include: Category,
    });
    if (!instructor) {
      const error = new Error("Could not find instructor.");
      err.statusCode = 404;
      throw error;
    }

    const comments = await Comment.findAll({
      where: { instructorId: instructor._id },
    });

    if (instructor.memberId !== activeBranchId) {
      res.status(200).json({
        message: "Instructor without or in other branch.",
        instructor: instructor,
        comments: comments,
      });
    } else {
      res.status(200).json({
        message: "Instructor fetched.",
        instructor: instructor,
        comments: comments,
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createVehicle = async (req, res, next) => {
  const brand = req.body.brand;
  const model = req.body.model;
  const year = req.body.year;
  const registrationPlate = req.body.registrationPlate;
  const categories = req.body.categories;
  let activeBranchId;
  let vehicle;
  try {
    const owner = await User.findByPk(req.userId);
    activeBranchId = owner.activeBranchId;
    vehicle = new Vehicle({
      brand: brand,
      model: model,
      year: year,
      registrationPlate: registrationPlate,
      branchId: activeBranchId,
    });
    const result = await vehicle.save();
    categories.forEach((category) => {
      Category.findAll({ where: { type: category } }).then((cats) => {
        cats.forEach((cat) => {
          const vehicleCategory = new VehicleCategory({
            vehicleId: vehicle._id,
            categoryId: cat._id,
          });
          const savedConnection = vehicleCategory.save();
        });
      });
    });
    res.status(201).json({
      message: "Vehicle saved successfully.",
      vehicle: result,
      categories: categories,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
  // has to find current branch, like in instructor list, to save() this branchId in DB. userID can be null, I have to admit it in model!
};

exports.getVehicleList = async (req, res, next) => {
  let activeBranchId;
  try {
    const owner = await User.findByPk(req.userId);
    activeBranchId = owner.activeBranchId;
    const vehicles = await Vehicle.findAll({
      where: { branchId: activeBranchId },
      include: Category,
    });
    res.status(200).json({ vehicles: vehicles });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getSingleVehicle = async (req, res, next) => {
  let activeBranchId;
  const vehicleId = req.params.vehicleId;
  try {
    const owner = await User.findByPk(req.userId);
    activeBranchId = owner.activeBranchId;
    const vehicle = await Vehicle.findByPk(vehicleId, {
      include: Category,
    });
    if (!vehicle) {
      const error = new Error("Could not find vehicle.");
      err.statusCode = 404;
      throw error;
    }
    if (vehicle.branchId !== activeBranchId) {
      const error = new Error("This vehicle is not part of the branch.");
      err.statusCode = 404;
      throw error;
    }

    const instructors = await User.findAll({
      where: {
        memberId: activeBranchId,
        role: "instructor",
      },
      include: Category,
    });
    let vehicleCategories = [];
    vehicleCategories = vehicle.categories.map((category) => {
      return category.type;
    });

    let instructorThatMatchCategoriesOfVehicle = [];

    instructors.forEach((instructor) => {
      let helper = [];
      helper = instructor.categories.map((category) => {
        return category.type;
      });

      if (helper.some((v) => vehicleCategories.indexOf(v) >= 0)) {
        instructorThatMatchCategoriesOfVehicle.push(instructor);
      }
    });

    res.status(200).json({
      message: "Vehicle fetched.",
      vehicle: vehicle,
      instructors: instructorThatMatchCategoriesOfVehicle,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.assignInstructorToVehicle = async (req, res, next) => {
  const assignedInstructorId = req.body.assignedInstructor;
  const curVehicle = req.body.curVehicle;

  try {
    const vehicle = await Vehicle.findOne({
      where: {
        _id: curVehicle,
      },
    });
    if (!vehicle) {
      const error = new Error("Could not find vehicle.");
      err.statusCode = 404;
      throw error;
    }

    vehicle.userId = assignedInstructorId;
    vehicle.save();
    res.status(200).json({ message: "Instructor assigned.", vehicle: vehicle });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createCourse = async (req, res, next) => {
  const {
    name,
    price,
    dayOfStart,
    theoryClasses,
    practicalClasses,
    categories,
  } = req.body;

  let activeBranchId;
  let course;
  try {
    const owner = await User.findByPk(req.userId);
    activeBranchId = owner.activeBranchId;
    course = new Course({
      name: name,
      price: price,
      dayOfStart: dayOfStart,
      theoryClasses: theoryClasses,
      practicalClasses: practicalClasses,
      status: "Available",
      branchId: activeBranchId,
    });
    const result = await course.save();
    categories.forEach((category) => {
      Category.findAll({ where: { type: category } }).then((cats) => {
        cats.forEach((cat) => {
          const courseCategory = new CourseCategory({
            courseId: course._id,
            categoryId: cat._id,
          });
          const savedConnection = courseCategory.save();
        });
      });
    });
    res.status(201).json({
      message: "Course saved successfully.",
      course: result,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getCourseList = async (req, res, next) => {
  let activeBranchId;
  try {
    const owner = await User.findByPk(req.userId);
    activeBranchId = owner.activeBranchId;
    const courses = await Course.findAll({
      where: { branchId: activeBranchId },
      include: Category,
    });

    res.status(200).json({ courses: courses });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getStudentsOfCourse = async (req, res, next) => {
  const selectedCourseId = req.body.selectedCourseId;
  const students = await User.findAll({
    where: {
      attendedCourseId: selectedCourseId,
    },
    attributes: ["_id", "firstname", "lastname", "assignedInstructorId"],
  });

  res.status(200).json({ students: students });
};

exports.getSingleCourse = async (req, res, next) => {
  let activeBranchId;
  const courseId = req.params.courseId;
  try {
    const course = await Course.findByPk(courseId, {
      include: Category,
    });
    if (!course) {
      const error = new Error("Could not find course.");
      err.statusCode = 404;
      throw error;
    }
    const owner = await User.findByPk(req.userId);
    activeBranchId = owner.activeBranchId;

    const students = await User.findAll({
      where: { memberId: activeBranchId, attendedCourseId: courseId },
      include: {
        model: Payment,
        right: true,
      },
    });

    res
      .status(200)
      .json({ message: "Course fetched.", course: course, students: students });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getMemberCourses = async (req, res, next) => {
  let memberId;
  let attendedCourseId;
  try {
    const student = await User.findByPk(req.userId);
    memberId = student.memberId;
    attendedCourseId = student.attendedCourseId;
    const courses = await Course.findAll({
      where: { branchId: memberId, status: "Available" },
      include: Category,
    });
    res
      .status(200)
      .json({ courses: courses, attendedCourseId: attendedCourseId });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.joinToCourse = async (req, res, next) => {
  const name = req.body.name;
  const price = req.body.price;
  const attendedCourseId = req.body.attendedCourseId;

  try {
    const updatedUser = await User.findByPk(req.userId);
    updatedUser.attendedCourseId = attendedCourseId;
    updatedUser.save();

    const newPayment = new Payment({
      userId: req.userId,
      name: "User_" + req.userId + "___" + name + "___" + price,
      price: price,
      status: "unpaid",
    });
    const result = newPayment.save();
    res.status(201).json({
      message:
        "Student joined course #" +
        attendedCourseId +
        " and payment " +
        newPayment.name +
        " has been booked.",
      payment: result,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getStudentData = async (req, res, next) => {
  const user = await User.findByPk(req.userId);
  const userPayment = await Payment.findOne({ where: { userId: user._id } });

  const { attendedCourseId } = user;
  // if (userPayme) {
  //   res.status(200).json({
  //     attendedCourseId: attendedCourseId,
  //   })
  // }
  const status = userPayment?.status;
  res.status(200).json({
    attendedCourseId: attendedCourseId,
    status: status,
  });
};

exports.getStudentPaymentData = async (req, res, next) => {
  const user = await User.findByPk(req.userId);
  const course = await Course.findOne({
    where: { _id: user.attendedCourseId },
  });
  const userPayment = await Payment.findOne({ where: { userId: req.userId } });
  const { name } = course;
  const { price, status, userId } = userPayment;
  res.status(200).json({
    name,
    price,
    status,
    userId,
  });
};

exports.payForCourse = async (req, res, next) => {
  const name = req.body.name;
  const coursePrice = req.body.price * 100;
  const email = req.body.email;
  let lineItems = [];

  const product = await stripe.products.create({
    name: name,
  });
  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: coursePrice,
    currency: "pln",
  });

  lineItems.push({ price: price.id, quantity: 1 });

  const stripeObj = await stripe.checkout.sessions.create({
    customer_email: email,
    success_url: "http://localhost:3000/payment?id={CHECKOUT_SESSION_ID}",
    cancel_url: "http://localhost:3000/payment?canceled=true",
    payment_method_types: ["card", "p24"],
    line_items: lineItems,
    mode: "payment",
  });

  res.status(200).json({
    stripeObj: stripeObj,
  });
};

exports.retrieveStripeObj = async (req, res, next) => {
  const sessionId = req.body.sessionId;
  const userId = req.userId;
  try {
    const session = await stripe.checkout.sessions.retrieve(
      sessionId.toString()
    );
    if (session.payment_status === "paid") {
      const payment = await Payment.findOne({
        where: {
          userId: userId,
        },
      });
      payment.status = session.payment_status;
      const result = payment.save();
      res.status(200).json({ result: result });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.changePaymentStatus = async (req, res, next) => {
  const curStatus = req.body.curStatus;
  const studentId = req.body.id;

  try {
    const user = await User.findByPk(studentId);
    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }
    if (curStatus !== "paid" && curStatus !== "unpaid") {
      const error = new Error("Invalid response.");
      error.statusCode = 404;
      throw error;
    }

    let changedPayment;
    changedPayment = await Payment.findOne({ where: { userId: studentId } });

    if (curStatus === "paid") {
      changedPayment.status = "unpaid";
    }
    if (curStatus === "unpaid") {
      changedPayment.status = "paid";
    }
    changedPayment.save();
    res.status(200).json({
      message: `Status of payment changed to opposite for student id#${studentId}.`,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getBranchPaymentsList = async (req, res, next) => {
  let activeBranchId;
  try {
    const owner = await User.findByPk(req.userId);
    activeBranchId = owner.activeBranchId;
    const payments = await Payment.findAll({
      include: {
        model: User,
        where: {
          memberId: activeBranchId,
        },
      },
    });

    res.status(200).json({
      payments: payments,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getInstructorListForStudent = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { _id: req.userId },
      include: [
        { model: Course, as: "attendedCourse", include: { model: Category } },
        { model: Payment },
      ],
    });

    let userAssignedInstructorId = user.assignedInstructorId;
    let instructorRequestId = user.instructorRequestId;

    let userPaymentStatus = user.payments.map((payment) => {
      return payment.status;
    });
    //////////////jeśli nie opłaciłęm to nie moge tego robić i basta
    let studentCourseCategories = [];
    if (!user.attendedCourse) {
      const error = new Error("You need to select course first.");
      error.statusCode = 401;
      throw error;
    }
    user.attendedCourse.categories.map((category) => {
      studentCourseCategories.push(category.type);
    });

    const instructors = await User.findAll({
      where: {
        memberId: user.memberId,
      },
      include: [Category, Vehicle],
    });

    let instructorThatMatchCategoriesOfCourse = [];

    instructors.forEach((instructor) => {
      let helper = [];
      helper = instructor.categories.map((category) => {
        return category.type;
      });

      if (helper.some((v) => studentCourseCategories.indexOf(v) >= 0)) {
        instructorThatMatchCategoriesOfCourse.push(instructor);
      }
    });

    res.status(200).json({
      instructors: instructorThatMatchCategoriesOfCourse,
      userPaymentStatus: userPaymentStatus,
      userAssignedInstructorId: userAssignedInstructorId,
      instructorRequestId: instructorRequestId,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.sendRequestToInstructor = async (req, res, next) => {
  const requestedInstructorId = req.body.requestedInstructorId;
  try {
    const student = await User.findByPk(req.userId);
    student.instructorRequestId = requestedInstructorId;
    const result = student.save();
    res.status(200).json({
      message: `Request sent to the instructor #${requestedInstructorId}`,
      user: student,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.studentListOfInstructor = async (req, res, next) => {
  try {
    const instructor = await User.findByPk(req.userId);
    if (!instructor) {
      const error = new Error("Could not find instructor.");
      err.statusCode = 404;
      throw error;
    }
    const students = await User.findAll({
      where: {
        assignedInstructorId: instructor._id,
        role: "student",
      },
    });

    const appliers = await User.findAll({
      where: {
        instructorRequestId: instructor._id,
        role: "student",
      },
    });
    res.status(200).json({
      message: "Student list fetched.",
      students: students,
      appliers: appliers,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.replyToApplierInstructorRequest = async (req, res, next) => {
  const decision = req.body.decision;
  const studentId = req.body.id;
  try {
    const user = await User.findByPk(studentId);
    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }
    if (decision !== "accept" && decision !== "reject") {
      const error = new Error("Invalid response.");
      error.statusCode = 404;
      throw error;
    }

    if (decision === "accept") {
      user.assignedInstructorId = user.instructorRequestId;
      user.instructorRequestId = null;
      user.save();
      res.status(200).json({
        message: `ACCEPT - Student with id ${studentId} accepted by instructor ${req.userId}.`,
      });
    } else if (decision === "reject") {
      user.instructorRequestId = null;
      user.save();
      res.status(200).json({
        message: `REJECT - Student with id ${studentId} rejected by instructor ${req.userId}.`,
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postNewComment = async (req, res, next) => {
  const text = req.body.text;
  const instructorId = req.body.instructorId;
  let newComment;
  try {
    newComment = new Comment({
      content: text,
      instructorId: instructorId,
    });
    const result = await newComment.save();
    res.status(201).json({
      message: "New comment added.",
      comment: result,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.sendMessage = async (req, res, next) => {
  const topic = req.body.topic;
  const messageContent = req.body.messageContent;
  const receiverId = req.body.receiverId;
  try {
    const mailbox = await Mailbox.findOne({
      where: { userId: receiverId },
      include: {
        model: Message,
        include: {
          model: User,
          as: "sender",
          attributes: ["firstname", "lastname"],
        },
      },
    });

    const newMessage = new Message({
      senderId: req.userId,
      topic: topic,
      messageContent: messageContent,
      mailboxId: mailbox._id,
      received: false,
    });
    const result = await newMessage.save();

    const sender = await User.findOne({
      where: { _id: newMessage.senderId },
      attributes: ["firstname", "lastname"],
    });

    socketFunction?.sendMessage(
      {
        sender: sender,
        _id: result._id,
        topic: result.topic,
        createdAt: result.createdAt,
        received: result.received,
      },
      receiverId
    );
    res.status(201).json({
      message: "Message sent successfully.",
      newMessage: newMessage,
      result: result,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }

    const mailbox = await Mailbox.findOne({
      where: { userId: user._id },
      include: {
        model: Message,
        include: {
          model: User,
          as: "sender",
          attributes: ["firstname", "lastname"],
        },
      },
    });

    if (!mailbox) {
      const error = new Error("Mailbox not found.");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: "Mailbox fetched.", mailbox: mailbox });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getSingleMessage = async (req, res, next) => {
  const messageId = req.params.messageId;
  try {
    const user = await User.findByPk(req.userId);
    if (+user._id !== +req.userId) {
      const error = new Error("Wrong user.");
      error.statusCode = 404;
      throw error;
    }
    const message = await Message.findOne({
      where: { _id: messageId },
      include: [
        { model: Mailbox, right: true },
        {
          model: User,
          as: "sender",
          attributes: ["firstname", "lastname", "_id"],
        },
      ],
    });
    if (+message.mailbox.userId !== +req.userId) {
      const error = new Error("Wrong user.");
      error.statusCode = 404;
      throw error;
    }

    if (!message.received) {
      message.received = true;
      message.save();
    }

    res.status(200).json({ message: "Message fetched.", message: message });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getNotifications = async (req, res, next) => {
  try {
    const mailbox = await Mailbox.findOne({
      where: { userId: req.userId },
      include: Message,
    });
    let counter = 0;
    mailbox.messages.map((message) => {
      if (!message.received) {
        counter++;
      }
    });

    res.status(200).json({ counter: counter });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createNewEvent = async (req, res, next) => {
  let instructor;
  let userList = [];
  const { title, _id, startDate, endDate } = req.body;
  if (title === "Practical Class") {
    try {
      const user = await User.findByPk(+_id);
      instructor = await User.findOne({
        where: { _id: user.assignedInstructorId },
      });
      userList = [user._id, instructor._id];
      const event = new Event({
        title: title,
        startDate: startDate,
        endDate: endDate,
        description: `Student: ${user.firstname} ${user.lastname}, Instructor: ${instructor.firstname} ${instructor.lastname}`,
        status: false,
      });
      const result = await event.save();
      userList.forEach((user) => {
        const eventCalendar = new CalendarEvent({
          calendarId: user,
          eventId: result._id,
        });
        const savedConnection = eventCalendar.save();
      });
      res.status(201).json({
        message: "Event saved",
        event: result,
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  } else if (title === "Internal Exam") {
    try {
      const user = await User.findByPk(+_id);
      userList = [user._id];
      const event = new Event({
        title: title,
        startDate: startDate,
        endDate: endDate,
        description: `Student: ${user.firstname} ${user.lastname}`,
        status: false,
      });

      const result = await event.save();
      userList.forEach((user) => {
        const eventCalendar = new CalendarEvent({
          calendarId: user,
          eventId: result._id,
        });
        const savedConnection = eventCalendar.save();
      });

      res.status(201).json({
        message: "Event saved",
        event: result,
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  } else if (title === "Theory Class (Course)") {
    try {
      const users = await User.findAll({
        where: { attendedCourseId: +_id },
        include: { model: Calendar },
      });
      const course = await Course.findByPk(+_id);

      let calendarIds = [];

      calendarIds = users.map((user) => {
        return user.calendar._id;
      });
      console.log(calendarIds);

      const event = new Event({
        title: title,
        startDate: startDate,
        endDate: endDate,
        description: `Students: ${course.name}`,
        status: false,
      });
      const result = await event.save();

      calendarIds.forEach((calendarId) => {
        const calendarEvent = new CalendarEvent({
          calendarId: calendarId,
          eventId: result._id,
        });
        const savedConnection = calendarEvent.save();
      });

      res.status(201).json({
        message: "Events created successfully",
        result: result,
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  } else if (title === "Individual (Instructor)") {
    try {
      const user = await User.findByPk(+_id);
      console.log("individual", user);

      const event = new Event({
        title: title,
        startDate: startDate,
        endDate: endDate,
        description: `Instructor: ${user.firstname} ${user.lastname}`,
        status: false,
      });

      const result = await event.save();

      const eventCalendar = new CalendarEvent({
        calendarId: user._id,
        eventId: result._id,
      });

      const savedConnection = await eventCalendar.save();

      res
        .status(200)
        .json({ message: "Instructor event created", event: result });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  } else if (title === "Branch (Instructor)") {
    let activeBranchId;
    try {
      const owner = await User.findByPk(req.userId);
      activeBranchId = owner.activeBranchId;

      const instructors = await User.findAll({
        where: { memberId: activeBranchId, role: "instructor" },
        include: { model: Calendar },
      });

      const branch = await Branch.findOne({
        where: { _id: activeBranchId },
        attributes: ["name"],
      });

      let instructorIds = [];

      instructorIds = instructors.map((instructor) => {
        return instructor.calendar._id;
      });

      const event = new Event({
        title: title,
        startDate: startDate,
        endDate: endDate,
        description: `Instructors: ${branch.name}`,
        status: false,
      });
      const result = await event.save();

      instructorIds.forEach((instructorId) => {
        const calendarEvent = new CalendarEvent({
          calendarId: instructorId,
          eventId: result._id,
        });
        const savedConnection = calendarEvent.save();
      });

      res
        .status(200)
        .json({ message: "Instructors branch event created", event: result });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  } else {
    const error = new Error("Wrong type of class or meeting.");
    error.statusCode = 404;
    throw error;
  }
};

exports.getStudentCalendar = async (req, res, next) => {
  try {
    const calendar = await Calendar.findOne({
      where: { userId: req.userId },
      include: [
        { model: User, attributes: ["firstname", "lastname", "_id"] },
        { model: Event },
      ],
    });
    res
      .status(200)
      .json({ message: "message test student calendar", eventList: calendar });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getStudentCalendarForInstructor = async (req, res, next) => {
  try {
    const selectedStudentId = req.body.userId;
    const calendar = await Calendar.findOne({
      where: { userId: selectedStudentId },
      include: [
        { model: User, attributes: ["_id", "firstname", "lastname"] },
        { model: Event },
      ],
    });
    res
      .status(200)
      .json({ message: "Calendar of student fetched.", calendar: calendar });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getInstructorCalendar = async (req, res, next) => {
  try {
    const calendar = await Calendar.findOne({
      where: { userId: req.userId },
      include: [
        { model: User, attributes: ["_id", "firstname", "lastname"] },
        { model: Event },
      ],
    });

    const studentCalendarEvents = await CalendarEvent.findAll({
      where: {
        eventId: calendar.events.map((event) => {
          return event._id;
        }),
      },
      attributes: ["calendarId", "eventId"],
    });

    console.log(studentCalendarEvents);

    res.status(200).json({ calendar: calendar });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getCourseCalendar = async (req, res, next) => {};

exports.getBranchCalendar = async (req, res, next) => {};

exports.changeEventStatus = async (req, res, next) => {
  const { eventId, curStatus } = req.body;
  console.log(eventId, curStatus);

  try {
    const event = await Event.findByPk(eventId);
    if (!curStatus) {
      event.status = true;
    }
    if (curStatus) {
      event.status = false;
    }

    const result = await event.save();

    res.status(200).json({
      message: "Status changed successfully.",
      result: result,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteEvent = async (req, res, next) => {
  const eventId = req.body.eventId;
  try {
    const event = await Event.findByPk(eventId);
    const deleteEvent = await event.destroy();
    res
      .status(200)
      .json({ message: "Event deleted.", deleteEvent: deleteEvent });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getStudentListOfSelectedInstructor = async (req, res, next) => {
  const userId = req.body.userId;
  try {
    const students = await User.findAll({
      where: { assignedInstructorId: userId },
      attributes: ["_id", "firstname", "lastname"],
    });
    const calendar = await Calendar.findOne({
      where: { userId: userId },
      include: [
        { model: User, attributes: ["_id", "firstname", "lastname"] },
        { model: Event },
      ],
    });

    res.status(200).json({
      message: "Student list of selected instructor fetched.",
      students: students,
      calendar: calendar,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getStudentListOfSelectedCourse = async (req, res, next) => {};

//
exports.addCategory = (req, res, next) => {
  let categories = [
    "A",
    "A1",
    "A2",
    "B",
    "B1",
    "C",
    "C1",
    "D",
    "D1",
    "B+E",
    "C+E",
    "D+E",
    "T",
  ];

  categories.forEach((category) => {
    const categoryy = new Category({
      type: category,
    });
    categoryy.save();
  });
};
