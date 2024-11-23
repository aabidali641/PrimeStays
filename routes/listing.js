const express = require("express");
const router = express.Router();
const { listingSchema , reviewSchema } = require("../schema.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner } = require("../middelware.js");
const listingController = require("../controllers/listings.js");

const validateListing = (req,res,next) => {
    const { error } = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map( (el) => el.message ).join(",");
        throw new ExpressError(400 , error);
    } else{
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

//index route 
router.get("/" ,  wrapAsync(listingController.index));
 
 //New Route 
 router.get("/new" , isLoggedIn , (req,res) => {
     res.render("listings/new.ejs" );
 });
 
 // show route
 router.get("/:id" , wrapAsync(async (req,res) => {
     let { id } = req.params;
     const orignalId = id.trim(); 
      const listing =  await Listing.findById(orignalId).populate("reviews").populate("owner");
      if(!listing){
        req.flash("error" , "Listing You Request , Does Not Exits");
        res.redirect("/listings");
      }
      console.log(listing);
     res.render("listings/show.ejs" , { listing });
 }));
 
 //Create Route
 router.post("/" , isLoggedIn , wrapAsync(async (req,res) => {
     const newListing = new Listing(req.body.listing);
     newListing.owner = req.user._id;
     await newListing.save();
     req.flash("success" , "New Listing Is Created Successfully");
     res.redirect("/listings");
 })
 );
 
 //Edit route 
 router.get("/:id/edit" , isLoggedIn , isOwner , wrapAsync(async (req,res) => {
     let { id } = req.params;
     let orignalId = id.trim();
     const listing = await Listing.findById(orignalId);
     req.flash("success" , "Listing Is Edited Succssfully");
     res.render("listings/edit.ejs" , { listing } );
 }));
 
 //Update Route
 router.put("/:id" , isLoggedIn , isOwner,  wrapAsync(async (req,res) => {
     let { id } = req.params;
     let orignalId = id.trim();
     await Listing.findByIdAndUpdate(orignalId , {...req.body.listing});
     req.flash("success" , "Listing Is Updated Successfully");
     res.redirect(`/listings/${orignalId}`);
 }));
 
 //delete Route
 
 router.delete("/:id" , isLoggedIn , isOwner , wrapAsync(async (req,res) =>{
     let { id } = req.params;
     let orignalId = id.trim();
     await Listing.findByIdAndDelete(orignalId);
     req.flash("success" , "Listing Is Deleted Successfully" );
     res.redirect("/listings");
 }));

 module.exports = router;