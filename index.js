var Tree = module.exports = function(db, opts) {

  if (!(this instanceof Tree)) {
    return new Tree(db)
  }

  this.sep = (opts && opts.sep) || '\xff!'
  this.db = db
  this.tree = {}
}

Tree.prototype.init = function(sep, cb) {

  var that = this

  this.db
    .createReadStream({ values: false })
    .on('data', function(key) {
      that.addKey(key)
    })
    .on('end', function() {
      cb(that.tree)
    })
}

Tree.prototype.addKey = function(key) {
  key = key.split(this.sep)
  key = key.filter(function() { return true })

  var parent = this.tree
  key.forEach(function(seg) {
    parent = parent[seg] || (parent[seg] = {})
  })
  return this.tree
}

Tree.prototype.update = function(key) {
  return this.addKey(key)
}

