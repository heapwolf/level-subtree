var level = require('level')
var Tree = require('../index')
var assert = require('assert')
var Sublevel = require('level-sublevel')

var db = level(__dirname + '/db')
var t = Tree(db)
db = Sublevel(db)

function seed(cb) {
  var SL1 = db.sublevel('SL1')
  var SL2 = db.sublevel('SL2')
  SL1.put('K1', 0, function() {
    SL2.put('K2', 0, function() {
      SL21 = SL2.sublevel('SL21')
      SL21.put('K3', 0, function() {
        cb()
      })
    })
  })
}

var expected = {
  SL1: {},
  SL2: {
    SL21: {}
  }
}

seed(function() {
  t.init(function(result) {
    assert.deepEqual(result, expected, 'the output tree matches the input data');
  })
})

