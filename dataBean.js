const TARTEMPDEFAULT = 23.0;
const TEMPBANDDEFAULT = 6.0;

var house1 = {
    num: 0, msgTime: ["-","-","-"], tarTemp: TARTEMPDEFAULT,tempBand: TEMPBANDDEFAULT, ventilPer: -99,
    temp: [0,0,0,0,0,0], avgTemp: 0, humid: [0,0,0,0,0,0], avgHumid: 0, fanMode: 0, fan: [0,0,0],
    num: 0, msgID: '-', edgeDepTime: '-', fogArrTime: '-', fogDepTime: '-', userArrTime: '-',
    tarTemp: TARTEMPDEFAULT,tempBand: TEMPBANDDEFAULT, ventilPer: -99,temp: [0,0,0,0,0,0], 
    avgTemp: 0.0, humid: [0,0,0,0,0,0], avgHumid: 0.0, fanMode: 0, fan: [0,0,0],
    waterMode: 0, water: 0, alarm: 0, state: 0 
};

/*
    0: normal operation
    1: complete blackout
*/

var house2 = {
    num: 0, msgTime: ["-","-","-"], tarTemp: TARTEMPDEFAULT, tempBand: TEMPBANDDEFAULT, ventilPer: -99,
    temp: [0,0,0,0,0,0], avgTemp: 0, humid: [0,0,0,0,0,0], avgHumid: 0, fanMode: 0, fan: [0,0,0],
    waterMode: 0, water: 0, alarm: 0, state: 0
    num: 0, msgID: '-', edgeDepTime: '-', fogArrTime: '-', fogDepTime: '-', userArrTime: '-',
    tarTemp: TARTEMPDEFAULT,tempBand: TEMPBANDDEFAULT, ventilPer: -99,temp: [0,0,0,0,0,0], 
    avgTemp: 0.0, humid: [0,0,0,0,0,0], avgHumid: 0.0, fanMode: 0, fan: [0,0,0],
    waterMode: 0, water: 0, alarm: 0, state: 0 
};

var house = [house1,house2];
module.exports = {
    house: house,
};