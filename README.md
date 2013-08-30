# SYNOPSIS
build and maintain a tree from the sublevels in a leveldb instance

# USAGE
To initialize level-subtree
```js
var require('level-subtree')
var db = require('level')('./db')
var t = Tree(db).init(function(tree) {
  // creates a tree from the existing keys.
})
```

Applied to a database with the following keys
```ascii
\xfftest1
\xfftest1\xff\xfftest11
\xfftest1\xffkey
\xfftest2
\xfftest2\xff\xfftest22
```

Produces an object that looks like this
```json
{
  "test1": {
    "test11": {}
  },
  "test2": {
    "test22": {}
  }
}
```

To update the tree

```js
var t.update(key) // use when adding a new sublevel.
```
