const mongoose = require("mongoose")
const loginSchema = new mongoose.Schema({
   email:{
        type:String
    },
    psw:{
        type:String
    }
   
})

const loginModel= mongoose.model("login", loginSchema)
module.exports = loginModel