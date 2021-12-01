const Branch = require("../models/branch");
const School = require("../models/school");
const User = require("../models/user");

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
      if (user.role === "owner") {
        user.getSchool().then((school) => {
          if (school) {
            console.log("test dupa jest szkola");
            hasSchool = true;
            console.log(hasSchool);
          }
          res.status(200).json({ role: user.role, hasSchool: hasSchool });
        });
      } else if (user.role === "student" || user.role === "instructor") {
        res.status(200).json({ role: user.role });
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
      console.log(school);

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

exports.getStudentList = async (req, res, next) => {
  let activeBranchId;
  try {
    const owner = await User.findByPk(req.userId);
    activeBranchId = owner.activeBranchId;
    const students = await User.findAll({
      where: { BranchRequestId: activeBranchId, role: "student" },
    });
    res.status(200).json({ students: students });
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
exports.getApplierList = (req, res, next) => {
  User.findAll({ where: { RequestBranchId: req } });
};

exports.replyToApplier = (req, res, next) => {};
