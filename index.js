const path = require("path");
const fs = require("fs");
const stream = require("stream");
const moment = require("moment");
moment.locale("hy-am");

class Readable extends stream.Readable {
  _read() {
    setTimeout(() => {
      const now = moment().format("HH:mm:ss, MMMM Do YYYY, dddd");
      this.push(now);
    }, 1000);
  }
}

class Transform extends stream.Transform {
  _transform(chunk, encoding, callback) {
    callback(null, chunk + "\n");
  }
}

class Writable extends stream.Writable {
  _write(chunk, encoding, callback) {
    callback(
      null,      
      fs.appendFile("stream1.txt", chunk.toString(), function (err) {
        if (err) throw err;
      })
    );
  }
}

const readableStream = new Readable();
const transformStream = new Transform();
const writebleStream = new Writable();

readableStream.pipe(transformStream);
transformStream.pipe(writebleStream);

// --------------

const writeStream = fs.createWriteStream(path.join(__dirname, "stream2.txt"), {
  flags: "a",
});

transformStream.on('data', chunk => {
  writeStream.write(chunk.toString());
});