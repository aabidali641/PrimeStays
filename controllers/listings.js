const Listing = require("../models/listing.js");

module.exports.index = async (req,res) => {
    let allListings =  await Listing.find({});
    res.render("listings/index.ejs" , { allListings });
 }; 

 module.exports.homePage = async(req,res) => {
    res.render("listings/home.ejs");
 };

 module.exports.contactPage = async(req, res) => {
    res.render("listings/contact.ejs");
 };

 module.exports.aboutPage = async (req, res) => {
   res.render("listings/about.ejs");
 };

 module.exports.renderNewForm = (req, res) => {
   res.render("listings/new.ejs");
 };


 module.exports.showListing = async (req, res) => {
   let { id } = req.params;
   const orignalId = id.trim();
   const listing = await Listing.findById(orignalId)
     .populate("reviews")
     .populate("owner");
   if (!listing) {
     req.flash("error", "Listing You Request , Does Not Exits");
     res.redirect("/listings");
   }
   res.render("listings/show.ejs", { listing });
 
 };


 module.exports.createListing = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;
   const newListing = new Listing(req.body.listing);
   newListing.owner = req.user._id;
   newListing.image = { url, filename };
   await newListing.save();
   req.flash("success", "New Listing Is Created Successfully");
   res.redirect("/listings");
 };


 module.exports.randerEditForm = async (req, res) => {
   let { id } = req.params;
   let orignalId = id.trim();
   const listing = await Listing.findById(orignalId);
   if(!listing) {
    req.flash("error" , "Listing You requested , Does not exist");
    res.redirect("/listings");
   }
   let orignalImageUrl = listing.image.url;
   orignalImageUrl = orignalImageUrl.replace("/upload" , "/upload/h_150,w_150");
       res.render("listings/edit.ejs", { listing , orignalImageUrl});
   
 };

 module.exports.updateListing = async (req, res) => {
   let { id } = req.params;
   let orignalId = id.trim();
   const listing = await Listing.findByIdAndUpdate(orignalId, { ...req.body.listing });

   if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
   }
   
   req.flash("success", "Listing Is Updated Successfully");
   res.redirect(`/listings/${orignalId}`);
 };

 module.exports.deleteListing = async (req, res) => {
   let { id } = req.params;
   let orignalId = id.trim();
   await Listing.findByIdAndDelete(orignalId);
   req.flash("success", "Listing Is Deleted Successfully");
   res.redirect("/listings");
 };

 module.exports.bookPage = async (req, res) => {
    res.render("listings/book");
 };