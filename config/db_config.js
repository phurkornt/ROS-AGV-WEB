const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/robot',(err)=>{
    if(!err)console.log("connect");
})

const robot = new mongoose.Schema({
    name:String,
    pos:"mixed",
    color:String
})

const nav_room = new mongoose.Schema({
    name:String,
    map:String
})
const nav_room_out = new mongoose.Schema({
    name:String,
    pos:"mixed",
    color:String,
    nav_room_name:String,
    option:Number
})
const nav_room_back = new mongoose.Schema({
    pos:"mixed",
    color:String,
    nav_room_name:String
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

module.exports.modelNavRoom = mongoose.model('NavRoom',nav_room);
module.exports.modelNavRoom_out = mongoose.model('NavRoom_out',nav_room_out);
module.exports.modelNavRoom_back = mongoose.model('NavRoom_back',nav_room_back);