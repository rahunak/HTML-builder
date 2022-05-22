// НЕ ПОНЯТНО НУЖНО ЛИ ВЫВОДИТЬ ИНФУ О ФАЙЛАХ В ПОДПАПКАХ. ЕСЛИ НУЖНО МОЖНО ВЫЗЫВАТЬ Ф-Ю РЕКУРСИВНО
const fs=require('fs');
const path = require('path');
//путь к необходимой папке
const pathToFolder=path.join(__dirname,'secret-folder');


fs.readdir(pathToFolder,(err,data)=>{
  //Читаю файлы в папке по пути pathToFolder
  if(err) return console.error('Error with fs.readdir',err.message);
  for(let i=0;i<data.length;i++){
    //Пробегаем по каждому файлу из папки
    //Конкатинируем путь к файлу path.join(pathToFolder,data[i])
    //Извлекаем статистику файла fs.stat
    let fileData=data[i].toString().split('.');//Разделили данные имени и расширения файла
    let fileName=fileData[0];//Имя файла
    let fileExtention=fileData[1];//Расширение файла
    let pathToFile=path.join(pathToFolder,data[i]);//путь к файлу
    fs.stat(pathToFile,(err,file)=>{
      if(err) return console.error('Error with   fs.stat',err.message);
      if(!file.isDirectory()){//Проверяем чтобы файл не был папкой
        console.log(fileName,' - ',fileExtention,' - ',file['size']/1024,'kb');
      }
    });
  }
});



