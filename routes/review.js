const express = require("express");
const router = express.Router({mergeParams: true});
const { listingSchema , reviewSchema } = require("../schema.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const reviewController = require("../controllers/reviews.js");


const validateReview = (req,res,next) => {
    const { error } = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map( (el) => el.message ).join(",");
        throw new ExpressError(400 , errMsg);
    } else{
        next();
    }
};


//Post Review Route
router.post("/" , wrapAsync(reviewController.postReview));

//Delete Review Route
router.delete("/:reviewId" , wrapAsync(reviewController.deleteReview) );

module.exports = router;
