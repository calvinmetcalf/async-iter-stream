async-iter-stream
===

Contains a subclass of the various writable streams that include a `Symbol.asyncIterator` method in order to allow for async iteration.

Does not polyfill anything, also includes writable stream so you can use it as a drop in for stream.
