
const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const passport = require("passport");
const signupController = require("../controllers/user");

router
  .route("/signup")
  .get(signupController.renedrSignupForm)
  .post( wrapAsync(signupController.signUpForm));

router
  .route("/login")
  .get(wrapAsync(signupController.renderLoginForm))
  .post(passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    signupController.loginForm
  );

router.get("/logout" , signupController.logoutForm);

module.exports = router; 