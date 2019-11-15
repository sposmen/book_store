'use strict';

const fs = require('fs');
const WordCounter = require('./WordCounter');
// let streamer = process.stdin;

let streamer = fs.createReadStream('3gables.txt');

let wordCounter = new WordCounter(
  (wc)=>{
    let sizeKeysValues = [...wc.sizeKeys.keys()];
    console.log(wc.sizeKeys.get(sizeKeysValues[sizeKeysValues.length - 1]));
    console.log(sizeKeysValues, sizeKeysValues[sizeKeysValues.length - 1]);
  }
).run(streamer);


