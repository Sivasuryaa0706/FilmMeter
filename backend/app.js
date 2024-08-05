const express = require("express");
const morgan = require("morgan");
require("express-async-errors");
require("dotenv").config({ path: "../.env" });
require("./db");
const userRoute = require("./routes/user");
const { errorHandler } = require("./middlewares/error");
const app = express();
const port = 8000;

app.use(express.json());
app.use(morgan("dev"));
app.use("/api/user", userRoute);

//Async Await Error Handling using express-async-errors
//We use this so that no need of try catch block for all async await functions
app.use(errorHandler);

app.listen(port, () => {
  console.log("Listening on port 8000");
});
