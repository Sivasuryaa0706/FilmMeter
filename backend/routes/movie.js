const express = require("express");
const { isAdmin, isAuth } = require("../middlewares/auth");
const { uploadVideo, uploadImage } = require("../middlewares/multer");
const { uploadTrailer, createMovie } = require("../controllers/movie");
const { parseData } = require("../middlewares/helper");
const router = express.Router();

router.post(
  "/upload-trailer",
  isAuth,
  isAdmin,
  uploadVideo.single("video"),
  uploadTrailer
);

router.post(
  "/create",
  isAuth,
  isAdmin,
  parseData,
  uploadImage.single("poster"),
  createMovie
);

module.exports = router;
