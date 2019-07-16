'use strict'

const tap = require('tap')
const Trace = require('../../lib/tracer/trace')
const Segment = require('../../lib/tracer/trace/segment')
const trace = new Trace()


function makeSegment() {
  return new Segment('test segment', trace)
}

tap.test('Segment#addChild', (t) => {
  t.autoend()
  t.test('should add a child as expected', (t) => {
    const segment = makeSegment()
    const child = segment.addChild('test child')
    t.equal(child.name, 'test child', 'should have the expected name')
    t.equal(child.trace, segment.trace, 'trace should be passed down')
    t.equal(segment.getChildren()[0], child, 'should be pushed into the children arary of the parent')
    t.end()
  })
  t.test('should throw when non-strings are passed as the name', (t) => {
    const segment = makeSegment()
    t.throws(function() {
      segment.addChild(1)
    }, 'throws on non-string typed names')
    t.end()
  })
  t.test('should throw when empty names are passed in', (t) => {
    const segment = makeSegment()
    t.throws(function() {
      segment.addChild('')
    }, 'throws on empty names')
    t.end()
  })
})

tap.test('Segment#addAttribute', (t) => {
  t.autoend()
  t.test('should omit null values', (t) => {
    const segment = makeSegment()
    segment.addAttribute('hello', null)
    t.notOk(segment.attributes.hello, 'should not add null valued attributes')
    t.end()
  })
  t.test('should add valid attributes', (t) => {
    const segment = makeSegment()
    segment.addAttribute('hello', 'world')
    t.equal(segment.attributes.hello, 'world', 'should add attributes as expected')
    t.end()
  })
  t.test('should throw when non-strings are passed as the name', (t) => {
    const segment = makeSegment()
    t.throws(function() {
      segment.addAttribute(1, 'world')
    }, 'throws on non-string typed names')
    t.end()
  })
  t.test('should throw when empty names are passed in', (t) => {
    const segment = makeSegment()
    t.throws(function() {
      segment.addAttribute('', 'world')
    }, 'throws on empty names')
    t.end()
  })
})