const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing");

main().then( () =>{
    console.log("Connected To DataBase Successfully");
})
.catch( (err) => {
    console.log(err);
})

async function main() {
   await mongoose.connect("mongodb://127.0.0.1:27017/wanderLust")
}
  
const initDB = async () => {
    await Listing.deleteMany( {} );
    initData.data = initData.data.map( (obj) => ({...obj , owner : "66e51761fad6260434c6d8ce" }));
    await Listing.insertMany(initData.data);
    console.log("data was initilized");
}

initDB();