'use strict'

const tap = require('tap')
const API = require('../../api')
const Tracer = require('../../lib/tracer')

function makeAPI() {
  return new API(new Tracer())
}

tap.test('API#startTrace', (t) => {
  t.autoend()
  t.test('should start a new trace', (t) => {
    const api = makeAPI()
    t.notOk(api.tracer.segment, 'should not have an active segment to start')
    api.startTrace('test trace', function() {
      const segment = api.tracer.segment
      t.ok(segment, 'should have an active segment')
      t.equal(segment.name, 'test trace', 'should have the desired name')
    })
    t.notOk(api.tracer.segment, 'should return to no active segment after') 
    t.end()
  })
  t.test('should not fail when creating nested traces', (t) => {
    const api = makeAPI()
    t.notOk(api.tracer.segment, 'should not have an active segment to start')
    api.startTrace('test trace', function() {
      const segment = api.tracer.segment
      t.ok(segment, 'should have an active segment')
      t.equal(segment.name, 'test trace', 'should have the desired name')
      api.startTrace('test trace 2', function() {
        const secondSegment = api.tracer.segment
        t.ok(secondSegment, 'should have an active segment')
        t.equal(secondSegment.name, 'test trace 2', 'should have the desired name')
      })
      t.equal(api.tracer.segment, segment, 'should reinstate the first segement')
    })
    t.notOk(api.tracer.segment, 'should return to no active segment after') 
    t.end() 
  })
})

tap.test('API#addAttribute', (t) => {
  t.autoend()
  t.test('should not fail when there is no active segment', (t) => {
    const api = makeAPI()
    t.notOk(api.tracer.segment, 'should not have an active segment to start')
    api.addAttribute('test', 'hello')
    t.end()
  })
  t.test('should add attributes to the current running segment', (t) => {
    const api = makeAPI()
    t.notOk(api.tracer.segment, 'should not have an active segment to start')
    api.startTrace('test trace', function() {
      const segment = api.tracer.segment
      api.addAttribute('test', 'hello')
      t.ok(segment, 'should have an active segment')
      t.equal(segment.name, 'test trace', 'should have the desired name')
      t.equal(segment.attributes.test, 'hello', 'should have a test attribute with hello value')
    })
    t.notOk(api.tracer.segment, 'should return to no active segment after') 
    t.end()
  })
  t.test('should omit null values', (t) => {
    const api = makeAPI()
    t.notOk(api.tracer.segment, 'should not have an active segment to start')
    api.startTrace('test trace', function() {
      const segment = api.tracer.segment
      api.addAttribute('test', null)
      t.ok(segment, 'should have an active segment')
      t.equal(segment.name, 'test trace', 'should have the desired name')
      t.notOk(segment.attributes.test, 'should not have a test attribute')
    })
    t.notOk(api.tracer.segment, 'should return to no active segment after') 
    t.end()
  }) 
})

tap.test('API#endTrace', (t) => {
  t.autoend()
  t.test('should not fail when there is no active segment', (t) => {
    const api = makeAPI()
    t.notOk(api.tracer.segment, 'should not have an active segment to start')
    api.endTrace()
    t.end()
  })
  t.test('should end the current running trace', (t) => {
    const api = makeAPI()
    t.notOk(api.tracer.segment, 'should not have an active segment to start')
    api.startTrace('test trace', function() {
      const segment = api.tracer.segment
      t.ok(segment, 'should have an active segment')
      t.equal(segment.name, 'test trace', 'should have the desired name')
      const trace = api.endTrace()
      t.equal(trace.name, 'test trace')
      t.equal(trace.root.name, 'test trace')
    })
    t.notOk(api.tracer.segment, 'should return to no active segment after') 
    t.end()
  })
})

tap.test('API#applyInstrumentation', (t) => {
  t.autoend()
  t.test('should not crash when attempting to apply instrumentation for an unknown module', (t) => {
    const api = makeAPI()
    api.applyInstrumentation('i donno what this is', {})
    t.end()
  })
  t.test('should monkey patch methods on the supplied object', (t) => {
    const api = makeAPI()
    const setImmediateStub = function(){}
    const setTimeoutStub = function(){}
    const toInstrument = {
      setImmediate: setImmediateStub,
      setTimeout: setTimeoutStub
    }
    api.applyInstrumentation('timers', toInstrument)
    t.notEqual(toInstrument.setImmediate, setImmediateStub, 'should be monkey patched')
    t.notEqual(toInstrument.setTimeout, setTimeoutStub, 'should be monkey patched')
    t.ok(toInstrument.setImmediate.__instrumented, 'should have artifacts of instrumentation')
    t.ok(toInstrument.setTimeout.__instrumented, 'should have artifacts of instrumentation')
    t.end()
  })
})