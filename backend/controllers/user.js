const { isValidObjectId } = require("mongoose");
const emailVerificationToken = require("../../models/emailVerificationToken");
const User = require("../../models/user");
const nodemailer = require("nodemailer");
const { generateOTP, generateMailTransporter } = require("../utils/mail");
const { sendError } = require("../utils/helper");

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
    message:
      "Please verify your email. OTP has been sent to your email successfully!",
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
        <h3><b><em>🙏 Thanks for choosing us! 😊</em></b></h3>
      `,
  });
  res.json({ message: "Your email is verified" });
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
