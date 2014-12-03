# SYNOPSIS
Build and maintain a javascript tree from the sublevels in a leveldb instance. Faster than a full scan.

# USAGE
To initialize level-subtree
```js
var Tree = require('level-subtree')
var db = require('level')('./db')
var tree = Tree(db)

var handle = tree.init(function(err, tree) {
  // creates a tree from the existing keys.
})

To update the tree...

```js
handle.update(key) // use when adding a new sublevel.
```
