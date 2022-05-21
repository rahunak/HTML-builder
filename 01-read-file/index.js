const fs = require('fs');
const path =require('path');
const pathToFile=path.join(__dirname,'text.txt');
const readableStream = fs.createReadStream(pathToFile);
readableStream.on('data', chunk => console.log(chunk.toString()));