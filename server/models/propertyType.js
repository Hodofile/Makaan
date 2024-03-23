const mongoose = require("mongoose")
const propertyTypeSchema = new mongoose.Schema({
    ptname:{
        type:String
    }
   
})

const propertyTypeModel= mongoose.model("propertyType", propertyTypeSchema)
module.exports = propertyTypeModel