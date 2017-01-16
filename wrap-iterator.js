

const wrapAsyncIterator = (iterator, stream) =>{
  var inProgress = false;
  var done = false;
  let write = next => {
    if (next.done) {
      if (typeof next.value !== 'undefined') {
        stream.push(next.value);
      }
      stream.push(null);
      done = true;
      return;
    }
    let ret = stream.push(next.value);
    if (ret) {
      return iterator.next().then(write);
    }
  }
  stream._read = function () {
    if (inProgress || done) {
      return;
    }
    inProgress = true;
    iterator.next().then(write).then(()=>{
      inProgress = false;
    })
  }
}

const wrapIterator = (iterator, stream) =>{
  stream._read = function () {
    while(true) {
      let next = iterator.next();
      if (next.done) {
        if (typeof next.value !== 'undefined') {
          this.push(next.value);
        }
        this.push(null);
        return;
      }
      let ret = this.push(next.value);
      if (!ret) {
        return;
      }
    }
  }
}

module.exports = (iterator, stream) => {
  if (Symbol.asyncIterator && typeof iterator[Symbol.asyncIterator] === 'function') {
    return wrapAsyncIterator(iterator[Symbol.asyncIterator](), stream);
  }
  if (Symbol.iterator && typeof iterator[Symbol.iterator] === 'function') {
    return wrapIterator(iterator[Symbol.iterator](), stream);
  }
};
