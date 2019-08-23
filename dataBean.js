var house1 = {
    num: 0, curTime: "", msgTime: "", tarTemp: 0, tempBand: 0, ventilPer: -99,
    temp1: 0, temp2: 0, humid1: 0, humid2: 0, fanMode: "", fan1: "", fan2: "", fan3: "",
    doseMode: "", feed: "", water: "",alarm: ""
};
var house2 = {
    num: 0, curTime: "", msgTime: "", tarTemp: 0, tempBand: 0, ventilPer: -99,
    temp1: 0, temp2: 0, humid1: 0, humid2: 0, fanMode: "", fan1: "", fan2: "", fan3: "",
    doseMode: "", feed: "", water: "",alarm: ""
};

var houseData = [house1,house2];

module.exports = {
    houseData: houseData
};