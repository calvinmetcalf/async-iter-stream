class Item {
  constructor(done, value) {
    this.value = value;
    this.done = !!done;
  }
}

class IterStream {
  constructor(stream) {
    this.stream = stream;
    this.done = false;
    this.errored = false;
    this.error = null;
    this.waiting = null;
    this.stream.once('end', ()=>{
      this.done = true;
      if (this.waiting) {
        this.waiting();
      }
      this.stream.removeAllListeners();
    });
    this.stream.once('error', e=>{
      this.error = e;
      this.errored = true;
      this.stream.removeAllListeners();
    });
  }
  throw(e) {
    this.stream.emit('error', e);
    return Promise.reject(e);
  }
  next() {
    if (this.done) {
      return Promise.resolve(new Item(true));
    }
    return new Promise((success, fail)=> {
      let onRead;
      const onError = e=>{
        if (onRead) {
          this.stream.removeListener('readable', onRead);
        }
        fail(e);
      }
      this.stream.once('error', onError);
      this.waiting = ()=>{
        this.stream.removeListener('error', onError);
        if (onRead) {
          this.stream.removeListener('readable', onRead);
        }
        success(new Item(true));
      }
      const done = value=>{
        this.stream.removeListener('error', onError);
        this.waiting = false;
        success(new Item(false, value));
      }
      const val = this.stream.read();
      if (val) {
        return done(val);
      }
      let _onRead = ()=>{
        onRead = null;
        const val = this.stream.read();
        if (val) {
          return done(val);
        } else {
          onRead = _onRead;
          this.stream.once('readable', onRead);
        }
      }
      onRead = _onRead;
      this.stream.once('readable', onRead);
    });
  }
}


module.exports = IterStream;
