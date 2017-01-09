'use strict';

const stream = require('stream');
const AsyncIter = require('./asyncIter');

exports.Writable = stream.Writable;

class Readable extends stream.Readable {
  [Symbol.asyncIterator]() {
    return new AsyncIter(this);
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
