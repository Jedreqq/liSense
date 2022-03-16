const express = require("express");
const User = require("../models/user");
const { body } = require("express-validator");
const { oneOf } = require("express-validator/check");

const router = express.Router();
const authController = require("../controllers/auth");

router.post(
  "/signup",
  [
    oneOf([
      body("role").trim().not().isEmpty().equals("student").withMessage('Not a student'),
      body("role").trim().not().isEmpty().equals("instructor").withMessage('Not a instructor'),
      body("role").trim().not().isEmpty().equals("owner").withMessage('Not an owner'),
    ]),
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return User.findOne({ where: { email: value } }).then((userExists) => {
          if (userExists) {
            return Promise.reject("Email address already exists.");
          }
        });
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }).withMessage("Password needs to be at least 5 characters long."),
    body("firstname").trim().not().isEmpty().withMessage("Firstname must not be empty."),
    body("lastname").trim().not().isEmpty().withMessage("Lastname must not be empty."),
    body("phonenumber").trim().not().isEmpty().isInt().withMessage('Phone number must be an integer'),
    body("usercity").trim().not().isEmpty().withMessage("User's city must not be empty."),
    body("postalcode").trim().not().isEmpty().withMessage("Postal code must not be empty."),
    body("confirmpassword")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords need to match.");
        }
        return true;
      })
      .trim(),
  ],
  authController.signup
);

router.post('/login', authController.login);

module.exports = router;
