var Tree = module.exports = function (db) {

  if (!(this instanceof Tree)) {
    return new Tree(db)
  }

  this.sep = '!'
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

  !function search(startkey, endkey) {

    var params = {
      values: false,
      limit: 1
    }

    if (startkey) {
      params.gte = startkey;
    }

    that
      .rs
      .call(that.db, params)
      .on('data', function (key) {
        var seg = that.addKey(key)
        levels++
        search(seg + '~')
      })
      .on('error', cb)
      .on('end', end)
  }()
}

Tree.prototype.addKey = function (key) {

  match = key.match(this.sublevelRE)

  var that = this
  var parent = this.tree

  if (!match) return key;

  match = match[0].split('#');

  match.map(function(seg) {
    seg = seg.replace(that.sepRE, '')
    parent = parent[seg] || (parent[seg] = {})
  })

  return match[0];
}

Tree.prototype.update = function (key) {
  return this.addKey(key)
}

