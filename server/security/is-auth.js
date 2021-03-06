const jwt = require("jsonwebtoken");
const User = require("../models/user");

verifyToken = (req, res, next) => {
  const authHeader = req.get("Authorization");
  console.log(authHeader);
  if (!authHeader) {
    const error = new Error("Not authenticated.");
    err.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "liSenseAppEngineerSecret");
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error("Not authenticated.");
    err.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId;
  req.userRole = decodedToken.role;
  next();
};

verifyTokenSocket = (token) => {
  const authHeader = token;
  console.log(authHeader);
  if (!authHeader) {
    const error = new Error("Not authenticated.");
    err.statusCode = 401;
    throw error;
  }
  const splitToken = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(splitToken, "liSenseAppEngineerSecret");
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error("Not authenticated.");
    err.statusCode = 401;
    throw error;
  }
  return {
    userId: decodedToken.userId,
    role: decodedToken.role,
  };
};

isOwner = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    if (user.role === "owner") {
      next();
      return;
    }
    res.status(403).send({
      message: "Require owner role.",
    });
    return;
  });
};

isInstructor = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    if (user.role === "instructor") {
      next();
      return;
    }
    res.status(403).send({
      message: "Require instructor role.",
    });
    return;
  });
};

isStudent = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    if (user.role === "student") {
      next();
      return;
    }
    res.status(403).send({
      message: "Require student role.",
    });
    return;
  });
};

isStudentOrInstructor = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    if (user.role === "student" || user.role === "instructor") {
      next();
      return;
    }
    res.status(403).send({ message: "Require student or instructor role." });
  });
  return;
};

isInstructorOrOwner = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    if (user.role === "owner" || user.role === "instructor") {
      next();
      return;
    }
    res.status(403).send({ message: "Require owner or instructor role." });
  });
  return;
}

const authJwt = {
  verifyToken: verifyToken,
  isOwner: isOwner,
  isInstructor: isInstructor,
  isStudent: isStudent,
  isStudentOrInstructor: isStudentOrInstructor,
  isInstructorOrOwner: isInstructorOrOwner,
  verifyTokenSocket: verifyTokenSocket
};

module.exports = authJwt;
