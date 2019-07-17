'use strict'

const tap = require('tap')
const API = require('../../../api')
const Tracer = require('../../../lib/tracer')

function makeAPI() {
  return new API(new Tracer())
}

tap.test('timer instrumentation', (t) => {
  t.autoend()
  t.test('should create segments for setImmediate', (t) => {
    const api = makeAPI()
    api.applyInstrumentation('timers', global)
    api.startTrace('test trace', function() {
      setImmediate(function() {
        t.ok(api.tracer.segment, 'should be in a trace in the callback')
        const trace = api.endTrace()
        const root = trace.root
        t.equal(root.name, 'test trace', 'segment name should be correct')
        const immediateSegment = root.getChildren()[0]
        t.equal(immediateSegment.name, 'setImmediate', 'segment name should be correct')
        const callbackSegment = immediateSegment.getChildren()[0]
        t.equal(callbackSegment.name, 'callback: <anonymous>', 'segment name should be correct')
        t.end()
      })
    })
  })
  t.test('should create segments for setTimeout', (t) => {
    const api = makeAPI()
    api.applyInstrumentation('timers', global)
    api.startTrace('test trace', function() {
      setTimeout(function() {
        t.ok(api.tracer.segment, 'should be in a trace in the callback')
        const trace = api.endTrace()
        const root = trace.root
        t.equal(root.name, 'test trace', 'segment name should be correct')
        const immediateSegment = root.getChildren()[0]
        t.equal(immediateSegment.name, 'setTimeout', 'segment name should be correct')
        const callbackSegment = immediateSegment.getChildren()[0]
        t.equal(callbackSegment.name, 'callback: <anonymous>', 'segment name should be correct')
        t.end()
      }, 10)
    })
  })
})
