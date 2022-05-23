const  fs  = require('fs');
const  path  = require('path');



async function removeOldStyles(){
  //Удаляем старый файл со стилями
  return fs.promises
    .rm(path.join(__dirname,'project-dist','bundle.css'),{recursive:true,force:true})
    .catch(err=>console.log('Err removeFolder',err.message));
}
async function createCssBundle(){
  return fs.promises.open(path.join(__dirname,'project-dist','bundle.css'),'a');
}
async function copyStyles(){
  //Читаем файлы в папке styles
  fs.promises.readdir(path.join(__dirname,'styles'),{ withFileTypes: true })
    .then((files)=>{
      files.forEach(file=>{
        const pathToBundle=path.join(__dirname,'project-dist','bundle.css');
        let pathToFile=path.join(__dirname,'styles',file.name);
        if(file.name.split('.')[1]==='css'){
          //Проверка на сss
          fs.readFile(pathToFile,'utf-8',(err,data)=>{
            //Читаем что в файле
            if(err)throw('err with  fs.readFile',err.message);
            fs.appendFile(pathToBundle,data,(err)=>{
              //Дописываем в бандл внутрянку файла
              if(err)throw('err with  fs.appendFile',err.message);
            });

          });
          
        }

      });
   
    })
    .catch((err)=>{
      throw('Err with fs.promises.readdir',err.message);
    });
}
function init(){
  removeOldStyles()
    .then(()=>createCssBundle())
    .then(()=>copyStyles());
}
init();