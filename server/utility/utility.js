const fs = require('fs');
const VendMachine = require('../models/vendMachineModel');

const anaylseLog = (path, machineUID, devName) => {
    fs.readFileSync(path, 'utf-8').split(/\r?\n/).forEach(async function(line, index) {
        let timeString = line.slice(0, 23);

        let log = {};
        log.dateTime = new Date(timeString);
        if ( log.dateTime == 'Invalid Date' ) {
            log.dateTime = new Date("2021-01-01 00:00:00");
        }
        log.text = line;
        log.lineNumber = index;

        // let machine1 = await VendMachine.findOne({ machineUID : machineUID });
        // console.log(machine1.logs.length);
        // machine1.logs.push(log);
        // console.log('----------------------------------')
        // console.log(index)
        // let result = machine1.save();
        // if (result) {
        //     console.log(index)
        //     console.log('************************************')
        // }
        // card transaction
        if ( /TXN_GET1: [0-9]{4}/.test(line) ) {
            let info = line.slice(42, line.length);
            let list = info.split(',');
            
        }
    });
}

module.exports = {
    anaylseLog
}