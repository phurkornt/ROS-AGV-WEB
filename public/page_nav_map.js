
    // get ip
    let ip =document.getElementById("ip");
    ip = ip.innerText;


    // Connect to ROS.
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
    
    
    function insert(){
      // For insert position in db
      var nav = NAV2D.OccupancyGridClientNav({
        topic:'insert',
        ros : ros,
        rootObject : viewer.scene,
        viewer : viewer,
        serverName:'move_base',
        withOrientation:true,
      });
    }
    function update(data){
      // For insert position in db
      var nav = NAV2D.OccupancyGridClientNav({
        topic:'update',
        ros : ros,
        rootObject : viewer.scene,
        viewer : viewer,
        serverName:'move_base',
        withOrientation:true,
        posSet:data
      });

    }

    function show_pos(data){
      // For show position 
      var nav = NAV2D.OccupancyGridClientNav({
        topic:'show',
        ros : ros,
        rootObject : viewer.scene,
        viewer : viewer,
        serverName:'move_base',
        withOrientation:true,
        posSet:data
      });
    }
    

    function move_to_pos(data,pos){
      // For move position 
      var nav = NAV2D.OccupancyGridClientNav({
        topic:'show',
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
