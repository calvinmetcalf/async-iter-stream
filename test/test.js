const stream = require('../');

class MyStream extends stream.Readable {
  constructor() {
    super({
      objectMode: true
    });
    this.times = 0;
  }
  _read() {
    this.push(++this.times);
    if (this.times > 10) {
      this.push(null);
    }
  }
}


async function test() {
  for await (let x of new MyStream()) {
    console.log(x);
  }
}

test().then(()=>console.log('done'), e=>{console.log(e)});
