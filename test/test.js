const stream = require('../');
const test = require('tape');
class MyStream extends stream.Readable {
  constructor() {
    super({
      objectMode: true
    });
    this.times = 0;
  }
  _read() {
    this.push(++this.times);
    if (this.times >= 10) {
      this.push(null);
    }
  }
}


async function test1(t) {
  let i = 1;
  for await (let x of new MyStream()) {
    t.equals(i++, x);
  }
}

test('iterate stream', t=>{
  t.plan(10);
  test1(t);
});
test('stream iterator', t=>{
  t.plan(10);
  test2(t);
})
test('stream sync iterator', t=>{
  t.plan(10);
  test3(t);
})
async function increment (num) {
  return num + 1;
}

async function * asyncTester(num) {
  var i = num;
  while(i < 10) {
    yield i;
    i = await increment(i);
  }
  return i;
}
function test2(t) {
  var i = 1;
  var a = new stream.Readable({objectMode: true});
  a.wrapIterator(asyncTester(1));
  a.pipe(new stream.Writable({
    objectMode: true,
    write(chunk, _, next) {
      t.equals(i++, chunk);
      next();
    }
   }))
}
function test3(t) {
  var i = 1;
  var a = new stream.Readable({objectMode: true});
  a.wrapIterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  a.pipe(new stream.Writable({
    objectMode: true,
    write(chunk, _, next) {
      t.equals(i++, chunk);
      next();
    }
   }))
}
