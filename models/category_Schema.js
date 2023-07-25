var mongoose=require('mongoose');

var categorySchema=mongoose.Schema({
    topic:String
})

var Category=mongoose.model('Category',categorySchema)

module.exports=Category
