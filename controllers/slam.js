

const get_ip = require('../config/ip_config')
const shell = require('shelljs')

const STATE = require('../config/get_status')

exports.slam = async (req, res) => {

    if( req.session.login === undefined ){
        res.redirect('/login');
    }else{
        let state = await STATE.get_status();
        res.render("createMap/scanMap",{
            ip:get_ip,
            slam:req.session.slam,
            status:state
        });
    }
};

exports.save_map = async (req, res) => {
    map_name = req.body.map_name;
    let state = await STATE.get_status();
    if( state.status == 2 ){
        STATE.set_status(0);
        shell.exec(` sh ./shell-script/save-map.sh ${map_name} `)
        shell.exec('sh ./shell-script/close-createMap.sh')
    }
    res.redirect('/slam');
};

exports.launch_slam = async (req, res) => {
    let x = req.body.x;
    let y = req.body.y;
    console.log(x,y,"DEG");
    let state = await STATE.get_status();
    if( state.status == 0 ){
        STATE.set_status(2);
        
        shell.exec(`sh ./shell-script/open-createMap.sh ${x} ${y}`)
    }
    res.redirect('/slam');
};
exports.close_slam = async (req, res) => {
    let state = await STATE.get_status();
    if( state.status == 2 ){
        console.log("DO THISS" ,shell.dirs());
        shell.exec('sh ./shell-script/close-createMap.sh')
        shell.exec('sh ./shell-script/close-createMap.sh')
        shell.exec('sh ./shell-script/close-createMap.sh')
        shell.exec('sh ./shell-script/close-createMap.sh')
        STATE.set_status(0);
    }
    res.redirect('/slam');
};