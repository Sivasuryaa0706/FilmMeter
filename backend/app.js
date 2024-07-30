const express = require("express");
require("./db");
const userRoute = require("./routes/user");
const app = express();
const port = 8000;

app.use(express.json());
app.use("/api/user", userRoute);

app.get("/about", (req, res) => {
  res.send("<h1>Hello, this is about tab<h1>");
});

app.listen(port, () => {
  console.log("Listening on port 8000");
});
