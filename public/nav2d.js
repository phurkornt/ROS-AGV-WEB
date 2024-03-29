let control_mode = "";
let posNext ;
let posSet;
let posNow = 0;
let posCon;

var counter = 0 ;
var isRun = false;
var arrow =[];
var NAV2D = NAV2D || {
    REVISION: "0.3.0"
};



/*  Zone Insert */
let insert_pos;
let get_insert_pos;
/*  Zone Insert */

/*  Zone Pause */

/*  Zone Pause */


var POSITION = [{
    x:4,
    y:7,
    z:-0.7
}]

var posMain = [];
NAV2D.ImageMapClientNav = function(a) {

    var b = this;
    a = a || {},
    this.ros = a.ros;
    var c = a.topic || "map_metadata"
      , d = a.image;
    this.serverName = a.serverName || "/move_base",
    this.actionName = a.actionName || "move_base_msgs/MoveBaseAction",
    this.rootObject = a.rootObject || new createjs.Container,isRun
    var e = new ROS2D.ImageMapClient({
        ros: this.ros,
        rootObject: this.rootObject,
        topic: c,
        image: d
    });
    e.on("change", function(){
 
        b.navigator = new NAV2D.Navigator({
            ros: b.ros,
            serverName: b.serverName,
            actionName: b.actionName,
            rootObject: b.rootObject,
            withOrientation: b.withOrientation
        }),
        b.viewer.scaleToDimensions(e.currentImage.width, e.currentImage.height),
        b.viewer.shift(e.currentImage.pose.position.x, e.currentImage.pose.position.y)
    })
}
,
NAV2D.Navigator = function(a) {
    function show_maker(){
        // console.log("HI");
        // console.log("Show : maker ",posSet[1].color)
        function hexToRgb(hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16)
            } : null;
        }

        for(let i =0;i<posSet.length ;i++){
            let posNow = posSet[i].pos;

            let rgb = hexToRgb(posSet[i].color);

            var d = new ROS2D.NavigationImage ({
                size:0.8,
                image:`http://${ip}:3000/move.svg`
            });
            // var d = new ROS2D.NavigationArrow({
            //     size: 0.25,
            //     strokeSize: 0.008,
            //     fillColor: createjs.Graphics.getRGB(rgb.r, rgb.g, rgb.b, .66),
            //     pulse: !0
            // });
      
            d.x = posNow.position.x,
            d.y = -posNow.position.y,
            d.rotation = h.rosQuaternionToGlobalTheta(posNow.orientation),
            d.scaleX = 1 / h.scaleX,
            d.scaleY = 1 / h.scaleY,
            c.rootObject.addChild(d)
        }
        
    }

    function move_maker(){

        if( posNext-1 < posSet.length ){
            // console.log("WOW" ,posSet.length)
            
            let posNow = posSet[ posNext-1 ].pos;
            var b = new ROSLIB.Goal({
                actionClient: i,
                goalMessage: {
                    target_pose: {
                        header: {
                            frame_id: "map"
                        },
                        pose: posNow
                    }
                }
            });

            // name="tostop"
            
            b.send();
            let moveStop = false;

            let pause = document.querySelector("button[name=topause]")
            pause.addEventListener('click',()=>{
                if(pause.innerText == 'Pause'){
                    pause.classList.remove('btn-warning');
                    pause.classList.add('btn-success')
                    pause.innerText = 'Go';
                    b.cancel();
                    moveStop = true;
                    
                }else if(pause.innerText == 'Go'){
                    pause.classList.remove('btn-success');
                    pause.classList.add('btn-warning')
                    pause.innerText = 'Pause';
                    window.location="/navigation";
                }
         
            })

            
            document.querySelector("button[name=tostop]").addEventListener('click',()=>{
                // console.log("WWW");

                b.cancel();
                moveStop = true;
                window.location="/navigation/moving/0";
            })
            
            b.on("result", function() {
                if(moveStop == true){

                }else{
                    console.log("DONE POS : "+posNext);
                    // alert("FDSFSF")
                    if( posNext - posSet.length == 0 ){
                        window.location="/navigation/moving/0";
                    }else{
                        window.location="/navigation/moving/"+(posNext+1);
                    }
                }
                
            })
        }
    }

    function show_makerOne(){
        function hexToRgb(hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16)
            } : null;
        }

        let posNow = posSet.pos;

        let rgb = hexToRgb(posSet.color);

        console.log("debug", rgb )

        var d = new ROS2D.NavigationImage ({
            size:0.8,
            image:`http://${ip}:3000/move.svg`
        });
        // var d = new ROS2D.NavigationArrow({
        //     size: 0.2,
        //     strokeSize: 0.01,
        //     fillColor: createjs.Graphics.getRGB(rgb.r, rgb.g, rgb.b, .66),
        //     pulse: !0
        // });
    
        d.x = posNow.position.x,
        d.y = -posNow.position.y,
        d.rotation = h.rosQuaternionToGlobalTheta(posNow.orientation),
        d.scaleX = 1 / h.scaleX,
        d.scaleY = 1 / h.scaleY,
        c.rootObject.addChild(d)
        
    }

    function update(a) {
        // For update pos to db
        function hexToRgb(hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16)
            } : null;
        }

        if( insert_pos !=undefined ){
            c.rootObject.removeChild(insert_pos)
        }
        
       
        let rgb = hexToRgb(document.querySelector("input[type=color]").value);
        var d = new ROS2D.NavigationImage ({
            size:0.8,
            image:`http://${ip}:3000/move.svg`
        });
        // var d = new ROS2D.NavigationArrow({
        //     size: 10,
        //     strokeSize: 0.8,
        //     fillColor: createjs.Graphics.getRGB(rgb.r, rgb.g, rgb.b, .66),
        //     pulse: !0
        // });

        d.x = a.position.x,
        d.y = -a.position.y,
        d.rotation = h.rosQuaternionToGlobalTheta(a.orientation),
        d.scaleX = 1 / h.scaleX,
        d.scaleY = 1 / h.scaleY,
        
        insert_pos = d;
        c.rootObject.addChild(insert_pos)

        // global Data
        get_insert_pos = a;
    }

    function insert(a) {
        // For insert pos to db
        function hexToRgb(hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16)
            } : null;
        }

        if( insert_pos !=undefined ){
            c.rootObject.removeChild(insert_pos)
        }
        
       
        let rgb = hexToRgb(document.querySelector("input[type=color]").value);
        var d = new ROS2D.NavigationImage ({
            size:0.8,
            image:`http://${ip}:3000/move.svg`
        });
        // var d = new ROS2D.NavigationArrow({
        //     size: 10,
        //     strokeSize: 1,
        //     fillColor: createjs.Graphics.getRGB(rgb.r, rgb.g, rgb.b, .66),
        //     pulse: !0
        // });

        d.x = a.position.x,
        d.y = -a.position.y,
        d.rotation = h.rosQuaternionToGlobalTheta(a.orientation),
        d.scaleX = 1 / h.scaleX,
        d.scaleY = 1 / h.scaleY,
        
        insert_pos = d;
        c.rootObject.addChild(insert_pos)

        // global Data
        get_insert_pos = a;
    }
    function nav_pos(){
        console.log("VIEWS",posSet);
        function hexToRgb(hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16)
            } : null;
        }

        let pos_show = posSet[posSet.length-1].pos;

        let rgb = hexToRgb(posSet[posSet.length-1].color);

        var d = new ROS2D.NavigationImage ({
            size:0.8,
            image:`http://${ip}:3000/move.svg`
        });
        // var d = new ROS2D.NavigationArrow({
        //     size: 0.25,
        //     strokeSize: 0.008,
        //     fillColor: createjs.Graphics.getRGB(rgb.r, rgb.g, rgb.b, .66),
        //     pulse: !0
        // });

        d.x = pos_show.position.x,
        d.y = -pos_show.position.y,
        d.rotation = h.rosQuaternionToGlobalTheta(pos_show.orientation),
        d.scaleX = 1 / h.scaleX,
        d.scaleY = 1 / h.scaleY,
        c.rootObject.addChild(d)

        var b = new ROSLIB.Goal({
            actionClient: i,
            goalMessage: {
                target_pose: {
                    header: {
                        frame_id: "map"
                    },
                    pose: posSet[posNow].pos
                }
            }
        });

        b.send();

        let moveStop = false;

        let pause = document.querySelector("button[name=topause]")
        pause.addEventListener('click',()=>{
            if(pause.innerText == 'Pause'){
                pause.classList.remove('btn-warning');
                pause.classList.add('btn-success')
                pause.innerText = 'Go';
                b.cancel();
                moveStop = true;
                
            }else if(pause.innerText == 'Go'){
                pause.classList.remove('btn-success');
                pause.classList.add('btn-warning')
                pause.innerText = 'Pause';
                window.location="/navigation";
            }
        
        })

        
        document.querySelector("button[name=tostop]").addEventListener('click',()=>{
            b.cancel();
            axios({
                url:'/navigation/cancle_move',
                method:'post',
                timeout:3000
            }).then((result)=>{
                window.location=`/`;
            })
        })
        
        b.on("result", function() {
            // if( moveStop === false ){

            //     if( posNow < posSet.length-1 ){
            //         console.log("DONE POS 1");
            //         let params =new URLSearchParams();
            //         params.append('posNow',posNow+1);
            //         axios({
            //             url:'/navigation/update_move',
            //             method:'post',
            //             data:params,
            //             timeout:3000
            //         }).then((result)=>{
            //             window.location=`/`;
            //             console.log("Update DONE !");
            //         })
            //     }else if( posNow === posSet.length-1 ){
            //         console.log("CANCLE   ");
            //         b.cancel();
            //         axios({
            //             url:'/navigation/cancle_move',
            //             method:'post',
            //             timeout:3000
            //         }).then((result)=>{
            //             window.location=`/`;
            //         })
            //     }
            // }
            
            if( moveStop === false ){
               
                if( posNow < posSet.length-1 ){

                    if( posSet[posNow].option == 1 ){

                        let set_time = setInterval(function(){

                         
                            let listener = new ROSLIB.Topic({
                                ros : ros,
                                name : '/agv_switch',
                                messageType : 'std_msgs/String'
                            });
                            listener.subscribe(function(message) {
                                let mes = message.data

                                if(mes == '1'){
                                    let params =new URLSearchParams();
                                    params.append('posNow',posNow+1);
                                    axios({
                                        url:'/navigation/update_move',
                                        method:'post',
                                        data:params,
                                        timeout:3000
                                    }).then((result)=>{
                                        window.location=`/`;
                                        console.log("Update DONE !");
                                    })
                                    clearInterval(set_time);
                                }

                                listener.unsubscribe();
                                
                            });


                        },200);

                        
                        


                    }else if( posSet[posNow].option == 0 ){
                        console.log("DONE POS 1");
                        // EXpression for push Button
                        let params =new URLSearchParams();
                        params.append('posNow',posNow+1);
                        axios({
                            url:'/navigation/update_move',
                            method:'post',
                            data:params,
                            timeout:3000
                        }).then((result)=>{
                            window.location=`/`;
                            console.log("Update DONE !");
                        })
                    }
                }else if( posNow === posSet.length-1 ){
                    b.cancel();
                    axios({
                        url:'/navigation/cancle_move',
                        method:'post',
                        timeout:3000
                    }).then((result)=>{
                        window.location=`/`;
                    })
                }
            }
            
        })
    }


    var c = this;

    a = a || {};
    var d = a.ros
      , e = a.serverName || "/move_base"
      , f = a.actionName || "move_base_msgs/MoveBaseAction"
      , g = a.withOrientation || !1;
    this.rootObject = a.rootObject || new createjs.Container;
    var h, i = new ROSLIB.ActionClient({
        ros: d,
        actionName: f,
        serverName: e
    }); this.rootObject.addChild(j);
    // console.log(c.rootObject);
    h = c.rootObject instanceof createjs.Stage ? c.rootObject : c.rootObject.getStage();

    // ------------------- Real POS -------------------
    // var j = new ROS2D.NavigationArrow({
    //     size: 7,
    //     strokeSize: 1,
    //     fillColor: createjs.Graphics.getRGB(255, 150, 0, .66),
    //     pulse: !0
    // });
    var j = new ROS2D.NavigationImage ({
        size:1.8,
        image:`http://${ip}:3000/robot.svg`,
        pulse:1
    });
    j.visible = !1,
    this.rootObject.addChild(j);
    var k = !1
      , l = new ROSLIB.Topic({
        ros: d,
        name: "/robot_pose",
        messageType: "geometry_msgs/Pose",
        throttle_rate: 100
    });
    if (l.subscribe(function(a) {
        j.x = a.position.x,
        j.y = -a.position.y,
        k || (j.scaleX = 1 / h.scaleX,
        j.scaleY = 1 / h.scaleY,
        k = !0),
        j.rotation = h.rosQuaternionToGlobalTheta(a.orientation),
        j.visible = !0
    }),
    g === !1)
        this.rootObject.addEventListener("dblclick", function(a) {
            var c = h.globalToRos(a.stageX, a.stageY)
              , d = new ROSLIB.Pose({
                position: new ROSLIB.Vector3(c)
            });
            
        });
    else {
        
        var m = null
          , n = null
          , o = 0
          , p = 0
          , q = null
          , r = !1
          , s = 0
          , t = 0
          , u = function(a, d) {
            if ("down" === d)
                m = h.globalToRos(a.stageX, a.stageY),
                n = new ROSLIB.Vector3(m),
                r = !0;
            else if ("move" === d) {
                //  When click
                if (c.rootObject.removeChild(q),
                r === !0) {
                    var e = h.globalToRos(a.stageX, a.stageY)
                      , f = new ROSLIB.Vector3(e);
                    q = new ROS2D.NavigationArrow({
                        size: 0,
                        strokeSize: 0,
                        fillColor: createjs.Graphics.getRGB(0, 0, 0, .66),
                        pulse: !0
                    }),
                    s = f.x - n.x,
                    t = f.y - n.y,
                    o = Math.atan2(s, t),
                    p = o * (180 / Math.PI),
                    p >= 0 && 180 >= p ? p += 270 : p -= 90,
                    q.x = n.x,
                    q.y = -n.y,
                    q.rotation =0,
                    q.scaleX = 1 / h.scaleX,
                    q.scaleY = 1 / h.scaleY
                    // c.rootObject.addChild(q)

                }
            } else if (r) {
                // Click and work here ..
                r = !1;
                var g = h.globalToRos(a.stageX, a.stageY)
                  , i = new ROSLIB.Vector3(g);
                s = i.x - n.x,
                t = i.y - n.y,
                o = Math.atan2(s, t),
                o >= 0 && o <= Math.PI ? o += 3 * Math.PI / 2 : o -= Math.PI / 2;
                var j = Math.sin(-o / 2)
                  , k = Math.cos(-o / 2)
                  , l = new ROSLIB.Quaternion({
                    x: 0,
                    y: 0,
                    z: j,
                    w: k
                })
                  , u = new ROSLIB.Pose({
                    position: n,
                    orientation: l
                });
                // b(u)


                // console.log("Data : " , u);
                // console.log("Data : " , u.position);
                // --------------------------------- Code init pose ---------------------------------
                

                if( control_mode =="insert"){
                    insert(u);
                }else if( control_mode =="update"){
                    update(u);
                }

                if( control_mode =="init_pose"){
                    let cmdVel = new ROSLIB.Topic({
                    ros : ros,
                    name : '/initialpose',
                    messageType : 'geometry_msgs/PoseWithCovarianceStamped Message'
                    });
                    console.log("HI");
                    let twist = new ROSLIB.Message({
                        header: {stamp: {sec: 0, nanosec: 0}, frame_id: "map"}, pose: { pose: {position: u.position , orientation: u.orientation}, } 
                    });
                    cmdVel.publish(twist);
                }

                
               
            }
            
            
        };

        if( control_mode =="show"){
            show_maker();
        }
        if (control_mode =="update"){
            show_makerOne();
        }
        if (control_mode =="run"){
            show_maker();
            nav_pos();
            // show_makerOne();
        }
        
        // if( posNext > 0 ){
        //     move_maker();
        // }


        this.rootObject.addEventListener("stagemousedown", function(a) {
            u(a, "down")
        }),
        this.rootObject.addEventListener("stagemousemove", function(a) {
            u(a, "move")
        }),
        this.rootObject.addEventListener("stagemouseup", function(a) {
            u(a, "up")
        })
    }
}
,
NAV2D.OccupancyGridClientNav = function(a) {

    // for control mode 
    control_mode = a.topic || "";
    console.log('control_mode',control_mode);

    var b = this;

    a = a || {},
    this.ros = a.ros;
    var c = "map", d = a.continuous;
    this.serverName = a.serverName || "/move_base",
    this.actionName = a.actionName || "move_base_msgs/MoveBaseAction",
    this.rootObject = a.rootObject || new createjs.Container,
    this.viewer = a.viewer,
    this.withOrientation = a.withOrientation || !1,
    this.navigator = null;
    
    
    posSet = a.posSet
    console.log("DATA",posSet);
    if(control_mode === "run"){
        posNow = parseInt( a.posNow )
        console.log(a);
    }
    // posNext = a.posNext
    // console.log("POS NEXT : ",posNext);

    // posCon = a.posCon;
    // console.log("POS Con : ",posCon);



    var e = new ROS2D.OccupancyGridClient({
        ros: this.ros,
        rootObject: this.rootObject,
        continuous: d,
        topic: c
        
    });
    
    e.on("change", function() {
        console.log("Change");
        b.navigator = new NAV2D.Navigator({
            ros: b.ros,
            serverName: b.serverName,
            actionName: b.actionName,
            rootObject: b.rootObject,
            withOrientation: b.withOrientation
        }),
        
        b.viewer.scaleToDimensions(e.currentGrid.width, e.currentGrid.height),
        b.viewer.shift(e.currentGrid.pose.position.x, e.currentGrid.pose.position.y)
        // console.log(e.currentGrid.pose.position.x);
    })
    
};














//  q.rotation = p,move_base_msgs/MoveBaseAction
/*
var b = new ROSLIB.Goal({
            actionClient: i,
            goalMessage: {
                target_pose: {
                    header: {
                        frame_id: "map"
                    },
                    pose: a
                }
            }
        });
b.send();
function b(a) {
        console.log(a);
        var b = new ROSLIB.Goal({
            actionClient: i,
            goalMessage: {
                target_pose: {
                    header: {
                        frame_id: "map"
                    },
                    pose: a
                }
            }
        });
        postNaxt.push(b);
        console.log(postNaxt);
        // b.send();
        var d = new ROS2D.NavigationArrow({
            size: 12,
            strokeSize: 1,
            fillColor: createjs.Graphics.getRGB(255, 64, 128, .66),
            pulse: !0
        });

        d.x = a.position.x,
        d.y = -a.position.y,
        d.rotation = h.rosQuaternionToGlobalTheta(a.orientation),
        d.scaleX = 1 / h.scaleX,
        d.scaleY = 1 / h.scaleY,
        c.rootObject.addChild(d),
        b.on("result", function() {
            c.rootObject.removeChild(d)
            
        })
    }


*/