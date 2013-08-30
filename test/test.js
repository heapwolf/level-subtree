var level = require('level')
var Tree = require('../index')
var assert = require('assert')

var db = level('./db')

var sep = '\xff!'

function seed() {

  db.batch(
    [
      { type: 'put', key: sep + 'test1', value: 0 },
      { type: 'put', key: sep + 'test1' + sep + 'test11', value: 0 },
      { type: 'put', key: sep + 'test2', value: 0 },
      { type: 'put', key: sep + 'test2' + sep + 'test22', value: 0 }
    ],
    function(err) {
      if (err) console.log(err)
    }
  )
}

var expected = { 
  '': { 
    'test1': { 
      'test11': {} 
    }, 
    'test2': { 
      'test22': {} 
    } 
  } 
}

seed()

Tree(db).init(sep, function(result) {
  assert.deepEqual(result, expected, 'the output tree matches the input data');
})

