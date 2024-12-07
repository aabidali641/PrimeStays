const User = require("../models/user.js");


module.exports.renedrSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signUpForm = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "You Are Registerd Successfully");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = async (req, res) => {
  res.render("users/login.ejs");
};

module.exports.loginForm = async (req, res) => {
  req.flash("success", "Welcome To PrimeStays");
  res.redirect("/listings");
};

module.exports.logoutForm = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You Are Logged Out Successfully!!");
    res.redirect("/listings");
  });
};