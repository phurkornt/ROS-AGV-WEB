

const rosnodejs = require('rosnodejs');
const std_msgs = rosnodejs.require('std_msgs').msg;


function send_data(obj) {

    const myJSON = JSON.stringify(obj);
    rosnodejs.initNode('/nodejs_manage')
    .then((rosNode) => {
        let pub = rosNode.advertise('/node_manager', std_msgs.String);
        const msg = new std_msgs.String();
        msg.data = myJSON
        // msg.data = '{ \"topic\":\"map\" , \"script\":\"roslaunch map.launch\" , \"mode\":\"start\"   }'
        pub.publish(msg);
        rosnodejs.log.info('I said: [' + msg.data + ']');
    });
}

function test_send_data() {
    rosnodejs.initNode('/nodejs_manage')
    .then((rosNode) => {
        let pub = rosNode.advertise('/node_manager', std_msgs.String);
        const msg = new std_msgs.String();
        msg.data = '{  \"mode\":\"test_status\"   }'
        pub.publish(msg);
    });
}

module.exports.send_data = send_data
module.exports.test_send_data = test_send_data