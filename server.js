const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const multer = require("multer");
const exphbs = require('express-handlebars');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const clientSessions = require("client-sessions");
const fs = require("fs");
const { count } = require("console");

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
var registerUser = mongoose.model("registerUser", registerUserSchema);

var registerPlaceSchema = new Schema({
  "rTilte":   { type: String, required: true },
  "price":  { type: String, required: true },
  "description":  { type: String, required: true },
  "location": { type: String, unique: true, required: true} ,
  "photoR": String
});
var registerPlace = mongoose.model("registerPlace", registerPlaceSchema);
////////////////////////////////////////////////////////////////////////////////////////


app.get("/", function(req, res){
  res.render("home", {user: req.session.user, layout: false});
});
////////////////////////////////////////////////////////////////////////////////////////
app.get("/index", function(req, res){

  registerPlace.find({})
  .exec()
  .then((places) => {
    places = places.map(value => value.toObject());
    res.render("index", {user: req.session.user, places: places, layout: false});
  });

});
////////////////////////////////////////////////////////////////////////////////////////
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync("B4c0/\/", salt);
////////////////////////////////////////////////////////////////////////////////////////
function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect("/");
  } else {
    next();
  }
}
///////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////
app.post("/register-user",  urlencodedParser, (req, res) => {
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
const password = req.body.psw;
console.log(password);
if(!email || !password)
    return res.status(400).send('email & password are required');

      registerUser.findOne({ Email: email })
      .exec()
      .then(inUser => {
        if (inUser) {

    //bcrypt.compare(password, inUser.Password),function (err, result){
      console.log("Fuck the Pop");
    //  if (result === true){
              req.session.user = {
                username: inUser["fName"] + " " + inUser["lName"],
                email: inUser["Email"],
                password: inUser["Password"]
              };
              res.redirect("/dashboard");   
           // }else {
             // return res.status(404).json({ email: "User not found" });
            //}
      // }
        }else {
          console.log("Did not crash");
        }
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
app.get("/placeMaker", ensureLogin, (req, res) => {
  res.render("placeMaker", {user: req.session.user, layout: false});
});

////////////////////////////////////////////////////////////////////////////////////////
const PHOTODIRECTORY = "./public/images/";

if (!fs.existsSync(PHOTODIRECTORY)) {
  fs.mkdirSync(PHOTODIRECTORY);
}

const storage = multer.diskStorage({
  destination: PHOTODIRECTORY,
  filename: function (req, file, cb) {
    cb(null , file.originalname);
}
});

const upload = multer({ storage: storage });


app.post("/register-newPlace",  urlencodedParser, upload.single("photo"), async (req, res) => {

  var place = new registerPlace({
    rTilte:  req.body.rTilte,
    price: req.body.price,
    description: req.body.description,
    location: req.body.location,
    photoR:  req.body.photo
  });

     place.save((err) => {
      if(err) {
        console.log("but how");
        res.render("placeMaker", {user: req.session.user, layout: false});
      } else {
        console.log("Saved New Place");
        res.render("placeMaker", {user: req.session.user, layout: false});
      }
  });
});

/////////////////////////////////////////////////////////////
app.get('/index/:placeName', (req, res) => {
  console.log(req.params.placeName);
  const rTilte = req.params.placeName;
  registerPlace.findOne({ rTilte: rTilte })
  .exec()
  .then(inPlace => {
    if (inPlace) {
            
  console.log("FunTimes");

          res.render("place", {user: req.session.user, place: inPlace.toObject(), layout: false});
       // }else {
         // return res.status(404).json({ email: "User not found" });
        //}
  // }
    }else {
      console.log("Did not crash");
    }
});
})