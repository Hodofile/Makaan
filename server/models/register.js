const mongoose = require("mongoose");
const registerSchema = new mongoose.Schema({
    uname:{
        type:String,
    },
    email:{
        type:String,
    },
    phone:{
        type:Number,
    },
    pass:{
        type:String,
    },
    confirm_pass:{
        type:String,
    },
    image:{
        type:String,
    },
    otp:{
        type:Number
    },
    npassword:{
        type:String
    }
   
})

let registerModel = mongoose.model("register", registerSchema)
module.exports = registerModel