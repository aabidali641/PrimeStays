
const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");

router.get("/signup"  , (req,res) => {
res.render("users/signup.ejs");
});

router.post("/signup" , wrapAsync( async (req,res,next) => {
    try{
        let { username , email , password  } = req.body;
        const newUser = new User({email , username});
        const registeredUser = await User.register(newUser , password);
        req.login(registeredUser , (err) => {
            if(err) {
                return next(err);
            }
            req.flash("success" , "You Are Registerd Successfully");
            res.redirect("/listings");
        })
    } catch(e){
        req.flash("error" , e.message);
        res.redirect("/signup");
    }
}));

router.get("/login" , wrapAsync ( async(req,res) => {
res.render("users/login.ejs");
}));

router.post("/login" , passport.authenticate("local" , {failureRedirect : "/login" , failureFlash : true }), async (req,res) => {
    req.flash("success" , "Welcome To WonderLust");
    res.redirect("/listings");
});

router.get("/logout" , (req,res,next) => {
    req.logOut((err) => {
        if(err){
            return next(err);
        }
        req.flash("success" , "You Are Logged Out Successfully!!");
        res.redirect("/listings");
    })
    });
   

module.exports = router; 