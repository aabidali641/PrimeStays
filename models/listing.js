const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const User = require("./user.js");


const listingSchema = new Schema({
    title: {
        type: String,
        required: true // optional: make title required
    },
    description: {
        type: String,
        required: true // optional: make description required
    },
    image: {
        url: {
            type: String,
            required:true,
        },
        filename: {
            type:String,
            required:true,
        }
    },
    price: {
        type: Number,
        required: true // optional: make price required
    },
    location: {
        type: String,
        required: true // optional: make location required
    },
    country: {
        type: String,
        required: true // optional: make country required
    },
    reviews: [ {
        type:Schema.Types.ObjectId,
        ref: "Review",
        default: [],
    }
    ],
    owner: {
    type:Schema.Types.ObjectId,
    ref: "User",
    }
});

listingSchema.post("findOneAndDelete" , async (listing) => {
    if(listing){
        await Review.deleteMany({_id: { $in: listing.reviews}}) ;
    }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
