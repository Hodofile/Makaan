const mongoose = require("mongoose")
const reactRegistrationSchema = new mongoose.Schema({
   username:{
    type: String
   },
   email:{
    type:String
   },
   psw:{
    type:String
   },
   phoneCode:{
    type:Number
   },
   phone:{
    type:Number
   },
   rimg:{
      type:String
   }
})

const reactRegistrationModel = mongoose.model("reactRegistration", reactRegistrationSchema)
module.exports = reactRegistrationModel