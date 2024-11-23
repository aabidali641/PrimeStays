const Listing = require("./models/listing.js");

module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        req.flash("error" , "You Must Be Logged In To Create Listing");
        res.redirect("/login");
    }
    return next();
};

module.exports.isOwner = async(req,res,next) => {
    let { id } = req.params;
    let orignalId = id.trim();
    let listing = await Listing.findById(orignalId);
    if(!listing.owner.equals(res.locals.currentUser._id)){
        req.flash("error" , "You Are Not The Owner Of This Listing");
        res.redirect(`/listings/${orignalId}`);
     }
     next();
};