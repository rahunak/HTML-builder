const  fs  = require('fs');
const  path  = require('path');

const projectDist=path.join(__dirname,'project-dist');


async function removeFolder(where){
  return fs.promises
    .rm(where,{recursive:true,force:true})
    .catch(err=>console.log('Err removeFolder - Иногда вылазит ошибка, я хз почему. Перезапуск VSCode всегда помогает, ошибка пропадает',err.message));
    
}
async function createFile(where,what){
  return fs.promises.open(path.join(where,what),'a');
}
async function copyFiles(from,to){
  fs.promises.readdir(from,{ withFileTypes: true })
    .then(files=>{
      for(let file of files){

        if(file.isFile()){
          //Аналог из задачи 4
          fs.promises.copyFile(path.join(from,file.name),
            path.join(to,file.name))
            .catch(err=>console.log('Err copyFile',err.message));
        }else if(file.isDirectory()){
          //Если это папка то создаем новую папку и не забываем что в ней могут быть еще файлы => рекурсивно запускаем нашу функцию
          createFolder(path.join(__dirname,'project-dist','assets',file.name))
            .then(()=>copyFiles(
              path.join(__dirname,'assets',file.name),
              path.join(__dirname,'project-dist','assets',file.name)
            ));
        }
      }
    })
    .catch(err=>console.log('Err readdir',err.message));
}
async function createFolder(where){
  fs.promises.mkdir(where, { recursive: true })
    .catch(err=>console.log('Err createCopyFolder',err.message));
}
async function makeCssBundle(){
  //Читаем файлы в папке styles
  fs.promises.readdir(path.join(__dirname,'styles'),{ withFileTypes: true })
    .then((files)=>{
      files.forEach(file=>{
        const pathToBundle=path.join(__dirname,'project-dist','style.css');
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
async function scanComponents(where){
  fs.promises.readdir(where)
    .then(files=>{
      fs.promises.readFile(path.join(__dirname,'project-dist','index.html'),'utf-8')
        .then(innderHTML=>{
          files.forEach(file=>{
            if(innderHTML.includes(`{{${path.basename(file,path.extname(file))}}}`)){
              fs.promises.readFile(path.join(where,file),'utf-8')
                .then((componentHTML)=>{
                  innderHTML=innderHTML.replace(`{{${path.basename(file,path.extname(file))}}}`,componentHTML);
                  fs.promises.writeFile(path.join(__dirname,'project-dist','index.html'),innderHTML);
                });
              //Тут я уже устал, опишу потом...
            }
          });
        });
    });  
  
}

function init(){
  removeFolder(projectDist)
    .then(()=> createFolder(projectDist))
    .then(()=>createFile(projectDist,'style.css'))
    .then(()=>makeCssBundle())
    .then(()=>{
      fs.promises.copyFile(path.join(__dirname,'template.html'),
        path.join(__dirname,'project-dist','index.html'));
    })
    .then(()=>createFolder(path.join(__dirname,'project-dist','assets')))
    .then(()=>copyFiles(
      path.join(__dirname,'assets'),
      path.join(__dirname,'project-dist','assets')))
    .then(()=>scanComponents(path.join(__dirname,'components')));
 
  
    
}
init();
