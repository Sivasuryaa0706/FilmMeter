const mongoose = require("mongoose");

const actorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    about: {
      type: String,
      trim: true,
      required: true,
    },
    gender: {
      type: String,
      trim: true,
      required: true,
    },
    avatar: {
      type: Object,
      url: String,
      profile_id: String,
    },
  },
  { timestamps: true }
);

actorSchema.index({ name: "text" });

module.exports = mongoose.model("Actor", actorSchema);
