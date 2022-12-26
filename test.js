let tt = {
  orientation:  {x: 0, y: 0, z: -0.7071067811865476, w: -0.7071067811865475},
  position:  {x: 18.04266693552335, y: 19.296000287532806, z: 0}
}
let tt2={
  orientation:  {x: 0, y: 0, z: -0.7071067811865476, w: -0.7071067811865475},
  position:  {x: 19.22133361975352, y: 19.344000288248065, z: 0}
}
let real = [tt,tt2];

if( test_done2 == 1  ){
  var b = new ROSLIB.Goal({
      actionClient: i,
      goalMessage: {
          target_pose: {
              header: {
                  frame_id: "map"
              },
              pose: real[0]
          }
      }
  });
  b.send();
}


b.on("result", function() {
  if( test_done2 == 1 ){
      console.log("Done pos 1");
      test_done2 = 2;
  }
  if( test_done2 == 2 ){
      var b = new ROSLIB.Goal({
          actionClient: i,
          goalMessage: {
              target_pose: {
                  header: {
                      frame_id: "map"
                  },
                  pose: real[1]
              }
          }
      });
      b.send();
  }

  if( test_done2 == 3 ){
      console.log("Done pos 2");
  }

});
// console.log(a);
// console.log(typeof a);
for(let i  =0;i<2;i++){
  var d = new ROS2D.NavigationArrow({
      size: 12,
      strokeSize: 1,
      fillColor: createjs.Graphics.getRGB(255, 64, 128, .66),
      pulse: !0
  });
  // console.log(a.position.x,a.position.y,a.orientation); // possition on canvan
  d.x = real[i].position.x,
  d.y = -real[i].position.y,
  d.rotation = h.rosQuaternionToGlobalTheta(real[i].orientation),
  d.scaleX = 1 / h.scaleX,
  d.scaleY = 1 / h.scaleY,
  c.rootObject.addChild(d)
}


