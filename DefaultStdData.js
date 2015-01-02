var stream = require('stream')
// for node v0.8
if (!stream.Transform) {
  stream = require('readable-stream')
}

module.exports = DefaultStdData

function DefaultStdData(worker) {
  if (!(this instanceof DefaultStdData)) {
    return new DefaultStdData(worker)
  }

  stream.Transform.call(this, {objectMode: true})
  this._worker = worker
}
util.inherits(DefaultStdData, stream.Transform)

DefaultStdData.prototype._transform = function (chunk, encoding, done) {
  this.push(new Date().toISOString() + ' '
           + 'pid:' + this._worker.process.pid + ' '
           + 'worker:' + this._worker.id + ' '
           + chunk.toString())
  done()
}

// no state, nothing to flush
DefaultStdData.prototype._flush = function (done) {
  done()
}