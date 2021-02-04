// application/json

const usrfs = require("fs");

const myreadstream = usrfs.createReadStream('data_two.json', {encoding: 'utf8'});
const mywritestream = usrfs.createWriteStream('bigdata2.txt');

myreadstream.on("data", (mychunk)=>{
    console.log('neww')
    console.log(mychunk);

    mywritestream.write(mychunk);
});
