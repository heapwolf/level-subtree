var Tree = module.exports = function (db, opts) {

  if (!(this instanceof Tree)) {
    return new Tree(db)
  }

  this.sep = (opts && opts.sep) || '\xff'
  this.rs = db.createReadStream
  this.sublevelRE = new RegExp(this.sep + '(.*?)' + this.sep, 'gi')
  this.sepRE = new RegExp(this.sep, 'gi')
  this.db = db
  this.tree = {}
}

Tree.prototype.init = function (cb) {

  var that = this
  var sep = this.sep
  var levels = 0

  function end() {
    levels--
    if (levels < 0) {
      cb(that.tree)
    }
  }

  function search(start) {
    start = start || sep

    that
      .rs
      .call(that.db, { start: start, values: false, limit: 1 })
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

  key = key.match(this.sublevelRE)
  
  var that = this
  var parent = this.tree
  
  key.forEach(function(seg) {
    seg = seg.replace(that.sepRE, '')
    parent = parent[seg] || (parent[seg] = {})
  })
  
  return this.tree
}

Tree.prototype.update = function (key) {
  return this.addKey(key)
}

