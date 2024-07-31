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
  let otp = "";
  for (let i = 0; i < 6; i++) {
    const randomVal = Math.round(Math.random() * 9);
    otp += randomVal;
  }

  // Store OTP in DB
  const newEmailVerificationToken = new emailVerificationToken({
    owner: newUser._id,
    token: otp,
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
        <h1>${otp}</h1>
      `,
  });

  // Save the new user
  await newUser.save();

  res.status(201).json({
    message:
      "Please verify your email. OTP has been sent to your email successfully!",
  });
};
