require('babel-register');
if (!Symbol.asyncIterator) {
  Symbol.asyncIterator = Symbol('asyncIterator');
}
require('./test');
