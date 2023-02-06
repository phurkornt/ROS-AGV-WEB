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

    self.manager.on('move', function (event, nipple) {
      console.log("Moving");
    });
    cmd_vel_listener.publish(twist);
  }

  var nav = NAV2D.OccupancyGridClientNav({
    
    ros : ros,
    rootObject : viewer.scene,
    viewer : viewer,
    serverName:'move_base',
    withOrientation:true

  });

  
  createJoystick = function () {
    var options = {
      zone: document.getElementById('zone_joystick'),
      threshold: 0.1,
      position: { left: 50 + '%' },
      mode: 'static',
      size: 150,
      color: '#000000',
    };
    manager = nipplejs.create(options);

    linear_speed = 0;
    angular_speed = 0;

    self.manager.on('start', function (event, nipple) {
      console.log("Movement start");
    });

    self.manager.on('move', function (event, nipple) {
      console.log("Moving");
    });

    self.manager.on('end', function () {
      console.log("Movement end");
    });
    manager.on('start', function (event, nipple) {

      timer = setInterval(function () {
        move(linear_speed, angular_speed);
      }, 25);

    });

  manager.on('end', function () {
    if (timer) {
      clearInterval(timer);
    }
    self.move(0, 0);
  });

  manager.on('move', function (event, nipple) {
    max_linear = 1.0; // m/s
    max_angular = 1.0; // rad/s
    max_distance = 1.0; // pixels;
    linear_speed = Math.sin(nipple.angle.radian) * max_linear * nipple.distance/max_distance;
    angular_speed = -Math.cos(nipple.angle.radian) * max_angular * nipple.distance/max_distance;
  });
  
  }
  

  window.onload = function () {
    createJoystick();
    // componentDidMount() ;
  }