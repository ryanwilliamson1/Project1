var express = require('express');
var app = express();
var path=require('path')
//var router = express.Router();

//router-> step1: require userVerify.js
var userAuth = require('./user_controller/userVerify.js');

require("./node_modules/bson/lib/bson/bson.js");

var publicPath=path.resolve(__dirname, "static"	);
var orderFs=require("./db_controller/dbOrders.js")
var menuFs=require('./db_controller/dbMenu.js')
app.use(express.static(publicPath))

var bodyParser = require('body-parser')
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var bson = require("./node_modules/bson/lib/bson/bson.js");


var session=require('express-session')
var sess = {
  secret: 'keyboard cat',
  cookie: {}
}
app.use(session(sess))


var MongoClient = require('mongodb').MongoClient;
var db,menu;
var dbURL="mongodb://pizza1:pizza1@localhost:27017/pizzadb"


MongoClient.connect(dbURL, 
					function(err, database) {
  if(err) throw err;

  db=database.db("pizzadb")
 
  // Start the application after the database connection is ready
  app.listen(8000);
  console.log("Listening on port 8000");
});

app.get('/', function(req, res){
  res.sendFile(`${publicPath}/index.html`);
});

app.get('/adminLogin',function (req,res) {
  res.sendFile(`${publicPath}/adminLogin.html`)
  /* body... */
})
app.get('/menu',function (req, res) {
	   var query={}
      findMenuItems(res,query)
})
app.get('/menus', function(req,res){
  if(req.session.user)
    res.sendFile(`${publicPath}/adminMenus.html`)
  else
    res.sendFile(`${publicPath}/adminLogin.html`)
})
app.post("/updateMenu",function(req,res){
  console.log(req.body)
  var data=req.body
  //var query={_id: ObjectId(data._id)}
  var query={_id: bson.ObjectId(data._id)}
  var update={$set:{pizzaName:data.pizzaName,
                    description:data.description,
                    price:data.price,
                    imgName:data.imgName}}
  menuFs.updateMenu(res,query,update)
})

app.post("/removeOrder",function(req,res){
  console.log(req.body)
  var data=req.body
  //var query={_id: ObjectId(data._id)}
  var query={_id: bson.ObjectId(data._id)}
  
  orderFs.deleteOrders(res,query)
})
//demo orders.html, only valid user can access orders.html
app.get('/orders', function(req,res){
  console.log('/orders')
  if (req.session.user)
    res.sendFile(`${publicPath}/orders.html`)
  else
    res.sendFile(`${publicPath}/adminLogin.html`)
})


//demo destroy session when get /logout
app.get('/logout',function(req,res){
  req.session.destroy(function(){
    console.log('destroy the session')
    res.redirect('/adminLogin')
  })
  /* body...*/
})



app.get('/showOrders',function(req,res){
var query={}
      findOrderItems(res,query)
})



//router step2: use the router, userAuth
app.use('/adminLogin', userAuth)

// app.post("/login",function (req,res) {
//    body... 
//  console.log('login with post')
// })  

function findMenuItems(res,query)
{
  console.log(query)
  db.collection("menu").find(query).toArray(function (err,results) {
 
    console.log(results)
    
    res.json(results)
  })

}


function findOrderItems(res,query)
{

  db.collection("orders").find(query).toArray(function (err,results) {
 
    console.log(results)
    
    res.writeHead(200);
    res.end(JSON.stringify(results))
  })
}


//two functions to export db and publicPath
getPublicPath =function(){
  return publicPath
}
var getDb=function(){
  return db;
}
module.exports.getDb=getDb
module.exports.getPublicPath=getPublicPath