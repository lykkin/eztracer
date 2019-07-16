'use strict'

const tap = require('tap')
const Trace = require('../../lib/tracer/trace')

function makeTrace() {
  return new Trace('test trace')
}

tap.test('Trace#end', (t) => {
  t.autoend()
  t.test('should calculate exclusive time on end', (t) => {
    const trace = makeTrace()
    const now = Date.now()
    const root = trace.root
    root.setDurationInMillis(100, now)
    const child = root.addChild('first child')
    child.setDurationInMillis(25, now)
    const secondChild = root.addChild('second child')
    secondChild.setDurationInMillis(25, now + 50)
    trace.end()
    t.equal(root._exclusiveDuration, 50, 'root should have 50 ms exclusive duration')
    t.equal(child._exclusiveDuration, 25, 'first child should have 25 ms exclusive duration')
    t.equal(child.name, 'first child', 'should have the proper name')
    t.equal(secondChild._exclusiveDuration, 25, 'second child should have 25 ms exclusive duration')
    t.equal(secondChild.name, 'second child', 'should have the proper name')

    t.end()
  })
  t.test('should end any pending segment', (t) => {
    const trace = makeTrace()
    const timer = trace.root.timer
    t.notOk(timer.ended, 'timer should not be ended')
    t.notOk(timer.duration, 'duration should not be set')
    trace.end()
    t.ok(timer.ended, 'timer should not be ended')
    t.ok(timer.duration, 'duration should not be set')
    t.end()
  })
  t.test('should not modify ended segments', (t) => {
    const trace = makeTrace()
    const root = trace.root
    const timer = root.timer
    t.notOk(timer.ended, 'timer should not be ended')
    t.notOk(timer.duration, 'duration should not be set')
    waitMs(10)
    root.update()
    t.notOk(timer.ended, 'timer should not be ended')
    t.ok(timer.duration, 'duration should not be set')
    const duration = root.timer.duration
    waitMs(10)
    trace.end()
    t.equal(timer.duration, duration, 'duration should not be updated')
    t.end()
  })
})

function waitMs(ms) {
  const now = Date.now()
  while (Date.now() - now < ms) {}
}