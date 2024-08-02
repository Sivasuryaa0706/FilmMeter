const { isValidObjectId } = require("mongoose");
const emailVerificationToken = require("../../models/emailVerificationToken");
const User = require("../../models/user");
const nodemailer = require("nodemailer");

exports.create = async (req, res) => {
  const { name, email, password } = req.body;

  // Preventing duplicate users
  const oldUser = await User.findOne({ email });
  if (oldUser) {
    return res.status(401).json({ error: "This email is already in use" });
  }

  const newUser = new User({ name, email, password });

  // Generate 6 digit OTP
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    const randomVal = Math.round(Math.random() * 9);
    OTP += randomVal;
  }

  // Store OTP in DB
  const newEmailVerificationToken = new emailVerificationToken({
    owner: newUser._id,
    token: OTP,
  });
  await newEmailVerificationToken.save();

  // Send OTP to user
  var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "80d9dae8252e8f",
      pass: "a5d8fb929682fd",
    },
  });

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

  if (!isValidObjectId(userId)) return res.json({ error: "Invalid User" });

  const user = await User.findById(userId);
  if (!user) return res.json({ error: "User not found!" });

  if (user.isVerified) return res.json({ error: "User already Verified!" });

  const token = await emailVerificationToken.findOne({ owner: userId });
  if (!token) return res.json({ error: "Token not found!" });

  // Comparing OTP with database
  const isMatched = await token.compareToken(OTP);
  if (!isMatched) return res.json({ error: "Please submit a valid OTP" });
  user.isVerified = true;
  await user.save();
  await emailVerificationToken.findByIdAndDelete(token._id); //After verify, delete OTP form db

  //Send Welcome email to user
  var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "80d9dae8252e8f",
      pass: "a5d8fb929682fd",
    },
  });

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
