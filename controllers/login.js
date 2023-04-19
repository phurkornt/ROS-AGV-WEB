

const get_ip = require('../config/ip_config')


const USER = [{
    username : "admin",
    password : "123",
    role     : "a"
}]

exports.first_route = async (req, res) => {
    
    if( req.session.login === undefined ){
        res.redirect('/login');

    }else{
        res.redirect('/navigation')

    }

};

exports.login = async (req, res) => {
    req.session.login = "login";
    if( req.session.login === undefined ){
        res.render('login',{ip:get_ip,status:0});
    }else{
        res.redirect("/navigation");
    }
};


exports.vertify_login = async (req, res) => {
    let isMatch = false;
    for(i of USER){
        if(req.body.username === i.username && req.body.password === i.password ){
            isMatch = true;
            break;
        }
    }
    if( isMatch === true){
        req.session.login = "login";
        res.redirect("/slam");
    }else{
        res.render('login',{ip:get_ip,status:1});
    }
};




