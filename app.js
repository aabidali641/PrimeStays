const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const { register } = require("module");
const { isLoggedIn } = require("./middelware.js");

app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "views"));
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs" , ejsMate);
app.use(express.static(path.join(__dirname , "/public")));

main().then( () => {
    console.log("Connected To DataBase Successfully");
})
.catch( (err) => {
    console.log(err);
})

async function main() {
   await mongoose.connect("mongodb://127.0.0.1:27017/wanderLust")
}

const sessionOptions = {
    secret: "mysupersecrercode",
    resave: false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    },
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

//Demo User 

// app.get("/demouser" , async (req,res) => {
//     let fakeUser = new User( {
//     email: "aabidali@gmail.com",
//     username : "Aabid",
//     });

//     let registerUser = await User.register(fakeUser , "Hii");  // pbkdf2 Algorithm is used In This hashing Process 
//     res.send(registerUser);
// });

app.use("/listings" , listingRouter);
app.use("/listings/:id/reviews" , reviewRouter);
app.use("/" , userRouter);


app.all( "*", (req,res,next) => {
    next(new ExpressError(404 , "Page Not Found"));
});

app.use((err,req,res,next) => {
    let {status = 500 , message = "Something Went Wrong!!"} = err;
    res.status(status).render("listings/error.ejs" , { message });
});

app.listen(port , () => {
    console.log(`Listning at port ${port}`);
});