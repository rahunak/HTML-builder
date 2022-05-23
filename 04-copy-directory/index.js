const fs = require('fs');
const path = require('path');

const origin = path.join(__dirname,'files');
const copy =path.join(__dirname,'files-copy');

async function removeFolder(){
  return fs.promises
    .rm(copy,{recursive:true,force:true})
    .catch(err=>console.log('Err removeFolder',err.message));
}
async function createCopyFolder(){
  fs.promises.mkdir(copy, { recursive: true })
    .catch(err=>console.log('Err createCopyFolder',err.message));
}
async function copyFiles(){
  fs.promises.readdir(origin,{ withFileTypes: true })
    .then(files=>{
      for(let file of files){
        fs.promises.copyFile(path.join(origin,file.name),
          path.join(copy,file.name))
          .catch(err=>console.log('Err copyFile',err.message));
      }
    })
    .catch(err=>console.log('Err readdir',err.message));
}

removeFolder().then(()=>{
  createCopyFolder();
  copyFiles();
});
