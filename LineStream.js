// shameless copy from http://strongloop.com/strongblog/practical-examples-of-the-new-node-js-streams-api/

var stream = require('stream')
// for node v0.8
if (!stream.Transform) {
  stream = require('readable-stream')
}

module.exports = LineStream

function LineStream() {
  if (!(this instanceof LineStream)) {
    return new LineStream()
  }

  stream.Transform.call(this, {objectMode: true})
}
util.inherits(LineStream, stream.Transform)

LineStream.prototype._transform = function (chunk, encoding, done) {
  var data = chunk.toString()
  if (this._lastLineData) data = this._lastLineData + data

  var lines = data.split('\n')
  this._lastLineData = lines.splice(lines.length-1,1)[0]

  lines.forEach(this.push.bind(this))
  done()
}

LineStream.prototype._flush = function (done) {
  if (this._lastLineData) this.push(this._lastLineData)
  this._lastLineData = null
  done()
}
