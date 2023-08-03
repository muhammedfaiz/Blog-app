var mongoose=require('mongoose');


var reviewSchema=mongoose.Schema({
    rate:Number,
    comment:String,
    userName:String,
    postId:String
})

var Review=mongoose.model("Review",reviewSchema);

module.exports=Review