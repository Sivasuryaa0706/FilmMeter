const multer = require("multer");
const storage = multer.diskStorage({});

const imageFileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image")) {
    cb("Please upload image!", false);
  }
  cb(null, true);
};

const videoFileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("video")) {
    cb("Please upload image!", false);
  }
  cb(null, true);
};

exports.uploadImage = multer({ storage, imageFileFilter });
exports.uploadVideo = multer({ storage, videoFileFilter });
