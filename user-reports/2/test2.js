'use strict'
const Trace = require('./lib/tracer/trace')
const trace = new Trace('test trace')
const root = trace.root
root.setDurationInMillis(42)
const now = Date.now()

const child1 = root.addChild('test1')
child1.setDurationInMillis(33, now)

  // add another, short child as a sibling
var child2 = child1.addChild('test2')
child2.setDurationInMillis(5, now)

  // add two disjoint children of the second segment encompassed by the first segment
var child3 = child2.addChild('test3')
child3.setDurationInMillis(11, now)

var child4 = child2.addChild('test4')
child4.setDurationInMillis(11, now + 16)
trace.end()
console.log(JSON.stringify(trace, null, 2))
