
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
    // Setup the map client.
    // var gridClient = new ROS2D.OccupancyGridClient({
    //   ros : ros,
    //   rootObject : viewer.scene
    // });
    // // Scale the canvas to fit to the map
    // gridClient.on('change', function(){
    //   viewer.scaleToDimensions(gridClient.currentGrid.width, gridClient.currentGrid.height);
    // });
    



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
  

  // $("#zoomplus").click(function(event) {
  //     event.preventDefault();
  //     let btn = document.querySelector("#zoomplus");
  //     let isActive = false;
  //     for(let i of btn.classList){
  //       if (i === "active"){

  //         break;
  //       }
  //     }
  //     // zoomInMap(ros, viewer);

  // });

  // $("#zoomminus").click(function(event) {
  //     event.preventDefault();
  //     zoomOutMap(ros, viewer);
  // });



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

    function nav_pos(data,now_pos){
      var nav = NAV2D.OccupancyGridClientNav({
        topic:'run',
        ros : ros,
        rootObject : viewer.scene,
        viewer : viewer,
        serverName:'move_base',
        withOrientation:true,
        posSet:data,
        posNow:now_pos
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


    function init_pose(input){
      // For show position 
      var nav = NAV2D.OccupancyGridClientNav({
        topic:input,
        ros : ros,
        rootObject : viewer.scene,
        viewer : viewer,
        serverName:'move_base',
        withOrientation:true
      });
    }