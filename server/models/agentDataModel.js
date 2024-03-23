const mongoose = require("mongoose")
const agentDataSchema = new mongoose.Schema({
   email:{
    type: String
   },
   role:{
    type:String
   }
})

const agentDataModel = mongoose.model("agentData", agentDataSchema)
module.exports = agentDataModel