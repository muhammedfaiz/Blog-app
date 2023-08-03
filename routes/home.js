var express=require('express')
var router=express.Router()
var session=require('express-session');
var Post=require('../models/post_Schema')


router.get('/',(req,res)=>{
    
    Post.find({approved:1}).then(response=>{
        res.render("home",{data:response})
    })
})
router.get('/about',(req,res)=>{
    res.render('about')
})


module.exports=router