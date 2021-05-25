const cron = require('node-cron');
const Client = require('ftp');
const path = require('path');
const fs = require('fs');
const utility = require('../utility/utility');

const VendMachine = require('../models/vendMachineModel');
const { nextTick } = require('process');

const directory = path.join(__dirname, '../../../vgc2');

const addAllLogs = async (req, res) => {
  fs.readdir(directory, async (err, files) => {
    for ( let i = 2; i < files.length; i++ ) {
      if (fs.lstatSync(path.resolve(directory, files[i])).isDirectory()) {
        if ( (i == 5) && files[i] !== 'admin' && files[i] !== 'unconfigured'&& files[i].search("_") == -1 ) {
          const machineUID = files[i];
          let siteID = "";
          let devName = "";
          let machine = await VendMachine.findOne({ machineUID : machineUID });

          if ( !Boolean(machine) ) {
            machine = new VendMachine();
          }
          console.log(machine.logs.length);return;
          machine.machineUID = machineUID;
          machine.save(); 

          let machinePath = path.join(directory, files[i]);
          let configData = {};

          fs.readdir(machinePath, (err, subfiles) => {
            if (err) throw err;
            subfiles.map( async file => {
              // get config information
              if (file === 'dev.conf') {
                let devConfPath = path.join(machinePath, file);
                let start = false;
                let end = false;
                console.log("____________________________________________")
                console.log(machineUID)
                console.log("*******************************************")
                fs.readFileSync(path.join(devConfPath), 'utf-8').split(/\r?\n/).forEach(function(line) {
                  if ( line === '[CONF_START]' ) {
                    start = true;
                    return;
                  } else if ( line === '[CONF_END]' ) {
                    end = true;
                  }
                  
                  if ( start && !end ) {
                    const conf = line.split('=');
                    configData[conf[0]] =  conf[1];
                    // getSiteId
                    if ( conf[0] === 'DEV_NAME' ) {
                      siteID = getSiteID(conf[1]);
                      devName = conf[1];
                    }
                  }
                });
              } 
              machine.config = configData;
              //  get log information
              if ( file === 'Logs.txt' ) {
                let devConfPath = path.join(machinePath, file);
                utility.anaylseLog(path.join(devConfPath), machineUID, devName);
              }
            })
          });
          
        }
      }
    }
  });
}

const getSiteID = (dev_name) => {
  // dev_name is style of InnnSnnnn
  let siteID = '';
  if (/S([0-9]{4})/.test(dev_name)) {
    const str = dev_name.match(/S([0-9]{4})/)[0];
    siteID = str.slice(1, str.length);
  } else if (dev_name === 'CC2GOS0000TEST') {
    siteID = 'test';
  } else if (TCN01UTDVEND12) {

  }
  else {
    siteID = 'no_site';
  }
  return siteID;
}


// SOURCE FTP CONNECTION SETTINGS
// const srcFTP = {    

//     host     : 'ftp.viewvending.com',
//     port     : 21,
//     user     : 'vending',
//     password : 'Z9q9uVWuYD'

// }

// // DESTINATION FTP CONNECTION SETTINGS
// const destFTP = {

//     host     : 'ftp.drivehq.com',
//     port     : 21,
//     user     : 'username',
//     password : 'password'

// }

// const downloadList = [];

const setCron = () => {
    // set cron job for getting log.txt from ftp server
    // cron.schedule('* * * * *', function() {
        
    //     console.log('running a task every minute');
    // });
    //  end cron
}

// const c = new Client();
// c.on('ready', function() {

//   c.list( 'VGC2/', function(err, list) {
//     console.log(err)
//     // if (err) throw err;

//     // list.map(function(entry){
//     //   if ( entry.name.match(/tar\.gz$/) && entry.name.match(/^filename/) ){
//     //     downloadList.push(entry.name);
//     //   }
//     // });

//     // downloadList.map(function(file){

//     //   // Download remote files and save it to the local file system:
//     //   c.get('directory/subdirectory/' + file, function(err, stream) {

//     //     if (err) throw err;
//     //     stream.once('close', function() { c.end(); });
//     //     stream.pipe(fs.createWriteStream(file));

//     //   });

//     // });

//     // c.end();

//   });

// });

// c.on('end', function(){

//   if ( downloadList.length > 0 ){

//     console.log("Uploading...");

//     const d = new Client();
//     d.on('ready', function() {

//       downloadList.map(function(filename){

//         // Upload local files to the server:
//         d.put(filename, filename, function(err) {
//           if (err) throw err;
//           d.end();
//         });

//       });

//     });

//     d.connect(destFTP);


//   } else {

//     console.log("Error: Download list empty.");

//   }

// });

// c.connect(srcFTP);

module.exports = { setCron, addAllLogs };