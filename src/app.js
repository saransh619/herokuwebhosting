const express = require("express");
const path = require("path");
// require("./db/conn");
const User= require("./models/usermessage");
const UserRegister = require("./models/userregister");
const hbs = require("hbs");
const { registerPartials } = require("hbs");

const app = express();
const port = process.env.PORT || 5000;

// mongodb atlas 
// const mongoose = require('mongoose');
// const DB = 'mongodb+srv://saransh:saransh123@cluster0.3oew6.mongodb.net/MyAllData?retryWrites=true&w=majority';
// mongoose.connect(DB, {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useUnifiedTopology: true,
//   useFindAndModify: false
// }).then(()=>{
//   console.log(`Connection Successful`);
// }).catch((err)=> console.log(`no connection`));


// paypal start
const paypal = require('paypal-rest-sdk');
// const { Mongoose } = require("mongoose");

paypal.configure({
    mode: "sandbox", //sandbox or live
    client_id: "AX77Ca1a5XJXA6ZzR-atqOa6Odd7Bo8YS8h3Or-kdK7y7ZiCPdxULGEhq1O3UvU_K6P8rsZAh1eQSohv",
    client_secret: "EFVMHR5rtU22zcPvC7hrKjclpUpQTqQe1djBxf664DxgEIoM7BFnTZ2u1GMf4LhsZy4xTGrO-QW5T_PB",
  });

  app.post("/pay", (req, res) => {
    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: "https://saransh-payment-gateway.herokuapp.com/success",
        cancel_url: "https://saransh-payment-gateway.herokuapp.com/cancel",
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: "Lucifer Pachhai",
                sku: "001",
                price: "5.00",
                currency: "USD",
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: "USD",
            total: "5.00",
          },
          description: "Hat for the best team ever",
        },
      ],
    };
  
    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        throw error;
      } else {
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === "approval_url") {
            res.redirect(payment.links[i].href);
          }
        }
      }
    });
  });
  
  app.get("/success", (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
  
    const execute_payment_json = {
      payer_id: payerId,
      transactions: [
        {
          amount: {
            currency: "USD",
            total: "5.00",
          },
        },
      ],
    };
  
    paypal.payment.execute(paymentId, execute_payment_json, function (
      error,
      payment
    ) {
      if (error) {
        console.log(error.response);
        throw error;
      } else {
        console.log(JSON.stringify(payment));
        res.send("Payment Success");
      }
    });
  });
  
  app.get("/cancel", (req, res) => res.send("Cancelled"));
// paypal end 

//setting the path
const staticpath = path.join(__dirname, "../public");
const templatepath = path.join(__dirname, "../templates/views");
const partialpath = path.join(__dirname, "../templates/partials");

//middleware
app.use('/css', express.static(path.join(__dirname, "../node_modules/bootstrap/dist/css")));
app.use("/js", express.static(path.join(__dirname, "../node_modules/bootstrap/dist/js")));
app.use("/jq", express.static(path.join(__dirname, "../node_modules/jquery/dist")));

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static(staticpath));
app.set("view engine", "hbs");
app.set("views", templatepath);
hbs.registerPartials(partialpath);

//routing
//app.get(path, callback)
app.get("/", (req,res)=>{
    res.render("index");
})


app.post("/contact", async(req,res)=>{
    try{
        const userData = new User(req.body);
        await userData.save();
        res.status(201).render("index");
    }catch(error){
        res.status(500).send(error);
    }
})

app.get("/register", (req,res)=>{
  res.render("register");
})

app.get("/login", (req,res)=>{
  res.render("login");
})

// create a new user in my database 
app.post("/register", async (req,res)=>{
  try{
        const password = req.body.password;
        const cpassword = req.body.cpassword;
       if(password===cpassword){
          const newUserRegister = new UserRegister({
            fname: req.body.fname,
            lname: req.body.lname,
            us: req.body.us,
            gender: req.body.gender,
            email: req.body.email,
            contactnumber: req.body.contactnumber,
            password: password,
            cpassword: cpassword
          })
          await newUserRegister.save();
         res.status(201).render("index");
       }else{
         res.send("Password are not matching.");
       }
  }catch(error){
    res.status(400).send(error);
  }
})


// login user in my database 
app.post("/login", async (req,res)=>{
  try{
    const email = req.body.email;
    const password = req.body.password;
    const useremail = await UserRegister.findOne({email:email});
    if(useremail.password===password){
      res.status(201).render("LoginDashboard");
    }else{
      res.send("Invalid login details");
    }
  }catch(error){
    res.status(400).send("Invalid login details");
  }
})

// Logout
app.post("/logout", (req,res)=>{
  try{
      res.status(201).render("login");
    }catch(error){
    res.status(400).send(error);
  }
})



//server create
app.listen(port, ()=>{
    console.log(`Server is running at port no. ${port}.`)
})



