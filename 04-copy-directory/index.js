const fs = require('fs');
const path = require('path');

const origin = path.join(__dirname,'files');
const copy =path.join(__dirname,'files-copy');

async function removeFolder(where){
  return fs.promises
    .rm(where,{recursive:true,force:true})
    .catch(err=>console.log('Err removeFolder',err.message));
}

async function createFolder(where){
  return  fs.promises.mkdir(where, { recursive: true })
    .catch(err=>console.log('Err createFolder ',err.message));
}

async function copyFiles(from,to){
  return fs.promises.readdir(from,{ withFileTypes: true })
    .then(files=>{
      for(let file of files){

        if(file.isFile()){
          //Аналог из задачи 4
          fs.promises.copyFile(path.join(from,file.name),
            path.join(to,file.name))
            .catch(err=>console.log('Err copyFile',err.message));
        }else if(file.isDirectory()){
          //Если это папка то создаем новую папку и не забываем что в ней могут быть еще файлы => рекурсивно запускаем нашу функцию
          createFolder(path.join(__dirname,file.name))
            .then(()=>copyFiles(
              path.join(__dirname,file.name),
              path.join(__dirname,'files-copy',file.name)
            ));
        }
      }
    })
    .catch(err=>console.log('Err readdir',err.message));
}

removeFolder(copy)
  .then(()=>createFolder(copy))
  .then(()=>copyFiles(origin,copy));
