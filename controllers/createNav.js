
const get_ip = require('../config/ip_config')
const path = require('path');
const fs = require('fs');
const shell = require('shelljs')

const model = require('../config/db_config')


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

        let file_map = await get_file();
        if(req.query.map === undefined){
            if(file_map.length > 0){

                res.render('createNav',{
                    ip:get_ip,
                    file_map:file_map
                });

            }else {
                res.render('createNav',{
                        ip:get_ip,
                        file_map:file_map
                });
            }
        }else{

            console.log(req.query.map,"FF");

            // get
            let NavRoom = await model.modelNavRoom.find({"map":req.query.map})
            // console.log(NavRoom);
            // action

            res.render('createNav',{
                ip:get_ip,
                file_map:file_map,
                select_map:req.query.map,
                NavRoom:NavRoom
            });
        }

        
        
    }
};


exports.nav_room = async (req, res) => {
    let posOut = await model.modelNavRoom_out.find({"nav_room_name":req.query.name_room})
    for(let i = 0;i<posOut.length ; i++){
        posOut[i] = posOut[i].toObject(); 
    }
    console.log(posOut);

    res.render('nav_room',{
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
    res.render(`insert`,{
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


exports.insert_nav_action = async (req, res) => {
    console.log(req.body);
    let posi = JSON.parse(req.body.pos)
    // console.log(posi.pos);

    await model.modelNavRoom_out.insertMany([{
        name:req.body.name,
        nav_room_name:req.body.name_room,
        pos:posi.pos,
        color:req.body.color
    }]);
    res.send({state:1});
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
    console.log(req.body);
    shell.exec('sh ./shell-script/close-map.sh ')
    shell.exec('sh ./shell-script/open-map.sh '+ req.body.map)
    res.redirect(`/createNav/?map=${req.body.map}`);
};


