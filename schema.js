const joi = require("joi");
const review = require("./models/review.js");
module.exports.listingSchema = joi.object( {
    listing: joi.object( {
        title: joi.string().required(),
        description:joi.string().required(),
        location: joi.string().required(),
        country: joi.string().required(),
        price: joi.string().required().min(0),
        image: joi.string().required(),
    }).required(),
});

module.exports.reviewSchema = joi.object({
    review: joi.object( {
        rating: joi.number().min(1).max(5).required,
        Comment: joi.string().required,
    } ).required,
});