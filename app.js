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
    // if( GLOBLE_Status_process === 0 ){
    //     if(input === 1){
    //         shell.exec('sh ./shell-script/open-createMap.sh')
    //     }else if(input === 2){
    //         console.log(2);

    //         shell.exec('sh ./shell-script/open-navMap.sh')
    //     }
    // }else if( GLOBLE_Status_process === 1){
    //     if(input === 2){
    //         shell.exec('sh ./shell-script/close-navMap.sh')
    //         shell.exec('sh ./shell-script/open-createMap.sh')
    //     }
    // }else if( GLOBLE_Status_process === 2){
    //     if(input === 1){
    //         shell.exec('sh ./shell-script/close-navMap.sh')
    //         shell.exec('sh ./shell-script/open-createMap.sh')
    //     }
    // }
    // GLOBLE_Status_process = input ;
}

// -------------------------- GLOBLE VARIABLE --------------------------


const path = require('path');

const rosnodejs = require('rosnodejs');
const express = require('express');

const execSync = require('child_process').execSync;

const shell = require('shelljs')

const bodyParser = require('body-parser');

const ejs = require('ejs');

const app = express();

const session = require('express-session')


app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use('/slam', express.static(path.join(__dirname, 'public')))
app.use('/navigation', express.static(path.join(__dirname, 'public')))

app.use('/axios',express.static("node_modules/axios/dist/"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({
    secret:'id',
    resave:false,
    saveUninitialized:false
}))






let dataset =[{name:"Position 1",pos:{orientation:  {x: 0, y: 0, z: 0.9946229901291115, w: 0.10356209493161814},position:  {x: 14.313333546618619, y: 16.85333358446757, z: 0}},color:"e66465"},
{name:"Point B",pos:{orientation:  {x: 0, y: 0, z: 0.7277604742911558, w: 0.6858313874849357},position:  {x: 14.313333546618619, y: 18.7733336130778, z: 0}},color:"e66465"}
]   





const loginRoutes = require('./routes/login');
const slamRoutes = require('./routes/slam');
const navRoutes = require('./routes/navigation');

app.use('/slam',slamRoutes);
app.use('/navigation',navRoutes);
app.use('/',loginRoutes);




// app.get('/navigation',(req,res)=>{
//     if( req.session.login === undefined ){
//         res.render('login',{ip:get_ip,status:0});
//     }else{
//         model.modelPos.find({},(err,result)=>{
//             if(!err){
//                 // console.log(result);
//                 res.render("navMap",{data:result,posNow:NOWPOS,ip:get_ip});
//             }
//         })
//     }
    
    
// });


// app.get('/navigation/move/:pos',(req,res)=>{
//     NOWPOS= req.params.pos;
//     console.log("nowpos : ",NOWPOS);
//     // if( dataset.length < NOWPOS)NOWPOS = 0;
//     res.redirect('/navigation')
//     // res.render("navMoving",{data:dataset,posNow:pos})
// });

// app.post('/launch_nav',(req,res)=>{
//     control_Status_process(2);
//     res.redirect('/navigation');
// });


// app.post('/insert',(req,res)=>{

//     let posi = JSON.parse(req.body.pos)
//     let doc ={
//         name:req.body.name,
//         pos: posi.pos,
//         color:req.body.color
//     }
//     // JSON.parse(req.body.pos)

//     model.modelPos.create(doc,(err)=>{
//         if(!err){
//             res.send({state:1});
//         }
        
//     })

// })
// app.get('/insert',(req,res)=>{
//     res.render('insert',{data:1,ip:get_ip});
// })


// app.post('/delete',(req,res)=>{
//     console.log(req.body.delete);
//     model.modelPos.findByIdAndDelete(req.body.delete , function(err){
//         if(!err){
//             res.redirect('/');
//         }
//     });
// })

// app.post('/update',(req,res)=>{
//     let posi = JSON.parse(req.body.pos)
//     let id =req.body.id;
//     let doc ={
//         name:req.body.name,
//         pos: posi.pos,
//         color:req.body.color
//     }
//     // JSON.parse(req.body.pos)
//     model.modelPos.findByIdAndUpdate( id , doc , function(err){
//         if(!err){
//             // console.log("Done Save");
//             res.send({state:1});
//         }
//     });

// })

// app.get('/update',(req,res)=>{
//     let id = req.query.id;
//     model.modelPos.findById(id,function(err,doc){
//         if(!err){
//             res.render("update",{data:doc,ip:get_ip});
//         }
//     })
// })

 
app.listen( process.env.PORT || 3000,()=>{
    console.log('Server is running ...');
});
