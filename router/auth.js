const router = require("express").Router();
const {
  signup,
  login,
  isSignedin,
  signout,
} = require("../controller/auth/auth");
const { check, validationResult } = require("express-validator");

router.post(
  "/signup",
  [
    check("name", "Name should be atleast 6 char long").isLength({ min: 3 }),
    check("email", "email should be valid email").isEmail(),
    check("password", "Invalid Password or EMail").isLength({
      min: 6,
    }),
  ],
  signup
);

router.post(
  "/signin",
  [
    check("email", "email should be valid email").isEmail(),
    check("password", "Password should be atleast 6 char long").isLength({
      min: 6,
    }),
  ],
  login
);

router.get("/signout", isSignedin, signout);

module.exports = router;
