const mongoose = require("mongoose")
const agentSchema = new mongoose.Schema({
    name:{
        type:String
    },
    desi: {
        type:String
    },
    fb: {
        type:String
    },
    insta:{
        type:String
    },
    tweet: {
        type:String
    },
    img:{
        type:String
    },
    aemail:{
        type:String
    },
    apass:{
        type:String
    },
    role:{
        type:String
    }
})

const agentTable = mongoose.model("agent_property", agentSchema)
module.exports = agentTable