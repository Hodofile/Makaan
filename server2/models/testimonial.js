const mongoose = require("mongoose");
const testimonialSchema = new mongoose.Schema({
    clientname:{
        type:String,
    },
    clientdesc:{
        type:String,
    },
    clientprof:{
        type:String,
    },
    clientimage:{
        type:String,
    }
})

let testimonialModel = mongoose.model("testimonial", testimonialSchema)
module.exports = testimonialModel