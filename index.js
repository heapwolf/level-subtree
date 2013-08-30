var Tree = module.exports = function (db, opts) {

  if (!(this instanceof Tree)) {
    return new Tree(db)
  }

  this.sep = (opts && opts.sep) || '\xff'
  this.db = db
  this.tree = {}
}

Tree.prototype.init = function (sep, cb) {

  var that = this
  var levels = 0

  function end() {
    levels--
    if (levels == 0) {
      cb(that.tree)
    }
  }

  function search(start) {
    start = start || sep

    that.db
      .createReadStream({ start: start, values: false, limit: 1 })
      .on('data', function (key) {
        levels++
        that.addKey(key)
        search(key + sep + sep)
      })
      .on('end', end)
  }
  search();
}

Tree.prototype.addKey = function (key) {
  key = key.split(this.sep)
  key = key.filter(function(seg) { if (seg) return true })

  var parent = this.tree
  key.forEach(function(seg) {
    parent = parent[seg] || (parent[seg] = {})
  })
  return this.tree
}

Tree.prototype.update = function (key) {
  return this.addKey(key)
}

