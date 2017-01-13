# async-iter-stream

Contains a subclass of the various writable streams that include a `Symbol.asyncIterator` method in order to allow for async iteration.

Also includes a `wrap` method which adds the iteration method to an existing stream.

Does not polyfill anything, also includes writable stream so you can use it as a drop in for stream.


# Usage

```js
const stream = require('async-iter-stream');

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

```

# Purpose

There was tentative agreement at the most recent streams working group to include the `Symbol.asyncIterator` interface in node core streams when it is finalized by TC39 so feedback very welcome.  The corresponding ability for write to return a promise is a while different can of worms that you are free to discuss somewhere else.
