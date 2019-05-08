var express = require('express');
var Controller = require('./controllers/Controller');
var app = express();

//set up template engine - ejs module
app.set('view engine', 'ejs');

//static files
app.use(express.static('./public'));

Controller(app);
//listen to port
app.listen(5000);
console.log('You are listening to port 5000');
console.log("RADIiiii")