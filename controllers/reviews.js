const Review = require("../models/review");
const  Listing = require("../models/listing");




module.exports.postReview = async (req, res) => {
  let { id } = req.params;
  let orignalId = id.trim();
  let listing = await Listing.findById(orignalId);
  const { rating, comment } = req.body.review;
  let newReview = new Review({ rating, comment });
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "Listing Is Reviewed Successfully");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview = async (req, res) => {
  let { id, reviewId } = req.params;
  let orignalId = id.trim();
  let orignalReviewId = reviewId.trim();
  await Listing.findByIdAndUpdate(orignalId, {
    $pull: { reviews: orignalReviewId },
  });
  await Review.findByIdAndDelete(orignalReviewId);
  req.flash("success", "Review Is Deleted Successfully");
  res.redirect(`/listings/${id}`);
}; 