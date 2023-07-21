var express=require('express');
var mongoose=require('mongoose');

var userSchema=mongoose.Schema({
    name:String,
    email:String,
    password:String,
    date:Date,
    type:Number,
    approved:Number
})

var User=mongoose.model('User',userSchema);

module.exports=User;