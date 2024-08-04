const { isValidObjectId } = require("mongoose");
const passwordResetToken = require("../models/passwordResetToken");
const { sendError } = require("../utils/helper");

exports.isValidPasswordResetToken = async (req, res, next) => {
  const { token, userId } = req.body;
  if (!token.trim() || !isValidObjectId(userId))
    return sendError(res, "Invalid Request");

  const resetToken = await passwordResetToken.findOne({ owner: userId });
  if (!resetToken) return sendError(res, "Invalid Request!");

  const matched = await resetToken.compareToken(token);
  if (!matched) return sendError(res, "Unauthorized Access, Invalid Request!");

  req.resetToken = resetToken; //Can be used in router's controller
  next();
};
