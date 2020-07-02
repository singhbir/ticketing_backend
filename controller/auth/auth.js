const User = require("../../models/User/User");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
//signup
exports.signup = async (req, res) => {
  //validation
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(400).json({
      error: error.array()[0].msg,
    });
  }

  //checking if email exists already
  let emailexists = await User.findOne({ email: req.body.email });
  if (emailexists) {
    return res.status(400).json({
      error: "email exists",
    });
  }

  //   hash the passwords
  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(req.body.password, salt);

  //   creating user and saving in db
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedpassword,
  });
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        error: "not able to save user to db",
      });
    }
    return res.status(200).json({
      name: user.name,
      email: user.email,
    });
  });
};

// login
exports.login = async (req, res) => {
  //validation
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(400).json({
      error: error.array()[0].msg,
    });
  }

  //checking if email exists already
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({
      error: "Email Does not Exists , Please Register",
    });
  }

  //Comparing Password
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass)
    return res.status(400).json({ error: "Email or Password Doesn't Match" });

  //getting token
  const token = await jwt.sign({ _id: user._id }, process.env.SECRET_KEY);
  let date = new Date();
  date.setTime(date.getTime() + 2 * 24 * 60 * 60 * 1000);
  res.cookie("token", token, { expire: date.toUTCString() });

  //sending response back
  const { name, email } = user;
  res.status(200).json({
    token,
    name,
    email,
  });
};

exports.isSignedin = expressJwt({
  secret: process.env.SECRET_KEY,
  algorithms: ["HS256"],
  userProperty: "auth",
});

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    message: "signout successfully done",
  });
};
