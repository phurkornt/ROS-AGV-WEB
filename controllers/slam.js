

const get_ip = require('../config/ip_config')
const shell = require('shelljs')

const STATE = require('../config/get_status')

var node_manager = require('../config/node_manager');



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

        node_manager.send_data({
            topic:"savemap",
            script:`rosrun map_server map_saver -f /home/agv/agv/config/manage_map/${map_name}`,
            mode:"once"
        });
        
        setTimeout(() => {
            node_manager.send_data({
                topic:"createmap",
                mode:"stop"
            });
        }, 500);

        // const dataset2={
        //     topic:"savemap",
        //     mode:"stop"
        // }
        // node_manager.send_data(dataset2);
        // 
        // shell.exec(` sh ./shell-script/save-map.sh ${map_name} `)
        // shell.exec('sh ./shell-script/close-createMap.sh')
    }
    res.redirect('/slam');
};

exports.launch_slam = async (req, res) => {
    let x = req.body.x;
    let y = req.body.y;
    console.log(x,y,"DEG");
    let state = await STATE.get_status();
    if( state.status == 0 ){
        
        console.log("DEG Create");
        STATE.set_status(2);    
        const dataset={
            topic:"createmap",
            script:`roslaunch /home/agv/agv/config/manage_launch/createmap.launch xmin:=${-x} ymin:=${-y} xmax:=${x} ymax:=${y}`,
            mode:"start"
        }
        node_manager.send_data(dataset);

        // shell.exec(`sh ./shell-script/open-createMap.sh ${x} ${y}`)
    }
    res.redirect('/slam');
};
exports.close_slam = async (req, res) => {
    let state = await STATE.get_status();
    if( state.status == 2 ){
        const dataset={
            topic:"createmap",
            mode:"stop"
        }
        node_manager.send_data(dataset);
        STATE.set_status(0);
    }
    res.redirect('/slam');
};