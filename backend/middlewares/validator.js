const { check, validationResult } = require("express-validator");
const genres = require("../utils/genres");
const { isValidObjectId } = require("mongoose");

exports.userValidCheck = [
  check("name").trim().not().isEmpty().withMessage("Name is missing!"),
  check("email").normalizeEmail().isEmail().withMessage("Email is invalid!"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password is invalid")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be 8 to 20 characters long"),
];

exports.validatePassword = [
  check("newPassword")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password is invalid")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be 8 to 20 characters long"),
];

exports.signInValidator = [
  check("email").normalizeEmail().isEmail().withMessage("Email is invalid!"),
  check("password").trim().not().isEmpty().withMessage("Password is invalid"),
];

//Middleware function
exports.validate = (req, res, next) => {
  const error = validationResult(req).array();
  if (error.length) {
    return res.json({ error: error[0].msg });
  }
  next();
};

exports.actorInfoValidator = [
  check("name").trim().not().isEmpty().withMessage("Name is missing!"),
  check("about").trim().not().isEmpty().withMessage("About is required field!"),
  check("gender")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Gender is required field!"),
];

exports.validateMovie = [
  check("title").trim().not().isEmpty().withMessage("Movie Title is missing!"),
  check("story").trim().not().isEmpty().withMessage("Story line is Important!"),
  check("releaseDate").isDate().withMessage("Release Date is Missing!"),
  check("language").isDate().withMessage("Language is Missing!"),
  check("status")
    .isIn(["public", "private"])
    .withMessage("Movie status must be is public or private!"),
  check("type").trim().not().isEmpty().withMessage("Movie Type is Important!"),

  check("genres")
    .isArray()
    .withMessage("Genres must be an array of strings!")
    .custom((value) => {
      for (let g of value) {
        if (!genres.includes(g)) throw Error("Invalid Genres");
      }
      return true;
    }),

  check("tags")
    .isArray({ min: 1 })
    .withMessage("Tags must be an array of strings")
    .custom((tags) => {
      for (let tag of tags) {
        if (typeof tag !== "string")
          throw Error("Tags must be an array of strings");
      }
      return true;
    }),

  check("cast")
    .isArray()
    .withMessage("Cast must be an array of strings!")
    .custom((cast) => {
      for (let c of cast) {
        if (!isValidObjectId(c.id)) throw Error("Invalid Cast id inside");
        if (!c.roleAs?.trim()) throw Error("RoleAs is missing inside cast!");
        if (typeof c.leadActor !== "boolean")
          throw Error(
            "Only accepted boolean value inside leadActor inside cast!"
          );
      }
      return true;
    }),

  check("trailerInfo")
    .isObject()
    .withMessage("Trailer Info must be an aboject with url and public_id")
    .custom(({ url, public_id }) => {
      try {
        const res = new URL(url);
        if (!res.protocol.includes("http"))
          throw Error("Trailer URL is invalid");

        //Getting name of the file uploaded to cloudinary(name is public_id)
        const arr = url.split("/");
        const publicId = arr[arr.length - 1].split(".")[0];

        if (public_id !== publicId) throw Error("Trailer public_id is invalid");
      } catch (error) {
        throw Error("Trailer URL is invalid");
      }
      return true;
    }),

  check("poster").custom((_, { req }) => {
    if (!req.file) throw Error("Poster is missing!");
    return true;
  }),
];
