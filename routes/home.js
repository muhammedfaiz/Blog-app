var express=require('express')
var router=express.Router()
var session=require('express-session');
var user_Sessoin=require('./user')


router.get('/',(req,res)=>{
    res.render('home')
})


module.exports=router