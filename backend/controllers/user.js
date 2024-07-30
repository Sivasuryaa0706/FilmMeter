const User = require("../../models/user");

exports.create = async (req, res) => {
  const { name, email, password } = req.body;

  //Preventing duplicate users
  const oldUser = await User.findOne({ email });
  if (oldUser)
    return res.status(401).json({ error: "This mail is already in use" }); //Unauthorized status code

  const newUser = new User({ name, email, password });
  await newUser.save();
  res.status(201).json({ user: newUser }); //Created status code
};
