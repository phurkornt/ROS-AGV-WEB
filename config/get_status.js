
const model = require('./db_config')
/**
 *  0 init
 *  1 create nav
 *  2 create map
 *  3 navigation
 */

// ------------ init ------------

module.exports.get_status = async function (){
    let status = await model.modelStatus.findOne({"title":"status"});
    return status;
}

module.exports.set_status = async function (number){
    let status = await model.modelStatus.findOne({"title":"status"});
    model.modelStatus.findByIdAndUpdate(status._id.toString(),{status:number},function (err,docs){
        if (err){
            console.log(err)
        }
        else{
            console.log("Updated User : ", docs);
        }
    });
}