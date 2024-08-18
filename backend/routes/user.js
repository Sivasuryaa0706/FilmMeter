const express = require("express");
const jwt = require("jsonwebtoken");
const {
  create,
  verifyEmail,
  resendEmailVerificationToken,
  forgetPassword,
  resetPassword,
  sendResetPasswordTokenStatus,
  signIn,
} = require("../controllers/user");
const {
  userValidCheck,
  validate,
  validatePassword,
  signInValidator,
} = require("../middlewares/validator");
const { isValidPasswordResetToken } = require("../middlewares/user");
const { sendError } = require("../utils/helper");
const user = require("../models/user");
const { isAuth } = require("../middlewares/auth");
const router = express.Router();

//Post -> safe, get-> not safe.  Always think from front-end.
router.post("/create", userValidCheck, validate, create); // Here we are getting info from front-end. (POST for frontend)
router.post("/sign-in", signInValidator, validate, signIn);
router.post("/verify-email", verifyEmail);
router.post("/resend-email-verification-token", resendEmailVerificationToken);
router.post("/forget-password", forgetPassword);
router.post(
  "/verify-pass-reset-token",
  isValidPasswordResetToken,
  sendResetPasswordTokenStatus
);
router.post(
  "/reset-password",
  validatePassword,
  validate,
  isValidPasswordResetToken,
  resetPassword
);

//To get to know if the user is authenticated
router.get("/is-auth", isAuth, (req, res) => {
  const { user } = req;
  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
    },
  });
});
module.exports = router;
