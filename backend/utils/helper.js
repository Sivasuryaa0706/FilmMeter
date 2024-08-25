const crypto = require("crypto");
const cloudinary = require("../cloud");

exports.sendError = (res, error, statusCode = 401) => {
  res.status(statusCode).json({ error });
};

exports.generateRandomBytes = () => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(30, (err, buff) => {
      if (err) reject(err);
      const buffstring = buff.toString("hex");
      console.log(buffstring);
      resolve(buffstring);
    });
  });
};

exports.handleNotFound = (req, res) => {
  this.sendError(res, "Not Found", 404);
};

exports.uploadImageToCloud = async (filePath) => {
  const { secure_url: url, public_id } = await cloudinary.uploader.upload(
    filePath,
    {
      gravity: "face",
      height: 500,
      width: 500,
      crop: "thumb",
    }
  );
  return { url, public_id };
};

exports.formatActor = (actor) => {
  const { name, gender, about, _id, avatar } = actor;
  return { id: _id, name, about, gender, avatar: actor.avatar?.url };
};
