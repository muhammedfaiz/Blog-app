var mongoose=require('mongoose')


var managerSchema=mongoose.Schema({
    email:String,
    password:String,
    category:String,
    approved:Number
})

var Manager=mongoose.model('Manager',managerSchema);



module.exports=Manager;