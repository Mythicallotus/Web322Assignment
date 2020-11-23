const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const muter = require("multer");
const exphbs = require('express-handlebars');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const clientSessions = require("client-sessions");
app.use('/public' , express.static('public'));
//var HTTP_PORT = process.env.HTTP_PORT || 8080;

app.engine('.hbs', exphbs({ extname: '.hbs'}));
app.set("views", "./public/views");
app.set('view engine', '.hbs');


app.listen(process.env.PORT || 3000, function () {
    console.log(`listening on ${process.env.PORT  || 3000}`)
  })
  /////////////////////////////////////////////////////////////////////////////////////
  app.use(clientSessions({
    cookieName: "session", // this is the object name that will be added to 'req'
    secret: "week10example_web322", // this should be a long un-guessable string.
    duration: 2 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
    activeDuration: 1000 * 60 // the session will be extended by this many ms each request (1 minute)
  }));
////////////////////////////////////////////////////////////////////////////////////////

// connect to the localhost mongo running on default port 27017
const MONGODB_URL = 'mongodb+srv://dbUser:Qb4gwfwj6!@@senecaweb.fu4fp.mongodb.net/<dbname>?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URL || "mongodb://localhost/web322",
{useNewUrlParser: true,
  useCreateIndex: true,
useUnifiedTopology: true
});
mongoose.connection.on('connected', () => {
  console.log("Plz God Work !!!");
});

////////////////////////////////////////////////////////////////////////////////////////
var registerUserSchema = new Schema({
  "fName":   { type: String, required: true },
  "lName":  { type: String, required: true },
  "Password":  { type: String, required: true },
  "Email":{
    "type": String,
    "unique": true
  },
  "bData": String
});
////////////////////////////////////////////////////////////////////////////////////////
var registerUser = mongoose.model("registerUser", registerUserSchema);

app.get("/", function(req, res){
  res.render('home', {
    layout: false
  });
});
////////////////////////////////////////////////////////////////////////////////////////
app.get("/index", function(req, res){
  res.render('index', {
    layout: false
  });
});
////////////////////////////////////////////////////////////////////////////////////////
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync("B4c0/\/", salt);
////////////////////////////////////////////////////////////////////////////////////////
function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect("/#login");
  } else {
    next();
  }
}
////////////////////////////////////////////////////////////////////////////////////////
app.post("/register-user",  urlencodedParser, (req, res) => {
  //var dateMade = req.body.dob-day + "/" + req.body.dob-month + "/" + req.body.dob-year;
  var user2 = new registerUser({
    fName:  req.body.fName,
    lName: req.body.lName,
    Password: req.body.password,
    Email: req.body.email,
    bData: " " //dateMade
  });

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user2.Password, salt, (err,hash) =>{
     user2.Password = hash;
     user2.save((err) => {
      if(err) {
        console.log("Big Sad");
        res.redirect("/home");
      } else {
        console.log("Saved Big Play");
        req.session.user = {
          username: user2["fName"] + " " + user2["lName"],
          email: user2["Email"]
        };
        res.redirect("/dashboard");
      }
    });
  });

  });
  });
////////////////////////////////////////////////////////////////////////////////////////
  app.post("/login-user",  urlencodedParser, (req, res) => {
const email = req.body.email;
const password = req.body.password;

      registerUser.findOne({ Email: email })
      .exec()
      .then((inUser) => {
          req.session.user = {
            username: inUser["fName"] + " " + inUser["lName"],
            email: inUser["Email"]
          };
          res.redirect("/dashboard");     
    });
  });
////////////////////////////////////////////////////////////////////////////////////////
  app.get("/dashboard", ensureLogin, (req, res) => {
    res.render("dashboard", {user: req.session.user, layout: false});
  });
////////////////////////////////////////////////////////////////////////////////////////
  app.get("/logout", function(req, res) {
    req.session.reset();
    res.redirect("/");
  });
////////////////////////////////////////////////////////////////////////////////////////