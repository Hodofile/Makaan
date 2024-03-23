const mongoose = require("mongoose");
const propertySchema = new mongoose.Schema({
    pname:{
        type:String,
    },
    pprice:{
        type:Number,
    },
    paddress:{
        type:String,
    },
    psize:{
        type:String,
    },
    pkit:{
        type:Number,
    },
    pbed:{
        type:Number,
    },
    pbath:{
        type:Number,
    },
    agent:{
        type:String
    },
    pdesc:{
        type:String,
    },
    image:{
        type:String,
    },
    ptType:{
        type:String
    },
    category:{
        type:String
    }
})

let propertyModel = mongoose.model("property", propertySchema)
module.exports = propertyModel