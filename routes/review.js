const express = require("express");
const router = express.Router({mergeParams: true});
const { listingSchema , reviewSchema } = require("../schema.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

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
router.post("/" ,   wrapAsync(async (req,res) => {
    let { id } = req.params;
    let orignalId = id.trim();
    let listing = await Listing.findById(orignalId);
    const { rating, comment } = req.body.review;
    let newReview = new Review({ rating, comment });
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success" , "Listing Is Reviewed Successfully");
    res.redirect(`/listings/${listing._id}`);
}));

//Delete Review Route

router.delete("/:reviewId" , validateReview , wrapAsync(async (req , res) => {
    let { id , reviewId} = req.params;
    let orignalId = id.trim();
    let orignalReviewId = reviewId.trim();
    await Listing.findByIdAndUpdate(orignalId , {$pull: {reviews: orignalReviewId}});
    await Review.findByIdAndDelete(orignalReviewId);
    req.flash("success" , "Review Is Deleted Successfully");
    res.redirect(`/listings/${id}`);
} ) );

module.exports = router;
