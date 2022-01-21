const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const Category = require("../models/category");
const UserCategory = require("../models/user-category");
const Mailbox = require("../models/mailbox");
const Calendar = require("../models/calendar");

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const role = req.body.role;
  const email = req.body.email;
  const password = req.body.password;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const city = req.body.usercity;
  const postalCode = req.body.postalcode;
  const phoneNumber = req.body.phonenumber;
  let categories;
  if (role === "instructor") {
    categories = req.body.categories;
    //     const categories = req.body.categories;
  }
  let user;
  let mailbox;

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      user = new User({
        role: role,
        email: email,
        firstname: firstname,
        lastname: lastname,
        city: city,
        postalCode: postalCode,
        phoneNumber: phoneNumber,
        password: hashedPassword,
      });
      return user.save();
    })
    .then((result) => {
      console.log(result);
      mailbox = new Mailbox({
        userId: user._id,
      });
      return mailbox.save();
    })
    .then((result) => {
      calendar = new Calendar({
        userId: user._id,
      });
      return calendar.save();
    })
    .then((result) => {
      if (role === "instructor") {
        categories.forEach((category) => {
          Category.findAll({ where: { type: category } }).then((cats) => {
            cats.forEach((cat) => {
              console.log(cat);
              const userCategory = new UserCategory({
                userId: user._id,
                categoryId: cat._id,
              });
              userCategory.save();
            });
          });
        });
      }
      res.status(201).json({
        message: `User with role ${role} created.`,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        res.json({ message: err.message });
        res.json({ message: "Server is here man." });
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  let loadedUser;
  User.findOne({ where: { email: email } })
    .then((user) => {
      if (!user) {
        const error = new Error("A user with this email could not be find.");
        error.statusCode = 401; //not authenticated error
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Wrong password!");
        error.statusCode = 401;
        throw error;
      }
      //tutaj już poszlo i tworzy sie token zeby moc byc autoryzowanym na wszystkie strony zalogowanego
      const token = jwt.sign(
        {
          userId: loadedUser._id,
          email: loadedUser.email,
          role: loadedUser.role,
        },
        "liSenseAppEngineerSecret",
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        userId: loadedUser._id.toString(),
        role: loadedUser.role,
        memberId: loadedUser.memberId,
        email: loadedUser.email,
        isAuth: true,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
