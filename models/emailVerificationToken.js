//!We use this schema to store tokens using owner id.
// verificationToken:{
//     owner: _id,
//     token: otp (in hashed format),
//     expiryDate: 1hr
// }

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const emailVerificationTokenSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId, //Stored as ObjectId datatype in db.
    ref: "User", //In the model/user we are exporting it as "User"
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    expires: 3600,
    default: Date.now(),
  },
});

// Hash token beforing saving.
emailVerificationTokenSchema.pre("save", async function (next) {
  if (this.isModified("token")) {
    const hash = await bcrypt.hash(this.token, 10);
    this.token = hash;
  }
  next();
});

// Method to compare Hashed OTP(stored in db), Email verification token(send through email)
emailVerificationTokenSchema.methods.compareToken = async function (token) {
  const result = await bcrypt.compare(token, this.token);
  return result;
};

module.exports = mongoose.model(
  "EmailVerficationToken",
  emailVerificationTokenSchema
);
