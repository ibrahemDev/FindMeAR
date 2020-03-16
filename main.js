const path = require('path');
const fs = require('fs');


const directoryPath = path.join(__dirname, 'app');
//passsing directoryPath and callback function
fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    //listing all files using forEach
    files.forEach(function (file) {
        // Do whatever you want to do with the file
        console.log(file);
    });

    const m = require(path.join(__dirname, './app/src/main.js'));

});











