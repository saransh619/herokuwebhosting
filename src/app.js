const express = require("express");
const path = require("path");
require("./db/conn");
const User = require("./models/usermessage");
const hbs = require("hbs");
const { registerPartials } = require("hbs");

const app = express();
const port = process.env.PORT || 5000;

// paypal start
const paypal = require('paypal-rest-sdk');

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
        return_url: "https://www.nea.org.np/",
        cancel_url: "https://www.google.com/",
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: "Red Sox Hat",
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
        res.send("Success");
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

app.use(express.urlencoded({extended:false}))
app.use(express.static(staticpath))
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

//server create
app.listen(port, ()=>{
    console.log(`Server is running at port no. ${port}.`)
})



