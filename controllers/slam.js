

const get_ip = require('../config/ip_config')
const shell = require('shelljs')

const STATE = require('../config/get_status')

exports.slam = async (req, res) => {

    if( req.session.login === undefined ){
        res.redirect('/login');
    }else{
        res.render("createMap/scanMap",{
            ip:get_ip,
            slam:req.session.slam
        });
    }
};

exports.save_map = async (req, res) => {
    map_name = req.body.map_name;
    // shell.exec('sh ./shell-script/close-createMap.sh')
    res.redirect('/slam');
};

exports.launch_slam = async (req, res) => {
    shell.exec('sh ./shell-script/open-createMap.sh')
    res.redirect('/slam');
};