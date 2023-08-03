var express=require('express')
const User = require('../models/user_Schema')
var session=require('express-session');
var router=express.Router()
var Post=require('../models/post_Schema');
var Category=require('../models/category_Schema');
var Review=require('../models/review_Schema')

router.use(function(req,res,next){
    res.setHeader("Cache-Control","no-cache,no-store,must-revalidate");
    res.setHeader("Pragma","no-cache");
    res.setHeader("Expires","30000");
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
        Post.find({approved:1}).then(response=>{
            res.render('user_home',{data:response})
        })
        
    }else{
        res.redirect('/')
    }
})

router.get("/readMore/:id",(req,res)=>{
    var id = req.params.id
    Post.findById(id).then(response=>{
        var postId=response._id
        Review.find({postId:postId}).then((result)=>{
            res.render("userRead",{blog:response,comment:result})
        })
    })
})

router.get('/logout',(req,res)=>{
    req.session.destroy()
    res.redirect('/user/login');
})

router.get('/createPost',(req,res)=>{
    Category.find().then(response=>{
        res.render('createPost',{cat:response});
    })
    
})
router.post('/createPost',(req,res)=>{
    var info=req.body;
    var d=new Date()
        month = '/' + (d.getMonth() + 1),
        day = d.getDate(),
        year = '/'+d.getFullYear();
    var time=day+''+month+""+year;
    var userId=req.session.user._id
    var userName=req.session.user.name
    var newPost=new Post({
        title:info.title,
        description:info.description,
        content:info.content,
        topic:info.topic,
        date:time,
        approved:0,
        userId:userId,
        userName:userName
    })

    newPost.save().then(response=>{
        console.log(response)
        res.redirect('/user')
    })
    
})

router.get('/managePost', (req, res) => {
    var id = req.session.user._id
    Post.find({ userId: id }).then(response => {
            res.render('managePost',{data:response})
    })
})

router.get("/editPost/:id",(req,res)=>{
    var id=req.params.id
    Post.findById(id).then(response=>{
        res.render("editPost",{data:response})
    })
})

router.post("/editPost/:id",(req,res)=>{
    var id=req.params.id
    var info=req.body
    Post.findByIdAndUpdate(id,{
        title:info.title,
        description:info.description,
        topic:info.topic,
        content:info.content,
        approved:0
    }).then(response=>{
        res.redirect("/user/managePost")
    })
})

router.get("/deletePost/:id",(req,res)=>{
    var id = req.params.id
    Post.deleteOne({_id:id}).then(response=>{
        res.redirect('/user/managePost')
    })
})

router.post('/comment/:id',(req,res)=>{
    var postId=req.params.id
    var info=req.body
    var userName=req.session.user.name
      
    
    var newReview=new Review({
        comment:info.comment,
        userName:userName,
        postId:postId
    })
    newReview.save().then(response=>{
        res.redirect(`/user/readMore/${postId}`)
    })

})
    module.exports=router;