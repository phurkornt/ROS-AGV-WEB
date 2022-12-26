

    // Connect to ROS.
    var ros = new ROSLIB.Ros({
      url : 'ws://192.168.1.6:9090'
    });

    // Create the main viewer.
    var viewer = new ROS2D.Viewer({
      divID : 'nav',
      width : 600,
      height : 600
    });

    // Setup the nav client.
    // var nav = NAV2D.OccupancyGridClientNav({
    //   topic:'nn',
    //   ros : ros,
    //   rootObject : viewer.scene,
    //   viewer : viewer,
    //   serverName:'move_base',
    //   withOrientation:true
    // });

    function insert(){
      var nav = NAV2D.OccupancyGridClientNav({
        topic:'insert',
        ros : ros,
        rootObject : viewer.scene,
        viewer : viewer,
        serverName:'move_base',
        withOrientation:true,
      });
    }
    function show_pos(data){
      // console.log("POS F DB : ",data);
      var nav = NAV2D.OccupancyGridClientNav({
        topic:'nn',
        ros : ros,
        rootObject : viewer.scene,
        viewer : viewer,
        serverName:'move_base',
        withOrientation:true,
        posSet:data
      });
    }
    

    function move_to_pos(data,pos){
      var nav = NAV2D.OccupancyGridClientNav({
        topic:'nn',
        ros : ros,
        rootObject : viewer.scene,
        viewer : viewer,
        serverName:'move_base',
        withOrientation:true,
        posSet:data,
        posNext:pos.pos,
        posCon:pos.con
      });
    }



    // var listener = new ROSLIB.Topic({
    //    ros : ros,
    //    name : '/phu',
    //    messageType : 'std_msgs/String'
    //  });
   
    //  listener.subscribe(function(message) {
    //    console.log('Received message on ' + listener.name + ': ' + message.data);
    //    listener.unsubscribe();
    //  });  

    // var listener = new ROSLIB.Topic({
    //   ros : ros,
    //   name : '/robot_pose',
    //   messageType : 'geometry_msgs/Pose'
    // });
  
    // listener.subscribe(function(message) {
    //   console.log('Received message on ' + ': ' + message);
    //   listener.unsubscribe();
    // });
  