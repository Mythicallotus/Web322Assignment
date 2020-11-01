var express = require("express");
var app = express();
var path = require("path");


//var HTTP_PORT = process.env.HTTP_PORT || 8080;

app.listen(process.env.PORT || 3000, function () {
    console.log(`listening on ${process.env.PORT  || 3000}`)
  })
  
function onHttpStart(){
    console.log("Express http server is listening on:" + HTTP_PORT);
}
app.use('/public' , express.static('public'));
app.get("/", function(req, res){
    res.sendFile(path.join(__dirname,"/views/home.html"));
});

app.get("/index", function(req, res){
    res.sendFile(path.join(__dirname,"/views/index.html"));
});


//app.listen(HTTP_PORT, onHttpStart);
