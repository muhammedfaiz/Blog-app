var mongoose=require('mongoose');


var postSchema=mongoose.Schema({
    title:String,
    description:String,
    topic:String,
    content:String,
    date:String,
    approved:Number,
    userId:String,
    userName:String,
    review:[{type:mongoose.Schema.Types.ObjectId,ref:"Review"}]
})

var Post=mongoose.model('Post',postSchema);

module.exports=Post;