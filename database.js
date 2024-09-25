
var mongoose = require('mongoose');

var Schema  = mongoose.Schema


let Users = new Schema({
    Name:{type:String},
    Email:{type:String},
    Password:{type:String},
    Phone:{type:String},
})

var user = mongoose.model("user",Users);


module.exports={
    user

}
