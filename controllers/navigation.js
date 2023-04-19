
const get_ip = require('../config/ip_config')
const model = require('../config/db_config')
const path = require('path');
const fs = require('fs');
const shell = require('shelljs');

const STATE = require('../config/get_status');

let node_manager = require('../config/node_manager');


let NOWPOS = 0;

async function get_file(){
    try {
        const directoryPath = path.join('/home/agv/agv/config/manage_map');
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
        let state = await STATE.get_status();
        if(req.session.nav_map === undefined){
            let file_map = await get_file();
            res.render("navigation/navConfig",{
                file_map:file_map,
                data:[],
                posNow:NOWPOS,
                ip:get_ip,
                status:state
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
    // console.log(data);
    res.send({navRoom:data})
};

exports.launch_nav = async (req, res) => {

    let state = await STATE.get_status();
    if( state.status == 0 ){
        console.log("DO this" ,req.body.map);
        STATE.set_status(3);

        node_manager.send_data({
            topic:"opennav",
            script:`roslaunch /home/agv/agv/config/manage_launch/navigation-p-test.launch`,
            mode:"start"
        });


        // shell.exec('sh ./shell-script/open-navMap.sh')
        setTimeout(function() {
            node_manager.send_data({
                topic:"nav_map",
                script:`rosrun map_server map_server /home/agv/agv/config/manage_map/${req.body.map}.yaml`,
                mode:"start"
            });
        }, 500);
        
        req.session.nav = "on";
        req.session.nav_map = req.body.map;
        res.redirect('move');
    }else{
        res.redirect('navigation');
    }
};



exports.navigation_move = async (req, res) => {

    let NavRoom = await model.modelNavRoom.find({"map":req.session.nav_map})
    console.log(req.session.nav_map);
    console.log(NavRoom);
    if( req.session.nav_plan !== undefined){

        let nav_stack = await model.modelNavPos.findOne();
        let get_pos = await model.modelNavRoom_out.find({
            nav_room_name:nav_stack.plan
        })

        console.log("test",get_pos);
        let now_pos = nav_stack.pos;
        // WHEN MOVING
        // Qurey pos and now_pos
        res.render("navigation/navMap",{
            data:NavRoom,
            name_map:req.session.nav_map,
            isMoving:1,
            get_pos:get_pos,
            now_pos:now_pos,
            ip:get_ip

        });

    }else{
        
        res.render("navigation/navMap",{
            data:NavRoom,
            name_map:req.session.nav_map,
            isMoving:0,
            ip:get_ip
        });
    }
};
exports.navigation_moving = async (req, res) => {

    req.session.nav_plan = req.body.plan
    STATE.set_pos(0,req.body.map,req.body.plan);

    console.log("DE " , req.body);
    res.redirect("move");

};

exports.update_navigation_moving = async (req, res) => {
    STATE.set_pos(req.body.posNow);
    // console.log("DE " , req.body);
    res.send({status:1})
};

exports.cancle_navigation_moving = async (req, res) => {
    req.session.nav_plan = undefined;
    STATE.set_pos(0,'',''); 
    res.send({status:1})
};




exports.close_navigation = async (req, res) => {

    let state = await STATE.get_status();
    if( state.status == 3 ){
        req.session.nav_map = undefined;
        req.session.nav_plan = undefined;
        STATE.set_status(0);

        node_manager.send_data({
            topic:"opennav",
            mode:"stop"
        });
        setTimeout(function() {
            node_manager.send_data({
                topic:"nav_map",
                mode:"stop"
            });
        }, 500);
        
        // shell.exec('sh ./shell-script/open-navMap.sh')
        // shell.exec('sh ./shell-script/close-navMap.sh')
        // shell.exec('sh ./shell-script/close-map.sh ')
    }
    res.redirect('/navigation');

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
    // NOWPOS = req.params.pos;
    // console.log("nowpos : ",NOWPOS);
    // // if( dataset.length < NOWPOS)NOWPOS = 0;
    // res.redirect('/navigation')
};