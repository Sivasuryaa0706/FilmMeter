const nodemailer = require("nodemailer");
exports.generateOTP = (otpLength = 6) => {
  //Default otpLength=6
  let OTP = "";
  for (let i = 0; i < otpLength; i++) {
    const randomVal = Math.round(Math.random() * 9);
    OTP += randomVal;
  }
  return OTP;
};
exports.generateMailTransporter = () =>
  nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "80d9dae8252e8f",
      pass: "a5d8fb929682fd",
    },
  });
