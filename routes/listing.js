const express = require("express");
const router = express.Router();
const { listingSchema, reviewSchema } = require("../schema.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");
const { isLoggedIn, isOwner } = require("../middelware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");

const {storage} = require("../cloudConfig.js")
const upload = multer({ storage });

const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

// const validateReview = (req,res,next) => {
//     const { error } = reviewSchema.validate(req.body);
//     if(error){
//         let errMsg = error.details.map( (el) => el.message ).join(",");
//         throw new ExpressError(400 , error);
//     } else{
//         next();
//     }
// }

router.get("/:_id/book", wrapAsync(listingController.bookPage));

router.get("/about", wrapAsync(listingController.aboutPage));

router.get("/contact", wrapAsync(listingController.contactPage));

router.get("/home", wrapAsync(listingController.homePage));


//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm );



router
  .route("/")
  //index route
  .get(wrapAsync(listingController.index))
  //create route
  .post(isLoggedIn, upload.single("listing[image]") , wrapAsync(listingController.createListing));
 ;

router
  .route("/:id")
  //show route
  .get(wrapAsync(listingController.showListing))
  // update route
  .put(isLoggedIn, isOwner,upload.single("listing[image]"), wrapAsync(listingController.updateListing))
  //delete route
  .delete( isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

//Edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.randerEditForm)
);




module.exports = router;
