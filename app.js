
const rosnodejs = require('rosnodejs');
const express = require('express');

const execSync = require('child_process').execSync;

const bodyParser = require('body-parser');

const ejs = require('ejs');




const app = express();


let NOWPOS = 0;

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use('/axios',express.static("node_modules/axios/dist/"));
app.use(bodyParser.urlencoded({extended:true}));

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/robot',(err)=>{
    if(!err)console.log("connect");
})

const robot = new mongoose.Schema({
    name:String,
    pos:"mixed",
    color:String
})
const model = mongoose.model('positions',robot);


// const Person = mongoose.model('Person', schema);
// const std_msgs = rosnodejs.require('std_msgs').msg;

// var dataset1 =[{name:"P1",pos:{orientation:  {x: 0, y: 0, z: -0.7071067811865476, w: -0.7071067811865475},position:  {x: 18.04266693552335, y: 19.296000287532806, z: 0}}},
//               {name:"P2",pos:{orientation:  {x: 0, y: 0, z: -0.7071067811865476, w: -0.7071067811865475},position:  {x: 15.22133361975352, y: 19.296000287532806, z: 0}}}]

// var dataset2 =[
//     {name:"P1",pos:{orientation:  {x: 0, y: 0, z: 0.7165801798099274, w: 0.6975047282302623},position:  {x: 16.61466691424449, y: 20.256000301837922, z: 0}}},
//     {name:"P2",pos:{orientation:  {x: 0, y: 0, z: 0.756237146993785, w: 0.6542976215046945},position:  {x: 18.97200028270483, y: 20.16000030040741, z: 0}}}]
             

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
    
    

app.get('/',(req,res)=>{
    res.redirect('/navigation')
    // res.render("scanMap");
});
app.get('/slam',(req,res)=>{
    res.render("scanMap");
});
app.get('/navigation',(req,res)=>{
    model.find({},(err,result)=>{
        if(!err){
            // console.log(result);
            res.render("navMap",{data:result,posNow:NOWPOS});
        }
    })
    
});

app.get('/navigation/move/:pos',(req,res)=>{
    NOWPOS= req.params.pos;
    if( dataset.length < NOWPOS)NOWPOS = 0;
    res.redirect('/navigation')
    // res.render("navMoving",{data:dataset,posNow:pos})

    // console.log("HI"+id);
});


//  function save map 
app.post('/saver',(req,res)=>{
    map_name = req.body.map_name;

    // command   = 'rosrun map_server map_saver -f /home/phul/Desktop/map/'+map_name;
    command   = 'rosrun map_server map_saver -f /home/phul/agv/src/urdf_sim/map/'+map_name;
    
    execSync(command, { encoding: 'utf-8' });
    // console.log('Output was:\n', output);
    command   = 'xdotool windowactivate --sync $(xdotool search --name "urdf_sim") key --clearmodifiers alt+F4';
    execSync(command, { encoding: 'utf-8' });
    
    res.redirect('/slam');
});


//  function run ros 
app.post('/launch_slam',(req,res)=>{
    // rostopic  echo /scan 
    // console.log('HI');
    command   = 'gnome-terminal -- roslaunch urdf_sim urdf_slam.launch ';
    execSync(command, { encoding: 'utf-8' });

    // console.log('Output was:\n', output);

    res.redirect('/slam');
});
//




/* -----------------------  insert  ------------------------ */


app.post('/insert',(req,res)=>{

    let posi = JSON.parse(req.body.pos)
    let doc ={
        name:req.body.name,
        pos: posi.pos,
        color:req.body.color
    }
    // JSON.parse(req.body.pos)

    model.create(doc,(err)=>{
        if(!err){
            res.send({state:1});
        }
        
    })

})

app.get('/insert',(req,res)=>{
    res.render('insert');
})

/* -----------------------  insert  ------------------------ */


/* -----------------------  delect  ------------------------ */

app.post('/delete',(req,res)=>{
    console.log(req.body.delete);
    model.findByIdAndDelete(req.body.delete , function(err){
        if(!err){
            res.redirect('/');
        }
    });
})


/* -----------------------  delect  ------------------------ */

 
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
