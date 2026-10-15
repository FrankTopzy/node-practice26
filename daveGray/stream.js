const fs = require('fs');

const readStream = fs.createReadStream('./files/lorem.txt', { encoding: 'utf8' });

const writeStream = fs.createWriteStream('./files/newLorem.txt');

/*readStream.on('data', (dataChunk) => {
  writeStream.write(dataChunk)
})*/

readStream.pipe(writeStream); // dos the sae thing as the above code, but is more efficient and easier to read