import fs from 'fs';
import csvtojson from 'csvtojson';
import { pipeline } from 'stream';

const csvFilePath = './files/file.csv';
const outputFilePath = './files/file.txt';

pipeline(
  fs.createReadStream(csvFilePath),
  csvtojson(),
  fs.createWriteStream(outputFilePath),
  error => {
    if (error) {
      console.log('error');
    } else {
      console.log('finished');
    }
  }
);
