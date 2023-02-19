

const os = require('os');
let get_ip = os.networkInterfaces();
get_ip = get_ip.wlo1[0].address;
module.exports = get_ip;