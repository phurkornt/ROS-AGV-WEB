 /**
   * Setup all visualization elements when the page is loaded.
   */

    // Connect to ROS.
    var ros = new ROSLIB.Ros({
        url : 'ws://localhost:9090'
      });

    // Create the main viewer.
     var viewer = new ROS2D.Viewer({
      divID : 'map',
      width : 600,
      height : 600
    });

    // var viewer = new ROS2D.Viewer({
    //   divID : 'map',
    //   width : 308,
    //   height : 250
    // });

    // Setup the map client.
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
  