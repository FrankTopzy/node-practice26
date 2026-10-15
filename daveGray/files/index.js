//const fs = require('fs');
const fsPromise = require('fs').promises;
const path = require('path');


const fileOps = async () => {
  try {
    const data = await fsPromise.readFile(path.join(__dirname, '', 'starter.txt'), 'utf8')
    console.log(data);
    await fsPromise.unlink(path.join(__dirname, 'starter.txt'))
    await fsPromise.writeFile(path.join(__dirname, '', 'promiseWrite.txt'), data);
    await fsPromise.appendFile(path.join(__dirname, '', 'promiseWrite.txt'), '\n\nNice to meet you.');
    await fsPromise.rename(path.join(__dirname, '', 'promiseWrite.txt'), path.join(__dirname, '', 'promisComplete.txt'));
    const newData = await fsPromise.readFile(path.join(__dirname, '', 'promisComplete.txt'), 'utf8');
    console.log(newData);
    
  } catch (error) {
    console.error(error);
  }
}

fileOps();

/*fs.readFile(path.join(__dirname, '', 'starter.txt'), 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
})

fs.writeFile(path.join(__dirname, 'reply.txt'), 'Nice to meet you', (err) => {
  if (err) throw err;
  console.log('Write Done');

  
  fs.appendFile(path.join(__dirname, 'reply.txt'), '\n\nYes it is', (err) => {
    if (err) throw err;
    console.log('Append Done');

    fs.rename(path.join(__dirname, 'reply.txt'), path.join(__dirname, 'newReply.txt'), (err) => {
      if (err) throw err;
      console.log('rename Done');
    })
  })
})*/

/*fs.appendFile(path.join(__dirname, 'test.txt'), 'testing text', (err) => {
  if (err) throw err;
  console.log('Append Done');
})*/


process.on('uncaughtException', err => {
  console.error(`There was an uncaught error: ${err}`);
  process.exit(1)
})