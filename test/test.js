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
  var SL21 = SL2.sublevel('SL2A')

  SL1.batch(
    [
      { type: 'put', key: 'K1', value: 0, },
      { type: 'put', key: 'K2', value: 0, },
      { type: 'put', key: 'K3', value: 0, }
    ], 
    function() {
    SL2.batch(
      [
        { type: 'put', key: 'K1', value: 0, },
        { type: 'put', key: 'K2', value: 0, },
        { type: 'put', key: 'K3', value: 0, },
        { type: 'put', key: 'K4', value: 0, },
        { type: 'put', key: 'K5', value: 0, }
      ], function() {
      SL21.batch(
        [
          { type: 'put', key: 'K1', value: 0, },
          { type: 'put', key: 'K2', value: 0, },
          { type: 'put', key: 'K3', value: 0, }
        ], function() {
        cb()
      })
    })
  })
}

var expected = {
  SL1: {},
  SL2: {
    SL2A: {}
  }
}

seed(function() {
  t.init(function(err, result) {
    assert.deepEqual(result, expected, 'the output tree matches the input data');
  })
})

