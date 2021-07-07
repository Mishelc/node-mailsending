// Add the express web framework
const express = require("express");
const app = express();

// Use body-parser to handle the POST data
const bodyParser = require("body-parser");
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);

const dotenv = require('dotenv').config();

const nodemailer = require("nodemailer");
var sent = false;
//setup nodemailer
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.email,
      pass: process.env.password
    }
  });

//get route to send mail, from form
app.post("/send-mail", function(req,res){
     var to = req.body.to,
         subject = req.body.subject, 
         message = req.body.message;
     //options
     const mailOptions = {
          from: process.env.email,
          to: to,                   // from req.body.to
          subject: subject,         //from req.body.subject
          html: message             //from req.body.message
      };
     //delivery
     transporter.sendMail(mailOptions, function(error, info){
          if (error) {
              console.log(error);  
          } else { 
          	  sent=true;
              console.log('Email sent: ' + info.response);
              res.redirect('/');
          }   
     });
});
      
// We want to extract the port to publish our app on
let port = process.env.PORT || 8080;

app.set('views', './public');
app.set('view engine', 'ejs');
// We can now set up our web server. First up we set it to serve static pages
app.use(express.static(__dirname + "/public"));


app.get('/', (req, res)=>{
	res.render('index', {sent: sent});
});

// Listen for a connection.
app.listen(port, function() {
    console.log("Server is listening on port " + port);
});