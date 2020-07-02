require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");

const app = express();

const authRoute = require("./router/auth");
//three main middlewares

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//PORT
const port = process.env.PORT || 8000;

//USING MIDDLEWARES
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//routes
app.use("/api", authRoute);

//DB CONNECTION
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(
    () => {
      console.log("MONGODB CONNECTED");
    },
    (error) => {
      console.log(`DB CONNECTION ERROR ${error}`);
    }
  );

//STARTING A SERVER
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
