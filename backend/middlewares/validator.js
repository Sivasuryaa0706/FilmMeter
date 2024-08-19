const { check, validationResult } = require("express-validator");

exports.userValidCheck = [
  check("name").trim().not().isEmpty().withMessage("Name is missing!"),
  check("email").normalizeEmail().isEmail().withMessage("Email is invalid!"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password is invalid")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be 8 to 20 characters long"),
];

exports.validatePassword = [
  check("newPassword")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password is invalid")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be 8 to 20 characters long"),
];

exports.signInValidator = [
  check("email").normalizeEmail().isEmail().withMessage("Email is invalid!"),
  check("password").trim().not().isEmpty().withMessage("Password is invalid"),
];

//Middleware function
exports.validate = (req, res, next) => {
  const error = validationResult(req).array();
  if (error.length) {
    return res.json({ error: error[0].msg });
  }
  next();
};

exports.actorInfoValidator = [
  check("name").trim().not().isEmpty().withMessage("Name is missing!"),
  check("about").trim().not().isEmpty().withMessage("About is required field!"),
  check("gender")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Gender is required field!"),
];
