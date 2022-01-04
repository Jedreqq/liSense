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
const stripe = require("stripe")(
  "sk_test_51KDYX8DHdY0p08Gp7of2nr1GtaPydLV5vLptoSR7hqySoe7np3gYHEY06nWQkRGKzToM25sXICeFvbCI9zj0ypgo00qVaHyBWn"
);

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
            console.log(hasSchool);
          }
          res.status(200).json({ role: user.role, hasSchool: hasSchool });
        });
      } else if (user.role === "student" || user.role === "instructor") {
        memberId = user.memberId;
        console.log(memberId);
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

exports.createSchool = (req, res, next) => {
  const name = req.body.name;
  let owner;
  User.findByPk(req.userId)
    .then((user) => {
      owner = `${user.firstname} ${user.lastname}`;
      const school = new School({
        name: name,
        owner: owner,
        userId: req.userId,
      });
      const result = school.save();
      res.status(201).json({
        message: `New school ${name} created successfully`,
        school: result,
        owner: owner,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
        console.log(err);
      }
      next(err);
    });
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
        console.log(school);
        res
          .status(200)
          .json({ schoolName: school.name, schoolOwner: school.owner });
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
        console.log(err);
      }
      next(err);
    });
};

exports.getOwnerBranches = (req, res, next) => {
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
      school.getBranches().then((branches) => {
        if (!branches) {
          return res
            .status(200)
            .json({ message: "No branches found.", branches: null });
        }
        res.status(200).json({
          message: "Branches found successfully.",
          branches: branches,
        });
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
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

exports.getBranchesList = (req, res, next) => {
  Branch.findAll()
    .then((branches) => {
      if (!branches) {
        const error = new Error("Branches are not found.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        message: "Fetched branches successfully.",
        branches: branches,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.applyToBranch = (req, res, next) => {
  const branchId = req.body.branchRequestId;
  console.log(branchId);
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
    const applier = await User.findByPk(studentId);
    if (!applier) {
      const error = new Error("Could not find vehicle.");
      err.statusCode = 404;
      throw error;
    }
    if (applier.memberId !== activeBranchId) {
      const error = new Error("This student is not part of the branch.");
      err.statusCode = 404;
      throw error;
    }

    console.log(applier);
    res.status(200).json({ message: "Student fetched.", student: applier });
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

  console.log(studentId);

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

      console.log(decision);
      let newMember = user.BranchRequestId;
      console.log(newMember);
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
      include: Category,
    });
    res.status(200).json({ appliers: appliers, instructors: instructors });
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
    if (instructor.memberId !== activeBranchId) {
      const error = new Error("This instructor is not part of the branch.");
      err.statusCode = 404;
      throw error;
    }

    console.log(instructor);

    res.status(200).json({
      message: "Instructor fetched.",
      instructor: instructor,
    });
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
          console.log(cat);
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

    console.log(vehicle);

    res.status(200).json({ message: "Vehicle fetched.", vehicle: vehicle });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createCourse = async (req, res, next) => {
  const name = req.body.name;
  const price = req.body.price;
  const dayOfStart = req.body.dayOfStart;
  const theoryClasses = req.body.theoryClasses;
  const practicalClasses = req.body.practicalClasses;
  const categories = req.body.categories;
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
          console.log(cat);
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

    // const studentPayments = await Payment.findAll({})
    console.log(students);
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
      name: "User_" + req.userId + "_" + name + "_" + price,
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
  if (!userPayment) {
    return;
  }
  const status = userPayment.status;
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
  console.log(coursePrice);
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

  console.log(stripeObj);

  res.status(200).json({
    stripeObj: stripeObj,
  });
};

exports.retrieveStripeObj = async (req, res, next) => {
  const sessionId = req.body.sessionId;
  const userId = req.userId;
  console.log(sessionId);
  try {
    const session = await stripe.checkout.sessions.retrieve(
      sessionId.toString()
    );
    console.log(session);
    if (session.payment_status === "paid") {
      const payment = await Payment.findOne({
        where: {
          userId: userId,
        },
      });
      console.log(payment);
      payment.status = session.payment_status;
      const result = payment.save();
      res.status(200).json({ result: result });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.changePaymentStatus = async (req, res, next) => {
  const curStatus = req.body.curStatus;
  const studentId = req.body.id;

  console.log(curStatus);
  console.log(studentId);

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
