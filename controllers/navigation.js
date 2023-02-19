
const get_ip = require('../config/ip_config')
const model = require('../config/db_config')

let NOWPOS = 0;


exports.navigation = async (req, res) => {
    if( req.session.login === undefined ){
        res.render('login',{ip:get_ip,status:0});
    }else{
        model.modelPos.find({},(err,result)=>{
            if(!err){
                // console.log(result);
                res.render("navMap",{data:result,posNow:NOWPOS,ip:get_ip});
            }
        })
    }
};
exports.launch_nav = async (req, res) => {
    // control_Status_process(2);
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
    NOWPOS= req.params.pos;
    console.log("nowpos : ",NOWPOS);
    // if( dataset.length < NOWPOS)NOWPOS = 0;
    res.redirect('/navigation')
};