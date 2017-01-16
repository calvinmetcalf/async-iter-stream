'use strict';

const stream = require('stream');
const AsyncIter = require('./asyncIter');

exports.Writable = stream.Writable;

class Readable extends stream.Readable {
  [Symbol.asyncIterator]() {
    return new AsyncIter(this);
  }
  wrapIterator(iterator) {
    return wrapIterator(iterator, this);
  }
}
exports.Readable = Readable;

class Transform extends stream.Transform {
  [Symbol.asyncIterator]() {
    return new AsyncIter(this);
  }
}
exports.Transform = Transform;

class Duplex extends stream.Duplex {
  [Symbol.asyncIterator]() {
    return new AsyncIter(this);
  }
}
exports.Duplex = Duplex;

class PassThrough extends stream.PassThrough {
  [Symbol.asyncIterator]() {
    return new AsyncIter(this);
  }
}
exports.PassThrough = PassThrough;

exports.wrap = function (stream) {
  if (!stream._readableState) {
    stream = new stream.Readable().wrap(stream);
  }
  if (typeof stream[Symbol.asyncIterator] !== 'function') {
    stream[Symbol.asyncIterator] = function () {
      return new AsyncIter(this);
    }
  }
  return stream;
}
