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
      cb(null, that.tree)
    }
  }

  function search(startkey, endkey) {
    startkey = startkey || sep

    var params = {
      values: false,
      start: startkey,
      limit: 1
    }

    that
      .rs
      .call(that.db, params)
      .on('data', function (key) {
        var seg = that.addKey(key)
        levels++
        search(seg + sep)
      })
      .on('error', cb)
      .on('end', end)
  }
  search()
}

Tree.prototype.addKey = function (key) {

  key = key.match(this.sublevelRE)
  
  var that = this
  var parent = this.tree
  
  key.map(function(seg) {
    seg = seg.replace(that.sepRE, '')
    parent = parent[seg] || (parent[seg] = {})
  })

  return key.join('')
}

Tree.prototype.update = function (key) {
  return this.addKey(key)
}

