const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("express-async-errors");
require("dotenv").config({ path: "../.env" });
require("./db");
const { errorHandler } = require("./middlewares/error");
const { handleNotFound } = require("./utils/helper");

//Routers
const userRoute = require("./routes/user");
const actorRoute = require("./routes/actor");
const movieRoute = require("./routes/movie");

const app = express();
app.use(cors());
const port = 8000;

app.use(express.json());
app.use(morgan("dev"));

app.use("/api/user", userRoute);
app.use("/api/actor", actorRoute);
app.use("/api/movie", movieRoute);
app.use("/*", handleNotFound);

//Async Await Error Handling using express-async-errors
//We use this so that no need of try catch block for all async await functions
app.use(errorHandler);

app.listen(port, () => {
  console.log("Listening on port 8000");
});
