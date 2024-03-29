let ip =document.getElementById("ip");
ip = ip.innerText;


var ros = new ROSLIB.Ros({
    // url : 'ws://localhost:9090'
    url : 'ws://'+ip+':9090'
  });

// Create the main viewer.
 var viewer = new ROS2D.Viewer({
  divID : 'nav',
  width : 600,
  height : 600
});

var gridClient = new ROS2D.OccupancyGridClient({
    ros : ros,
    rootObject : viewer.scene,
    // Use this property in case of continuous updates
    continuous: true
});

  // Scale the canvas to fit to the map
  gridClient.on('change', function() {
    viewer.scaleToDimensions(gridClient.currentGrid.width, gridClient.currentGrid.height);
    viewer.shift(gridClient.currentGrid.pose.position.x, gridClient.currentGrid.pose.position.y);
  });


  cmd_vel_listener = new ROSLIB.Topic({
    ros : ros,
    name : "/cmd_vel",
    messageType : 'geometry_msgs/Twist'
  });

  move = function (linear, angular) {
    var twist = new ROSLIB.Message({
      linear: {
        x: linear,
        y: 0,
        z: 0
      },
      angular: {
        x: 0,
        y: 0,
        z: angular
      }
      // console.log("Movement start");
    });

    // self.manager.on('move', function (event, nipple) {
    //   console.log("Moving");
    // });
    cmd_vel_listener.publish(twist);
  }

  var nav = NAV2D.OccupancyGridClientNav({
    ros : ros,
    rootObject : viewer.scene,
    viewer : viewer,
    serverName:'move_base',
    withOrientation:true
  });

  
//  ---------------------- ZOOM ----------------------
function getMousePos(canvas, evt) {
  let rect = canvas.getBoundingClientRect();
  return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
  };
}
  let canvas = document.getElementById("nav");
  canvas.addEventListener("click", function (evt) {
    let mousePos = getMousePos(canvas, evt);
    let zoomIN = document.querySelector("#zoomplus").classList
    let zoomOUT = document.querySelector("#zoomminus").classList
    let zoom = new ROS2D.ZoomView({
      ros: ros,
      rootObject: viewer.scene
    });
    if(zoomIN.value.indexOf("active") >= 0){
      zoom.startZoom(mousePos.x, mousePos.y);
      zoom.zoom(1.5);
    }else if(zoomOUT.value.indexOf("active") >= 0){
      zoom.startZoom(mousePos.x, mousePos.y);
      zoom.zoom(0.5);
    }
  }, false);


  
  // createJoystick = function () {
  //   var options = {
  //     zone: document.getElementById('zone_joystick'),
  //     threshold: 0.1,
  //     position: { left: 50 + '%' },
  //     mode: 'static',
  //     size: 150,
  //     color: '#000000',
  //   };
  //   manager = nipplejs.create(options);

  //   linear_speed = 0;
  //   angular_speed = 0;

  //   self.manager.on('start', function (event, nipple) {
  //     console.log("Movement start");
  //   });

  //   self.manager.on('move', function (event, nipple) {
  //     console.log("Moving");
  //   });

  //   self.manager.on('end', function () {
  //     console.log("Movement end");
  //   });
  //   manager.on('start', function (event, nipple) {

  //     timer = setInterval(function () {
  //       move(linear_speed, angular_speed);
  //     }, 25);

  //   });

  // manager.on('end', function () {
  //   if (timer) {
  //     clearInterval(timer);
  //   }
  //   self.move(0, 0);
  // });

  // manager.on('move', function (event, nipple) {
  //   max_linear = 1.0; // m/s
  //   max_angular = 1.0; // rad/s
  //   max_distance = 1.0; // pixels;
  //   linear_speed = Math.sin(nipple.angle.radian) * max_linear * nipple.distance/max_distance;
  //   angular_speed = -Math.cos(nipple.angle.radian) * max_angular * nipple.distance/max_distance;
  // });
  
  // }
  
  function getSpeed(){
    let ang = parseFloat( document.querySelector("input[name=angular_speed]").value )
    let lin = parseFloat( document.querySelector("input[name=linear_speed]").value )
    let max_limit = 1;
    if(ang >= max_limit)ang = max_limit;
    if(lin >= max_limit)lin = max_limit;
    return [lin,ang];
  }

  window.onload = function () {
    // componentDidMount() ;
    let timer;


    document.querySelector('#m-f').addEventListener('click',function(){
      // clearInterval(timer);
      // timer = setInterval(function () {
        // 
        const [lin,ang] = getSpeed();
        move(lin, 0);
      // }, 50);
    })

    document.querySelector('#m-b').addEventListener('click',function(){
        const [lin,ang] = getSpeed();
        move(-lin, 0);
    })
    document.querySelector('#m-l').addEventListener('click',function(){
        const [lin,ang] = getSpeed();
        move(0, ang);
    })
    document.querySelector('#m-r').addEventListener('click',function(){
        const [lin,ang] = getSpeed();
        move(0,-ang);
    })
    document.querySelector('#m-s').addEventListener('click',function(){
      move(0, 0);
    })


  }





  // let mes ="";
  // let listener = new ROSLIB.Topic({
  //   ros : ros,
  //   name : '/mcu-topic',
  //   messageType : 'std_msgs/String'
  // });
  // listener.subscribe(function(message) {
  //   mes = message.data
  //   // console.log('Received message on ' + listener.name + ': ' + message.data);
  //   // listener.unsubscribe();
  // });
  // document.body.addEventListener('click',function(){
  //     console.log(mes);
  // })    
  