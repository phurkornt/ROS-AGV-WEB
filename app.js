// -------------------------- GLOBLE VARIABLE --------------------------
/*
    !Note
    Status 
       0   not run
       1   create map
       2   nav map

*/
let GLOBLE_Status_process = 0 ;

function control_Status_process(input){
    if( GLOBLE_Status_process === 0 ){
        if(input === 1){
            shell.exec('sh ./shell-script/open-createMap.sh')
        }else if(input === 2){
            console.log(2);

            shell.exec('sh ./shell-script/open-navMap.sh')
        }
    }else if( GLOBLE_Status_process === 1){
        if(input === 2){
            shell.exec('sh ./shell-script/close-navMap.sh')
            shell.exec('sh ./shell-script/open-createMap.sh')
        }
    }else if( GLOBLE_Status_process === 2){
        if(input === 1){
            shell.exec('sh ./shell-script/close-navMap.sh')
            shell.exec('sh ./shell-script/open-createMap.sh')
        }
    }
    GLOBLE_Status_process = input ;
}

// -------------------------- GLOBLE VARIABLE --------------------------



const rosnodejs = require('rosnodejs');
const express = require('express');

const execSync = require('child_process').execSync;
const shell = require('shelljs')

const bodyParser = require('body-parser');

const ejs = require('ejs');

const app = express();

const session = require('express-session')

let NOWPOS = 0;

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use('/axios',express.static("node_modules/axios/dist/"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({
    secret:'id',
    resave:false,
    saveUninitialized:false
}))

const USER = [{
    username : "admin",
    password : "123",
    role     : "a"
}]




// const mongoose = require('mongoose');
// mongoose.connect('mongodb://127.0.0.1/robot',(err)=>{
//     if(!err)console.log("connect");
// })

// const robot = new mongoose.Schema({
//     name:String,
//     pos:"mixed",
//     color:String
// })
// const model = mongoose.model('positions',robot);


const model = require('./config/db_config')


let dataset =[{name:"Position 1",pos:{orientation:  {x: 0, y: 0, z: 0.9946229901291115, w: 0.10356209493161814},position:  {x: 14.313333546618619, y: 16.85333358446757, z: 0}},color:"e66465"},
{name:"Point B",pos:{orientation:  {x: 0, y: 0, z: 0.7277604742911558, w: 0.6858313874849357},position:  {x: 14.313333546618619, y: 18.7733336130778, z: 0}},color:"e66465"}
]   

// let doc ={
//     name:"My-home1"
//     ,pos:{orientation:  {x: 0, y: 0, z: -0.7071067811865476, w: -0.7071067811865475}
//     ,position:  {x: 16.338666880329448, y: 15.400000214576721, z: 0}}
//     ,color:"#000000"
// }
// // console.log(dataset[0]);
// model.create(doc,(err)=>{
//     console.log(err);
// })
    
const os = require('os');
let get_ip = os.networkInterfaces();
get_ip = get_ip.wlo1[0].address;



app.get('/',(req,res)=>{    
    req.session.login="d"

    if( req.session.login === undefined ){

        res.redirect('/login');

    }else{

        res.redirect('/navigation')

    }
});

app.get('/login',(req,res)=>{    
    if( req.session.login === undefined ){
        res.render('login',{ip:get_ip,status:0});
    }else{
        res.redirect("/navigation");
    }
});

app.post('/login',(req,res)=>{    
    let isMatch = false;
    for(i of USER){
        if(req.body.username === i.username && req.body.password === i.password ){
            // console.log("TRUE");
            isMatch = true;
            break;
        }
    }
    if( isMatch === true){
        req.session.login = "login";
        res.redirect("/navigation");
    }else{
        res.render('login',{ip:get_ip,status:1});
    }

});

app.get('/slam', async (req,res)=>{

    if( req.session.login === undefined ){
        res.render('login',{ip:get_ip,status:0});
    }else{
        res.render("scanMap",{
            ip:get_ip,
            slam:req.session.slam
        });
    }

});
app.get('/navigation',(req,res)=>{
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
    
    
});

app.get('/navigation/move/:pos',(req,res)=>{
    NOWPOS= req.params.pos;
    console.log("nowpos : ",NOWPOS);
    // if( dataset.length < NOWPOS)NOWPOS = 0;
    res.redirect('/navigation')
    // res.render("navMoving",{data:dataset,posNow:pos})
});


//  function save map 
app.post('/saver',(req,res)=>{
    map_name = req.body.map_name;
    shell.exec('sh ./shell-script/close-createMap.sh')
    res.redirect('/slam');
});



//  function run ros 
app.post('/launch_slam',(req,res)=>{
    
    control_Status_process(1);

    res.redirect('/slam');
});

app.post('/launch_nav',(req,res)=>{
    control_Status_process(2);
    res.redirect('/navigation');
});




/* -----------------------  insert  ------------------------ */


app.post('/insert',(req,res)=>{

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

})

app.get('/insert',(req,res)=>{
    res.render('insert',{data:1,ip:get_ip});
})

/* -----------------------  insert  ------------------------ */




/* -----------------------  delect  ------------------------ */

app.post('/delete',(req,res)=>{
    console.log(req.body.delete);
    model.modelPos.findByIdAndDelete(req.body.delete , function(err){
        if(!err){
            res.redirect('/');
        }
    });
})


/* -----------------------  delect  ------------------------ */




/* -----------------------  update  ------------------------ */

app.post('/update',(req,res)=>{
    
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

})
app.get('/update',(req,res)=>{
    let id = req.query.id;
    model.modelPos.findById(id,function(err,doc){
        if(!err){
            res.render("update",{data:doc,ip:get_ip});
        }
    })
})


/* -----------------------  update  ------------------------ */



 
app.listen( process.env.PORT || 3000,()=>{
    console.log('Server is running ...');
});


/*

// open new terminal with command

gnome-terminal -- ./tt.sh

// search tab name 
xdotool search --name "urdf_sim"

// close terminal with tab name                          this
xdotool windowactivate --sync $(xdotool search --name "roscore") key --clearmodifiers alt+F4





*/

/**
 
 */