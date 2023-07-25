var mongoose=require('mongoose');


var reviewSchema=mongoose.Schema({
    likes:Number,
    comment:String,
    user:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    post:{type:mongoose.Schema.Types.ObjectId,ref:'Post'}
})

var Review=mongoose.model("Review",reviewSchema);

module.exports=Review