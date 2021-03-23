const mongoose = require("mongoose");

// creating a database
mongoose.connect("mongodb://localhost:27017/saranshdynamic", {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("connection successful");
}).catch((error)=>{
    console.log("No Connection");
})