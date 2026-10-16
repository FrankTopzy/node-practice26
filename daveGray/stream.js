const fs = require('fs');

const readStream = fs.createReadStream('./files/lorem.txt', { encoding: 'utf8' });

const writeStream = fs.createWriteStream('./files/newLorem.txt');

/*readStream.on('data', (dataChunk) => {
  writeStream.write(dataChunk)
})*/

readStream.pipe(writeStream); // does the same thing as the above code, but it's more efficient and easier to read