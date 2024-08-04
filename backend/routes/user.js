const express = require("express");
const {
  create,
  verifyEmail,
  resendEmailVerificationToken,
  forgetPassword,
} = require("../controllers/user");
const { userValidCheck, validate } = require("../middlewares/validator");
const { isValidPasswordResetToken } = require("../middlewares/user");
const router = express.Router();

//Post -> safe, get-> not safe.  Always think from front-end.
router.post("/create", userValidCheck, validate, create); // Here we are getting info from front-end. (POST for frontend)
router.post("/verify-email", verifyEmail);
router.post("/resend-email-verification-token", resendEmailVerificationToken);
router.post("/forget-password", forgetPassword);
router.post(
  "/verify-pass-reset-token",
  isValidPasswordResetToken,
  (req, res) => {
    res.json({ valid: true });
  }
);

module.exports = router;
