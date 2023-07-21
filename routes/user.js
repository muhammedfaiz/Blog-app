var express=require('express')
const User = require('../models/user_Schema')
var session=require('express-session');
var router=express.Router()

router.use(function(req,res,next){
    res.setHeader("Cache-Control","no-cache,no-store,must-revalidate");
    res.setHeader("Pragma","no-cache");
    res.setHeader("Expires","0");
    next();

})

router.use(
    session({
        secret:"secret-key",
        resave:false,
        saveUninitialized:true,
        cookie:{secure:false},

    })
)


router.get('/signup',(req,res)=>{
    res.render('registration')
})

router.post('/signup',(req,res)=>{
    var userInfo=req.body;
    User.findOne({email:userInfo.email}).then(response=>{
        if(response){
            res.render('registrationcd..',{message:"User already existed!"})
        }else{
            var newUser=new User({
                name:userInfo.name,
                email:userInfo.email,
                password:userInfo.password,
                date:new Date(),
                type:1,
                approved:1

            })
            newUser.save().then(response=>{
                req.session.user=newUser;
                res.redirect('/user')
            })
        }
        
    })
   var user_session=req.session
})



router.get('/login',(req,res)=>{
    res.render('login');    
})

router.post('/login',(req,res)=>{
    var loginInfo=req.body
    User.findOne({email:loginInfo.email}).then(response=>{
        if(!response){
            res.render('login',{message:'Enter Valid Email..'})
        }
        else if(response.password==loginInfo.password){
            if(response.approved===1){
                req.session.user=response;
                res.redirect('/user');
            }else{
                res.render('login',{message:"You are Disapproved"})
            } 
        }
        else{
            res.render('login',{message:'Incorrect User Password '})
        }
    }).catch(error=>{
        res.json(error)
    })
})


router.get('/',(req,res)=>{
    if(req.session.user){
        res.render('user_home')
    }else{
        res.redirect('/')
    }
})
router.get('/logout',(req,res)=>{
    req.session.destroy()
    res.redirect('/user/login');
})


    module.exports=router;