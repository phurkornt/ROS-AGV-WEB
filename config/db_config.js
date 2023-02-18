const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/robot',(err)=>{
    if(!err)console.log("connect");
})


const robot = new mongoose.Schema({
    name:String,
    pos:"mixed",
    color:String
})
/*
    !Note
    Status 
       0   not run
       1   create map
       2   nav map

*/
const now_process = new mongoose.Schema({
    status:Number,
    id:Number
})


module.exports.modelPos = mongoose.model('positions',robot);
module.exports.modelStatus = mongoose.model('status_process',now_process);