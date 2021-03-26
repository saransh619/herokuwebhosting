const mongoose = require("mongoose");
const validator = require("validator");
// creating a database
mongoose.connect("mongodb+srv://saransh:saransh123@cluster0.3oew6.mongodb.net/testing?retryWrites=true&w=majority", {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("connection successful");
}).catch((error)=>{
    console.log("No Connection");
})

var conn = mongoose.Collection;

const userSchema = mongoose.Schema({
    name: {
        type:String,
        required:true,
        minLength:3
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email Id")
            }
        }
    },
    phone:{
        type:Number,
        min:10,
        required:true,
        unique:true
    },
    message:{
        type:String,
        required:true,
        minLength:3
    },
    date:{
        type:Date,
        default:Date.now
    }
})

//we need a collection
const User = mongoose.model("User",userSchema);

module.exports = User;
