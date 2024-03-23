const mongoose = require("mongoose")
const studentSchema = new mongoose.Schema({
    name:{
        type:String
    },
    age:{
        type:Number
    },
    city:{
        type:String
    },
    designation:{
        type:String
    }
})

const studentModel = mongoose.model("student", studentSchema)
module.exports = studentModel