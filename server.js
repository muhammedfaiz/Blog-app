var express=require('express');
var app=express()
var session=require("express-session")
var user_Router=require('./routes/user')
var home_Router=require('./routes/home')
var admin_Router=require('./routes/admin')
var User=require('./models/user_Schema')
var Admin=require('./models/admin_Schema')
var bodyParser=require('body-parser')
var mongoose=require('mongoose')

mongoose.connect('mongodb://127.0.0.1/blog_app');





app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs')
app.use(express.static('./public'));
app.use('/user',user_Router);
app.use('/',home_Router);
app.use('/admin',admin_Router)

app.listen(2000)