
const get_ip = require('../config/ip_config')
const model = require('../config/db_config')
const path = require('path');
const fs = require('fs');
const shell = require('shelljs');



let NOWPOS = 0;

async function get_file(){
    try {
        const directoryPath = path.join('/home/agv/agv/map');
        let files = await fs.promises.readdir(directoryPath);
        let output = [];
        files.forEach(function (file) {
            if( file.search(".yaml") >= 0  ){
                file=file.replace('.yaml','')
                output.push(file);
            }
        });
        return output ;

    } catch (err) {
        console.error('Error occurred while reading directory!', err);
        return [];
    }
}

exports.navigation = async (req, res) => {
    if( req.session.login === undefined ){
        res.render('login',{ip:get_ip,status:0});
    }else{
        if(req.session.nav_map === undefined){
            let file_map = await get_file();
            res.render("navigation/navConfig",{
                file_map:file_map,
                data:[],
                posNow:NOWPOS,
                ip:get_ip
            });
        }else{
            res.redirect('/navigation/move')
        }
        
    }
};

exports.get_navroom = async (req, res) => {
    console.log(req.query);
    let navRoom = await model.modelNavRoom.find({"map":req.query.select_map})
    let data =[]
    for(let i of navRoom){
        data.push(i.name)
    }
    console.log(data);
    res.send({navRoom:data})
};

exports.launch_nav = async (req, res) => {

    
    console.log("debug",req.body);
    shell.exec('sh ./shell-script/open-navMap.sh')
    req.session.nav = "on";
    req.session.nav_map = req.body.map;
    req.session.nav_plan = req.body.plan;

    res.redirect('move');
};

exports.navigation_move = async (req, res) => {
    let posOut = await model.modelNavRoom_out.find({"nav_room_name":req.session.nav_plan})
    for(let i = 0;i<posOut.length ; i++){
        posOut[i] = posOut[i].toObject(); 
    }
    console.log(posOut);

    res.render("navigation/navMap",{
        data:posOut,
        name_map:req.session.nav_map,
        name_room:req.session.nav_plan,
        posNow:NOWPOS,
        ip:get_ip
    });
};

exports.insert_post = async (req, res) => {
    let posi = JSON.parse(req.body.pos)
    let doc ={
        name:req.body.name,
        pos: posi.pos,
        color:req.body.color
    }
    // JSON.parse(req.body.pos)

    model.modelPos.create(doc,(err)=>{
        if(!err){
            res.send({state:1});
        }
        
    })
};
exports.insert_get = async (req, res) => {
    res.render('insert',{data:1,ip:get_ip});
};
exports.delete = async (req, res) => {
    console.log(req.body.delete);
    model.modelPos.findByIdAndDelete(req.body.delete , function(err){
        if(!err){
            res.redirect('/');
        }
    });
};

exports.update_post = async (req, res) => {
    let posi = JSON.parse(req.body.pos)
    let id =req.body.id;
    let doc ={
        name:req.body.name,
        pos: posi.pos,
        color:req.body.color
    }
    // JSON.parse(req.body.pos)
    model.modelPos.findByIdAndUpdate( id , doc , function(err){
        if(!err){
            // console.log("Done Save");
            res.send({state:1});
        }
    });
};
exports.update_get = async (req, res) => {
    let id = req.query.id;
    model.modelPos.findById(id,function(err,doc){
        if(!err){
            res.render("update",{data:doc,ip:get_ip});
        }
    })
};
exports.move = async (req, res) => {
    NOWPOS = req.params.pos;
    console.log("nowpos : ",NOWPOS);
    // if( dataset.length < NOWPOS)NOWPOS = 0;
    res.redirect('/navigation')
};