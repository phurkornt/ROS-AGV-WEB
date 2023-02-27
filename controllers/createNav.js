
const get_ip = require('../config/ip_config')
const path = require('path');
const fs = require('fs');
const shell = require('shelljs')

const model = require('../config/db_config')

const STATE = require('../config/get_status')


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

exports.createNav = async (req, res) => {



    if( req.session.login === undefined ){
        res.redirect('/login');
    }else{
        let state = await STATE.get_status();
        
        let file_map = await get_file();
        if( req.query.map != undefined ){
            let NavRoom = await model.modelNavRoom.find({"map":req.query.map})
            res.render('createNav/createNav',{
                ip:get_ip,
                file_map:file_map,
                select_map:req.query.map,
                NavRoom:NavRoom,
                status:state
            });

        }else if( req.session.map != undefined ){
            let NavRoom = await model.modelNavRoom.find({"map":req.session.map})
            res.render('createNav/createNav',{
                ip:get_ip,
                file_map:file_map,
                select_map:req.session.map,
                NavRoom:NavRoom,
                status:state
            });
        }else{
            res.render('createNav/createNav',{
                ip:get_ip,
                file_map:file_map,
                status:state
            });
        }

    }
};


exports.nav_room = async (req, res) => {
    let posOut = await model.modelNavRoom_out.find({"nav_room_name":req.query.name_room})
    for(let i = 0;i<posOut.length ; i++){
        posOut[i] = posOut[i].toObject(); 
    }
    
    res.render('createNav/nav_room',{
        ip:get_ip,
        name_room:req.query.name_room,
        name_map:req.query.name_map,
        posOut:posOut
    });


};


exports.insert_nav = async (req, res) => {
    // await model.modelNavRoom.insertMany([{
    //     name:req.body.name_room,
    //     map:req.body.name_map
    // }]);
    res.render(`createNav/insert`,{
        ip:get_ip,
        name_room:req.query.name_room,
        name_map:req.query.name_map
    });
};
exports.delete_nav = async (req, res) => {
    await model.modelNavRoom_out.deleteOne({
        "_id":req.query.id
    });
    console.log(req.query);
    res.redirect(`/createNav/nav_room/?name_room=${req.query.name_room}&name_map=${req.query.name_map}`)
};
exports.update_nav = async (req, res) => {
    let data = await model.modelNavRoom_out.findById(req.query.id)
    res.render(`createNav/update`,{
        ip:get_ip,
        name_room:req.query.name_room,
        name_map:req.query.name_map,
        data:data
    });

};




exports.insert_nav_action = async (req, res) => {
    console.log(req.body);
    let posi = JSON.parse(req.body.pos)
    // console.log(posi.pos);
    
    await model.modelNavRoom_out.insertMany([{
        name:req.body.name,
        nav_room_name:req.body.name_room,
        pos:posi.pos,
        color:req.body.color,
        option:req.body.option
    }]);
    res.send({state:1});
};
exports.update_nav_action = async (req, res) => {
    console.log(req.body);
    let posi = JSON.parse(req.body.pos)
    let id =req.body.id;
    let doc ={
        name:req.body.name,
        pos: posi.pos,
        color:req.body.color,
        option:req.body.option
    }

    model.modelNavRoom_out.findByIdAndUpdate( id , doc , function(err){
        if(!err){
            // console.log("Done Save");
            res.send({state:1});
        }
    });
    // res.send({state:1});
};


exports.insert_room = async (req, res) => {
    await model.modelNavRoom.insertMany([{
        name:req.body.name_room,
        map:req.body.name_map
    }]);

    res.redirect(`/createNav/?map=${req.body.name_map}`);


};

exports.delete_room = async (req, res) => {
    await model.modelNavRoom.deleteOne({
        name:req.query.name_room
    });

    res.redirect(`/createNav/?map=${req.query.name_map}`);


};



exports.launch_map = async (req, res) => {
    let state = await STATE.get_status();
    if( state.status == 0 ){
        STATE.set_status(1);

        req.session.map = req.body.map;
        shell.exec('sh ./shell-script/close-map.sh ')
        shell.exec('sh ./shell-script/open-map.sh '+ req.body.map)

        res.redirect(`/createNav/?map=${req.body.map}`);
        
    }else{
        res.redirect(`/createNav`);
    }
};
exports.close_map = async (req, res) => {
    let state = await STATE.get_status();
    if( state.status == 1 ){
        req.session.map = undefined
        shell.exec('sh ./shell-script/close-map.sh ')
        STATE.set_status(0);
    }
    res.redirect(`/createNav`);
};


