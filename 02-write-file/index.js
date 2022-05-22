const { stdin,stdout } = process;
const fs=require('fs');
const path = require('path');
//Необходимые модули
const fileFowWriting = path.join(__dirname,'fileForWriting.txt');//Создаём файл для печати.
process.stdout.write('You can write. Press buttons...\n');//Выводим в консоль приглашение к печати

const writeStream = fs.createWriteStream(fileFowWriting);//Создаём поток чтения

//Читаем из потока ввода данные 
stdin.on('data',(data)=>{

  if(data.toString().trim().split(' ').includes('exit')){
    //Проверка на ввод стоп-слова "exit"
    clouseApp();
  }

  writeStream.write(data);
});

process.on('SIGINT',()=>{
  //отслеживаем нажатие Ctrl + C
  clouseApp();
});

function clouseApp(){
  //Закрываем прогу
  //Закрываем поток чтения
  process.exit();
  writeStream.close();
}
process.on('exit', () => stdout.write('Удачи в изучении Node.js!'));