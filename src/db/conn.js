const mongoose = require("mongoose");

// creating a database
mongoose.connect("mongodb+srv://saransh:saransh123@cluster0.3oew6.mongodb.net/test?retryWrites=true&w=majority", {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("connection successful");
}).catch((error)=>{
    console.log("No Connection");
})

var conn = mongoose.Collection;