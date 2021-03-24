const mongoose = require("mongoose");
const validator = require("validator");

const userRegisterSchema = mongoose.Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    us: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
        default:null
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email Id");
            }
        }
    },
    contactnumber: {
        type: Number,
        unique:true
        
    },
    password: {
        type: String,
        minlength: 6,
        maxlength: 12,
        required: true
    },
    cpassword: {
        type: String,
        minlength: 6,
        maxlength: 12,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

//we need a collection
const UserRegister= mongoose.model("UserRegister", userRegisterSchema);

module.exports = UserRegister;