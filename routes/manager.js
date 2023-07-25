var express=require('express');
var router=express.Router()
var Manager=require('../models/manager_Schema')
var session=require('express-session')
var Post=require("../models/post_Schema")


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

router.get('/', (req, res) => {
    Post.find({ topic: req.session.manager.category }).then(response => {
        const unapprovedPost = response.filter(post => post.approved == 0)
        if (!response ||unapprovedPost.length === 0) {
            res.render('manager', { message: "You are up to Date" })
        } else {
            res.render('manager', { data: unapprovedPost })
        }
    }).catch(error => {
        console.error("Error fetching data:", error);
        res.render('manager', { message: "Error fetching data. Please try again later." });
    });
})



router.get('/login',(req,res)=>{
    res.render('login')
})

router.post('/login',(req,res)=>{
    var info=req.body;
    Manager.findOne({email:info.email}).then(response=>{
        if(!response){
            res.render('login',{message:"Invalid Manager Id"});
        }else if(response.password==info.password){
            if(response.approved==1){
                req.session.manager=response;
                res.redirect('/manager');
            }else{
                res.render('login',{message:"Admin disapproved"})
            }
        }else{
            res.render('login',{message:"Invalid Password"});
        }
    })
})

router.get('/readmore/:id',(req,res)=>{
    var id =req.params.id;
    Post.findById(id).then(response=>{
        res.render('managerRead',{blog:response})
    })
})

router.post('/readmore/:id',(req,res)=>{
    var id=req.params.id;
    var info=req.body;
    Post.findByIdAndUpdate(id,{approved:info.approved}).then(response=>{
        res.redirect('/manager')
    })
})


router.get('/logout',(req,res)=>{
    req.session.destroy()
    res.redirect('/')
})

router.get("/approved",(req,res)=>{
    var category=req.session.manager.category
    Post.find({approved:1,topic:category}).then(response=>{
        res.render('approveManager',{data:response})
    })
})
router.get("/declined",(req,res)=>{
    
    var category=req.session.manager.category
    Post.find({approved:-1,topic:category}).then(response=>{
        res.render('declineManager',{data:response});
    })
})
module.exports=router
