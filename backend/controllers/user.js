const jwt = require("jsonwebtoken");
const { isValidObjectId } = require("mongoose");
const emailVerificationToken = require("../models/emailVerificationToken");
const passwordResetToken = require("../models/passwordResetToken");
const User = require("../models/user");
const { generateOTP, generateMailTransporter } = require("../utils/mail");
const { sendError, generateRandomBytes } = require("../utils/helper");

exports.create = async (req, res) => {
  const { name, email, password } = req.body;

  // Preventing duplicate users
  const oldUser = await User.findOne({ email });
  if (oldUser) {
    return sendError(res, "This email is already in use");
  }

  const newUser = new User({ name, email, password });

  // Generate 6 digit OTP
  let OTP = generateOTP(6);

  // Store OTP in DB
  const newEmailVerificationToken = new emailVerificationToken({
    owner: newUser._id,
    token: OTP,
  });
  await newEmailVerificationToken.save();

  // Send OTP to user
  var transport = generateMailTransporter();

  await transport.sendMail({
    from: "verification@reviewapp.com",
    to: newUser.email,
    subject: "Email Verification",
    html: `
        <p>Your Verification OTP</p>
        <h1>${OTP}</h1>
      `,
  });

  // Save the new user
  await newUser.save();

  res.status(201).json({
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    },
  });
};

exports.verifyEmail = async (req, res) => {
  const { userId, OTP } = req.body;

  if (!isValidObjectId(userId)) return sendError(res, "Invalid User");

  const user = await User.findById(userId);
  if (!user) return sendError(res, "User not found!", 404);

  if (user.isVerified) return sendError(res, "User already Verified!");

  const token = await emailVerificationToken.findOne({ owner: userId });
  if (!token) return res.json({ error: "Token not found!" });

  // Comparing OTP with database
  const isMatched = await token.compareToken(OTP);
  if (!isMatched) return sendError(res, "Please submit a valid OTP");
  user.isVerified = true;
  await user.save();
  await emailVerificationToken.findByIdAndDelete(token._id); //After verify, delete OTP form db

  //Send Welcome email to user
  var transport = generateMailTransporter();

  await transport.sendMail({
    from: "verification@reviewapp.com",
    to: user.email,
    subject: "Verification successful ✅",
    html: `
        <h1>Your email has been verified successfully! 🎉</h1><br>
        <h3><b><em>Thanks for choosing us! 😊</em></b></h3>
      `,
  });
  const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      token: jwtToken,
      isVerified: user.isVerified,
    },
    message: "Your email is verified",
  });
};

//After 1hr, token will be reset.
exports.resendEmailVerificationToken = async (req, res) => {
  const { userId } = req.body;
  const user = await User.findById(userId);
  if (!user) return sendError(res, "User not found");
  if (user.isVerified)
    return sendError(res, "This email id is already verified!");

  //check generated token is present in db. To avoid multiple token (1hr not completed)
  const alreadyHasToken = await emailVerificationToken.findOne({
    owner: userId,
  });
  if (alreadyHasToken)
    return sendError(res, "Only after 1hr you can request for another token");

  //!If user dont have then send a new OTP
  let OTP = generateOTP(6);

  // Store OTP in DB
  const newEmailVerificationToken = new emailVerificationToken({
    owner: user._id,
    token: OTP,
  });
  await newEmailVerificationToken.save();

  // Send OTP to user
  var transport = generateMailTransporter();

  await transport.sendMail({
    from: "verification@reviewapp.com",
    to: user.email,
    subject: "Email Verification",
    html: `
        <p>Your Verification OTP</p>
        <h1>${OTP}</h1>
      `,
  });
  res.json({ message: "New OTP has been sent to your registered email id" });
};

//For resetting password
exports.forgetPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return sendError(res, "Email is missing!");

  const user = await User.findOne({ email });
  if (!user) return sendError(res, "User not found!", 404);

  const alreadyHasToken = await passwordResetToken.findOne({ owner: user._id });
  if (alreadyHasToken)
    return sendError(
      res,
      "Only after one hour you can request for another token!"
    );

  // Sending password reset link
  const token = await generateRandomBytes();
  const newPasswordResetToken = await passwordResetToken({
    owner: user._id,
    token,
  });
  await newPasswordResetToken.save();

  const resetPasswordUrl = `http://localhost:5173/auth/reset-password?token=${token}&id=${user._id}`; //React app

  const transport = generateMailTransporter();
  await transport.sendMail({
    from: "security@reviewapp.com",
    to: user.email,
    subject: "Reset Password link",
    html: `
        <p>Click here to reset password</p>
        <a href='${resetPasswordUrl}'>Reset Password</a>
      `,
  });
  res.json({ message: "Link sent to your email" });
};

exports.sendResetPasswordTokenStatus = (req, res) => {
  res.json({ valid: true });
};

exports.resetPassword = async (req, res) => {
  const { newPassword, userId } = req.body;
  const user = await User.findById(userId);
  const matched = await user.comparePassword(newPassword);
  if (matched)
    return sendError(
      res,
      "The new password must be different from the old one!"
    );
  user.password = newPassword;
  await user.save();

  //Delete passwordreset token since the password is successfully reset
  await passwordResetToken.findByIdAndDelete(req.resetToken._id);

  //Send success mail
  const transport = generateMailTransporter();
  await transport.sendMail({
    from: "security@reviewapp.com",
    to: user.email,
    subject: "✅Password reset Successful",
    html: `
        <h1>Password Reset Successfull🎉</h1>
        <p>Now you can use new password to login</p>
      `,
  });
  res.json({
    message:
      "Password Reset Successfull, now you can use new password to login",
  });
};

exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return sendError(res, "Email/ Password mismatch");

  const matched = await user.comparePassword(password);
  if (!matched) return sendError(res, "Email/ Password mismatch");

  const { _id, name, role, isVerified } = user;
  const jwtToken = jwt.sign({ userId: _id }, process.env.JWT_SECRET);
  res.json({
    user: { id: _id, name, email, role, token: jwtToken, isVerified },
  });
};
