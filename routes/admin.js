var express=require('express');
var Admin=require('../models/admin_Schema')
var User=require('../models/user_Schema')
var Manager=require('../models/manager_Schema')
var router=express.Router()


router.get('/',(req,res)=>{
    User.find().sort({_id:-1}).then(response=>{
        res.render('admin',{usr:response});
    })
})

router.get('/login',(req,res)=>{
    res.render('login');
});

router.post('/login',(req,res)=>{
    var adminInfo=req.body
    
    Admin.findOne({email:adminInfo.email}).then(response=>{
        if(!response){
            res.render('login',{message:'invalid admin email..'})
        }else if(response.password==adminInfo.password){
            res.redirect('/');
        }else{
            res.render('login',{message:'invalid password'})
        }
    }).catch(err=>{
        res.json(err);
        console.log(err)
    })
})

router.get('/logout',(req,res)=>{
    res.redirect('/admin/login')
})
router.get('/edit/:id',(req,res)=>{
    var id=req.params.id;
    User.findById(id).then(response=>{
        res.render('editUser',{user:response})
    })
    
})
router.post('/edit/:id',(req,res)=>{
    
    var update=req.body
    User.findByIdAndUpdate(req.params.id,{
        name:update.name,
        email:update.email,
        password:update.password,
        type:update.type,
        approved:update.approved
       }).then(response=>{
        res.redirect('/admin')
    })
})


router.get('/addManager',(req,res)=>{
    res.render('addManager')
})

router.post('/addManager',(req,res)=>{
    var info=req.body;
    var newManger=new Manager({
        email:info.email,
        password:info.password,
        category:info.category,
        approved:1
    })

    newManger.save().then(response=>{
        console.log(response)
        res.redirect('/admin');
    })
})
router.get('/viewManager',(req,res)=>{
    Manager.find().sort({_id:-1}).then(response=>{
        res.render('viewManager',{mngr:response})
    })
    
})

router.get('/editManager/:id',(req,res)=>{
    var id=req.params.id
    Manager.findById(id).then(response=>{
        res.render('editManager',{manager:response});
    })
   
})

router.post('/editManager/:id',(req,res)=>{
    var id=req.params.id
    var info=req.body
    Manager.findByIdAndUpdate(id,{
        email:info.email,
        password:info.password,
        category:info.category,
        approved:info.approved
    }).then(response=>{
        res.redirect('/admin/viewManager')
    })
})
module.exports=router