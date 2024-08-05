const express = require("express");
const morgan = require("morgan");
require("dotenv").config({ path: "../.env" });
require("./db");
const userRoute = require("./routes/user");
const app = express();
const port = 8000;

app.use(express.json());
app.use(morgan("dev"));
app.use("/api/user", userRoute);

app.listen(port, () => {
  console.log("Listening on port 8000");
});
