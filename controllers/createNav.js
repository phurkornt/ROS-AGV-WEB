
const get_ip = require('../config/ip_config')
const path = require('path');
const fs = require('fs');
const shell = require('shelljs')


exports.createNav = async (req, res) => {

    if( req.session.login === undefined ){
        res.redirect('/login');

    }else{
        
        const directoryPath = path.join('/home/agv/agv/map');
        let file_map = await fs.readdir(directoryPath, function (err, files) {
            if (err) {
                return console.log('Unable to scan directory: ' + err);
            } 
            let output = [];
            files.forEach(function (file) {
                if( file.search(".yaml") >= 0  ){
                    file=file.replace('.yaml','')
                    output.push(file);
                }
            });
            console.log(output);
            res.render('createNav',{
                ip:get_ip,
                status:0,
                file_map:output
            });
            
        });
        
        
    }

};
exports.launch_map = async (req, res) => {
    console.log(req.body);
    shell.exec('sh ./shell-script/open-map.sh '+ req.body.map)
    res.redirect('/createNav');
};


